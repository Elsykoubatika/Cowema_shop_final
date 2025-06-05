
import { StateCreator } from 'zustand';
import { AuthState, User } from '../../../types/auth';
import { MockUserRecord } from '../mockDatabase';

export const createAuthActions = (mockUsers: Record<string, MockUserRecord>) => {
  return ((set, get) => ({
    checkAuthStatus: () => {
      // This would normally check with a backend
      // For now, we'll just restore from persisted state (handled by zustand persist)
      return get().isAuthenticated;
    },

    login: async (email: string, password: string) => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userRecord = mockUsers[email];
      if (!userRecord || userRecord.password !== password) {
        return false;
      }
      
      set({ isAuthenticated: true, user: userRecord.user });
      return true;
    },
    
    register: async (userData: any) => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (mockUsers[userData.email]) {
        return false;
      }
      
      // Generate ID
      const id = Math.random().toString(36).substring(2, 15);
      
      // Create new user
      const newUser: User = {
        id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "", // Make phone optional
        role: userData.role || "user", // Add role if provided, default to "user"
        loyaltyPoints: 0,
        addresses: [],
        orders: [],
        createdAt: new Date().toISOString(),
        nom: userData.nom || userData.firstName + " " + userData.lastName,
        gender: userData.gender || "male"
      };
      
      // Store user
      mockUsers[userData.email] = {
        password: userData.password,
        user: newUser
      };
      
      // Only login user if autoLogin is true (default) or undefined
      if (userData.autoLogin !== false) {
        set({ isAuthenticated: true, user: newUser });
      }
      
      return true;
    },
    
    logout: () => {
      set({ isAuthenticated: false, user: null });
    },
  })) as unknown as StateCreator<AuthState>;
};
