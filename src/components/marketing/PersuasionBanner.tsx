import React, { useRef, useEffect, useState } from 'react';
import { Star, Zap, ShoppingCart, Crown, Gift, Sparkles, ArrowRight, Timer, Heart, Phone, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBannerProducts } from '@/hooks/useBannerProducts';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { useUnifiedCart } from '@/cart/components/CartProvider';
import { useNavigate } from 'react-router-dom';
import ProductCardRating from '@/components/ProductCardRating';
import { calculateAndFormatLoyaltyPoints } from '@/utils/loyaltyUtils';

interface ProductMediaCyclerProps {
  images: string[];
  videoUrl?: string;
  title: string;
}

const ProductMediaCycler: React.FC<ProductMediaCyclerProps> = ({ images, videoUrl, title }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);

  // Créer un tableau de tous les médias (images + vidéo)
  const allMedia = React.useMemo(() => {
    const media = [...(images || [])];
    if (videoUrl?.trim()) {
      media.push(videoUrl);
    }
    return media;
  }, [images, videoUrl]);

  // Cycle automatique à travers tous les médias
  useEffect(() => {
    if (allMedia.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => {
        const nextIndex = (prev + 1) % allMedia.length;
        // Vérifier si le prochain média est une vidéo (dernier élément si videoUrl existe)
        setIsVideo(videoUrl && nextIndex === allMedia.length - 1);
        return nextIndex;
      });
    }, 2500); // Change toutes les 2.5 secondes

    return () => clearInterval(interval);
  }, [allMedia.length, videoUrl]);

  const currentMedia = allMedia[currentMediaIndex];

  if (!currentMedia) {
    return (
      <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-xs">Pas d'image</span>
      </div>
    );
  }

  return (
    <div className="relative h-28 mb-2 rounded-lg overflow-hidden flex-shrink-0">
      {isVideo && videoUrl ? (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <img 
            src={`https://img.youtube.com/vi/${videoUrl.split('/').pop()?.split('?')[0] || ''}/mqdefault.jpg`}
            alt={`${title} - aperçu vidéo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si la thumbnail YouTube ne charge pas
              const target = e.target as HTMLImageElement;
              target.src = currentMedia;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-1">
              <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
          </div>
          {/* Indicateur vidéo */}
          <div className="absolute bottom-1 left-1 bg-red-600 text-white text-xs px-1 rounded">
            VIDÉO
          </div>
        </div>
      ) : (
        <img 
          src={currentMedia} 
          alt={`${title} - ${currentMediaIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      )}
      
      {/* Indicateurs de progression */}
      {allMedia.length > 1 && (
        <div className="absolute bottom-1 right-1 flex gap-0.5">
          {allMedia.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PersuasionBanner: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useUnifiedCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);
  
  // Récupération des produits via le hook existant
  const { products, isLoading } = useHybridProducts();
  
  // Utilisation du nouveau système de scoring amélioré
  const { 
    featuredProducts, 
    refreshProducts, 
    getDebugStats,
    isLoading: isBannerLoading 
  } = useBannerProducts({ 
    products, 
    count: 8, // Augmenté pour avoir plus de produits dans le carrousel
    refreshInterval: 60000, // Rafraîchissement toutes les minutes
    maxPrice: 1500000, // Limite à 1.5M FCFA
    genderBalance: true // Équilibrage hommes/femmes
  });

  // Effet pour le défilement automatique continu et fluide - CORRIGÉ
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || featuredProducts.length === 0) {
      console.log('❌ Scroll container or products not ready:', { 
        hasContainer: !!scrollContainer, 
        productsCount: featuredProducts.length 
      });
      return;
    }

    console.log('✅ Starting auto-scroll for banner with', featuredProducts.length, 'products');

    let scrollPosition = 0;
    const scrollSpeed = 1; // Vitesse de défilement réduite (pixels par frame)

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Calculer la largeur d'une carte (220px + gap de 16px)
        const cardWidth = 220 + 16;
        const totalWidth = cardWidth * featuredProducts.length;
        
        // Reset quand on a scrollé la largeur d'un set complet
        if (scrollPosition >= totalWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    // Démarrer l'animation
    animationRef.current = requestAnimationFrame(scroll);

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up banner scroll animation');
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [featuredProducts.length, isPaused]); // Ajout de isPaused dans les dépendances

  // Gestionnaires pour pause/resume au hover
  const handleMouseEnter = () => {
    console.log('🖱️ Banner scroll paused on hover');
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    console.log('🖱️ Banner scroll resumed');
    setIsPaused(false);
  };

  const handleProductClick = (productId: string) => {
    console.log(`Viewing product ${productId}`);
    navigate(`/product/${productId}`);
    // Log pour analytics amélioré
    console.log('🎯 Banner product clicked:', getDebugStats());
  };

  const handleShopNow = () => {
    console.log('Shop now clicked from intelligent banner');
    console.log('📊 Current banner stats:', getDebugStats());
    navigate('/deals'); // Changer de '/all-deals' vers '/deals'
  };

  const handleCartClick = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    // Créer un objet produit compatible avec le système de panier
    const cartProduct = {
      id: product.id,
      name: product.title,
      title: product.title,
      price: parseInt(product.oldPrice?.replace(/\s/g, '') || product.price.replace(/\s/g, '')) || 0,
      promoPrice: product.oldPrice ? parseInt(product.price.replace(/\s/g, '')) : undefined,
      images: [product.url],
      stock: 10, // Valeur par défaut
      category: 'Électronique',
      keywords: [],
      isYaBaBoss: product.badge === 'TOP',
      isFlashOffer: product.badge === 'FLASH',
      isActive: true
    };
    
    addItem(cartProduct);
    console.log('🛒 Product added to cart from banner:', product.title);
  };

  const handleWhatsAppClick = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    const message = `Bonjour, je suis intéressé par ce produit : ${product.title} au prix de ${product.price} FCFA. Pouvez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/242068196522?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('📱 WhatsApp contact initiated for:', product.title);
  };

  const handleDirectOrderClick = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    // Ajouter d'abord au panier
    handleCartClick(e, product);
    
    // Puis ouvrir le modal de commande directe ou rediriger
    setTimeout(() => {
      // Ici on pourrait ouvrir un modal de commande directe
      // Pour l'instant, on simule en cliquant sur le bouton panier
      const cartButton = document.querySelector('.fixed.bottom-6.right-6 button');
      if (cartButton instanceof HTMLElement) {
        cartButton.click();
      }
    }, 500);
    
    console.log('⚡ Direct order initiated for:', product.title);
  };

  // Affichage de loading si les produits ne sont pas encore chargés
  if (isLoading || isBannerLoading || featuredProducts.length === 0) {
    return (
      <section className="relative py-6 overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-red-700">
        <div className="container-cowema relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Sélection intelligente des meilleures offres...</p>
          </div>
        </div>
      </section>
    );
  }

  console.log('PersuasionBanner: Rendering full banner with', featuredProducts.length, 'products');

  return (
    <section className="relative py-6 overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-red-700">
      {/* Dynamic animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(239,68,68,0.3),transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(251,146,60,0.3),transparent_70%)] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_90%,rgba(254,215,170,0.2),transparent_60%)] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce opacity-60"
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
        {/* Header avec focus sur les promos */}
        <div className="text-center mb-6">
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 mb-3 animate-pulse">
              🔥 SUPER PROMOS EN COURS 🔥
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-red-400/20 blur-lg rounded-lg"></div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-bounce shadow-xl">
              <Timer className="animate-spin" size={16} />
              <span>JUSQU'À -70% DE RÉDUCTION</span>
              <Zap size={16} />
            </div>
          </div>
          
          <p className="text-yellow-200 text-lg font-medium">
            Découvrez nos articles en promotion avec des remises exceptionnelles !
          </p>
        </div>

        {/* Carrousel de produits avec focus sur les promos */}
        <div className="relative max-w-6xl mx-auto">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-hidden scrollbar-hide"
            style={{ scrollBehavior: 'auto' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Dupliquer les produits pour un défilement infini */}
            {[...featuredProducts, ...featuredProducts].map((product, index) => {
              // Calculer le prix pour les points Ya Ba Boss
              const productPrice = parseInt(product.oldPrice?.replace(/\s/g, '') || product.price.replace(/\s/g, '')) || 0;
              const loyaltyPoints = calculateAndFormatLoyaltyPoints(productPrice);
              
              // Simuler des images multiples et vidéo pour le produit (en production, cela viendrait des données)
              const productImages = [
                product.url,
                // Ajouter des variations d'images simulées
                product.url.replace('?w=300', '?w=301'),
                product.url.replace('?w=300', '?w=302'),
              ];
              const productVideoUrl = Math.random() > 0.7 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined;
              
              return (
                <div
                  key={`${product.id}-${index}`}
                  className="group relative flex-shrink-0 transform transition-all duration-500 hover:scale-105"
                  style={{ width: '220px' }} // Largeur fixe pour toutes les cartes
                >
                  {/* Product card avec hauteur réduite */}
                  <div 
                    className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer animate-fade-in h-72"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Gradient border */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${product.color} p-0.5 rounded-xl`}>
                      <div className="bg-white rounded-lg h-full"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-3 h-full flex flex-col">
                      {/* Badges avec mise en évidence des promos */}
                      <div className="flex justify-between items-start mb-2">
                        {product.discount && (
                          <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-black px-3 py-1 animate-pulse shadow-lg border-2 border-yellow-400">
                            -{product.discount}% OFF
                          </Badge>
                        )}
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-0.5">
                          {product.badge}
                        </Badge>
                      </div>

                      {/* Image cyclique avec hauteur réduite */}
                      <ProductMediaCycler 
                        images={productImages}
                        videoUrl={productVideoUrl}
                        title={product.title}
                      />

                      {/* Product info */}
                      <div className="flex-grow flex flex-col justify-between">
                        {/* Titre avec ellipsis sur une seule ligne */}
                        <h3 className="font-bold text-sm text-gray-800 mb-2 truncate leading-tight" title={product.title}>
                          {product.title}
                        </h3>
                        
                        {/* Prix avec mise en évidence des économies - AMÉLIORÉ */}
                        <div className="flex flex-col mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-red-600 text-lg">
                              {product.price} F
                            </span>
                            {product.discount && (
                              <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                -{product.discount}%
                              </div>
                            )}
                          </div>
                          {product.oldPrice && (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-gray-400 line-through font-medium">
                                Avant: {product.oldPrice} F
                              </span>
                              <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                                💰 Économie: {parseInt(product.oldPrice.replace(/\s/g, '')) - parseInt(product.price.replace(/\s/g, ''))} F
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <ProductCardRating productId={product.id} showCount={false} size="sm" />
                          </div>
                        </div>

                        {/* Points Ya Ba Boss */}
                        <div className="mt-auto flex items-center justify-center">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Crown size={10} />
                            <span>+{loyaltyPoints} pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating discount indicator pour les promos - AMÉLIORÉ */}
                  {product.discount && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center text-xs font-black animate-bounce shadow-xl border-3 border-yellow-400">
                      <span className="text-xs">-{product.discount}%</span>
                      <span className="text-[10px]">OFF</span>
                    </div>
                  )}

                  {/* Floating heart */}
                  <div className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Heart className="text-pink-400 animate-bounce" size={12} fill="currentColor" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call-to-action avec focus promo */}
        <div className="text-center mt-6">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-black text-lg px-8 py-4 rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-xl relative"
            onClick={handleShopNow}
          >
            <Gift className="mr-2" size={20} />
            VOIR TOUTES LES PROMOS
            <ArrowRight className="ml-2 animate-bounce" size={20} />
          </Button>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <p className="text-yellow-200 text-sm font-medium">
              🎁 Jusqu'à -70% sur des milliers d'articles • Promos limitées dans le temps! 🎁
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshProducts}
              className="text-yellow-200 hover:text-white text-xs"
            >
              🔄 Actualiser
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersuasionBanner;
