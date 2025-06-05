
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortAsc, SortDesc, Grid, List } from 'lucide-react';

interface ProductsSortingProps {
  sortBy: 'date' | 'price' | 'title';
  setSortBy: (sort: 'date' | 'price' | 'title') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const ProductsSorting: React.FC<ProductsSortingProps> = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={(value: 'date' | 'price' | 'title') => setSortBy(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price">Prix</SelectItem>
            <SelectItem value="title">Nom</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode('grid')}
          className={viewMode === 'grid' ? 'bg-gray-100 hover:bg-gray-100' : ''}
        >
          <Grid size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'bg-gray-100 hover:bg-gray-100' : ''}
        >
          <List size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ProductsSorting;
