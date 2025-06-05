
import { useMemo } from 'react';
import { useSupabaseOrders } from './useSupabaseOrders';

export const useUserOrderStats = () => {
  const { userOrders, isLoading } = useSupabaseOrders();

  const stats = useMemo(() => {
    if (!userOrders || userOrders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        lastOrderDate: null,
        averageOrderValue: 0
      };
    }

    console.log('📊 Calcul des stats avec', userOrders.length, 'commandes');

    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const pendingOrders = userOrders.filter(order => order.status === 'pending').length;
    const deliveredOrders = userOrders.filter(order => order.status === 'delivered').length;
    const lastOrderDate = userOrders.length > 0 
      ? new Date(Math.max(...userOrders.map(order => new Date(order.created_at).getTime())))
      : null;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    const calculatedStats = {
      totalOrders,
      totalSpent,
      pendingOrders,
      deliveredOrders,
      lastOrderDate,
      averageOrderValue
    };

    console.log('📈 Stats calculées:', calculatedStats);

    return calculatedStats;
  }, [userOrders]);

  return {
    stats,
    isLoading,
    orders: userOrders
  };
};
