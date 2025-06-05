
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageComposer } from './MessageComposer';
import { SegmentManager } from './SegmentManager';
import { MessageHistory } from './MessageHistory';
import { MessageStats } from './MessageStats';
import { WhatsAppConfigList } from './WhatsAppConfigList';
import { Mail, MessageSquare, Users, BarChart, Smartphone } from 'lucide-react';
import { useRolePermissions } from '@/hooks/useRolePermissions';

export const MessagingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compose');
  const permissions = useRolePermissions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centre de messagerie</h2>
          <p className="text-muted-foreground">
            Envoyez des messages personnalisés à vos clients via email ou WhatsApp
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Mail size={16} />
            Composer
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users size={16} />
            Segments
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Historique
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart size={16} />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="whatsapp-config" className="flex items-center gap-2">
            <Smartphone size={16} />
            Config WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau message</CardTitle>
              <CardDescription>
                Créez et envoyez des messages personnalisés à vos clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessageComposer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des segments</CardTitle>
              <CardDescription>
                Organisez vos clients en segments pour un ciblage précis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SegmentManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des messages</CardTitle>
              <CardDescription>
                Consultez tous les messages envoyés et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessageHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'envoi</CardTitle>
              <CardDescription>
                Analysez les performances de vos campagnes de messagerie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessageStats />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp-config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration WhatsApp Business</CardTitle>
              <CardDescription>
                Configurez les comptes WhatsApp Business pour chaque utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WhatsAppConfigList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
