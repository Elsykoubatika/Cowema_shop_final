
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Percent, Tag, Flame, ExternalLink } from 'lucide-react';
import { Product } from '../../data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUnifiedCart } from '@/cart/components/CartProvider';

interface PromoSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const PromoSection: React.FC<PromoSectionProps> = ({
  products,
  onAddToCart
}) => {
  const navigate = useNavigate();
  const { addItem: handleAddToCart } = useUnifiedCart();
  
  // Filtrer ET afficher AU MOINS 16 produits en promotion
  const promoProducts = products.filter(product => 
    product.promoPrice && 
    product.promoPrice < product.price &&
    product.stock > 0
  ).slice(0, 16);

  const handleViewAllPromos = () => {
    navigate('/deals');
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      handleAddToCart(product);
    }
  };

  // Ne pas afficher la section s'il n'y a pas de produits en promo
  if (promoProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20"></div>
      
      <div className="container-cowema relative">
        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white rounded-lg p-4 mb-8 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Tag size={20} />
            <span className="font-bold text-lg">PROMOTIONS EXCLUSIVES - TOUTES CATÉGORIES</span>
            <Flame size={20} fill="currentColor" />
          </div>
          <p className="text-sm opacity-90">
            💥 Jusqu'à -50% • 🎯 Stock limité • 🚚 Livraison gratuite dès 25 000 FCFA
          </p>
        </div>

        {/* Grille de produits en promotion avec design amélioré */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
          {promoProducts.map((product) => {
            const discount = Math.round(((product.price - (product.promoPrice || product.price)) / product.price) * 100);
            
            return (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden border border-gray-200 hover:border-red-300"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Badge de réduction accrocheur */}
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
                    -{discount}%
                  </Badge>
                </div>

                {/* Bouton lien direct */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product.id);
                  }}
                  title="Voir les détails"
                >
                  <ExternalLink size={14} />
                </Button>

                {/* Image du produit */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name || product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">Pas d'image</span>
                    </div>
                  )}
                </div>

                {/* Contenu du produit */}
                <div className="p-4">
                  {/* Titre du produit */}
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-3 hover:text-red-600 transition-colors">
                    {product.name || product.title}
                  </h3>
                  
                  {/* Prix avec design attractif */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-bold text-red-600">
                        {(product.promoPrice || 0).toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-400 line-through font-medium">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                        Économie: {(product.price - (product.promoPrice || product.price)).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <Button 
                    onClick={(e) => handleAddToCartClick(e, product)}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
                  </Button>
                </div>

                {/* Effet de survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bouton pour voir toutes les promotions */}
        <div className="text-center">
          <button 
            onClick={handleViewAllPromos}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-4 px-10 rounded-lg flex items-center gap-3 mx-auto transition-all duration-300 shadow-lg font-bold text-lg hover:scale-105"
          >
            <Tag size={20} />
            Voir tous les deals et promotions
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
