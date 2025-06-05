
import { useState, useCallback } from 'react';
import { useAuthStore } from './useAuthStore';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return { user, loading, fetchUser };
};
