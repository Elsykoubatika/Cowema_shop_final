
import { SupabaseOrder } from './types';

export const filterOrdersByCity = (orders: SupabaseOrder[], user: any) => {
  if (!user) return [];
  
  console.log('getAllOrders - user:', user);
  console.log('getAllOrders - all orders:', orders);
  
  // Admin and sales_manager see all orders if no city is specified
  if ((user.role === 'admin' || user.role === 'sales_manager') && !user.city) {
    console.log('Admin/sales_manager without city - returning all orders:', orders.length);
    return orders;
  }

  // Apply city-based filtering
  const filteredOrders = orders.filter(order => {
    const orderCity = order.customer_info?.city || order.delivery_address?.city;
    
    console.log('Filtering order:', order.id, 'orderCity:', orderCity, 'userCity:', user.city);
    
    if (!orderCity) {
      console.log('Order has no city - including it');
      return true; // Show orders without city info
    }
    
    // If user has no city specified, they can see all orders (according to their role permissions)
    if (!user.city) {
      const canSeeAll = user.role === 'admin' || user.role === 'sales_manager';
      console.log('User has no city - can see all:', canSeeAll);
      return canSeeAll;
    }

    const userCity = user.city.toLowerCase();
    const deliveryCity = orderCity.toLowerCase();

    // Pointe-Noire users can manage Pointe-Noire and Dolisie
    if (userCity === 'pointe-noire') {
      const canManage = deliveryCity === 'pointe-noire' || deliveryCity === 'dolisie';
      console.log('Pointe-Noire user - can manage:', canManage);
      return canManage;
    }

    // Brazzaville users can manage Brazzaville and other cities (except Pointe-Noire and Dolisie)
    if (userCity === 'brazzaville') {
      const canManage = deliveryCity !== 'pointe-noire' && deliveryCity !== 'dolisie';
      console.log('Brazzaville user - can manage:', canManage);
      return canManage;
    }

    // For other cities, exact match
    const exactMatch = userCity === deliveryCity;
    console.log('Other city user - exact match:', exactMatch);
    return exactMatch;
  });

  console.log('Filtered orders count:', filteredOrders.length);
  return filteredOrders;
};

export const getUnassignedOrders = (accessibleOrders: SupabaseOrder[]) => {
  console.log('getUnassignedOrders - Starting with accessible orders:', accessibleOrders.length);
  
  const unassigned = accessibleOrders.filter(order => {
    // More comprehensive check for unassigned status
    const assignedTo = order.assigned_to;
    
    // Check all possible "empty" values
    const isUnassigned = (
      assignedTo === null || 
      assignedTo === undefined || 
      assignedTo === '' || 
      (typeof assignedTo === 'string' && assignedTo.trim() === '')
    );
    
    console.log('🔍 Order Analysis:', {
      id: order.id.substring(0, 8),
      assigned_to: assignedTo,
      assigned_to_type: typeof assignedTo,
      assigned_to_length: assignedTo ? assignedTo.length : 'N/A',
      isUnassigned: isUnassigned,
      customer_name: `${order.customer_info?.firstName || ''} ${order.customer_info?.lastName || ''}`.trim()
    });
    
    return isUnassigned;
  });
  
  console.log('🎯 getUnassignedOrders SUMMARY:');
  console.log('- Total accessible orders:', accessibleOrders.length);
  console.log('- Unassigned orders found:', unassigned.length);
  console.log('- Unassigned order IDs:', unassigned.map(o => o.id.substring(0, 8)));
  
  return unassigned;
};

export const getUserAssignedOrders = (accessibleOrders: SupabaseOrder[], user: any) => {
  if (!user) {
    console.log('getMyOrders - no user');
    return [];
  }
  
  const myOrders = accessibleOrders.filter(order => {
    // Ensure both values are strings for comparison
    const orderAssignedTo = order.assigned_to ? String(order.assigned_to) : '';
    const userId = String(user.id);
    const isAssignedToMe = orderAssignedTo === userId;
    console.log('Order', order.id, 'assigned_to:', orderAssignedTo, 'user.id:', userId, 'isAssignedToMe:', isAssignedToMe);
    return isAssignedToMe;
  });
  
  console.log('getMyOrders - total accessible:', accessibleOrders.length, 'my orders:', myOrders.length);
  console.log('My orders:', myOrders.map(o => ({ id: o.id, assigned_to: o.assigned_to })));
  return myOrders;
};
