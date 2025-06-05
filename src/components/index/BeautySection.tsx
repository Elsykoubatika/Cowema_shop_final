
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Heart } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../types/product';

interface BeautySectionProps {
  distributedProducts?: Product[];
  onAddToCart: (product: Product) => void;
}

const BeautySection: React.FC<BeautySectionProps> = ({
  distributedProducts = [],
  onAddToCart
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate('/products?category=Beauté');
  };

  const beautyProducts = distributedProducts.slice(0, 8);

  if (beautyProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container-cowema">
        {/* Bannière de mise en avant */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={20} />
            <span className="font-bold text-lg">BEAUTÉ & COSMÉTIQUES</span>
            <Sparkles size={20} />
          </div>
          <p className="text-sm opacity-90">
            {beautyProducts.length} articles • Soins de qualité • Marques tendance • Beauté authentique
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {beautyProducts.map((product, index) => (
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
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-pink-200">
              <Heart className="text-pink-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                {beautyProducts.length} produits beauté sélectionnés avec soin
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 px-8 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            Découvrir tous nos produits beauté
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BeautySection;
