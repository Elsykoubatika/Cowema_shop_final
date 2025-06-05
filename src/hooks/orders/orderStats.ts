
import { SupabaseOrder, OrderStats } from './types';

export const calculateOrderStats = (orders: SupabaseOrder[]): OrderStats => {
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalAmount: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };
};
