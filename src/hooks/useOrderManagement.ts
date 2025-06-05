
import { useState } from 'react';
import { useSupabaseOrders } from './useSupabaseOrders';
import { useAuthStore } from './useAuthStore';
import { useRolePermissions } from './useRolePermissions';
import { filterOrdersByCity, getUnassignedOrders, getUserAssignedOrders } from './orders/orderFiltering';
import { assignOrderToSelf, assignOrderToUser, updateOrderStatus } from './orders/orderAssignment';
import { canManageOrder, canAssignOrderToSelf, canAssignToOthers } from './orders/orderPermissions';

export const useOrderManagement = () => {
  const { orders, assignOrder, updateOrderStatus: updateOrderStatusFn, fetchOrders } = useSupabaseOrders();
  const { user } = useAuthStore();
  const permissions = useRolePermissions();
  const [isLoading, setIsLoading] = useState(false);

  // Get all orders accessible to the user based on city restrictions
  const getAllOrders = () => {
    return filterOrdersByCity(orders, user);
  };

  // Get unassigned orders - Enhanced logic with better debugging
  const getUnassignedOrdersFn = () => {
    const allAccessible = getAllOrders();
    return getUnassignedOrders(allAccessible);
  };

  // Get user's assigned orders - Fixed logic
  const getMyOrders = () => {
    const allAccessible = getAllOrders();
    return getUserAssignedOrders(allAccessible, user);
  };

  // Assign order to self
  const assignToSelf = async (orderId: string) => {
    return assignOrderToSelf(orderId, user, assignOrder, fetchOrders, setIsLoading);
  };

  // Assign order to another user
  const assignToUser = async (orderId: string, userId: string, userName: string) => {
    return assignOrderToUser(orderId, userId, userName, permissions.canAssignToOthers, assignOrder, fetchOrders, setIsLoading);
  };

  // Update order status
  const updateStatus = async (orderId: string, status: string) => {
    return updateOrderStatus(orderId, status, updateOrderStatusFn, fetchOrders, setIsLoading);
  };

  // Check if user can manage specific order
  const canManageOrderFn = (order: any) => {
    const accessibleOrders = getAllOrders();
    return canManageOrder(order, user, accessibleOrders);
  };

  // Check if user can assign order to themselves - Enhanced logic
  const canAssignOrderToSelfFn = (order: any) => {
    const accessibleOrders = getAllOrders();
    return canAssignOrderToSelf(order, user, accessibleOrders);
  };

  // Check if user can assign orders to others
  const canAssignToOthersFn = () => {
    return canAssignToOthers(user);
  };

  return {
    getAllOrders,
    getUnassignedOrders: getUnassignedOrdersFn,
    getMyOrders,
    assignToSelf,
    assignToUser,
    updateStatus,
    canManageOrder: canManageOrderFn,
    canAssignOrderToSelf: canAssignOrderToSelfFn,
    canAssignToOthers: canAssignToOthersFn,
    isLoading,
    refreshOrders: fetchOrders
  };
};
