
import React from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import LoadMoreButton from '@/components/products/LoadMoreButton';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  goToPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalLoaded: number;
  totalProducts: number;
  viewMode: 'grid' | 'list';
  onClearFilters: () => void;
  showInactiveProducts?: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  isLoading,
  hasMore,
  loadMore,
  goToPage,
  currentPage,
  totalPages,
  totalLoaded,
  totalProducts,
  viewMode,
  onClearFilters,
  showInactiveProducts = false
}) => {
  // Filtrer les produits selon le contexte (public ou admin)
  const filteredProducts = showInactiveProducts 
    ? products 
    : products.filter(product => product.isActive !== false);

  // Générer les numéros de pages à afficher
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (isLoading && filteredProducts.length === 0) {
    return (
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">Aucun produit trouvé</p>
        <p className="text-gray-400 mb-4">Essayez de modifier vos critères de recherche</p>
        <Button variant="outline" onClick={onClearFilters}>
          Réinitialiser les filtres
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Grille de produits */}
      <div className={`grid gap-6 mb-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Bouton Charger Plus */}
      {hasMore && (
        <div className="text-center mb-8">
          <Button 
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            {isLoading ? 'Chargement...' : 'Charger plus de produits'}
          </Button>
        </div>
      )}

      {/* Pagination avancée */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => goToPage(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          {/* Informations de pagination */}
          <div className="text-center mt-4 text-sm text-gray-600">
            <p>
              Affichage de {filteredProducts.length} produits • 
              Page {currentPage} sur {totalPages} • 
              Total: {totalProducts} produits
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsGrid;
