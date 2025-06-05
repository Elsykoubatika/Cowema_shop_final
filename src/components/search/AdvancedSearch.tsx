
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  hasPromo: boolean;
  rating: number;
  sortBy: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  isOpen,
  onToggle
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: [0, 1000000],
    inStock: false,
    hasPromo: false,
    rating: 0,
    sortBy: 'relevance'
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      category: '',
      priceRange: [0, 1000000],
      inStock: false,
      hasPromo: false,
      rating: 0,
      sortBy: 'relevance'
    });
    onClear();
  };

  const categories = [
    'Électronique',
    'Vêtements',
    'Maison & Jardin',
    'Sports & Loisirs',
    'Livres',
    'Beauté & Santé',
    'Automobiles',
    'ya-ba-boss'
  ];

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Rechercher des produits..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggle}
              className="p-1"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSearch}
              className="p-1"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced filters */}
      {isOpen && (
        <Card className="mb-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              Filtres avancés
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Label htmlFor="sortBy">Trier par</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pertinence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                    <SelectItem value="name_asc">Nom A-Z</SelectItem>
                    <SelectItem value="name_desc">Nom Z-A</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                    <SelectItem value="newest">Plus récents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div>
                <Label htmlFor="rating">Note minimum</Label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Toutes les notes</SelectItem>
                    <SelectItem value="1">1 étoile et plus</SelectItem>
                    <SelectItem value="2">2 étoiles et plus</SelectItem>
                    <SelectItem value="3">3 étoiles et plus</SelectItem>
                    <SelectItem value="4">4 étoiles et plus</SelectItem>
                    <SelectItem value="5">5 étoiles seulement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price range */}
            <div>
              <Label>Gamme de prix: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} FCFA</Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                max={1000000}
                min={0}
                step={1000}
                className="mt-2"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStock: !!checked }))}
                />
                <Label htmlFor="inStock">En stock seulement</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPromo"
                  checked={filters.hasPromo}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasPromo: !!checked }))}
                />
                <Label htmlFor="hasPromo">En promotion</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Effacer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
