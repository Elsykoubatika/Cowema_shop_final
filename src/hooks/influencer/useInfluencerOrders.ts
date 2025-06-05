
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price_at_time: number;
  promo_price?: number;
  image?: string;
  product_id: string;
}

export interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_info: any;
  delivery_address: any;
  notes?: string;
  order_items: OrderItem[];
}

export interface OrderStats {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalSalesAmount: number;
  avgOrderValue: number;
  conversionRate: number;
  thisMonthOrders: number;
  lastMonthOrders: number;
  ordersGrowth: number;
  totalCommissions: number;
}

export const useInfluencerOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUserInfluencer } = useInfluencerStore();

  const fetchOrders = async () => {
    if (!currentUserInfluencer?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customer_orders')
        .select(`
          *,
          order_items (
            id,
            title,
            quantity,
            price_at_time,
            promo_price,
            image,
            product_id
          )
        `)
        .eq('influencer_id', currentUserInfluencer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedOrders: Order[] = data?.map(order => ({
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        customer_info: order.customer_info,
        delivery_address: order.delivery_address,
        notes: order.notes,
        order_items: order.order_items || []
      })) || [];

      setOrders(formattedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUserInfluencer?.id]);

  const stats: OrderStats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    
    const totalSalesAmount = deliveredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const avgOrderValue = deliveredOrders.length > 0 ? totalSalesAmount / deliveredOrders.length : 0;

    const thisMonthOrders = orders.filter(o => new Date(o.created_at) >= thisMonth).length;
    const lastMonthOrders = orders.filter(o => {
      const date = new Date(o.created_at);
      return date >= lastMonth && date <= lastMonthEnd;
    }).length;

    const ordersGrowth = lastMonthOrders > 0 
      ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : 0;

    // Calcul des commissions (5% par défaut)
    const commissionRate = currentUserInfluencer?.commissionRate || 5;
    const totalCommissions = totalSalesAmount * (commissionRate / 100);

    // Estimation du taux de conversion (commandes livrées / clics estimés)
    const estimatedClicks = Math.max(orders.length * 15, 100);
    const conversionRate = estimatedClicks > 0 ? (deliveredOrders.length / estimatedClicks) * 100 : 0;

    return {
      totalOrders: orders.length,
      deliveredOrders: deliveredOrders.length,
      pendingOrders: pendingOrders.length,
      totalSalesAmount,
      avgOrderValue,
      conversionRate,
      thisMonthOrders,
      lastMonthOrders,
      ordersGrowth,
      totalCommissions
    };
  }, [orders, currentUserInfluencer?.commissionRate]);

  return {
    orders,
    stats,
    isLoading,
    error,
    refetch: fetchOrders
  };
};
