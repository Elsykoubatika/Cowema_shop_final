
import { useAuthStore } from './useAuthStore';
import { Order } from '@/types/order';

interface RolePermissions {
  canViewAllOrders: boolean;
  canAssignOrders: boolean;
  canAssignToOthers: boolean;
  canUpdateOrderStatus: boolean;
  canViewSalesStats: boolean;
  canViewProducts: boolean;
  canViewCategories: boolean;
  canViewPromotions: boolean;
  canManageSettings: boolean;
  canViewInfluencers: boolean;
  canSendMessages: boolean;
  canDeleteOrders: boolean;
  canManageUsers: boolean;
  // Check si un utilisateur peut s'attribuer une commande spécifique
  canAssignOrderToSelf: (order: Order) => boolean;
}

export const useRolePermissions = (): RolePermissions => {
  const { user } = useAuthStore();
  const userRole = user?.role || '';
  const userCity = user?.city || '';
  
  // Vérifie si une commande peut être attribuée à l'utilisateur actuel en fonction de la ville
  const canAssignOrderToSelf = (order: Order): boolean => {
    if (!user || !order || !order.customer) return false;
    
    // Si admin ou sales_manager, peut s'attribuer n'importe quelle commande
    if (userRole === 'admin' || userRole === 'sales_manager') return true;
    
    // Pour les vendeurs et team leads, vérifier la ville
    if ((userRole === 'seller' || userRole === 'team_lead') && userCity) {
      // Vérifier si la ville du client correspond à la ville du vendeur
      return order.customer.city?.toLowerCase() === userCity.toLowerCase();
    }
    
    return false;
  };
  
  return {
    // Admin
    canViewAllOrders: ['admin', 'sales_manager', 'team_lead', 'seller'].includes(userRole),
    canAssignOrders: ['admin', 'sales_manager', 'team_lead', 'seller'].includes(userRole),
    canAssignToOthers: ['admin', 'sales_manager', 'team_lead'].includes(userRole),
    canUpdateOrderStatus: ['admin', 'sales_manager', 'team_lead', 'seller'].includes(userRole),
    canViewSalesStats: ['admin', 'sales_manager', 'team_lead'].includes(userRole),
    canViewProducts: ['admin', 'sales_manager', 'team_lead', 'seller'].includes(userRole),
    canViewCategories: ['admin', 'sales_manager', 'team_lead'].includes(userRole),
    canViewPromotions: ['admin', 'sales_manager', 'team_lead'].includes(userRole),
    canManageSettings: ['admin'].includes(userRole),
    canViewInfluencers: ['admin', 'sales_manager'].includes(userRole),
    canSendMessages: ['admin', 'sales_manager', 'team_lead', 'seller'].includes(userRole),
    canDeleteOrders: ['admin', 'sales_manager'].includes(userRole),
    canManageUsers: ['admin'].includes(userRole),
    canAssignOrderToSelf
  };
};
