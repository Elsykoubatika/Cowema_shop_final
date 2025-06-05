
import { SupabaseOrder } from './types';

export const transformOrderData = (data: any[]): SupabaseOrder[] => {
  return (data || []).map(order => {
    const transformedOrder = {
      id: order.id,
      customer_info: (order.customer_info as any) || {},
      delivery_address: (order.delivery_address as any) || {},
      delivery_fee: order.delivery_fee || 0,
      total_amount: order.total_amount,
      status: (order.status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') || 'pending',
      assigned_to: order.assigned_to,
      created_at: order.created_at,
      updated_at: order.updated_at,
      user_id: order.user_id,
      order_items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        title: item.title || item.name || 'Produit sans nom',
        quantity: Number(item.quantity) || 1,
        price_at_time: Number(item.price_at_time) || 0,
        promo_price: item.promo_price ? Number(item.promo_price) : null,
        image: item.image || null,
        product_id: item.product_id
      }))
    };

    console.log(`🔄 Transformed order ${order.id.substring(0, 8)}:`, {
      id: transformedOrder.id.substring(0, 8),
      itemsCount: transformedOrder.order_items.length,
      items: transformedOrder.order_items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price_at_time,
        hasImage: !!item.image
      }))
    });

    return transformedOrder;
  });
};

export const transformSingleOrder = (data: any): SupabaseOrder => {
  const transformedOrder = {
    id: data.id,
    customer_info: (data.customer_info as any) || {},
    delivery_address: (data.delivery_address as any) || {},
    delivery_fee: data.delivery_fee || 0,
    total_amount: data.total_amount,
    status: (data.status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') || 'pending',
    assigned_to: data.assigned_to,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user_id: data.user_id,
    order_items: (data.order_items || []).map((item: any) => ({
      id: item.id,
      title: item.title || item.name || 'Produit sans nom',
      quantity: Number(item.quantity) || 1,
      price_at_time: Number(item.price_at_time) || 0,
      promo_price: item.promo_price ? Number(item.promo_price) : null,
      image: item.image || null,
      product_id: item.product_id
    }))
  };

  console.log(`🔄 Transformed single order ${data.id.substring(0, 8)}:`, {
    id: transformedOrder.id.substring(0, 8),
    itemsCount: transformedOrder.order_items.length,
    items: transformedOrder.order_items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price_at_time,
      hasImage: !!item.image
    }))
  });

  return transformedOrder;
};
