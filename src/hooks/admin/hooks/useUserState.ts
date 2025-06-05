
import { useState } from 'react';
import { UserProfile } from '@/types/userManager';

export const useUserState = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setUsersData = (userData: UserProfile[]) => {
    setUsers(userData);
  };

  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const setErrorState = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    users,
    loading,
    error,
    setUsersData,
    setLoadingState,
    setErrorState,
    resetError
  };
};
