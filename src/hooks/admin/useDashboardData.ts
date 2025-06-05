
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/hooks/useAuthStore';

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  monthlyGrowth: {
    orders: number;
    customers: number;
    revenue: number;
    products: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer les commandes
      let ordersQuery = supabase
        .from('customer_orders')
        .select('*');

      // Filtrer par ville pour les non-admins
      if (user.city && (user.role === 'seller' || user.role === 'team_lead' || user.role === 'sales_manager')) {
        const userCity = user.city.toLowerCase();
        
        if (userCity === 'pointe-noire') {
          ordersQuery = ordersQuery.or(
            `customer_info->>city.ilike.%pointe-noire%,customer_info->>city.ilike.%dolisie%`
          );
        } else if (userCity === 'brazzaville') {
          ordersQuery = ordersQuery
            .not('customer_info->>city', 'ilike', '%pointe-noire%')
            .not('customer_info->>city', 'ilike', '%dolisie%');
        } else {
          ordersQuery = ordersQuery.or(
            `customer_info->>city.ilike.%${userCity}%`
          );
        }
      }

      const { data: orders, error: ordersError } = await ordersQuery.order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Récupérer les clients
      const { data: customers, error: customersError } = await supabase
        .from('crm_customers')
        .select('*');

      if (customersError) throw customersError;

      // Récupérer les produits
      const { data: products, error: productsError } = await supabase
        .from('products_unified')
        .select('*')
        .eq('is_active', true);

      if (productsError) throw productsError;

      // Calculer les statistiques
      const totalOrders = orders?.length || 0;
      const totalCustomers = customers?.length || 0;
      const totalProducts = products?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      // Calculer la croissance mensuelle (simulation)
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      
      const currentMonthOrders = orders?.filter(order => {
        const orderMonth = new Date(order.created_at).getMonth();
        return orderMonth === currentMonth;
      }) || [];

      const lastMonthOrders = orders?.filter(order => {
        const orderMonth = new Date(order.created_at).getMonth();
        return orderMonth === lastMonth;
      }) || [];

      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      const monthlyGrowth = {
        orders: lastMonthOrders.length > 0 ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0,
        customers: 5, // Simulation
        revenue: lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0,
        products: 8 // Simulation
      };

      // Calculer les revenus mensuels
      const monthlyData: Record<string, { revenue: number; orders: number }> = {};
      orders?.forEach(order => {
        const month = new Date(order.created_at).toISOString().substring(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, orders: 0 };
        }
        monthlyData[month].revenue += order.total_amount || 0;
        monthlyData[month].orders += 1;
      });

      const monthlyRevenue = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
          revenue: data.revenue,
          orders: data.orders
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Last 6 months

      // Préparer les commandes récentes avec vérification de type
      const recentOrders = orders?.slice(0, 5).map(order => {
        let customerName = 'Client';
        
        // Vérification de type pour customer_info
        if (order.customer_info && typeof order.customer_info === 'object' && order.customer_info !== null) {
          const customerInfo = order.customer_info as Record<string, any>;
          customerName = customerInfo.name || customerInfo.first_name || customerInfo.nom || 'Client';
        }

        return {
          id: order.id,
          customer_name: customerName,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at
        };
      }) || [];

      setStats({
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue,
        recentOrders,
        monthlyGrowth,
        monthlyRevenue
      });

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
