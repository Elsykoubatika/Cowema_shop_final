
import React from 'react';
import ProductCard from './product-card/ProductCard';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { useIsMobile } from '@/hooks/use-mobile';
import YaBaBossIcon from './icons/YaBaBossIcon';

interface YaBaBossProductsSectionProps {
  yaBaBossProducts: Product[];
  onAddToCart: (product: Product) => void;
  onOpenModal: (product: Product) => void;
  activeCategory?: string;
}

const YaBaBossProductsSection: React.FC<YaBaBossProductsSectionProps> = ({
  yaBaBossProducts, 
  onAddToCart,
  onOpenModal,
  activeCategory = ''
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Ne pas afficher la section s'il n'y a pas de produits YaBaBoss
  if (!yaBaBossProducts || yaBaBossProducts.length === 0) {
    console.log('🚫 YaBaBoss section hidden - no products available');
    return null;
  }

  // Limiter à 15 produits maximum
  const productsToShow = yaBaBossProducts.slice(0, 15);

  const handleViewMoreClick = () => {
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      navigate(`/ya-ba-boss/products?category=${encodeURIComponent(activeCategory)}`);
    } else {
      navigate('/ya-ba-boss/products');
    }
  };

  const getSectionTitle = () => {
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      return `YA BA BOSS - ${activeCategory}`;
    }
    return 'YA BA BOSS - Sélection Premium';
  };

  const getSectionDescription = () => {
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      return `${productsToShow.length} produits YA BA BOSS premium dans ${activeCategory} • Qualité garantie`;
    }
    return `${productsToShow.length} produits YA BA BOSS premium • Algorithme intelligent • Tendances actuelles`;
  };

  console.log('✅ YaBaBoss section displaying:', {
    category: activeCategory || 'Tous',
    productsCount: productsToShow.length,
    maxAllowed: 15
  });

  return (
    <section className="py-8 bg-gradient-to-r from-yellow-50 to-orange-50">
      <div className="container-cowema">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <YaBaBossIcon size={24} className="mr-2 text-yellow-500" />
              {getSectionTitle()}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {getSectionDescription()}
            </p>
          </div>
          <button 
            onClick={handleViewMoreClick}
            className="text-primary hover:underline flex items-center gap-1 cursor-pointer hover:text-primary/80 transition-colors"
          >
            Voir plus
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productsToShow.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                showWhatsAppButton={false}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={handleViewMoreClick}
            className="btn btn-primary py-2 px-6 flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
          >
            Voir tous les produits YaBaBoss <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default YaBaBossProductsSection;
