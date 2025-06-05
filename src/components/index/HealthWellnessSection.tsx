
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Shield, Zap } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../types/product';

interface HealthWellnessSectionProps {
  distributedProducts?: Product[];
  onAddToCart: (product: Product) => void;
}

const HealthWellnessSection: React.FC<HealthWellnessSectionProps> = ({
  distributedProducts = [],
  onAddToCart
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate('/products?category=Santé%20%26%20Bien-être');
  };

  const healthProducts = distributedProducts.slice(0, 8);

  if (healthProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container-cowema">
        {/* Bannière de mise en avant */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={20} />
            <span className="font-bold text-lg">SANTÉ & BIEN-ÊTRE</span>
            <Zap size={20} />
          </div>
          <p className="text-sm opacity-90">
            {healthProducts.length} articles • Compléments naturels • Équipements fitness • Bien-être global
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {healthProducts.map((product, index) => (
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
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-green-200">
              <Heart className="text-green-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                {healthProducts.length} produits santé certifiés et approuvés
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-8 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            Explorer santé & bien-être
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HealthWellnessSection;
