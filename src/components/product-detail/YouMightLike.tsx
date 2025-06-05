import React, { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/product-card/ProductCard';
import { useProductRecommendations } from '@/hooks/useProductRecommendations';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YouMightLikeProps {
  currentProduct: Product;
  onAddToCart: (product: Product) => void;
}

const YouMightLike: React.FC<YouMightLikeProps> = ({ 
  currentProduct, 
  onAddToCart 
}) => {
  const { getCheckoutUpsellProducts } = useProductRecommendations();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 products per page for this section
  
  // Get up to 30 recommended products (different from similar products)
  const allRecommendedProducts = getCheckoutUpsellProducts(currentProduct, products, 30);
  
  // Calculate pagination
  const totalPages = Math.ceil(allRecommendedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = allRecommendedProducts.slice(startIndex, endIndex);

  if (allRecommendedProducts.length === 0) {
    return null;
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="py-8 border-t">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vous aimeriez ceci
        </h2>
        <p className="text-gray-600">
          Recommandations personnalisées basées sur vos intérêts ({allRecommendedProducts.length} produits sélectionnés)
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Précédent
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            
            <Button
              onClick={handleLoadMore}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            Affichage de {startIndex + 1}-{Math.min(endIndex, allRecommendedProducts.length)} sur {allRecommendedProducts.length} produits
          </div>
        </div>
      )}

      {/* Existing "Voir plus" button for additional exploration */}
      <div className="text-center">
        <Button 
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          onClick={() => window.location.href = '/products'}
        >
          Découvrir plus de produits
        </Button>
      </div>
    </section>
  );
};

export default YouMightLike;
