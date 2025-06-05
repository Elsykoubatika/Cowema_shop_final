
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';

export interface InfluencerPerformanceData {
  influencerId: string;
  name: string;
  totalEarned: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
  rank: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  isCurrentUser?: boolean;
}

export interface PerformanceStats {
  totalEarned: {
    value: number;
    rank: number;
    percentile: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
  };
  totalOrders: {
    value: number;
    rank: number;
    percentile: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
  };
  conversionRate: {
    value: number;
    rank: number;
    percentile: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
  };
  avgOrderValue: {
    value: number;
    rank: number;
    percentile: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
  };
}

export const useInfluencerPerformance = (period: 'week' | 'month' | 'quarter' = 'month') => {
  const [performanceData, setPerformanceData] = useState<InfluencerPerformanceData[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUserInfluencer } = useInfluencerStore();

  const getDateFilter = () => {
    const now = new Date();
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'quarter':
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return quarterAgo.toISOString();
      default: // month
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return monthAgo.toISOString();
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      const dateFilter = getDateFilter();

      // Récupérer tous les profils d'influenceurs approuvés avec les profils utilisateur
      const { data: influencers, error: influencersError } = await supabase
        .from('influencer_profiles')
        .select(`
          id,
          user_id,
          total_earnings,
          total_sales,
          referral_code,
          profiles!influencer_profiles_user_id_fkey(nom)
        `)
        .eq('status', 'approved');

      if (influencersError) {
        console.error('Error fetching influencers:', influencersError);
        return;
      }

      // Récupérer les commissions pour calculer les métriques de période
      const { data: commissions, error: commissionsError } = await supabase
        .from('influencer_commissions')
        .select('*')
        .gte('created_at', dateFilter);

      if (commissionsError) {
        console.error('Error fetching commissions:', commissionsError);
        return;
      }

      // Récupérer les commandes pour calculer les métriques
      const { data: orders, error: ordersError } = await supabase
        .from('customer_orders')
        .select('*')
        .gte('created_at', dateFilter)
        .not('influencer_id', 'is', null);

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      // Calculer les métriques pour chaque influenceur
      const performanceList: InfluencerPerformanceData[] = influencers?.map(influencer => {
        const influencerCommissions = commissions?.filter(c => c.influencer_id === influencer.id) || [];
        const influencerOrders = orders?.filter(o => o.influencer_id === influencer.id) || [];
        
        const totalEarned = influencerCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
        const totalOrders = influencerOrders.length;
        const totalClicks = Math.max(totalOrders * 10, 100); // Estimation des clics
        const conversionRate = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
        const avgOrderValue = totalOrders > 0 
          ? influencerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0) / totalOrders 
          : 0;

        // Accéder correctement au nom du profil
        const profileData = influencer.profiles as any;
        const influencerName = profileData?.nom || 'Influenceur';

        return {
          influencerId: influencer.id,
          name: influencerName,
          totalEarned,
          totalOrders,
          conversionRate,
          avgOrderValue,
          rank: 0, // Sera calculé après tri
          percentile: 0, // Sera calculé après tri
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
          trendValue: Math.random() * 30 - 10, // -10% à +20%
          isCurrentUser: influencer.user_id === currentUserInfluencer?.userId
        };
      }) || [];

      // Trier et assigner les rangs
      const sortedByEarnings = [...performanceList].sort((a, b) => b.totalEarned - a.totalEarned);
      sortedByEarnings.forEach((item, index) => {
        const originalItem = performanceList.find(p => p.influencerId === item.influencerId);
        if (originalItem) {
          originalItem.rank = index + 1;
          originalItem.percentile = Math.round(((performanceList.length - index) / performanceList.length) * 100);
        }
      });

      setPerformanceData(performanceList);

      // Calculer les statistiques pour l'utilisateur actuel
      if (currentUserInfluencer) {
        const currentUserData = performanceList.find(p => p.isCurrentUser);
        if (currentUserData) {
          // Calculer les rangs pour chaque métrique
          const earningsRank = [...performanceList].sort((a, b) => b.totalEarned - a.totalEarned)
            .findIndex(p => p.influencerId === currentUserData.influencerId) + 1;
          const ordersRank = [...performanceList].sort((a, b) => b.totalOrders - a.totalOrders)
            .findIndex(p => p.influencerId === currentUserData.influencerId) + 1;
          const conversionRank = [...performanceList].sort((a, b) => b.conversionRate - a.conversionRate)
            .findIndex(p => p.influencerId === currentUserData.influencerId) + 1;
          const avgValueRank = [...performanceList].sort((a, b) => b.avgOrderValue - a.avgOrderValue)
            .findIndex(p => p.influencerId === currentUserData.influencerId) + 1;

          const stats: PerformanceStats = {
            totalEarned: {
              value: currentUserData.totalEarned,
              rank: earningsRank,
              percentile: Math.round(((performanceList.length - earningsRank + 1) / performanceList.length) * 100),
              trend: currentUserData.trend,
              trendValue: currentUserData.trendValue
            },
            totalOrders: {
              value: currentUserData.totalOrders,
              rank: ordersRank,
              percentile: Math.round(((performanceList.length - ordersRank + 1) / performanceList.length) * 100),
              trend: currentUserData.trend,
              trendValue: Math.random() * 40 - 10
            },
            conversionRate: {
              value: currentUserData.conversionRate,
              rank: conversionRank,
              percentile: Math.round(((performanceList.length - conversionRank + 1) / performanceList.length) * 100),
              trend: Math.random() > 0.6 ? 'up' : 'stable',
              trendValue: Math.random() * 20 - 5
            },
            avgOrderValue: {
              value: currentUserData.avgOrderValue,
              rank: avgValueRank,
              percentile: Math.round(((performanceList.length - avgValueRank + 1) / performanceList.length) * 100),
              trend: Math.random() > 0.4 ? 'down' : 'stable',
              trendValue: Math.random() * 30 - 15
            }
          };

          setPerformanceStats(stats);
        }
      }

    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserInfluencer) {
      fetchPerformanceData();
    }
  }, [period, currentUserInfluencer]);

  const getTopInfluencers = (limit: number = 10) => {
    return performanceData
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit);
  };

  return {
    performanceData,
    performanceStats,
    isLoading,
    getTopInfluencers,
    refetch: fetchPerformanceData
  };
};
