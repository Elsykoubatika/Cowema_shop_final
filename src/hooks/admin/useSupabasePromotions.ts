
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabasePromotion {
  id: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count?: number;
  target_cities?: string[];
  target_categories?: string[];
  customer_history_requirement?: any;
  is_combinable?: boolean;
  combination_rules?: any;
  created_at?: string;
  created_by?: string;
  usage_type?: 'unlimited' | 'limited' | 'single_use';
  max_uses_per_user?: number;
  promo_code?: string;
}

export const useSupabasePromotions = () => {
  const [promotions, setPromotions] = useState<SupabasePromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all promotions
  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedPromotions: SupabasePromotion[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        discount_type: item.discount_type as 'percentage' | 'fixed',
        discount_value: item.discount_value,
        min_order_amount: item.min_order_amount,
        start_date: item.start_date,
        end_date: item.end_date,
        is_active: item.is_active,
        usage_limit: item.usage_limit,
        used_count: item.used_count,
        target_cities: item.target_cities,
        target_categories: item.target_categories,
        customer_history_requirement: item.customer_history_requirement,
        is_combinable: item.is_combinable,
        combination_rules: item.combination_rules,
        created_at: item.created_at,
        created_by: item.created_by,
        usage_type: item.usage_type as 'unlimited' | 'limited' | 'single_use',
        max_uses_per_user: item.max_uses_per_user,
        promo_code: item.promo_code
      }));
      
      setPromotions(transformedPromotions);
      setError(null);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Erreur lors du chargement des promotions');
    } finally {
      setIsLoading(false);
    }
  };

  // Create promotion
  const createPromotion = async (promotion: Omit<SupabasePromotion, 'id' | 'created_at'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('promotions')
        .insert([{
          name: promotion.name,
          description: promotion.description,
          discount_type: promotion.discount_type,
          discount_value: promotion.discount_value,
          min_order_amount: promotion.min_order_amount,
          start_date: promotion.start_date,
          end_date: promotion.end_date,
          is_active: promotion.is_active,
          usage_limit: promotion.usage_limit,
          target_cities: promotion.target_cities,
          target_categories: promotion.target_categories,
          customer_history_requirement: promotion.customer_history_requirement,
          is_combinable: promotion.is_combinable,
          combination_rules: promotion.combination_rules,
          usage_type: promotion.usage_type,
          max_uses_per_user: promotion.max_uses_per_user,
          promo_code: promotion.promo_code,
          created_by: user.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data
      const transformedPromotion: SupabasePromotion = {
        id: data.id,
        name: data.name,
        description: data.description,
        discount_type: data.discount_type as 'percentage' | 'fixed',
        discount_value: data.discount_value,
        min_order_amount: data.min_order_amount,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
        usage_limit: data.usage_limit,
        used_count: data.used_count,
        target_cities: data.target_cities,
        target_categories: data.target_categories,
        customer_history_requirement: data.customer_history_requirement,
        is_combinable: data.is_combinable,
        combination_rules: data.combination_rules,
        created_at: data.created_at,
        created_by: data.created_by,
        usage_type: data.usage_type as 'unlimited' | 'limited' | 'single_use',
        max_uses_per_user: data.max_uses_per_user,
        promo_code: data.promo_code
      };

      setPromotions(prev => [transformedPromotion, ...prev]);
      toast({
        title: "Promotion créée",
        description: `La promotion ${promotion.name} a été créée avec succès.`
      });
      
      return { success: true, data: transformedPromotion };
    } catch (err) {
      console.error('Error creating promotion:', err);
      toast({
        title: "Erreur",
        description: "Impossible de créer la promotion",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Update promotion
  const updatePromotion = async (id: string, updates: Partial<SupabasePromotion>) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data
      const transformedPromotion: SupabasePromotion = {
        id: data.id,
        name: data.name,
        description: data.description,
        discount_type: data.discount_type as 'percentage' | 'fixed',
        discount_value: data.discount_value,
        min_order_amount: data.min_order_amount,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
        usage_limit: data.usage_limit,
        used_count: data.used_count,
        target_cities: data.target_cities,
        target_categories: data.target_categories,
        customer_history_requirement: data.customer_history_requirement,
        is_combinable: data.is_combinable,
        combination_rules: data.combination_rules,
        created_at: data.created_at,
        created_by: data.created_by,
        usage_type: data.usage_type as 'unlimited' | 'limited' | 'single_use',
        max_uses_per_user: data.max_uses_per_user,
        promo_code: data.promo_code
      };

      setPromotions(prev => prev.map(p => p.id === id ? transformedPromotion : p));
      toast({
        title: "Promotion mise à jour",
        description: `La promotion a été mise à jour avec succès.`
      });
      
      return { success: true, data: transformedPromotion };
    } catch (err) {
      console.error('Error updating promotion:', err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la promotion",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Delete promotion
  const deletePromotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPromotions(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Promotion supprimée",
        description: "La promotion a été supprimée avec succès."
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting promotion:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la promotion",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Toggle promotion active status
  const togglePromotionStatus = async (id: string, isActive: boolean) => {
    return updatePromotion(id, { is_active: isActive });
  };

  // Get active promotions
  const getActivePromotions = () => {
    return promotions.filter(p => 
      p.is_active && 
      new Date(p.end_date) > new Date() &&
      new Date(p.start_date) <= new Date()
    );
  };

  // Get usage statistics
  const getPromotionUsage = async (promotionId: string) => {
    try {
      const { data, error } = await supabase
        .from('promotion_usage')
        .select('*')
        .eq('promotion_id', promotionId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching promotion usage:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions,
    isLoading,
    error,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus,
    getActivePromotions,
    getPromotionUsage,
    refetch: fetchPromotions
  };
};
