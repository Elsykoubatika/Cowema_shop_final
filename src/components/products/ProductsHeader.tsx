
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductsHeaderProps {
  totalProducts: number;
  totalLoaded: number;
  currentPage: number;
  totalPages: number;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  totalProducts,
  totalLoaded,
  currentPage,
  totalPages
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4">Tous nos produits</h1>
      <div className="flex gap-2 items-center">
        <Badge variant="secondary">
          {totalProducts} produits au total
        </Badge>
        <Badge variant="outline">
          {totalLoaded} produits affichés
        </Badge>
        {totalPages > 1 && (
          <Badge variant="outline">
            Page {currentPage} sur {totalPages}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProductsHeader;
