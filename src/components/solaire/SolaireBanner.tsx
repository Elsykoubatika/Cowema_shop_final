import React, { useRef, useEffect, useState } from 'react';
import { Sun, Zap, Leaf, ArrowRight, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';

interface SolaireBannerProps {
  products: Product[];
  isLoading: boolean;
}

const SolaireBanner: React.FC<SolaireBannerProps> = ({ products, isLoading }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Sélection intelligente des produits pour la bannière
  const promotionalProducts = products.filter(product => 
    product.promoPrice && product.promoPrice < product.price
  );
  
  const regularProducts = products.filter(product => 
    !product.promoPrice || product.promoPrice >= product.price
  );
  
  // Logique de sélection dynamique :
  // 1. Prendre tous les produits en promo disponibles (max 8)
  // 2. Compléter avec des produits réguliers si nécessaire pour atteindre 8 produits
  const maxDisplayProducts = 8;
  let displayProducts: Product[] = [];
  
  if (promotionalProducts.length >= maxDisplayProducts) {
    // Assez de produits en promo, on prend les 8 premiers
    displayProducts = promotionalProducts.slice(0, maxDisplayProducts);
  } else {
    // Pas assez de produits en promo, on complète avec des produits réguliers
    const promoCount = promotionalProducts.length;
    const regularCount = Math.min(maxDisplayProducts - promoCount, regularProducts.length);
    
    displayProducts = [
      ...promotionalProducts,
      ...regularProducts.slice(0, regularCount)
    ];
  }
  
  // Déterminer le mode d'affichage basé sur la proportion de produits en promo
  const promoRatio = promotionalProducts.length / displayProducts.length;
  const isPromotionMode = promoRatio > 0.5; // Plus de 50% de produits en promo

  // Fixed auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || displayProducts.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // Pixels per frame
    const cardWidth = 296; // 280px width + 16px gap
    const maxScroll = cardWidth * displayProducts.length;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset position when we've scrolled past all cards
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [displayProducts.length, isPaused]);

  const handleProductClick = (product: Product) => {
    // Utiliser l'externalApiId en priorité, sinon l'id
    const productId = product.externalApiId || product.id;
    
    console.log('🔄 Banner product click navigation:', {
      productName: product.name,
      originalId: product.id,
      externalId: product.externalApiId,
      navigationId: productId
    });
    
    navigate(`/product/${productId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products?category=solaire');
  };

  if (isLoading) {
    return (
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-orange-500 via-yellow-500 to-green-500">
        <div className="container-cowema">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Chargement des produits solaires...</p>
          </div>
        </div>
      </section>
    );
  }

  // Couleurs et textes adaptatifs selon le mode
  const bannerColors = isPromotionMode 
    ? "from-red-500 via-orange-500 to-yellow-500"
    : "from-orange-500 via-yellow-500 to-green-500";
    
  const badgeColors = isPromotionMode
    ? "from-red-600 to-orange-600"
    : "from-orange-600 to-yellow-600";

  // Texte adaptatif selon la composition des produits
  const getBannerTitle = () => {
    if (promotionalProducts.length === 0) {
      return "🌞 Solutions Solaires Premium 🌞";
    } else if (promotionalProducts.length === displayProducts.length) {
      return "🔥 Offres Spéciales Solaires 🔥";
    } else {
      return "🌟 Sélection Solaire Spéciale 🌟";
    }
  };

  const getBannerDescription = () => {
    if (promotionalProducts.length === 0) {
      return "Découvrez nos produits solaires les plus populaires avec des technologies innovantes pour une énergie propre et économique";
    } else if (promotionalProducts.length === displayProducts.length) {
      return "Profitez de nos meilleures promotions sur les équipements solaires avec des économies exceptionnelles";
    } else {
      return `${promotionalProducts.length} promotion${promotionalProducts.length > 1 ? 's' : ''} spéciale${promotionalProducts.length > 1 ? 's' : ''} et notre sélection de produits solaires premium`;
    }
  };

  return (
    <section className={`relative py-12 overflow-hidden bg-gradient-to-br ${bannerColors}`}>
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_60%)] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-bounce opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="container-cowema relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center gap-3 bg-gradient-to-r ${badgeColors} text-white px-6 py-3 rounded-full font-bold text-lg mb-6 shadow-xl`}>
            {isPromotionMode ? (
              <>
                <Percent className="animate-pulse" size={24} />
                <span>PROMOTIONS SOLAIRES</span>
                <Zap size={20} />
              </>
            ) : (
              <>
                <Sun className="animate-spin" size={24} />
                <span>ÉNERGIE SOLAIRE TENDANCE</span>
                <Zap size={20} />
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            {getBannerTitle()}
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {getBannerDescription()}
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              scrollBehavior: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Display products only once without duplication */}
            {displayProducts.map((product, index) => {
              const discountPercentage = product.promoPrice 
                ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
                : 0;
              
              const isPromoProduct = product.promoPrice && product.promoPrice < product.price;
                
              return (
                <div
                  key={`${product.id}-${index}`}
                  className="group relative flex-shrink-0 transform transition-all duration-500 hover:scale-105"
                  style={{ width: '280px' }}
                >
                  <div 
                    className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer h-80"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Dynamic badge selon le type de produit */}
                    {isPromoProduct ? (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold z-10">
                        <Percent size={12} className="mr-1" />
                        -{discountPercentage}%
                      </Badge>
                    ) : (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold z-10">
                        <Sun size={12} className="mr-1" />
                        SOLAIRE
                      </Badge>
                    )}

                    {/* Eco badge */}
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold z-10">
                      <Leaf size={12} className="mr-1" />
                      ÉCO
                    </Badge>

                    {/* Product Image */}
                    <div className="relative bg-gray-50 overflow-hidden h-48">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Sun className="text-gray-400" size={48} />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 h-32 flex flex-col justify-between">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          {product.promoPrice ? (
                            <>
                              <span className="text-lg font-black text-red-600">
                                {product.promoPrice.toLocaleString()} FCFA
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {product.price.toLocaleString()} FCFA
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-black text-green-600">
                              {product.price.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {isPromoProduct ? (
                            <span className="text-xs text-red-600 font-medium">
                              🔥 Promotion limitée
                            </span>
                          ) : (
                            <span className="text-xs text-orange-600 font-medium">
                              🌱 Énergie propre
                            </span>
                          )}
                          {product.location && (
                            <span className="text-xs text-gray-500">
                              📍 {product.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-white text-orange-600 font-black text-lg px-8 py-4 rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
            onClick={handleViewAllProducts}
          >
            <Sun className="mr-2" size={20} />
            {isPromotionMode ? "VOIR TOUTES LES PROMOTIONS" : "VOIR TOUS LES PRODUITS SOLAIRES"}
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SolaireBanner;
