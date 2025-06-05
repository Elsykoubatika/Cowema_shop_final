
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Search, Calendar, MapPin, Users, ShoppingBag } from 'lucide-react';

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: any) => void;
  appliedFilters: string[];
  onClearFilter: (filter: string) => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  onFiltersChange,
  appliedFilters,
  onClearFilter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '',
    city: '',
    customerType: '',
    productCategory: '',
    orderStatus: '',
    trafficSource: '',
    deviceType: '',
    minOrderValue: '',
    maxOrderValue: ''
  });

  const applyFilters = () => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}: ${value}`);
    
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: '',
      city: '',
      customerType: '',
      productCategory: '',
      orderStatus: '',
      trafficSource: '',
      deviceType: '',
      minOrderValue: '',
      maxOrderValue: ''
    });
    onFiltersChange({});
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Bouton d'ouverture des filtres */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="relative"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres
        {appliedFilters.length > 0 && (
          <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
            {appliedFilters.length}
          </Badge>
        )}
      </Button>

      {/* Filtres appliqués */}
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {appliedFilters.map(filter => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onClearFilter(filter)}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Tout effacer
          </Button>
        </div>
      )}

      {/* Modal des filtres */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres Analytics
                </CardTitle>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filtres temporels */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  Période personnalisée
                </Label>
                <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="yesterday">Hier</SelectItem>
                    <SelectItem value="last7days">7 derniers jours</SelectItem>
                    <SelectItem value="last30days">30 derniers jours</SelectItem>
                    <SelectItem value="thismonth">Ce mois</SelectItem>
                    <SelectItem value="lastmonth">Mois dernier</SelectItem>
                    <SelectItem value="thisyear">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtres géographiques */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium">
                  <MapPin className="h-4 w-4 mr-2" />
                  Localisation
                </Label>
                <Select value={filters.city} onValueChange={(value) => updateFilter('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kinshasa">Kinshasa</SelectItem>
                    <SelectItem value="lubumbashi">Lubumbashi</SelectItem>
                    <SelectItem value="bukavu">Bukavu</SelectItem>
                    <SelectItem value="goma">Goma</SelectItem>
                    <SelectItem value="mbuji-mayi">Mbuji-Mayi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtres clients */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  Type de client
                </Label>
                <Select value={filters.customerType} onValueChange={(value) => updateFilter('customerType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouveaux clients</SelectItem>
                    <SelectItem value="returning">Clients fidèles</SelectItem>
                    <SelectItem value="vip">Clients VIP</SelectItem>
                    <SelectItem value="yababoss">Ya Ba Boss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtres produits */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Catégorie produit
                </Label>
                <Select value={filters.productCategory} onValueChange={(value) => updateFilter('productCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solaire">Solaire</SelectItem>
                    <SelectItem value="beaute">Beauté</SelectItem>
                    <SelectItem value="cuisine">Cuisine</SelectItem>
                    <SelectItem value="sante">Santé</SelectItem>
                    <SelectItem value="tech">Technologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtres commandes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Valeur min. commande</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minOrderValue}
                    onChange={(e) => updateFilter('minOrderValue', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Valeur max. commande</Label>
                  <Input
                    type="number"
                    placeholder="999999"
                    value={filters.maxOrderValue}
                    onChange={(e) => updateFilter('maxOrderValue', e.target.value)}
                  />
                </div>
              </div>

              {/* Filtres trafic */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Source de trafic</Label>
                <Select value={filters.trafficSource} onValueChange={(value) => updateFilter('trafficSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="referral">Référent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button onClick={applyFilters} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
                <Button onClick={clearAllFilters} variant="outline">
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AnalyticsFilters;
