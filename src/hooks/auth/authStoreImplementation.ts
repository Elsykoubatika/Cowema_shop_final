
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole, RegisterData } from '../../types/auth';

// Mock users database
const mockUsers: Record<string, { password: string; user: User }> = {};

export const createAuthStore = () => 
  create<AuthState>()(
    persist(
      (set, get) => ({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        
        checkAuthStatus: () => {
          // This would normally check with a backend
          // For now, we'll just restore from persisted state (handled by zustand persist)
          return get().isAuthenticated;
        },

        login: async (email: string, password: string) => {
          // Simulate API request delay
          set({ isLoading: true });
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const userRecord = mockUsers[email];
          if (!userRecord || userRecord.password !== password) {
            set({ isLoading: false });
            return false;
          }
          
          set({ isAuthenticated: true, user: userRecord.user, isLoading: false });
          return true;
        },
        
        register: async (userData: RegisterData) => {
          // Simulate API request delay
          set({ isLoading: true });
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Check if user already exists
          if (mockUsers[userData.email]) {
            set({ isLoading: false });
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
            phone: userData.phone,
            nom: userData.nom,
            gender: userData.gender,
            role: userData.role || 'user',
            loyaltyPoints: 0,
            addresses: [],
            orders: [],
            customers: [], // Initialize customers array
            createdAt: new Date().toISOString()
          };
          
          // Store user
          mockUsers[userData.email] = {
            password: userData.password,
            user: newUser
          };
          
          // Login user
          set({ isAuthenticated: true, user: newUser, isLoading: false });
          return true;
        },
        
        logout: () => {
          set({ isAuthenticated: false, user: null });
        },
        
        updateProfile: (data: Partial<User>) => {
          const { user } = get();
          if (!user) return;
          
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
          
          // Update mock database
          if (mockUsers[user.email]) {
            mockUsers[user.email].user = updatedUser;
          }
        },
        
        updateUserRole: (role: UserRole, city?: string) => {
          const { user } = get();
          if (!user) return;
          
          const updatedUser = { ...user, role, ...(city ? { city } : {}) };
          set({ user: updatedUser });
          
          // Update mock database
          if (mockUsers[user.email]) {
            mockUsers[user.email].user = updatedUser;
          }
        },
        
        addAddress: (address) => {
          const { user } = get();
          if (!user) return;
          
          // Generate ID
          const id = Math.random().toString(36).substring(2, 15);
          
          // Set as default if it's the first address
          const isDefault = user.addresses.length === 0 ? true : address.isDefault;
          
          // Update other addresses if this one is default
          let addresses = [...user.addresses];
          if (isDefault) {
            addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
          }
          
          // Add new address
          addresses.push({ ...address, id, isDefault });
          
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
          
          let addresses = [...user.addresses];
          const index = addresses.findIndex(addr => addr.id === id);
          
          if (index === -1) return;
          
          // If setting this address as default, update other addresses
          if (address.isDefault) {
            addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
          }
          
          // Update the address
          addresses[index] = { ...addresses[index], ...address };
          
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
          
          const addresses = user.addresses.filter(addr => addr.id !== id);
          
          // If we removed the default address and there are other addresses, set the first one as default
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
          
          const addresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
          }));
          
          // Update user
          const updatedUser = { ...user, addresses };
          set({ user: updatedUser });
          
          // Update mock database
          if (mockUsers[user.email]) {
            mockUsers[user.email].user = updatedUser;
          }
        },
        
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
      }),
      {
        name: 'cowema-auth'
      }
    )
  );
