
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import LanguageSelector from './LanguageSelector';

interface GeneralSettingsTabProps {
  maintenanceMode: boolean;
  handleToggleMaintenance: () => void;
  handleSaveSettings: () => void;
}

/**
 * Onglet de paramètres généraux pour l'admin
 * Gère les configurations générales de l'application
 */
const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  maintenanceMode,
  handleToggleMaintenance,
  handleSaveSettings
}) => {
  const [language, setLanguage] = useState('fr');
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Dans une implémentation réelle, nous sauvegarderions cette préférence
  };

  return (
    <div className="space-y-6">
      {/* Paramètres du site */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nom du site</Label>
              <Input id="site-name" defaultValue="Cowema" />
              <p className="text-xs text-muted-foreground">
                Le nom qui apparaît dans l'en-tête et le pied de page
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email de contact</Label>
              <Input id="contact-email" type="email" defaultValue="contact@cowema.com" />
              <p className="text-xs text-muted-foreground">
                Utilisé pour les notifications et formulaires de contact
              </p>
            </div>
          </div>

          {/* Sélecteur de langue */}
          <LanguageSelector 
            selectedLanguage={language}
            onChange={handleLanguageChange}
          />
        </CardContent>
      </Card>

      {/* Mode maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Mode maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activer le mode maintenance</p>
              <p className="text-sm text-muted-foreground">
                Lorsque activé, les visiteurs verront une page de maintenance au lieu du site
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleToggleMaintenance}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings}>Enregistrer les paramètres</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeneralSettingsTab;
