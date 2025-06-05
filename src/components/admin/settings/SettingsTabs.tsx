
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import GeneralSettingsTab from './GeneralSettingsTab';
import PaymentSettingsTab from './PaymentSettingsTab';
import ShippingSettingsTab from './ShippingSettingsTab';
import NotificationsSettingsTab from './NotificationsSettingsTab';
import DeliveryFeesTab from './DeliveryFeesTab';

interface SettingsTabsProps {
  maintenanceMode: boolean;
  handleToggleMaintenance: () => void;
  handleSaveSettings: () => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  maintenanceMode,
  handleToggleMaintenance,
  handleSaveSettings
}) => {
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="payment">Paiement</TabsTrigger>
        <TabsTrigger value="shipping">Livraison</TabsTrigger>
        <TabsTrigger value="deliveryFees">Frais de livraison</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettingsTab 
          maintenanceMode={maintenanceMode}
          handleToggleMaintenance={handleToggleMaintenance}
          handleSaveSettings={handleSaveSettings}
        />
      </TabsContent>

      <TabsContent value="payment">
        <PaymentSettingsTab 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      <TabsContent value="shipping">
        <ShippingSettingsTab 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      <TabsContent value="deliveryFees">
        <DeliveryFeesTab 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsSettingsTab 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
