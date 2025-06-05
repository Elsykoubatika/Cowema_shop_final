
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PromotionUsage {
  id: string;
  promotion_id: string;
  user_id: string;
  order_id?: string;
  used_at: string;
  discount_applied: number;
}

export interface PromotionCombination {
  id: string;
  order_id: string;
  promotion_ids: string[];
  total_discount: number;
  applied_at: string;
}

export const useAdvancedPromotions = () => {
  const [usageData, setUsageData] = useState<PromotionUsage[]>([]);
  const [combinationData, setCombinationData] = useState<PromotionCombination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Récupérer les données d'utilisation des promotions
  const fetchUsageData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('promotion_usage')
        .select('*')
        .order('used_at', { ascending: false });

      if (error) throw error;
      setUsageData(data || []);
    } catch (error) {
      console.error('Error fetching promotion usage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'utilisation des promotions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les données de combinaisons
  const fetchCombinationData = async () => {
    try {
      const { data, error } = await supabase
        .from('promotion_combinations')
        .select('*')
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setCombinationData(data || []);
    } catch (error) {
      console.error('Error fetching promotion combinations:', error);
    }
  };

  // Vérifier l'éligibilité d'une promotion
  const checkPromotionEligibility = async (
    promotionId: string,
    userId: string,
    orderTotal: number,
    customerCity?: string,
    productCategories?: string[]
  ) => {
    try {
      const { data, error } = await supabase.rpc('check_promotion_eligibility', {
        p_promotion_id: promotionId,
        p_user_id: userId,
        p_order_total: orderTotal,
        p_customer_city: customerCity,
        p_product_categories: productCategories
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking promotion eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility' };
    }
  };

  // Enregistrer l'utilisation d'une promotion
  const recordPromotionUsage = async (
    promotionId: string,
    userId: string,
    discountApplied: number,
    orderId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('promotion_usage')
        .insert({
          promotion_id: promotionId,
          user_id: userId,
          discount_applied: discountApplied,
          order_id: orderId
        })
        .select()
        .single();

      if (error) throw error;
      
      // Mettre à jour les données locales
      await fetchUsageData();
      
      return data;
    } catch (error) {
      console.error('Error recording promotion usage:', error);
      throw error;
    }
  };

  // Enregistrer une combinaison de promotions
  const recordPromotionCombination = async (
    orderId: string,
    promotionIds: string[],
    totalDiscount: number
  ) => {
    try {
      const { data, error } = await supabase
        .from('promotion_combinations')
        .insert({
          order_id: orderId,
          promotion_ids: promotionIds,
          total_discount: totalDiscount
        })
        .select()
        .single();

      if (error) throw error;
      
      // Mettre à jour les données locales
      await fetchCombinationData();
      
      return data;
    } catch (error) {
      console.error('Error recording promotion combination:', error);
      throw error;
    }
  };

  // Obtenir les statistiques d'utilisation par promotion
  const getUsageStatistics = () => {
    const stats = usageData.reduce((acc, usage) => {
      const promoId = usage.promotion_id;
      if (!acc[promoId]) {
        acc[promoId] = {
          totalUses: 0,
          totalDiscount: 0,
          uniqueUsers: new Set(),
          recentUses: []
        };
      }
      
      acc[promoId].totalUses++;
      acc[promoId].totalDiscount += usage.discount_applied;
      acc[promoId].uniqueUsers.add(usage.user_id);
      
      // Garder les 5 utilisations les plus récentes
      if (acc[promoId].recentUses.length < 5) {
        acc[promoId].recentUses.push(usage);
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Convertir les Sets en nombres
    Object.keys(stats).forEach(promoId => {
      stats[promoId].uniqueUsers = stats[promoId].uniqueUsers.size;
    });

    return stats;
  };

  useEffect(() => {
    fetchUsageData();
    fetchCombinationData();
  }, []);

  return {
    usageData,
    combinationData,
    isLoading,
    fetchUsageData,
    fetchCombinationData,
    checkPromotionEligibility,
    recordPromotionUsage,
    recordPromotionCombination,
    getUsageStatistics: getUsageStatistics()
  };
};
