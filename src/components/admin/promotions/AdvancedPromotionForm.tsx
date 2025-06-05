
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, MapPin, Package, Users, Layers } from 'lucide-react';
import { UsageType, CustomerHistoryRequirement } from '@/hooks/usePromotionStore';

interface AdvancedPromotionFormProps {
  formData: any;
  onUpdateFormData: (updates: any) => void;
}

const AdvancedPromotionForm: React.FC<AdvancedPromotionFormProps> = ({
  formData,
  onUpdateFormData
}) => {
  const [newCity, setNewCity] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const congolaiseCities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso',
    'Madingou', 'Owando', 'Sibiti', 'Kinkala', 'Impfondo'
  ];

  const productCategories = [
    'Électronique', 'Vêtements', 'Maison & Jardin', 'Beauté & Santé',
    'Sports & Loisirs', 'Automobile', 'Livres & Médias', 'Alimentation',
    'Bijoux & Accessoires', 'Jouets & Enfants'
  ];

  const addCity = () => {
    if (newCity && !formData.targetCities?.includes(newCity)) {
      onUpdateFormData({
        targetCities: [...(formData.targetCities || []), newCity]
      });
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    onUpdateFormData({
      targetCities: formData.targetCities?.filter((c: string) => c !== city)
    });
  };

  const addCategory = () => {
    if (newCategory && !formData.targetCategories?.includes(newCategory)) {
      onUpdateFormData({
        targetCategories: [...(formData.targetCategories || []), newCategory]
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    onUpdateFormData({
      targetCategories: formData.targetCategories?.filter((c: string) => c !== category)
    });
  };

  const updateHistoryRequirement = (field: string, value: number | undefined) => {
    onUpdateFormData({
      customerHistoryRequirement: {
        ...formData.customerHistoryRequirement,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Limites d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Limites d'utilisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="usageType">Type d'utilisation</Label>
            <Select
              value={formData.usageType || 'unlimited'}
              onValueChange={(value: UsageType) => onUpdateFormData({ usageType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">Illimitée</SelectItem>
                <SelectItem value="limited">Limitée par utilisateur</SelectItem>
                <SelectItem value="single_use">Usage unique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.usageType === 'limited' && (
            <div>
              <Label htmlFor="maxUsesPerUser">Nombre max d'utilisations par utilisateur</Label>
              <Input
                id="maxUsesPerUser"
                type="number"
                min="1"
                value={formData.maxUsesPerUser || ''}
                onChange={(e) => onUpdateFormData({ 
                  maxUsesPerUser: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="Ex: 3"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ciblage géographique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ciblage géographique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newCity} onValueChange={setNewCity}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent>
                {congolaiseCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addCity} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.targetCities && formData.targetCities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.targetCities.map((city: string) => (
                <Badge key={city} variant="secondary" className="flex items-center gap-1">
                  {city}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeCity(city)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Laissez vide pour appliquer à toutes les villes
          </p>
        </CardContent>
      </Card>

      {/* Ciblage par catégories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ciblage par catégories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addCategory} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.targetCategories && formData.targetCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.targetCategories.map((category: string) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeCategory(category)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Laissez vide pour appliquer à toutes les catégories
          </p>
        </CardContent>
      </Card>

      {/* Exigences d'historique client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Exigences d'historique client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="minOrders">Nombre minimum de commandes</Label>
            <Input
              id="minOrders"
              type="number"
              min="0"
              value={formData.customerHistoryRequirement?.min_orders || ''}
              onChange={(e) => updateHistoryRequirement('min_orders', 
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              placeholder="Ex: 2"
            />
          </div>

          <div>
            <Label htmlFor="minSpent">Montant minimum dépensé (FCFA)</Label>
            <Input
              id="minSpent"
              type="number"
              min="0"
              value={formData.customerHistoryRequirement?.min_spent || ''}
              onChange={(e) => updateHistoryRequirement('min_spent',
                e.target.value ? parseFloat(e.target.value) : undefined
              )}
              placeholder="Ex: 50000"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Laissez vide pour appliquer à tous les clients
          </p>
        </CardContent>
      </Card>

      {/* Combinaisons de promotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Combinaisons de promotions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isCombinable"
              checked={formData.isCombinable || false}
              onCheckedChange={(checked) => onUpdateFormData({ isCombinable: checked })}
            />
            <Label htmlFor="isCombinable">Peut être combinée avec d'autres promotions</Label>
          </div>

          {formData.isCombinable && (
            <div className="space-y-4 border-l-2 border-muted pl-4">
              <div>
                <Label htmlFor="maxPromotions">Nombre maximum de promotions combinables</Label>
                <Input
                  id="maxPromotions"
                  type="number"
                  min="2"
                  max="5"
                  value={formData.combinationRules?.max_promotions || ''}
                  onChange={(e) => onUpdateFormData({
                    combinationRules: {
                      ...formData.combinationRules,
                      max_promotions: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  placeholder="Ex: 3"
                />
              </div>

              <div>
                <Label htmlFor="minGapHours">Délai minimum entre combinaisons (heures)</Label>
                <Input
                  id="minGapHours"
                  type="number"
                  min="0"
                  value={formData.combinationRules?.min_gap_hours || ''}
                  onChange={(e) => onUpdateFormData({
                    combinationRules: {
                      ...formData.combinationRules,
                      min_gap_hours: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  placeholder="Ex: 24"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPromotionForm;
