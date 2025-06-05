
import { useEffect } from 'react';
import { setupReminderSystem } from '../utils/reminderSystem';
import { useOrderStore } from './useOrderStore';

// Custom hook pour initialiser le système de relance
export const useReminderSystem = () => {
  const { getAllOrders, markReminderSent } = useOrderStore();
  
  useEffect(() => {
    // Initialiser le système de relance avec les méthodes du store
    const cleanupReminders = setupReminderSystem(getAllOrders, markReminderSent);
    
    // Nettoyer à la destruction du composant
    return () => {
      cleanupReminders();
    };
  }, [getAllOrders, markReminderSent]);
};
