
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ShippingSettingsTabProps {
  handleSaveSettings: () => void;
}

const ShippingSettingsTab: React.FC<ShippingSettingsTabProps> = ({
  handleSaveSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des livraisons</CardTitle>
        <CardDescription>
          Définissez vos méthodes de livraison et les zones desservies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Délai de livraison estimé</Label>
            <Input defaultValue="24-48h" />
            <p className="text-sm text-muted-foreground">
              Délai moyen affiché aux clients lors de la commande
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Frais de livraison standard</Label>
            <div className="flex items-center">
              <Input 
                type="number" 
                defaultValue="1000" 
                className="max-w-[180px]"
              />
              <span className="ml-2">FCFA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Frais de livraison par défaut
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Montant minimum pour la livraison gratuite</Label>
            <div className="flex items-center">
              <Input 
                type="number" 
                defaultValue="15000" 
                className="max-w-[180px]"
              />
              <span className="ml-2">FCFA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Montant à partir duquel la livraison est offerte
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Zones de livraison</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="zone-cotonou" defaultChecked />
                <Label htmlFor="zone-cotonou" className="cursor-pointer">
                  Cotonou
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="zone-porto" defaultChecked />
                <Label htmlFor="zone-porto" className="cursor-pointer">
                  Porto-Novo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="zone-others" />
                <Label htmlFor="zone-others" className="cursor-pointer">
                  Autres régions
                </Label>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
      </CardContent>
    </Card>
  );
};

export default ShippingSettingsTab;
