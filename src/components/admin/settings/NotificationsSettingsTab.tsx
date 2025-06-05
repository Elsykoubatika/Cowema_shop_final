
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface NotificationsSettingsTabProps {
  handleSaveSettings: () => void;
}

const NotificationsSettingsTab: React.FC<NotificationsSettingsTabProps> = ({
  handleSaveSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des notifications</CardTitle>
        <CardDescription>
          Paramétrez les notifications envoyées aux clients et administrateurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications client</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="notify-order" defaultChecked />
              <Label htmlFor="notify-order" className="cursor-pointer">
                Confirmation de commande
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notify-shipping" defaultChecked />
              <Label htmlFor="notify-shipping" className="cursor-pointer">
                Expédition de commande
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notify-delivery" defaultChecked />
              <Label htmlFor="notify-delivery" className="cursor-pointer">
                Livraison effectuée
              </Label>
            </div>
          </div>
          
          <h3 className="text-lg font-medium">Notifications admin</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="admin-order" defaultChecked />
              <Label htmlFor="admin-order" className="cursor-pointer">
                Nouvelle commande
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="admin-review" defaultChecked />
              <Label htmlFor="admin-review" className="cursor-pointer">
                Nouvel avis client
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="admin-application" defaultChecked />
              <Label htmlFor="admin-application" className="cursor-pointer">
                Nouvelle demande d'influenceur
              </Label>
            </div>
          </div>
        </div>
        <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettingsTab;
