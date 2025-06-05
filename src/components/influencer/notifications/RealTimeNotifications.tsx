
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { useInfluencerMessaging } from '@/hooks/useInfluencerMessaging';

const RealTimeNotifications: React.FC = () => {
  const {
    notifications,
    isLoading,
    markNotificationAsRead
  } = useInfluencerMessaging();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return '💰';
      case 'payment':
        return '💳';
      case 'order':
        return '📦';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'commission':
        return 'bg-green-100 border-green-200';
      case 'payment':
        return 'bg-blue-100 border-blue-200';
      case 'order':
        return 'bg-purple-100 border-purple-200';
      case 'system':
        return 'bg-orange-100 border-orange-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure(s)`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Chargement des notifications...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé des notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Non lues</p>
                <p className="text-2xl font-bold text-red-600">{unreadNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Eye className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Lues</p>
                <p className="text-2xl font-bold text-gray-600">{readNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications non lues */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Notifications non lues ({unreadNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} relative`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="h-6 px-2"
                      >
                        <EyeOff className="h-3 w-3 mr-1" />
                        Marquer comme lu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notifications lues */}
      {readNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-600" />
              Notifications lues ({readNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {readNotifications.slice(0, 10).map(notification => (
              <div
                key={notification.id}
                className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 opacity-75"
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg opacity-60">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-700">{notification.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <span className="text-xs text-gray-400">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {readNotifications.length > 10 && (
              <p className="text-sm text-center text-gray-500 pt-2">
                ... et {readNotifications.length - 10} autres notifications
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* État vide */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Bell className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <h3 className="font-medium">Aucune notification</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vous serez notifié ici de vos nouvelles commissions, paiements et mises à jour importantes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeNotifications;
