
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
import { Textarea } from "@/components/ui/textarea";

interface PaymentSettingsTabProps {
  handleSaveSettings: () => void;
}

const PaymentSettingsTab: React.FC<PaymentSettingsTabProps> = ({
  handleSaveSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des paiements</CardTitle>
        <CardDescription>
          Gérez vos méthodes de paiement et paramètres associés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Méthodes de paiement actives</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="payment-cash" defaultChecked />
                <Label htmlFor="payment-cash" className="cursor-pointer">
                  Paiement à la livraison
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="payment-mobile" defaultChecked />
                <Label htmlFor="payment-mobile" className="cursor-pointer">
                  Mobile Money
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="payment-bank" />
                <Label htmlFor="payment-bank" className="cursor-pointer">
                  Virement bancaire
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Instructions pour le paiement à la livraison</Label>
            <Textarea
              defaultValue="Le paiement se fait en espèces au moment de la livraison. Veuillez préparer le montant exact si possible."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Instructions pour Mobile Money</Label>
            <Textarea
              defaultValue="Envoyez le montant au numéro +229 987654321 et indiquez votre numéro de commande en référence."
            />
          </div>
        </div>
        <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsTab;
