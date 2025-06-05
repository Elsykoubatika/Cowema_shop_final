
import { StateCreator } from 'zustand';
import { AuthState } from '../../../types/auth';
import { mockUsers } from '../createAuthStore';

export const createOrderActions = () => {
  return ((set, get) => ({
    addLoyaltyPoints: (points) => {
      const { user } = get();
      if (!user) return;
      
      const updatedUser = {
        ...user,
        loyaltyPoints: user.loyaltyPoints + points
      };
      
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    },
    
    addOrder: (order) => {
      const { user } = get();
      if (!user) return;
      
      // Generate ID
      const id = Math.random().toString(36).substring(2, 15);
      
      // Add new order
      const orders = [...user.orders, { ...order, id }];
      
      // Calculate loyalty points (1pt per 1000 FCFA)
      const loyaltyPoints = order.total / 1000;
      
      // Update user
      const updatedUser = {
        ...user,
        orders,
        loyaltyPoints: user.loyaltyPoints + loyaltyPoints
      };
      
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    },
    
    updateOrderStatus: (id, status) => {
      const { user } = get();
      if (!user) return;
      
      const orders = user.orders.map(order => 
        order.id === id ? { ...order, status } : order
      );
      
      // Update user
      const updatedUser = { ...user, orders };
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    }
  })) as unknown as StateCreator<AuthState>;
};
