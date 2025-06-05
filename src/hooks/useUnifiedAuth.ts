
import { useAuthActions } from './auth/useAuthActions';
import { useAuthStateManager } from './auth/useAuthStateManager';
import { useProfileManager } from './auth/useProfileManager';

export interface AuthUser {
  id: string;
  email: string;
  nom: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender: 'male' | 'female';
  role: 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer';
  city?: string;
  loyaltyPoints: number;
  createdAt: string;
}

export const useUnifiedAuth = () => {
  console.log('🔧 useUnifiedAuth hook called');
  
  const authState = useAuthStateManager();
  const { login: authLogin, register, logout } = useAuthActions();
  const { getDashboardRoute } = useProfileManager();

  // Wrapper pour maintenir la compatibilité avec l'ancien login
  const login = async (email: string, password: string, expectedRoleType?: 'admin' | 'influencer' | 'client') => {
    return await authLogin(email, password, expectedRoleType);
  };

  return {
    ...authState,
    login,
    register,
    logout,
    getDashboardRoute
  };
};
