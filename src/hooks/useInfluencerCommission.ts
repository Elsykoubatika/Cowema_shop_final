
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInfluencerStore } from './useInfluencerStore';

export interface MonthlyCommissionData {
  month: string;
  totalCommissions: number;
  totalSales: number;
  orderCount: number;
}

export interface WeeklyConversionData {
  week: number;
  conversions: number;
  clicks: number;
  conversionRate: number;
}

export const useInfluencerCommission = () => {
  const [monthlyCommissionData, setMonthlyCommissionData] = useState<MonthlyCommissionData[]>([]);
  const [weeklyConversionData, setWeeklyConversionData] = useState<WeeklyConversionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUserInfluencer } = useInfluencerStore();

  const fetchCommissionData = async () => {
    if (!currentUserInfluencer) return;

    try {
      setIsLoading(true);

      // Récupérer les commissions des 6 derniers mois - SEULEMENT pour les commandes livrées
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: commissions, error: commissionsError } = await supabase
        .from('influencer_commissions')
        .select(`
          *,
          customer_orders!inner(
            id,
            status,
            total_amount,
            created_at
          )
        `)
        .eq('influencer_id', currentUserInfluencer.id)
        .eq('customer_orders.status', 'delivered') // Seulement les commandes livrées
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true });

      if (commissionsError) {
        console.error('Error fetching commissions:', commissionsError);
        return;
      }

      // Récupérer TOUTES les commandes de l'influenceur pour les statistiques de conversion
      const { data: allOrders, error: ordersError } = await supabase
        .from('customer_orders')
        .select('*')
        .eq('influencer_id', currentUserInfluencer.id)
        .gte('created_at', sixMonthsAgo.toISOString());

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      // Traiter les données mensuelles basées sur les commissions réelles (commandes livrées)
      const monthlyData: Record<string, MonthlyCommissionData> = {};
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      commissions?.forEach(commission => {
        const date = new Date(commission.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = monthNames[date.getMonth()];

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            totalCommissions: 0,
            totalSales: 0,
            orderCount: 0
          };
        }

        monthlyData[monthKey].totalCommissions += commission.commission_amount || 0;
        monthlyData[monthKey].totalSales += commission.order_total || 0;
        monthlyData[monthKey].orderCount += 1;
      });

      const sortedMonthlyData = Object.values(monthlyData).sort((a, b) => 
        monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
      );

      // Traiter les données hebdomadaires (toutes les commandes pour les taux de conversion)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const recentOrders = allOrders?.filter(order => 
        new Date(order.created_at) >= fourWeeksAgo
      ) || [];

      const weeklyData: WeeklyConversionData[] = [];
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - i * 7);

        const weekOrders = recentOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= weekStart && orderDate < weekEnd;
        });

        // Séparer les commandes par statut pour un meilleur calcul de conversion
        const deliveredOrders = weekOrders.filter(order => order.status === 'delivered');
        const totalOrders = weekOrders.length;
        const estimatedClicks = Math.max(totalOrders * 12, 30); // Estimation plus réaliste
        const conversionRate = estimatedClicks > 0 ? (deliveredOrders.length / estimatedClicks) * 100 : 0;

        weeklyData.unshift({
          week: 4 - i,
          conversions: deliveredOrders.length, // Seulement les commandes livrées
          clicks: estimatedClicks,
          conversionRate
        });
      }

      setMonthlyCommissionData(sortedMonthlyData);
      setWeeklyConversionData(weeklyData);

    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionData();
  }, [currentUserInfluencer]);

  const getInfluencerStats = (influencerId: string) => {
    // Calculer les statistiques basées uniquement sur les commandes livrées
    const totalCommissions = monthlyCommissionData.reduce((sum, month) => sum + month.totalCommissions, 0);
    const totalSales = monthlyCommissionData.reduce((sum, month) => sum + month.totalSales, 0);
    const totalDeliveredOrders = monthlyCommissionData.reduce((sum, month) => sum + month.orderCount, 0);
    const avgOrderValue = totalDeliveredOrders > 0 ? totalSales / totalDeliveredOrders : 0;
    
    const stats = {
      totalOrders: totalDeliveredOrders, // Seulement les commandes livrées comptent
      totalSalesAmount: totalSales,
      avgOrderValue,
      totalCommissions,
      totalSales,
      averageConversion: weeklyConversionData.reduce((sum, week) => sum + week.conversionRate, 0) / Math.max(weeklyConversionData.length, 1)
    };
    
    console.log('📊 Statistiques influenceur (commandes livrées seulement):', stats);
    return stats;
  };

  return {
    monthlyCommissionData,
    weeklyConversionData,
    isLoading,
    getInfluencerStats,
    refetch: fetchCommissionData
  };
};
