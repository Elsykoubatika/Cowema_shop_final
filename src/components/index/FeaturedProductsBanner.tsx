
import React from 'react';
import { Star, Zap, Crown } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../data/products';

interface FeaturedProductsBannerProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const FeaturedProductsBanner: React.FC<FeaturedProductsBannerProps> = ({
  products,
  onAddToCart
}) => {
  
  // Algorithme pour sélectionner 9 produits vedettes avec disposition spéciale
  const getFeaturedProducts = () => {
    // Trier par ordre de priorité
    const sortedProducts = products
      .filter(product => product.stock > 0)
      .sort((a, b) => {
        // Ya Ba Boss en priorité
        if (a.isYaBaBoss && !b.isYaBaBoss) return -1;
        if (!a.isYaBaBoss && b.isYaBaBoss) return 1;
        
        // Ensuite les promotions
        if (a.promoPrice && !b.promoPrice) return -1;
        if (!a.promoPrice && b.promoPrice) return 1;
        
        // Ensuite les offres flash
        if (a.isFlashOffer && !b.isFlashOffer) return -1;
        if (!a.isFlashOffer && b.isFlashOffer) return 1;
        
        return 0;
      });

    // Sélectionner 9 produits uniques
    const selected = [];
    const usedIds = new Set();
    
    for (const product of sortedProducts) {
      if (selected.length >= 9) break;
      if (!usedIds.has(product.id)) {
        selected.push(product);
        usedIds.add(product.id);
      }
    }
    
    return selected;
  };

  const featuredProducts = getFeaturedProducts();

  if (featuredProducts.length === 0) {
    return null;
  }

  // Le produit central (le plus important)
  const centerProduct = featuredProducts[0];
  // Les 4 produits de gauche
  const leftProducts = featuredProducts.slice(1, 5);
  // Les 4 produits de droite
  const rightProducts = featuredProducts.slice(5, 9);

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-400 rounded-full opacity-5 animate-pulse"></div>
      </div>
      
      <div className="container-cowema relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="text-yellow-400" size={32} />
            <h2 className="text-4xl font-bold text-white">Sélection Vedette</h2>
            <Crown className="text-yellow-400" size={32} />
          </div>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg">
            Nos 9 coups de cœur sélectionnés spécialement pour vous
          </p>
        </div>

        {/* Bannière d'accroche */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl p-4 mb-12 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star size={24} fill="currentColor" />
            <span className="font-bold text-xl">PRODUITS EXCEPTIONNELS</span>
            <Zap size={24} fill="currentColor" />
          </div>
          <p className="text-sm font-semibold">
            Qualité premium • Prix imbattables • Satisfaction garantie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Colonne gauche - 4 produits */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {leftProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>

          {/* Produit central - Plus grand */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm">
                    <Crown size={16} />
                    PRODUIT VEDETTE
                    <Crown size={16} />
                  </div>
                </div>
                <ProductCard 
                  product={centerProduct} 
                  onAddToCart={onAddToCart}
                />
              </div>
            </div>
          </div>

          {/* Colonne droite - 4 produits */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {rightProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 4) * 0.2}s` }}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Message de fin */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
            <Star className="text-yellow-400" size={20} fill="currentColor" />
            <span className="text-sm font-medium">
              Découvrez encore plus de produits exceptionnels ci-dessous
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsBanner;
