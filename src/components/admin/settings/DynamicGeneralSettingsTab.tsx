
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Loader2, Save } from 'lucide-react';

const DynamicGeneralSettingsTab: React.FC = () => {
  const { settings, loading, updateSetting, getSetting } = useSystemSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const getSettingValue = (key: string) => {
    return localSettings[key] !== undefined ? localSettings[key] : getSetting(key);
  };

  const handleSave = async () => {
    setSaving(true);
    const promises = Object.entries(localSettings).map(([key, value]) => 
      updateSetting(key, value)
    );
    
    await Promise.all(promises);
    setLocalSettings({});
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nom du site</Label>
              <Input 
                id="site-name" 
                value={getSettingValue('site_name') || ''}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email de contact</Label>
              <Input 
                id="contact-email" 
                type="email" 
                value={getSettingValue('contact_email') || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Téléphone de contact</Label>
              <Input 
                id="contact-phone" 
                value={getSettingValue('contact_phone') || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-currency">Devise par défaut</Label>
              <Input 
                id="default-currency" 
                value={getSettingValue('default_currency') || ''}
                onChange={(e) => handleInputChange('default_currency', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Description du site</Label>
            <Textarea 
              id="site-description"
              value={getSettingValue('site_description') || ''}
              onChange={(e) => handleInputChange('site_description', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de commande */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min-order">Montant minimum de commande (FCFA)</Label>
              <Input 
                id="min-order" 
                type="number"
                value={getSettingValue('min_order_amount') || ''}
                onChange={(e) => handleInputChange('min_order_amount', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loyalty-rate">Taux de points de fidélité</Label>
              <Input 
                id="loyalty-rate" 
                type="number"
                step="0.001"
                value={getSettingValue('loyalty_points_rate') || ''}
                onChange={(e) => handleInputChange('loyalty_points_rate', parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Points accordés par FCFA dépensé
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Mode maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activer le mode maintenance</p>
              <p className="text-sm text-muted-foreground">
                Lorsque activé, les visiteurs verront une page de maintenance
              </p>
            </div>
            <Switch
              checked={getSettingValue('maintenance_mode') === true}
              onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications email</p>
              <p className="text-sm text-muted-foreground">
                Envoyer des notifications par email
              </p>
            </div>
            <Switch
              checked={getSettingValue('email_notifications') === true}
              onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                Envoyer des notifications par WhatsApp
              </p>
            </div>
            <Switch
              checked={getSettingValue('whatsapp_notifications') === true}
              onCheckedChange={(checked) => handleInputChange('whatsapp_notifications', checked)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSave}
            disabled={saving || Object.keys(localSettings).length === 0}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DynamicGeneralSettingsTab;
