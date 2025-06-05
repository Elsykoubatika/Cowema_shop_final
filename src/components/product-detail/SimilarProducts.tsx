
import React, { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/product-card/ProductCard';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface SimilarProductsProps {
  currentProduct: Product;
  onAddToCart: (product: Product) => void;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ 
  currentProduct, 
  onAddToCart 
}) => {
  const { products } = useHybridProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Use smart recommendations for truly similar products
  const { recommendations: smartSimilarProducts } = useSmartRecommendations({
    currentProduct,
    allProducts: products,
    maxRecommendations: 50 // Get more candidates for pagination
  });
  
  console.log('🔍 SimilarProducts Smart Algorithm:', {
    productId: currentProduct.id,
    productName: currentProduct.name?.substring(0, 30),
    productCategory: currentProduct.category,
    totalSimilarFound: smartSimilarProducts.length,
    similarProducts: smartSimilarProducts.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name?.substring(0, 25),
      category: p.category
    }))
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(smartSimilarProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = smartSimilarProducts.slice(startIndex, endIndex);

  if (smartSimilarProducts.length === 0) {
    return (
      <section className="py-8 border-t">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Articles similaires
          </h2>
          <p className="text-gray-600">
            Aucun article similaire trouvé pour le moment.
          </p>
        </div>
      </section>
    );
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
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Articles similaires
          </h2>
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Algorithme intelligent
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          Découvrez des produits similaires dans la même catégorie 
          <span className="font-medium text-blue-600"> ({smartSimilarProducts.length} produits trouvés)</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Précédent
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page</span>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {currentPage}
                </div>
                <span className="text-sm text-gray-600">sur {totalPages}</span>
              </div>
              
              <Button
                onClick={handleLoadMore}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
              >
                Suivant
                <ChevronRight size={16} />
              </Button>
            </div>

            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
              <span className="font-medium">
                {startIndex + 1}-{Math.min(endIndex, smartSimilarProducts.length)}
              </span>
              {' '}sur{' '}
              <span className="font-medium text-blue-600">
                {smartSimilarProducts.length}
              </span>
              {' '}produits similaires
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Progression de navigation dans les articles similaires
            </p>
          </div>
        </div>
      )}

      {/* Algorithm info */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Sparkles size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Algorithme de similarité avancé
            </h4>
            <p className="text-sm text-blue-700">
              Ces produits sont sélectionnés en fonction de la catégorie, des mots-clés, 
              du prix et de la compatibilité avec <strong>{currentProduct.name}</strong>. 
              L'algorithme analyse plusieurs critères pour vous proposer les articles les plus pertinents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimilarProducts;
