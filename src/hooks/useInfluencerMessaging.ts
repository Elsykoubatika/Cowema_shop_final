
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';

interface NotificationData {
  id: string;
  type: 'commission' | 'payment' | 'order' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ConversationData {
  id: string;
  title: string;
  last_message: string;
  unread_count: number;
  updated_at: string;
}

interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_important: boolean;
}

export const useInfluencerMessaging = () => {
  const { user } = useUnifiedAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Compter les notifications non lues
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;
  
  // Compter les conversations avec messages non lus
  const unreadConversationsCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedNotifications: NotificationData[] = (data || []).map(notification => ({
        id: notification.id,
        type: notification.type as NotificationData['type'],
        title: notification.title,
        message: notification.message,
        is_read: notification.is_read,
        created_at: notification.created_at
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  // Fonction pour créer des conversations simulées basées sur les commissions
  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Simuler des conversations basées sur les commissions récentes
      const { data: commissions, error } = await supabase
        .from('influencer_commissions')
        .select('*')
        .eq('influencer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const simulatedConversations: ConversationData[] = (commissions || []).map((commission, index) => ({
        id: `conv-${commission.id}`,
        title: `Commande #${commission.order_id.slice(0, 8)}`,
        last_message: commission.status === 'paid' 
          ? 'Votre commission a été versée !' 
          : 'Commission en attente de paiement',
        unread_count: commission.status === 'pending' ? 1 : 0,
        updated_at: commission.created_at
      }));

      setConversations(simulatedConversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };

  // Fonction pour récupérer les actualités (notifications globales)
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .eq('is_global', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedAnnouncements: AnnouncementData[] = (data || []).map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.message,
        created_at: announcement.created_at,
        is_important: announcement.type === 'important'
      }));

      setAnnouncements(formattedAnnouncements);
    } catch (error) {
      console.error('Erreur lors du chargement des actualités:', error);
    }
  };

  // Fonction pour marquer une notification comme lue
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('system_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
  };

  // Fonction pour créer des notifications de test pour les influenceurs
  const createTestNotifications = async () => {
    if (!user) return;

    const testNotifications = [
      {
        user_id: user.id,
        type: 'commission',
        title: 'Nouvelle commission',
        message: 'Vous avez reçu une commission de 2 500 FCFA !',
        is_read: false
      },
      {
        user_id: user.id,
        type: 'payment',
        title: 'Paiement disponible',
        message: 'Votre solde dépasse 10 000 FCFA. Vous pouvez demander un paiement.',
        is_read: false
      }
    ];

    try {
      const { error } = await supabase
        .from('system_notifications')
        .insert(testNotifications);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la création des notifications test:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      // Créer des notifications de test si aucune n'existe
      const { data: existingNotifications } = await supabase
        .from('system_notifications')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!existingNotifications || existingNotifications.length === 0) {
        await createTestNotifications();
      }

      await Promise.all([
        fetchNotifications(),
        fetchConversations(),
        fetchAnnouncements()
      ]);
      
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user) return;

    const notificationsChannel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          const formattedNotification: NotificationData = {
            id: newNotification.id,
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            is_read: newNotification.is_read,
            created_at: newNotification.created_at
          };
          
          setNotifications(prev => [formattedNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]);

  return {
    notifications,
    conversations,
    announcements,
    unreadNotificationsCount,
    unreadConversationsCount,
    isLoading,
    markNotificationAsRead,
    refetch: () => {
      fetchNotifications();
      fetchConversations();
      fetchAnnouncements();
    }
  };
};
