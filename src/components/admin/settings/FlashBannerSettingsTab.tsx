
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useFlashBannerSettings } from '@/hooks/useFlashBannerSettings';
import { Loader2, Save, Eye, ShoppingCart } from 'lucide-react';

const FlashBannerSettingsTab: React.FC = () => {
  const { updateSetting } = useSystemSettings();
  const { settings, loading } = useFlashBannerSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const getSettingValue = (key: string, fallback: any) => {
    if (localSettings[key] !== undefined) return localSettings[key];
    if (!settings) return fallback;
    
    switch (key) {
      case 'enabled': return settings.enabled;
      case 'messageGeneral': return settings.messageGeneral;
      case 'messageBzpn': return settings.messageBzpn;
      case 'codeGeneral': return settings.codeGeneral;
      case 'codeBzpn': return settings.codeBzpn;
      case 'discountGeneral': return settings.discountGeneral;
      case 'discountBzpn': return settings.discountBzpn;
      case 'colorFrom': return settings.colors.from;
      case 'colorTo': return settings.colors.to;
      case 'expiryHour': return settings.expiryHour;
      case 'targetCities': return settings.targetCities.join(', ');
      case 'cartAbandonDiscount': return settings.cartAbandonDiscount || 10;
      default: return fallback;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const updates = [];
      
      if (localSettings.enabled !== undefined) {
        updates.push(updateSetting('flash_banner_enabled', localSettings.enabled));
      }
      if (localSettings.messageGeneral !== undefined) {
        updates.push(updateSetting('flash_banner_message_general', localSettings.messageGeneral));
      }
      if (localSettings.messageBzpn !== undefined) {
        updates.push(updateSetting('flash_banner_message_bzpn', localSettings.messageBzpn));
      }
      if (localSettings.codeGeneral !== undefined) {
        updates.push(updateSetting('flash_banner_code_general', localSettings.codeGeneral));
      }
      if (localSettings.codeBzpn !== undefined) {
        updates.push(updateSetting('flash_banner_code_bzpn', localSettings.codeBzpn));
      }
      if (localSettings.discountGeneral !== undefined) {
        updates.push(updateSetting('flash_banner_discount_general', Number(localSettings.discountGeneral)));
      }
      if (localSettings.discountBzpn !== undefined) {
        updates.push(updateSetting('flash_banner_discount_bzpn', Number(localSettings.discountBzpn)));
      }
      if (localSettings.colorFrom !== undefined || localSettings.colorTo !== undefined) {
        const colors = {
          from: localSettings.colorFrom || settings?.colors.from || '#f97316',
          to: localSettings.colorTo || settings?.colors.to || '#dc2626'
        };
        updates.push(updateSetting('flash_banner_colors', colors));
      }
      if (localSettings.expiryHour !== undefined) {
        updates.push(updateSetting('flash_banner_expiry_hour', Number(localSettings.expiryHour)));
      }
      if (localSettings.targetCities !== undefined) {
        const cities = localSettings.targetCities.split(',').map((city: string) => city.trim()).filter(Boolean);
        updates.push(updateSetting('flash_banner_target_cities', cities));
      }
      if (localSettings.cartAbandonDiscount !== undefined) {
        updates.push(updateSetting('cart_abandon_discount', Number(localSettings.cartAbandonDiscount)));
      }

      await Promise.all(updates);
      setLocalSettings({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
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
      {/* Activation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Activation de la bannière
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activer la bannière flash</p>
              <p className="text-sm text-muted-foreground">
                Afficher la bannière sur toutes les pages du site
              </p>
            </div>
            <Switch
              checked={getSettingValue('enabled', true)}
              onCheckedChange={(checked) => handleInputChange('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages de la bannière</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-general">Message pour toutes les villes</Label>
            <Input 
              id="message-general"
              value={getSettingValue('messageGeneral', 'MEGA FLASH SALE')}
              onChange={(e) => handleInputChange('messageGeneral', e.target.value)}
              placeholder="MEGA FLASH SALE"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-bzpn">Message pour Brazzaville/Pointe-Noire</Label>
            <Input 
              id="message-bzpn"
              value={getSettingValue('messageBzpn', 'LIVRAISON GRATUITE à BZ et PN')}
              onChange={(e) => handleInputChange('messageBzpn', e.target.value)}
              placeholder="LIVRAISON GRATUITE à BZ et PN"
            />
          </div>
        </CardContent>
      </Card>

      {/* Codes promo */}
      <Card>
        <CardHeader>
          <CardTitle>Codes promotionnels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code-general">Code général</Label>
              <Input 
                id="code-general"
                value={getSettingValue('codeGeneral', 'FLASH10')}
                onChange={(e) => handleInputChange('codeGeneral', e.target.value.toUpperCase())}
                placeholder="FLASH10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount-general">Réduction générale (%)</Label>
              <Input 
                id="discount-general"
                type="number"
                min="0"
                max="100"
                value={getSettingValue('discountGeneral', 15)}
                onChange={(e) => handleInputChange('discountGeneral', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code-bzpn">Code BZ/PN</Label>
              <Input 
                id="code-bzpn"
                value={getSettingValue('codeBzpn', 'BZPN10')}
                onChange={(e) => handleInputChange('codeBzpn', e.target.value.toUpperCase())}
                placeholder="BZPN10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount-bzpn">Réduction BZ/PN (%)</Label>
              <Input 
                id="discount-bzpn"
                type="number"
                min="0"
                max="100"
                value={getSettingValue('discountBzpn', 10)}
                onChange={(e) => handleInputChange('discountBzpn', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cart Abandon Popup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Popup d'abandon de panier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="cart-abandon-discount">Réduction abandon de panier (%)</Label>
            <Input 
              id="cart-abandon-discount"
              type="number"
              min="0"
              max="100"
              value={getSettingValue('cartAbandonDiscount', 10)}
              onChange={(e) => handleInputChange('cartAbandonDiscount', e.target.value)}
              placeholder="10"
            />
            <p className="text-xs text-muted-foreground">
              Pourcentage de réduction affiché dans le popup d'abandon de panier
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color-from">Couleur de début</Label>
              <Input 
                id="color-from"
                type="color"
                value={getSettingValue('colorFrom', '#f97316')}
                onChange={(e) => handleInputChange('colorFrom', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color-to">Couleur de fin</Label>
              <Input 
                id="color-to"
                type="color"
                value={getSettingValue('colorTo', '#dc2626')}
                onChange={(e) => handleInputChange('colorTo', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry-hour">Heure d'expiration (0-23)</Label>
            <Input 
              id="expiry-hour"
              type="number"
              min="0"
              max="23"
              value={getSettingValue('expiryHour', 23)}
              onChange={(e) => handleInputChange('expiryHour', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              La bannière disparaîtra à cette heure chaque jour
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Villes ciblées */}
      <Card>
        <CardHeader>
          <CardTitle>Villes ciblées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="target-cities">Villes pour offres spéciales</Label>
            <Textarea 
              id="target-cities"
              value={getSettingValue('targetCities', 'brazzaville, pointe-noire, pn')}
              onChange={(e) => handleInputChange('targetCities', e.target.value)}
              placeholder="brazzaville, pointe-noire, pn"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Séparez les villes par des virgules. Ces villes afficheront le message et code spéciaux.
            </p>
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

export default FlashBannerSettingsTab;
