
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Settings, Truck, Bell, Store, Megaphone, Star } from 'lucide-react';
import DynamicGeneralSettingsTab from '@/components/admin/settings/DynamicGeneralSettingsTab';
import DeliveryFeesManager from '@/components/admin/settings/DeliveryFeesManager';
import FlashBannerSettingsTab from '@/components/admin/settings/FlashBannerSettingsTab';
import LoyaltySettingsTab from '@/components/admin/settings/LoyaltySettingsTab';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Configurez les paramètres globaux de votre boutique
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Livraison
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Fidélité
          </TabsTrigger>
          <TabsTrigger value="flash-banner" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Bannière Flash
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avancé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <DynamicGeneralSettingsTab />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <DeliveryFeesManager />
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <LoyaltySettingsTab />
        </TabsContent>

        <TabsContent value="flash-banner" className="space-y-4">
          <FlashBannerSettingsTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez les notifications automatiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications de nouvelles commandes</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email pour chaque nouvelle commande
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer des notifications via WhatsApp
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rappels de commandes non traitées</Label>
                  <p className="text-sm text-muted-foreground">
                    Rappel quotidien des commandes en attente
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>
                Configuration technique et intégrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Clé API WhatsApp</Label>
                <Input id="apiKey" type="password" placeholder="Entrez votre clé API" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL Webhook</Label>
                <Input id="webhookUrl" placeholder="https://votre-webhook.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
