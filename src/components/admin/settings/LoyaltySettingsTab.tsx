
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Loader2, Save, Crown, Star, Award, Gem, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LoyaltySettingsTab: React.FC = () => {
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

  const loyaltyLevels = [
    {
      name: 'Bronze',
      icon: Award,
      color: 'bg-amber-100 text-amber-800',
      pointsKey: 'loyalty_bronze_min_points',
      discountKey: 'loyalty_bronze_discount'
    },
    {
      name: 'Argent',
      icon: Shield,
      color: 'bg-gray-100 text-gray-800',
      pointsKey: 'loyalty_silver_min_points',
      discountKey: 'loyalty_silver_discount'
    },
    {
      name: 'Or',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-800',
      pointsKey: 'loyalty_gold_min_points',
      discountKey: 'loyalty_gold_discount'
    },
    {
      name: 'Platine',
      icon: Crown,
      color: 'bg-blue-100 text-blue-800',
      pointsKey: 'loyalty_platinum_min_points',
      discountKey: 'loyalty_platinum_discount'
    },
    {
      name: 'Diamant',
      icon: Gem,
      color: 'bg-purple-100 text-purple-800',
      pointsKey: 'loyalty_diamond_min_points',
      discountKey: 'loyalty_diamond_discount'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Configuration générale du système de fidélité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="points-per-fcfa">Montant en FCFA pour gagner 1 point</Label>
              <Input 
                id="points-per-fcfa" 
                type="number"
                value={getSettingValue('loyalty_points_per_fcfa') || '1000'}
                onChange={(e) => handleInputChange('loyalty_points_per_fcfa', e.target.value)}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground">
                Par exemple : 1000 FCFA = 1 point de fidélité
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration des niveaux */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration des niveaux de fidélité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyLevels.map((level, index) => {
              const IconComponent = level.icon;
              return (
                <div 
                  key={level.name}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-5 w-5" />
                    <Badge className={level.color}>
                      {level.name}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`${level.pointsKey}`}>
                        Points minimum
                      </Label>
                      <Input 
                        id={level.pointsKey}
                        type="number"
                        value={getSettingValue(level.pointsKey) || '0'}
                        onChange={(e) => handleInputChange(level.pointsKey, e.target.value)}
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={level.discountKey}>
                        Pourcentage de remise (%)
                      </Label>
                      <Input 
                        id={level.discountKey}
                        type="number"
                        value={getSettingValue(level.discountKey) || '0'}
                        onChange={(e) => handleInputChange(level.discountKey, e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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
                Enregistrer la configuration
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Aperçu du système */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu du système de fidélité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loyaltyLevels.map((level) => {
              const points = getSettingValue(level.pointsKey) || '0';
              const discount = getSettingValue(level.discountKey) || '0';
              return (
                <div key={level.name} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{level.name}</span>
                  <div className="text-sm text-gray-600">
                    {points}+ points → {discount}% de remise
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Règle de gain :</strong> 1 point pour chaque {getSettingValue('loyalty_points_per_fcfa') || '1000'} FCFA dépensés
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltySettingsTab;
