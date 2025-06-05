
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Star, TrendingUp } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../data/products';

interface MomentOffersSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const MomentOffersSection: React.FC<MomentOffersSectionProps> = ({
  products,
  onAddToCart
}) => {
  const navigate = useNavigate();
  
  // Sélectionner des produits de toutes les catégories avec diversité
  const getSelectedProducts = () => {
    if (products.length === 0) return [];
    
    // Grouper les produits par catégorie
    const productsByCategory = products.reduce((acc, product) => {
      const category = product.category || 'Autres';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as { [key: string]: Product[] });
    
    // Sélectionner 1-2 produits par catégorie pour la diversité
    const selectedProducts: Product[] = [];
    const categories = Object.keys(productsByCategory);
    
    categories.forEach(category => {
      const categoryProducts = productsByCategory[category];
      // Mélanger les produits de cette catégorie
      const shuffled = [...categoryProducts].sort(() => Math.random() - 0.5);
      // Prendre 1-2 produits par catégorie
      const count = Math.min(2, shuffled.length);
      selectedProducts.push(...shuffled.slice(0, count));
    });
    
    // Mélanger le résultat final et limiter à 6 produits
    return selectedProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  };

  const selectedProducts = getSelectedProducts();

  const handleViewMore = () => {
    navigate('/products');
  };

  // Ne pas afficher la section s'il n'y a pas de produits
  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Éléments décoratifs statiques */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
      
      <div className="container-cowema relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-full">
              <Zap className="text-white" size={24} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">✨ Sélection Variée & Tendances</h2>
            <div className="bg-purple-500 p-2 rounded-full">
              <Star className="text-white" size={24} fill="currentColor" />
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection diversifiée de produits tendances dans toutes les catégories.
          </p>
        </div>

        {/* Bannière informative */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 text-white rounded-lg p-4 mb-8 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={20} />
            <span className="font-bold text-lg">PRODUITS TENDANCES</span>
            <Star size={20} fill="currentColor" />
          </div>
          <p className="text-sm opacity-90">
            🌟 Toutes catégories • 💎 Qualité garantie • 🚚 Livraison gratuite dès 25 000 FCFA
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          {selectedProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Bouton pour voir plus */}
        <div className="text-center">
          <button 
            onClick={handleViewMore}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-8 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-300 shadow-lg font-semibold"
          >
            Découvrir tous nos produits
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MomentOffersSection;
