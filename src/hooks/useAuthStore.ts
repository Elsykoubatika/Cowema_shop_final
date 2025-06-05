
import { useUnifiedAuth } from './useUnifiedAuth';

// Hook de compatibilité pour unifier l'authentification
export const useAuthStore = () => {
  const auth = useUnifiedAuth();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    session: auth.session,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    getDashboardRoute: auth.getDashboardRoute
  };
};
