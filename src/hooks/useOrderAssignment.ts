
import { useOrderStore } from './useOrderStore';
import { useAuthStore } from './useAuthStore';
import { toast } from 'sonner';
import { Order } from '@/types/order';
import { useRolePermissions } from './useRolePermissions';

export const useOrderAssignment = () => {
  const { assignOrder } = useOrderStore();
  const { user } = useAuthStore();
  const { canAssignOrderToSelf } = useRolePermissions();
  
  // Assigner une commande à soi-même
  const assignOrderToSelf = (order: Order) => {
    if (!user) {
      toast.error("Vous devez être connecté pour vous attribuer une commande");
      return false;
    }
    
    if (!canAssignOrderToSelf(order)) {
      toast.error(`Vous ne pouvez pas vous attribuer cette commande car elle n'est pas dans votre ville (${user.city})`);
      return false;
    }
    
    assignOrder(order.id, user.id);
    toast.success("La commande vous a été attribuée");
    return true;
  };
  
  // Assigner une commande à un autre utilisateur
  const assignOrderToUser = (order: Order, userId: string, userName: string) => {
    assignOrder(order.id, userId);
    toast.success(`La commande a été attribuée à ${userName}`);
    return true;
  };
  
  return {
    assignOrderToSelf,
    assignOrderToUser
  };
};
