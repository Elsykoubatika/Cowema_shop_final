
import { StateCreator } from 'zustand';
import { AuthState } from '../../../types/auth';
import { mockUsers } from '../createAuthStore';

export const createAddressActions = () => {
  return ((set, get) => ({
    addAddress: (address) => {
      const { user } = get();
      if (!user) return;
      
      // Generate ID
      const id = Math.random().toString(36).substring(2, 15);
      
      // Add new address
      const addresses = [...user.addresses, { ...address, id, isDefault: user.addresses.length === 0 }];
      
      // Update user
      const updatedUser = { ...user, addresses };
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    },
    
    updateAddress: (id, address) => {
      const { user } = get();
      if (!user) return;
      
      const addresses = user.addresses.map(addr => 
        addr.id === id ? { ...addr, ...address } : addr
      );
      
      // Update user
      const updatedUser = { ...user, addresses };
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    },
    
    removeAddress: (id) => {
      const { user } = get();
      if (!user) return;
      
      // Filter out address
      const addresses = user.addresses.filter(addr => addr.id !== id);
      
      // If removed address was default, set new default
      if (user.addresses.find(addr => addr.id === id)?.isDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }
      
      // Update user
      const updatedUser = { ...user, addresses };
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    },
    
    setDefaultAddress: (id) => {
      const { user } = get();
      if (!user) return;
      
      const addresses = user.addresses.map(addr => 
        ({ ...addr, isDefault: addr.id === id })
      );
      
      // Update user
      const updatedUser = { ...user, addresses };
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    }
  })) as unknown as StateCreator<AuthState>;
};
