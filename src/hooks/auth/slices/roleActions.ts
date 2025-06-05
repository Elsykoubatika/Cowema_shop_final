
import { StateCreator } from 'zustand';
import { AuthState, UserRole } from '../../../types/auth';
import { mockUsers } from '../createAuthStore';

export const createRoleActions = () => {
  return ((set, get) => ({
    updateUserRole: (role: UserRole, city?: string) => {
      const { user } = get();
      if (!user) return;
      
      // Si le rôle est vendeur ou team lead, la ville est obligatoire
      if ((role === 'seller' || role === 'team_lead') && !city) {
        console.error('La ville est obligatoire pour les vendeurs et team leads');
        return;
      }
      
      const updatedUser = { 
        ...user, 
        role,
        // Si la ville est fournie, la mettre à jour, sinon conserver l'ancienne valeur ou null
        ...(city !== undefined && { city })
      };
      
      set({ user: updatedUser });
      
      // Update mock database
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser;
      }
    }
  })) as unknown as StateCreator<AuthState>;
};
