
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Bell, Megaphone } from 'lucide-react';
import CommissionNotifications from './notifications/CommissionNotifications';
import DirectMessaging from './messaging/DirectMessaging';
import NewsAnnouncements from './news/NewsAnnouncements';

const CommunicationHub: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Centre de Communication
        </CardTitle>
        <CardDescription>
          Notifications, messages et actualités en un seul endroit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Actualités
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="mt-6">
            <CommissionNotifications />
          </TabsContent>
          
          <TabsContent value="messages" className="mt-6">
            <DirectMessaging />
          </TabsContent>
          
          <TabsContent value="news" className="mt-6">
            <NewsAnnouncements />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunicationHub;
