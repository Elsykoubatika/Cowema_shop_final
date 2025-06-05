
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import YaBaBossIcon from '../icons/YaBaBossIcon';

interface FeaturedProductsProps {
  products: Product[];
  handleAddToCart: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, handleAddToCart }) => {
  const navigate = useNavigate();

  const handleNavigateToProducts = () => {
    navigate('/ya-ba-boss/products');
  };

  const handleViewMore = () => {
    navigate('/ya-ba-boss/products');
  };

  return (
    <section className="py-12 bg-gradient-to-b from-yellow-50 to-white">
      <div className="container-cowema">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <YaBaBossIcon size={24} className="text-yellow-500" />
            Produits YA BA BOSS
          </h2>
          <button 
            onClick={handleViewMore}
            className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            Voir tous les produits
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {products.length > 8 && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleNavigateToProducts}
              className="btn btn-primary py-2 px-6 inline-flex items-center gap-2"
            >
              Voir plus de produits <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
