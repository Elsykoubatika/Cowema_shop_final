
import { useUnifiedAuth } from './useUnifiedAuth';

// Hook de compatibilité - redirige vers le système unifié
export const useSupabaseAuth = () => {
  return useUnifiedAuth();
};
