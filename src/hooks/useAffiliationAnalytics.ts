
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';

export interface LinkAnalytics {
  totalClicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  clicksBySource: Record<string, number>;
  recentClicks: Array<{
    id: string;
    timestamp: string;
    source: string;
    userAgent: string;
    converted: boolean;
  }>;
}

export const useAffiliationAnalytics = (referralCode: string) => {
  const [analytics, setAnalytics] = useState<LinkAnalytics>({
    totalClicks: 0,
    conversions: 0,
    conversionRate: 0,
    revenue: 0,
    clicksBySource: {},
    recentClicks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUnifiedAuth();

  useEffect(() => {
    if (!referralCode || !user) return;
    
    fetchAnalytics();
  }, [referralCode, user]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les statistiques de clics depuis les commandes
      const { data: orders, error: ordersError } = await supabase
        .from('customer_orders')
        .select('*')
        .eq('referral_code', referralCode);

      if (ordersError) throw ordersError;

      // Récupérer les commissions pour calculer les revenus
      const { data: commissions, error: commissionsError } = await supabase
        .from('influencer_commissions')
        .select('*')
        .in('order_id', orders?.map(o => o.id) || []);

      if (commissionsError) throw commissionsError;

      // Calculer les statistiques
      const totalClicks = orders?.length || 0;
      const conversions = orders?.filter(o => o.status === 'delivered').length || 0;
      const conversionRate = totalClicks > 0 ? (conversions / totalClicks) * 100 : 0;
      const revenue = commissions?.reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;

      // Analyser les sources (simulé pour maintenant)
      const clicksBySource = orders?.reduce((acc, order) => {
        const source = 'direct'; // À améliorer avec de vraies données de tracking
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Récupérer les clics récents
      const recentClicks = orders?.slice(0, 10).map(order => ({
        id: order.id,
        timestamp: order.created_at,
        source: 'direct',
        userAgent: 'Unknown',
        converted: order.status === 'delivered'
      })) || [];

      setAnalytics({
        totalClicks,
        conversions,
        conversionRate,
        revenue,
        clicksBySource,
        recentClicks
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analytics,
    isLoading,
    refetch: fetchAnalytics
  };
};
