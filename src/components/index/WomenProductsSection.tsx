
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Star } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../types/product';

interface WomenProductsSectionProps {
  distributedProducts?: Product[];
  onAddToCart: (product: Product) => void;
  visibleProducts?: number;
  onShowMoreProducts?: () => void;
}

const WomenProductsSection: React.FC<WomenProductsSectionProps> = ({
  distributedProducts = [],
  onAddToCart,
  visibleProducts = 60,
  onShowMoreProducts
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    if (onShowMoreProducts) {
      onShowMoreProducts();
    } else {
      navigate('/products?category=femme');
    }
  };

  // AUGMENTÉ : Afficher beaucoup plus d'articles - AU MOINS 15 articles
  const displayCount = Math.max(15, visibleProducts);
  const womenProducts = distributedProducts.slice(0, displayCount);

  if (womenProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-4 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="container-cowema">
        {/* Bannière décorative */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white rounded-xl p-3 mb-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart size={18} fill="currentColor" />
              <span className="font-bold text-lg">SPÉCIALEMENT POUR VOUS</span>
              <Star size={18} fill="currentColor" />
            </div>
            <p className="text-xs opacity-90 font-medium">
              {womenProducts.length} articles • Beauté • Mode • Bien-être • Lifestyle • Qualité Premium
            </p>
          </div>
          {/* Éléments décoratifs */}
          <div className="absolute top-1 left-8 w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
          <div className="absolute bottom-1 right-8 w-4 h-4 bg-white bg-opacity-20 rounded-full"></div>
          <div className="absolute top-1/2 left-3 w-3 h-3 bg-white bg-opacity-15 rounded-full"></div>
          <div className="absolute top-1/4 right-3 w-4 h-4 bg-white bg-opacity-15 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4">
          {womenProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in hover-scale" 
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-md border-2 border-pink-200">
              <Heart className="text-pink-500" size={14} fill="currentColor" />
              <span className="text-xs font-medium text-gray-700">
                {womenProducts.length} produits sélectionnés pour vous
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 text-white py-2 px-5 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-lg font-bold text-sm"
          >
            Découvrir toute la collection femme
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WomenProductsSection;
