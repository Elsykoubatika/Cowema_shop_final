
import { useState, useEffect, useCallback } from 'react';
import { SupabaseOrder, OrderStats } from './orders/types';
import { fetchOrders, createOrder, assignOrder, updateOrderStatus, fetchSingleOrder } from './orders/orderOperations';
import { calculateOrderStats } from './orders/orderStats';
import { useUnifiedAuth } from './useUnifiedAuth';

export const useSupabaseOrders = () => {
  const { user } = useUnifiedAuth();
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrdersData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Fetching orders data...');
      const ordersData = await fetchOrders();
      console.log('📊 Orders data fetched:', ordersData.length, 'orders');
      setOrders(ordersData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des commandes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSingleOrderData = useCallback(async (orderId: string) => {
    try {
      console.log('🔄 Fetching single order:', orderId);
      const orderData = await fetchSingleOrder(orderId);
      console.log('📊 Single order data fetched:', orderData);
      return orderData;
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la commande:', error);
      return null;
    }
  }, []);

  const createOrderData = async (orderData: any) => {
    const newOrder = await createOrder(orderData);
    await fetchOrdersData();
    return newOrder;
  };

  const assignOrderData = async (orderId: string, userId: string) => {
    await assignOrder(orderId, userId);
    await fetchOrdersData();
  };

  const updateOrderStatusData = async (orderId: string, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') => {
    await updateOrderStatus(orderId, status);
    await fetchOrdersData();
  };

  const getOrderStats = useCallback((): OrderStats => {
    return calculateOrderStats(orders);
  }, [orders]);

  // Filtrer les commandes pour l'utilisateur connecté si on est dans un contexte client
  const getUserOrders = useCallback((): SupabaseOrder[] => {
    if (!user) return [];
    
    return orders.filter(order => {
      // Vérifier par user_id d'abord
      if (order.user_id === user.id) return true;
      
      // Vérifier par téléphone dans customer_info
      const customerPhone = (order.customer_info as any)?.phone;
      if (customerPhone && user.phone && customerPhone === user.phone) return true;
      
      // Vérifier par email dans customer_info
      const customerEmail = (order.customer_info as any)?.email;
      if (customerEmail && user.email && customerEmail === user.email) return true;
      
      return false;
    });
  }, [orders, user]);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  return {
    orders,
    userOrders: getUserOrders(),
    isLoading,
    loading: isLoading, // Alias pour la compatibilité
    fetchOrders: fetchOrdersData,
    fetchSingleOrder: fetchSingleOrderData,
    createOrder: createOrderData,
    assignOrder: assignOrderData,
    updateOrderStatus: updateOrderStatusData,
    getOrderStats
  };
};

// Export des types pour les autres composants
export type { SupabaseOrder, OrderStats };
