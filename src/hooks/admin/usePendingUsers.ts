
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

export interface PendingUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
}

export const usePendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les utilisateurs non confirmés via l'API admin
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      // Filtrer les utilisateurs non confirmés avec le type User correct
      const unconfirmedUsers = data.users
        .filter((user: User) => !user.email_confirmed_at)
        .map((user: User) => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at
        }));

      setPendingUsers(unconfirmedUsers);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs en attente",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (email: string): Promise<boolean> => {
    try {
      // Envoyer un email de rappel via edge function
      const { error } = await supabase.functions.invoke('send-reminder-email', {
        body: { email }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Rappel envoyé",
        description: "L'email de rappel a été envoyé avec succès.",
      });

      return true;
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le rappel",
      });
      return false;
    }
  };

  const confirmUser = async (userId: string): Promise<boolean> => {
    try {
      // Confirmer l'utilisateur manuellement
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true
      });

      if (error) {
        throw error;
      }

      // Refetch pour mettre à jour la liste
      await fetchPendingUsers();

      toast({
        title: "Utilisateur confirmé",
        description: "L'utilisateur peut maintenant se connecter.",
      });

      return true;
    } catch (error: any) {
      console.error('Error confirming user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de confirmer l'utilisateur",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return {
    pendingUsers,
    loading,
    fetchPendingUsers,
    sendReminder,
    confirmUser
  };
};
