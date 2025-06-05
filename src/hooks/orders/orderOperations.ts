
import { toast } from 'sonner';
import { SupabaseOrder } from './types';
import { transformOrderData, transformSingleOrder } from './orderTransformer';
import { 
  fetchSingleOrderQuery,
  createOrderQuery, 
  assignOrderQuery, 
  updateOrderStatusQuery 
} from './orderQueries';
import { fetchOrdersWithMapping, enrichOrderItemsWithMapping } from './enhancedOrderQueries';

export const fetchOrders = async (): Promise<SupabaseOrder[]> => {
  try {
    console.log('🔄 Fetching orders with enhanced product mapping...');
    const data = await fetchOrdersWithMapping();
    const transformedOrders = transformOrderData(data);
    console.log(`✅ ${transformedOrders.length} commandes transformées avec mapping produits:`, transformedOrders);
    
    return transformedOrders;
  } catch (error) {
    console.error('Error in fetchOrders:', error);
    toast.error('Erreur lors du chargement des commandes');
    return [];
  }
};

export const fetchSingleOrder = async (orderId: string): Promise<SupabaseOrder | null> => {
  try {
    const data = await fetchSingleOrderQuery(orderId);
    console.log('📦 Raw single order from database:', data);
    
    if (data.order_items && data.order_items.length > 0) {
      console.log(`🔍 Enriching single order ${orderId.substring(0, 8)} with mapping`);
      data.order_items = await enrichOrderItemsWithMapping(data.order_items);
    }

    const transformedOrder = transformSingleOrder(data);
    console.log(`✅ Single order transformed with mapping:`, transformedOrder);
    
    return transformedOrder;
  } catch (error) {
    console.error('Error in fetchSingleOrder:', error);
    return null;
  }
};

export const createOrder = async (orderData: any): Promise<SupabaseOrder> => {
  try {
    const data = await createOrderQuery(orderData);
    const transformedOrder = transformSingleOrder(data);
    console.log(`✅ Commande créée: ${transformedOrder.id}`);
    return transformedOrder;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const assignOrder = async (orderId: string, userId: string): Promise<void> => {
  try {
    await assignOrderQuery(orderId, userId);
    console.log(`✅ Commande ${orderId} assignée à ${userId}`);
  } catch (error) {
    console.error('Error in assignOrder:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'): Promise<void> => {
  try {
    await updateOrderStatusQuery(orderId, status);
    console.log(`✅ Statut de la commande ${orderId} mis à jour: ${status}`);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw error;
  }
};
