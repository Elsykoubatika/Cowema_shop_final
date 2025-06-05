
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhatsAppAccountManager } from './WhatsAppAccountManager';
import { ResponseIoIntegration } from './ResponseIoIntegration';
import { WhatsAppConfigList } from './WhatsAppConfigList';

export const MultiVendorMessaging: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Système Multi-Vendeurs WhatsApp</h1>
        <p className="text-muted-foreground">
          Configurez et gérez les comptes WhatsApp Business pour tous vos vendeurs
        </p>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Comptes WhatsApp</TabsTrigger>
          <TabsTrigger value="response">Intégration response.io</TabsTrigger>
          <TabsTrigger value="config">Configuration avancée</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <WhatsAppAccountManager />
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          <ResponseIoIntegration />
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <WhatsAppConfigList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
