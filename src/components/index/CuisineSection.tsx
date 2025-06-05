
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChefHat, Utensils, Coffee, Cookie } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../types/product';

interface CuisineSectionProps {
  distributedProducts?: Product[];
  onAddToCart: (product: Product) => void;
}

const CuisineSection: React.FC<CuisineSectionProps> = ({
  distributedProducts = [],
  onAddToCart
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate('/products?category=cuisine');
  };

  // AUGMENTÉ : Afficher AU MOINS 12 articles cuisine
  const displayCount = 12;
  const cuisineProducts = distributedProducts.slice(0, displayCount);

  if (cuisineProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container-cowema">
        {/* Bannière de mise en avant */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coffee size={20} />
            <span className="font-bold text-lg">ÉQUIPEMENTS TENDANCE</span>
            <Cookie size={20} />
          </div>
          <p className="text-sm opacity-90">
            {cuisineProducts.length} articles • Ustensiles professionnels • Électroménager moderne • Innovation culinaire
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {cuisineProducts.map((product, index) => (
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
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-amber-200">
              <Utensils className="text-amber-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                {cuisineProducts.length} articles cuisine tendance sélectionnés
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-8 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            Explorer toute la cuisine
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CuisineSection;
