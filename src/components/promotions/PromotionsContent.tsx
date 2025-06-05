
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductsGrid from '@/components/products/ProductsGrid';

interface PromotionsContentProps {
  filteredProducts: any[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  goToPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalLoaded: number;
  totalProducts: number;
  clearFilters: () => void;
}

const PromotionsContent: React.FC<PromotionsContentProps> = ({
  filteredProducts,
  isLoading,
  error,
  hasMore,
  loadMore,
  goToPage,
  currentPage,
  totalPages,
  totalLoaded,
  totalProducts,
  clearFilters
}) => {
  return (
    <div className="py-8">
      <div className="container-cowema">
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Erreur lors du chargement des produits: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Réessayer
            </Button>
          </div>
        )}
        
        {!error && (
          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            goToPage={goToPage}
            currentPage={currentPage}
            totalPages={totalPages}
            totalLoaded={totalLoaded}
            totalProducts={totalProducts}
            viewMode="grid"
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  );
};

export default PromotionsContent;
