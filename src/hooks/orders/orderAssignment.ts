
import { toast } from 'sonner';

export const assignOrderToSelf = async (
  orderId: string, 
  user: any, 
  assignOrder: (orderId: string, userId: string) => Promise<void>,
  fetchOrders: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  if (!user) {
    toast.error("Vous devez être connecté");
    return false;
  }

  try {
    setIsLoading(true);
    console.log('Assigning order to self:', orderId, 'user:', user.id);
    await assignOrder(orderId, user.id);
    
    // Force refresh of orders after assignment
    await fetchOrders();
    
    toast.success("Commande attribuée avec succès");
    return true;
  } catch (error) {
    console.error('Error assigning order:', error);
    toast.error("Erreur lors de l'attribution");
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const assignOrderToUser = async (
  orderId: string, 
  userId: string, 
  userName: string,
  canAssignToOthers: boolean,
  assignOrder: (orderId: string, userId: string) => Promise<void>,
  fetchOrders: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  if (!canAssignToOthers) {
    toast.error("Vous n'avez pas l'autorisation d'assigner à d'autres");
    return false;
  }

  try {
    setIsLoading(true);
    console.log('Assigning order to user:', orderId, 'userId:', userId);
    await assignOrder(orderId, userId);
    
    // Force refresh of orders after assignment
    await fetchOrders();
    
    toast.success(`Commande attribuée à ${userName}`);
    return true;
  } catch (error) {
    console.error('Error assigning order:', error);
    toast.error("Erreur lors de l'attribution");
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const updateOrderStatus = async (
  orderId: string, 
  status: string,
  updateOrderStatusFn: (orderId: string, status: any) => Promise<void>,
  fetchOrders: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    setIsLoading(true);
    await updateOrderStatusFn(orderId, status as any);
    
    // Force refresh of orders after status update
    await fetchOrders();
    
    toast.success("Statut mis à jour");
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error("Erreur lors de la mise à jour");
    return false;
  } finally {
    setIsLoading(false);
  }
};
