
import { useUnifiedAuth } from './useUnifiedAuth';
import { useEffect, useState } from 'react';

// Hook de compatibilité pour l'espace influenceur avec timeout
export const useInfluencerAuth = () => {
  const { user, isAuthenticated, isLoading } = useUnifiedAuth();
  const [hasChecked, setHasChecked] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  const isAuthorized = isAuthenticated && user?.role === 'influencer';
  
  useEffect(() => {
    // Timeout de sécurité pour éviter le chargement infini
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout reached for influencer auth check');
      setTimeoutReached(true);
      setHasChecked(true);
    }, 10000); // 10 secondes max

    if (!isLoading) {
      setHasChecked(true);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);
  
  const redirectToLoginIfUnauthorized = () => {
    if ((hasChecked || timeoutReached) && !isAuthorized) {
      console.log('🔄 Redirecting unauthorized user to login');
      window.location.href = '/influencer/login';
    }
  };

  return {
    isAuthorized,
    redirectToLoginIfUnauthorized,
    user,
    isAuthenticated,
    isLoading: (isLoading && !timeoutReached) || (!hasChecked && !timeoutReached),
    hasTimedOut: timeoutReached
  };
};
