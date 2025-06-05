
import { SupabaseOrder } from './types';

export const canManageOrder = (order: any, user: any, accessibleOrders: SupabaseOrder[]) => {
  if (!user) return false;
  
  // Check if order is in user's manageable area first
  const canAccess = accessibleOrders.some(o => o.id === order.id);
  
  if (!canAccess) return false;
  
  // Admin and sales_manager can manage all accessible orders
  if (user.role === 'admin' || user.role === 'sales_manager') {
    return true;
  }
  
  // Team leads can manage orders in their area
  if (user.role === 'team_lead') {
    return true;
  }
  
  // Sellers can only manage their assigned orders
  if (user.role === 'seller') {
    return order.assigned_to === user.id;
  }
  
  return false;
};

export const canAssignOrderToSelf = (order: any, user: any, accessibleOrders: SupabaseOrder[]) => {
  if (!user) return false;
  
  // Enhanced check for already assigned orders
  const assignedTo = order.assigned_to;
  const isAlreadyAssigned = (
    assignedTo !== null && 
    assignedTo !== undefined && 
    assignedTo !== '' && 
    (typeof assignedTo !== 'string' || assignedTo.trim() !== '')
  );
  
  if (isAlreadyAssigned) {
    console.log('🚫 Order already assigned to:', assignedTo);
    return false;
  }
  
  // Check if order is in user's manageable area
  const canAccess = accessibleOrders.some(o => o.id === order.id);
  console.log('✅ Can access order:', canAccess);
  return canAccess;
};

export const canAssignToOthers = (user: any) => {
  return user?.role === 'admin' || user?.role === 'sales_manager' || user?.role === 'team_lead';
};
