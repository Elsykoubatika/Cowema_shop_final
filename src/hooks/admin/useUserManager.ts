
import { useEffect } from 'react';
import { CreateUserData } from '@/types/userManager';
import { UserService } from './services/userService';
import { useUserState } from './hooks/useUserState';
import { useUserNotifications } from './utils/userNotifications';

export type { UserProfile, CreateUserData } from '@/types/userManager';

export const useUserManager = () => {
  const {
    users,
    loading,
    error,
    setUsersData,
    setLoadingState,
    setErrorState,
    resetError
  } = useUserState();

  const {
    showUserCreatedToast,
    showUserUpdatedToast,
    showUserDeletedToast,
    showPasswordResetToast,
    showLoadingErrorToast,
    showCreateErrorToast,
    showUpdateErrorToast,
    showDeleteErrorToast,
    showPasswordResetErrorToast
  } = useUserNotifications();

  const fetchUsers = async () => {
    try {
      setLoadingState(true);
      resetError();
      
      console.log('📋 Récupération des utilisateurs...');
      
      const userData = await UserService.fetchUsers();
      setUsersData(userData);
      console.log('✅ Utilisateurs chargés:', userData.length);
      
    } catch (err: any) {
      console.error('❌ Erreur fetchUsers:', err);
      const errorMessage = err.message || 'Erreur lors du chargement des utilisateurs';
      setErrorState(errorMessage);
      showLoadingErrorToast(errorMessage);
    } finally {
      setLoadingState(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    try {
      setLoadingState(true);
      console.log('🚀 Création utilisateur:', userData.nom, userData.email);
      
      await UserService.createUser(userData);
      
      // Actualiser la liste
      await fetchUsers();

      showUserCreatedToast(userData.nom, userData.email);
      return true;
      
    } catch (err: any) {
      console.error('❌ Erreur création:', err);
      showCreateErrorToast(err.message);
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<any>) => {
    try {
      setLoadingState(true);
      
      await UserService.updateUser(userId, updates);
      await fetchUsers();

      showUserUpdatedToast();
      return true;
    } catch (err: any) {
      console.error('❌ Erreur mise à jour:', err);
      showUpdateErrorToast();
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoadingState(true);
      
      await UserService.deleteUser(userId);
      await fetchUsers();

      showUserDeletedToast();
      return true;
    } catch (err: any) {
      console.error('❌ Erreur suppression:', err);
      showDeleteErrorToast();
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      setLoadingState(true);
      
      await UserService.resetPassword(userId, newPassword);

      showPasswordResetToast();
      return true;
    } catch (err: any) {
      console.error('❌ Erreur réinitialisation:', err);
      showPasswordResetErrorToast();
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
  };
};
