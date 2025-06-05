
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './useAuthStore';
import { toast } from 'sonner';

interface NotificationData {
  id: string;
  type: 'order' | 'review' | 'system' | 'customer';
  title: string;
  message: string;
  data?: any;
  created_at: string;
  read: boolean;
}

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || !['admin', 'sales_manager', 'team_lead', 'seller'].includes(user.role || '')) return;

    // Canal pour les notifications en temps réel
    const notificationsChannel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_orders'
        },
        (payload) => {
          const order = payload.new as any;
          
          // Créer une notification pour nouvelle commande
          const notification: NotificationData = {
            id: `order-${order.id}`,
            type: 'order',
            title: 'Nouvelle commande',
            message: `Commande #${order.id.slice(0, 8)} reçue - ${order.total_amount.toLocaleString()} FCFA`,
            data: order,
            created_at: new Date().toISOString(),
            read: false
          };

          setNotifications(prev => [notification, ...prev].slice(0, 50)); // Limiter à 50 notifications
          setUnreadCount(prev => prev + 1);
          
          // Toast notification
          toast.success(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_orders'
        },
        (payload) => {
          const order = payload.new as any;
          const oldOrder = payload.old as any;
          
          if (oldOrder.status !== order.status) {
            const notification: NotificationData = {
              id: `order-update-${order.id}-${Date.now()}`,
              type: 'order',
              title: 'Commande mise à jour',
              message: `Commande #${order.id.slice(0, 8)} - Statut: ${getStatusText(order.status)}`,
              data: order,
              created_at: new Date().toISOString(),
              read: false
            };

            setNotifications(prev => [notification, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};
