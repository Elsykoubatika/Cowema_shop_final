
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ProductsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  categories: string[];
  cities: string[];
  isLoadingFilters: boolean;
  onClearFilters: () => void;
}

// Utiliser les mêmes catégories prédéfinies
const PREDEFINED_CATEGORIES = [
  'Electronics',
  'Electroménager',
  'Solaire',
  'Cuisine',
  'Santé & Bien-être',
  'Beauté',
  'Habillements',
  'Jouets'
];

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  cities,
  isLoadingFilters,
  onClearFilters
}) => {
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedCity !== 'all';

  if (isLoadingFilters) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtre par catégorie - utiliser les catégories prédéfinies */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {PREDEFINED_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par ville */}
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cities
              .filter(city => city && city.trim() !== '') // Filtrer les villes vides
              .map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Bouton pour effacer les filtres */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="whitespace-nowrap"
          >
            <X className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Recherche: "{searchQuery}"
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Catégorie: {selectedCategory}
            </span>
          )}
          {selectedCity !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ville: {selectedCity}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsFilters;
