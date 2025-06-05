
import React, { useEffect, useState } from 'react';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommissionNotification {
  id: string;
  type: 'new_commission' | 'payment_available' | 'payment_sent';
  title: string;
  message: string;
  amount?: number;
  orderId?: string;
  read: boolean;
  createdAt: string;
}

const CommissionNotifications: React.FC = () => {
  const { currentUserInfluencer } = useInfluencerStore();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<CommissionNotification[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<string>(
    localStorage.getItem('influencer_last_check') || new Date().toISOString()
  );

  // Simuler des notifications basées sur les nouvelles commissions
  useEffect(() => {
    if (!currentUserInfluencer) return;

    const checkNewCommissions = () => {
      const newCommissions = currentUserInfluencer.commissions.filter(
        commission => new Date(commission.date) > new Date(lastCheckTime)
      );

      newCommissions.forEach(commission => {
        const notification: CommissionNotification = {
          id: `comm-${commission.id}`,
          type: 'new_commission',
          title: 'Nouvelle commission !',
          message: `Vous avez gagné ${commission.amount.toFixed(0)} FCFA sur une commande`,
          amount: commission.amount,
          orderId: commission.orderId,
          read: false,
          createdAt: commission.date
        };

        setNotifications(prev => {
          if (!prev.find(n => n.id === notification.id)) {
            toast({
              title: notification.title,
              description: notification.message,
              duration: 5000,
            });
            return [notification, ...prev];
          }
          return prev;
        });
      });

      // Vérifier si le montant disponible dépasse le seuil
      const availableAmount = currentUserInfluencer.totalEarned - (currentUserInfluencer.totalPaid || 0);
      if (availableAmount >= 10000) {
        const paymentNotification: CommissionNotification = {
          id: 'payment-available',
          type: 'payment_available',
          title: 'Retrait disponible',
          message: `Vous pouvez maintenant retirer ${availableAmount.toFixed(0)} FCFA`,
          amount: availableAmount,
          read: false,
          createdAt: new Date().toISOString()
        };

        setNotifications(prev => {
          if (!prev.find(n => n.id === paymentNotification.id)) {
            return [paymentNotification, ...prev];
          }
          return prev;
        });
      }
    };

    checkNewCommissions();
    const interval = setInterval(checkNewCommissions, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [currentUserInfluencer, lastCheckTime, toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setLastCheckTime(new Date().toISOString());
    localStorage.setItem('influencer_last_check', new Date().toISOString());
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_commission':
        return '💰';
      case 'payment_available':
        return '💳';
      case 'payment_sent':
        return '✅';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_commission':
        return 'bg-green-100 border-green-200';
      case 'payment_available':
        return 'bg-blue-100 border-blue-200';
      case 'payment_sent':
        return 'bg-purple-100 border-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Marquer tout comme lu
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Restez informé de vos nouvelles commissions et paiements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 10).map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'shadow-sm' : 'opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionNotifications;
