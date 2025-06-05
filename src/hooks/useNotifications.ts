
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationData {
  type: 'order_confirmation' | 'stock_alert' | 'promotion' | 'delivery_update';
  title: string;
  message: string;
  userId?: string;
  phone?: string;
  email?: string;
  orderId?: string;
  productId?: string;
}

export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Send push notification (browser notification for now)
  const sendPushNotification = useCallback(async (data: NotificationData) => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/favicon.ico',
            tag: data.type
          });
        }
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }, []);

  // Send SMS notification via edge function
  const sendSMSNotification = useCallback(async (data: NotificationData) => {
    if (!data.phone) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke('send-sms', {
        body: {
          phone: data.phone,
          message: `${data.title}\n${data.message}`,
          type: data.type
        }
      });

      if (error) throw error;
      toast.success('SMS envoyé avec succès');
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error('Erreur lors de l\'envoi du SMS');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send email notification via edge function
  const sendEmailNotification = useCallback(async (data: NotificationData) => {
    if (!data.email) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: data.email,
          subject: data.title,
          message: data.message,
          type: data.type,
          orderId: data.orderId,
          productId: data.productId
        }
      });

      if (error) throw error;
      toast.success('Email envoyé avec succès');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send order confirmation notifications
  const sendOrderConfirmation = useCallback(async (orderData: {
    orderId: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
    total: number;
  }) => {
    const notificationData: NotificationData = {
      type: 'order_confirmation',
      title: 'Commande confirmée',
      message: `Bonjour ${orderData.customerName}, votre commande #${orderData.orderId} d'un montant de ${orderData.total} FCFA a été confirmée.`,
      email: orderData.customerEmail,
      phone: orderData.customerPhone,
      orderId: orderData.orderId
    };

    // Send both email and SMS
    await Promise.all([
      sendEmailNotification(notificationData),
      sendSMSNotification(notificationData),
      sendPushNotification(notificationData)
    ]);
  }, [sendEmailNotification, sendSMSNotification, sendPushNotification]);

  // Send stock alert
  const sendStockAlert = useCallback(async (productData: {
    productId: string;
    productName: string;
    currentStock: number;
    threshold: number;
  }) => {
    const notificationData: NotificationData = {
      type: 'stock_alert',
      title: 'Alerte de stock',
      message: `Le produit "${productData.productName}" est en rupture de stock (${productData.currentStock} restants).`,
      productId: productData.productId
    };

    await sendPushNotification(notificationData);
  }, [sendPushNotification]);

  return {
    isLoading,
    sendPushNotification,
    sendSMSNotification,
    sendEmailNotification,
    sendOrderConfirmation,
    sendStockAlert
  };
};
