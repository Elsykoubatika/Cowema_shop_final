
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface Promotion {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchaseAmount?: number;
  maxDiscount?: number;
  validUntil?: string;
  expiryDate: string;
  isActive: boolean;
  target: PromoTarget;
  description: string;
  
  // Advanced properties
  usageType?: UsageType;
  maxUsesPerUser?: number;
  targetCities?: string[];
  targetCategories?: string[];
  customerHistoryRequirement?: CustomerHistoryRequirement;
  isCombinable?: boolean;
  combinationRules?: any;
  createdAt?: string;
}

export type DiscountType = 'percentage' | 'fixed';
export type PromoTarget = 'all' | 'ya-ba-boss';
export type UsageType = 'unlimited' | 'limited' | 'single_use';

export interface CustomerHistoryRequirement {
  minOrders?: number;
  minAmount?: number;
}

interface PromotionState {
  promotions: Promotion[];
  activePromotions: Promotion[];
  activePromotion: Promotion | null;
  isLoading: boolean;
}

interface PromotionActions {
  loadPromotionsFromSupabase: () => Promise<void>;
  getActivePromotion: (code: string) => Promotion | null;
  applyPromoCode: (code: string, orderAmount: number) => Promise<{
    success: boolean;
    discount?: number;
    message: string;
  }>;
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  setActivePromotion: (promotion: Promotion | null) => void;
  cleanExpiredPromotions: () => void;
  updateAbandonCartDiscount: (discount: number) => void;
}

// Function to get cart abandon discount from system settings
const getCartAbandonDiscount = () => {
  try {
    const settingsStore = localStorage.getItem('system-settings');
    if (settingsStore) {
      const settings = JSON.parse(settingsStore);
      return Number(settings.cart_abandon_discount) || 10;
    }
  } catch (error) {
    console.warn('Error reading cart abandon discount from settings:', error);
  }
  return 10; // Default fallback
};

// Default fallback promotions (for offline use) - including the abandon cart promo
const getDefaultPromotions = (): Promotion[] => {
  const cartAbandonDiscount = getCartAbandonDiscount();
  
  return [
    {
      id: '1',
      code: 'WELCOME10',
      discount: 10,
      discountType: 'percentage',
      minPurchaseAmount: 5000,
      maxDiscount: 2000,
      isActive: true,
      target: 'all',
      description: 'Promotion de bienvenue - 10% de réduction',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usageType: 'unlimited'
    },
    {
      id: '2',
      code: 'ABANDON10',
      discount: cartAbandonDiscount,
      discountType: 'percentage',
      minPurchaseAmount: 0, // No minimum for abandon cart
      maxDiscount: 5000, // Max 5000 FCFA discount
      isActive: true,
      target: 'all',
      description: `Promotion abandon de panier - ${cartAbandonDiscount}% de réduction`,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Valid for 1 year
      usageType: 'unlimited'
    }
  ];
};

