
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Package } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../data/products';
import { useProductRecommendations } from '../../hooks/useProductRecommendations';

interface InterestingCombinationsSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const InterestingCombinationsSection: React.FC<InterestingCombinationsSectionProps> = ({
  products,
  onAddToCart
}) => {
  const navigate = useNavigate();
  const { getFrequentlyBoughtTogether } = useProductRecommendations();
  
  // Sélectionner un produit populaire comme base pour les recommandations
  const baseProduct = products.find(p => p.isYaBaBoss) || products[0];
  
  // AUGMENTÉ : Obtenir AU MOINS 12 combinaisons intéressantes
  const combinationProducts = baseProduct 
    ? getFrequentlyBoughtTogether(baseProduct, products, 12)
    : products.slice(0, 12);

  const handleViewMore = () => {
    navigate('/products');
  };

  if (!baseProduct || combinationProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container-cowema">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-purple-600" size={28} />
            <h2 className="text-3xl font-bold text-gray-900">Combinaisons Intéressantes</h2>
            <Package className="text-blue-600" size={28} />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {combinationProducts.length} produits qui se marient parfaitement ensemble. 
            Nos clients achètent souvent ces articles en combinaison pour une expérience optimale.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {combinationProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-purple-200">
              <Sparkles className="text-purple-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                Plus de {products.length} combinaisons disponibles
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="btn btn-primary py-3 px-8 flex items-center gap-2 mx-auto hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Explorer toutes les combinaisons
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InterestingCombinationsSection;
