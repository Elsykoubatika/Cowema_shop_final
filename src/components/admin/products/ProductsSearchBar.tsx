
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProductsSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductsSearchBar: React.FC<ProductsSearchBarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Rechercher un produit par nom, catégorie..."
        className="pl-9 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default ProductsSearchBar;