export const usePromotionStore = create<PromotionState & PromotionActions>()(
  persist(
    (set, get) => ({
      promotions: getDefaultPromotions(),
      activePromotions: getDefaultPromotions().filter(p => p.isActive),
      activePromotion: null,
      isLoading: false,
      
      loadPromotionsFromSupabase: async () => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          const promotions: Promotion[] = (data || []).map(promo => ({
            id: promo.id,
            code: promo.promo_code || promo.name,
            discount: promo.discount_value,
            discountType: promo.discount_type as 'percentage' | 'fixed',
            minPurchaseAmount: promo.min_order_amount,
            maxDiscount: undefined, // Not in current schema
            expiryDate: promo.end_date,
            isActive: promo.is_active,
            target: 'all' as PromoTarget, // Default value, could be enhanced
            description: promo.description || '',
            usageType: promo.usage_type as UsageType || 'unlimited',
            maxUsesPerUser: promo.max_uses_per_user,
            targetCities: promo.target_cities,
            targetCategories: promo.target_categories,
            customerHistoryRequirement: promo.customer_history_requirement as CustomerHistoryRequirement || undefined,
            isCombinable: promo.is_combinable,
            combinationRules: promo.combination_rules,
            createdAt: promo.created_at
          }));

          // Merge with default promotions, prioritizing Supabase data
          const mergedPromotions = [...promotions];
          
          // Add default promotions if they don't exist in Supabase
          getDefaultPromotions().forEach(defaultPromo => {
            if (!promotions.find(p => p.code === defaultPromo.code)) {
              mergedPromotions.push(defaultPromo);
            }
          });

          set({ 
            promotions: mergedPromotions,
            activePromotions: mergedPromotions.filter(p => p.isActive && new Date(p.expiryDate) > new Date()),
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading promotions from Supabase:', error);
          set({ isLoading: false });
        }
      },
      
      getActivePromotion: (code: string) => {
        const { promotions } = get();
        return promotions.find(p => 
          p.code.toLowerCase() === code.toLowerCase() && 
          p.isActive && 
          new Date(p.expiryDate) > new Date()
        ) || null;
      },
      
      applyPromoCode: async (code: string, orderAmount: number) => {
        const { getActivePromotion } = get();
        const promotion = getActivePromotion(code);
        
        if (!promotion) {
          return {
            success: false,
            message: 'Code promo invalide ou expiré'
          };
        }
        
        if (promotion.minPurchaseAmount && orderAmount < promotion.minPurchaseAmount) {
          return {
            success: false,
            message: `Montant minimum requis: ${promotion.minPurchaseAmount.toLocaleString()} FCFA`
          };
        }
        
        let discount = 0;
        if (promotion.discountType === 'percentage') {
          discount = (orderAmount * promotion.discount) / 100;
          if (promotion.maxDiscount) {
            discount = Math.min(discount, promotion.maxDiscount);
          }
        } else {
          discount = promotion.discount;
        }
        
        // Record usage in Supabase
        try {
          const { data: user } = await supabase.auth.getUser();
          if (user.user) {
            await supabase.from('promotion_usage').insert({
              promotion_id: promotion.id,
              user_id: user.user.id,
              discount_applied: discount
            });
          }
        } catch (error) {
          console.error('Error recording promotion usage:', error);
        }
        
        return {
          success: true,
          discount,
          message: 'Code promo appliqué avec succès'
        };
      },

      addPromotion: (promotion: Omit<Promotion, 'id'>) => {
        const newPromotion: Promotion = {
          ...promotion,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          promotions: [newPromotion, ...state.promotions],
          activePromotions: newPromotion.isActive 
            ? [newPromotion, ...state.activePromotions]
            : state.activePromotions
        }));
      },

      updatePromotion: (id: string, updatedPromotion: Partial<Promotion>) => {
        set(state => ({
          promotions: state.promotions.map(p => 
            p.id === id ? { ...p, ...updatedPromotion } : p
          ),
          activePromotions: state.promotions
            .map(p => p.id === id ? { ...p, ...updatedPromotion } : p)
            .filter(p => p.isActive && new Date(p.expiryDate) > new Date())
        }));
      },

      deletePromotion: (id: string) => {
        set(state => ({
          promotions: state.promotions.filter(p => p.id !== id),
          activePromotions: state.activePromotions.filter(p => p.id !== id)
        }));
      },

      setActivePromotion: (promotion: Promotion | null) => {
        set({ activePromotion: promotion });
      },

      cleanExpiredPromotions: () => {
        const now = new Date();
        set(state => ({
          promotions: state.promotions.filter(p => {
            const expiry = new Date(p.expiryDate);
            return expiry > now;
          }),
          activePromotions: state.activePromotions.filter(p => {
            const expiry = new Date(p.expiryDate);
            return expiry > now;
          })
        }));
      },

      updateAbandonCartDiscount: (discount: number) => {
        set(state => ({
          promotions: state.promotions.map(p => 
            p.code === 'ABANDON10' 
              ? { ...p, discount, description: `Promotion abandon de panier - ${discount}% de réduction` }
              : p
          ),
          activePromotions: state.activePromotions.map(p => 
            p.code === 'ABANDON10' 
              ? { ...p, discount, description: `Promotion abandon de panier - ${discount}% de réduction` }
              : p
          )
        }));
      }
    }),
    {
      name: 'promotion-storage'
    }
  )
);

// Initialize promotions from Supabase on app start
if (typeof window !== 'undefined') {
  usePromotionStore.getState().loadPromotionsFromSupabase();
}

export const useActivePromotion = () => {
  const { activePromotion } = usePromotionStore();
  return activePromotion;
};
