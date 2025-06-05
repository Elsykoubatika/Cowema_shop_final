
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bell, Megaphone, Loader2 } from 'lucide-react';
import RealTimeNotifications from './notifications/RealTimeNotifications';
import RealTimeDirectMessaging from './messaging/RealTimeDirectMessaging';
import RealTimeAnnouncements from './news/RealTimeAnnouncements';
import { useInfluencerMessaging } from '@/hooks/useInfluencerMessaging';

const RealTimeCommunicationHub: React.FC = () => {
  const { 
    unreadNotificationsCount, 
    unreadConversationsCount,
    isLoading 
  } = useInfluencerMessaging();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Centre de Communication
          </CardTitle>
          <CardDescription>
            Notifications, messages et actualités en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Chargement des données...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Centre de Communication
        </CardTitle>
        <CardDescription>
          Notifications, messages et actualités en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadNotificationsCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-auto">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {unreadConversationsCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-auto">
                  {unreadConversationsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Actualités
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="mt-6">
            <RealTimeNotifications />
          </TabsContent>
          
          <TabsContent value="messages" className="mt-6">
            <RealTimeDirectMessaging />
          </TabsContent>
          
          <TabsContent value="news" className="mt-6">
            <RealTimeAnnouncements />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeCommunicationHub;
