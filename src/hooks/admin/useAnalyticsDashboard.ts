
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  chartData: Array<{
    day: string;
    visits: number;
    orders: number;
    revenue: number;
  }>;
  topPages: Array<{
    page: string;
    count: number;
  }>;
  topCities: Array<{
    city: string;
    count: number;
  }>;
  deviceData: Array<{
    device: string;
    count: number;
    percentage: string;
  }>;
  // Propriétés pour la compatibilité avec les composants existants
  totalCustomers: number;
  averageOrderValue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    customerLifetimeValue: number;
  };
  influencerMetrics: {
    totalInfluencers: number;
    totalCommissions: number;
    topInfluencers: Array<{
      id: string;
      name: string;
      sales: number;
    }>;
  };
}

export const useAnalyticsDashboard = (defaultDateRange: string = '7d') => {
  const [dateRange, setDateRange] = useState(defaultDateRange);

  const getDateRange = () => {
    const end = endOfDay(new Date());
    let start;
    
    switch (dateRange) {
      case '1d': start = startOfDay(new Date()); break;
      case '7d': 
      case '7days': start = startOfDay(subDays(new Date(), 7)); break;
      case '30d':
      case '30days': start = startOfDay(subDays(new Date(), 30)); break;
      case '90d':
      case '90days': start = startOfDay(subDays(new Date(), 90)); break;
      case 'year': start = startOfDay(subDays(new Date(), 365)); break;
      default: start = startOfDay(subDays(new Date(), 7));
    }
    
    return { start, end };
  };

  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-dashboard', dateRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const { start, end } = getDateRange();

      // Récupérer les visites
      const { data: siteVisits = [], error: visitsError } = await supabase
        .from('site_visits')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (visitsError) throw visitsError;

      // Récupérer les commandes
      const { data: orders = [], error: ordersError } = await supabase
        .from('customer_orders')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (ordersError) throw ordersError;

      // Récupérer les clients
      const { data: customers = [], error: customersError } = await supabase
        .from('crm_customers')
        .select('*');

      if (customersError) throw customersError;

      // Récupérer les influenceurs
      const { data: influencers = [], error: influencersError } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('status', 'approved');

      if (influencersError) throw influencersError;

      // Récupérer les commissions
      const { data: commissions = [], error: commissionsError } = await supabase
        .from('influencer_commissions')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (commissionsError) throw commissionsError;

      // Récupérer les données comportementales
      const { data: behavioralData = [], error: behavioralError } = await supabase
        .from('behavioral_tracking')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (behavioralError) throw behavioralError;

      // Calculer les métriques principales
      const totalVisits = siteVisits.length;
      const uniqueVisitors = new Set(siteVisits.map(v => v.visitor_id)).size;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const conversionRate = totalVisits > 0 ? (totalOrders / totalVisits * 100) : 0;
      const totalCustomers = customers.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Données pour les graphiques par jour
      const visitsByDay = siteVisits.reduce((acc, visit) => {
        const day = format(new Date(visit.created_at), 'dd/MM');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const ordersByDay = orders.reduce((acc, order) => {
        const day = format(new Date(order.created_at), 'dd/MM');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const chartData = Object.keys({...visitsByDay, ...ordersByDay}).map(day => ({
        day,
        visits: visitsByDay[day] || 0,
        orders: ordersByDay[day] || 0,
        revenue: orders
          .filter(o => format(new Date(o.created_at), 'dd/MM') === day)
          .reduce((sum, o) => sum + (o.total_amount || 0), 0)
      }));

      // Données mensuelles pour les graphiques
      const monthlyRevenue = orders.reduce((acc, order) => {
        const month = format(new Date(order.created_at), 'MM/yyyy');
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.revenue += order.total_amount || 0;
          existing.orders += 1;
        } else {
          acc.push({
            month,
            revenue: order.total_amount || 0,
            orders: 1
          });
        }
        return acc;
      }, [] as Array<{ month: string; revenue: number; orders: number }>);

      // Top pages
      const topPagesMap = siteVisits.reduce((acc, visit) => {
        acc[visit.page_path] = (acc[visit.page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPages = Object.entries(topPagesMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([page, count]) => ({ page, count }));

      // Top villes
      const citiesMap = siteVisits.reduce((acc, visit) => {
        const city = visit.city || 'Inconnu';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCities = Object.entries(citiesMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([city, count]) => ({ city, count }));

      // Données des appareils
      const deviceMap = behavioralData.reduce((acc, data) => {
        const deviceType = data.user_agent?.includes('Mobile') ? 'Mobile' : 
                          data.user_agent?.includes('Tablet') ? 'Tablet' : 'Desktop';
        acc[deviceType] = (acc[deviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const deviceData = Object.entries(deviceMap).map(([device, count]) => ({
        device,
        count,
        percentage: behavioralData.length > 0 ? ((count / behavioralData.length) * 100).toFixed(1) : '0'
      }));

      // Métriques clients
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const newCustomers = customers.filter(c => new Date(c.created_at) >= thirtyDaysAgo).length;
      const returningCustomers = customers.filter(c => (c.order_count || 0) > 1).length;
      const customerLifetimeValue = customers.length > 0 ? 
        customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length : 0;

      // Métriques influenceurs
      const totalCommissions = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
      const topInfluencers = influencers.slice(0, 5).map(inf => ({
        id: inf.id,
        name: inf.user_id || 'Influenceur',
        sales: inf.total_earnings || 0
      }));

      return {
        totalVisits,
        uniqueVisitors,
        totalOrders,
        totalRevenue,
        conversionRate,
        chartData,
        topPages,
        topCities,
        deviceData,
        totalCustomers,
        averageOrderValue,
        monthlyRevenue,
        customerMetrics: {
          newCustomers,
          returningCustomers,
          customerLifetimeValue
        },
        influencerMetrics: {
          totalInfluencers: influencers.length,
          totalCommissions,
          topInfluencers
        }
      };
    }
  });

  const exportMetrics = () => {
    if (!analyticsData) return;
    
    const dataToExport = {
      period: dateRange,
      exportDate: new Date().toISOString(),
      metrics: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    data: analyticsData,
    metrics: analyticsData,
    isLoading,
    error,
    dateRange,
    setDateRange,
    refetch,
    exportMetrics
  };
};
