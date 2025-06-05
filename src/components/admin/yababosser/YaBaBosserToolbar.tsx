
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Search,
  Star,
  Video,
  Filter,
  PackageCheck
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface YaBaBosserToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onAddYaBaBoss: () => void;
  onRemoveYaBaBoss: () => void;
  categories: string[];
  filters: {
    onlyYaBaBoss: boolean;
    onlyWithVideo: boolean;
    onlyActive: boolean;
    category?: string;
  };
  onFilterChange: (filters: any) => void;
}

const YaBaBosserToolbar: React.FC<YaBaBosserToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCount,
  onAddYaBaBoss,
  onRemoveYaBaBoss,
  categories,
  filters,
  onFilterChange
}) => {
  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Actions pour les produits sélectionnés */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {selectedCount} sélectionné(s)
            </Badge>
            <Button 
              size="sm" 
              onClick={onAddYaBaBoss}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Star size={16} fill="currentColor" className="mr-1" /> Ajouter YA BA BOSS
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRemoveYaBaBoss}
            >
              <Star size={16} className="mr-1" /> Retirer YA BA BOSS
            </Button>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filtres:</span>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="yababoss-filter"
            checked={filters.onlyYaBaBoss}
            onCheckedChange={(checked) => onFilterChange({ ...filters, onlyYaBaBoss: checked })}
          />
          <label htmlFor="yababoss-filter" className="text-sm flex items-center cursor-pointer">
            <Star size={14} fill={filters.onlyYaBaBoss ? "currentColor" : "none"} className="mr-1 text-yellow-500" />
            YA BA BOSS
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="video-filter"
            checked={filters.onlyWithVideo}
            onCheckedChange={(checked) => onFilterChange({ ...filters, onlyWithVideo: checked })}
          />
          <label htmlFor="video-filter" className="text-sm flex items-center cursor-pointer">
            <Video size={14} className="mr-1 text-blue-500" />
            Avec vidéo
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="active-filter"
            checked={filters.onlyActive}
            onCheckedChange={(checked) => onFilterChange({ ...filters, onlyActive: checked })}
          />
          <label htmlFor="active-filter" className="text-sm flex items-center cursor-pointer">
            <PackageCheck size={14} className="mr-1 text-green-500" />
            En stock
          </label>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange({ ...filters, category: value })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default YaBaBosserToolbar;
