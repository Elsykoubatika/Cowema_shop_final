import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Play, Sun, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { useUnifiedCart } from '@/cart/components/CartProvider';
import { getYouTubeThumbnailUrl, isYouTubeUrl, formatYouTubeUrl } from '@/utils/videoUtils';
import { Product } from '@/types/product';

const SolarDemos: React.FC = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');
  const [visibleCount, setVisibleCount] = useState(6);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const { addItem } = useUnifiedCart();

  // Charger les produits solaires
  const { products, isLoading, error } = useHybridProducts({
    search: 'solaire',
    per_page: 100
  });

  // Enrichir les produits avec les extensions vidéo depuis localStorage
  const enrichedProducts = products.map(product => {
    try {
      const extensionsData = localStorage.getItem('productExtensions');
      const extensions = extensionsData ? JSON.parse(extensionsData) : {};
      
      let productExtension = null;
      const productIdAsString = product.id;
      const productIdAsNumber = parseInt(product.id);
      const externalIdAsString = product.externalApiId;
      const externalIdAsNumber = product.externalApiId ? parseInt(product.externalApiId) : null;
      
      if (extensions[productIdAsString]) {
        productExtension = extensions[productIdAsString];
      } else if (extensions[productIdAsNumber]) {
        productExtension = extensions[productIdAsNumber];
      } else if (externalIdAsString && extensions[externalIdAsString]) {
        productExtension = extensions[externalIdAsString];
      } else if (externalIdAsNumber && extensions[externalIdAsNumber]) {
        productExtension = extensions[externalIdAsNumber];
      }
      
      return {
        ...product,
        videoUrl: productExtension?.videoUrl || product.videoUrl || ''
      };
    } catch (error) {
      console.error('Error enriching product with extensions:', error);
      return product;
    }
  });

  // Filtrer les produits solaires avec vidéos
  const solarProductsWithVideos = enrichedProducts.filter(product => {
    const isSolar = product.category?.toLowerCase().includes('solaire') ||
                   product.name?.toLowerCase().includes('solaire') ||
                   product.description?.toLowerCase().includes('solaire') ||
                   product.keywords?.some(keyword => keyword.toLowerCase().includes('solaire'));
    
    const hasVideo = product.videoUrl && 
                    product.videoUrl.trim() !== '' && 
                    isYouTubeUrl(product.videoUrl);
    
    return isSolar && hasVideo;
  });

  // Trier les produits
  const sortedProducts = [...solarProductsWithVideos].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.promoPrice || a.price) - (b.promoPrice || b.price);
      case 'newest':
        return 0;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, sortedProducts.length));
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      ...product,
      title: product.name
    });
  };

  const handleVideoPlay = (productId: string) => {
    setPlayingVideos(prev => new Set([...prev, productId]));
  };

  const handleVideoStop = (productId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  // Nouvelle fonction pour naviguer vers les détails du produit
  const handleProductImageClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  console.log('🎬 Solar Demos Page - Products with videos:', solarProductsWithVideos.length);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Démonstrations Produits Solaires - Vidéos & Tutoriels | Cowema</title>
        <meta name="description" content="Découvrez nos produits solaires en action avec des démonstrations vidéo détaillées. Tutoriels, installations et guides pratiques." />
        <meta name="keywords" content="démonstrations solaires, vidéos solaires, tutoriels énergie solaire, installation panneaux solaires" />
      </Helmet>

      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-blue-600 to-green-600 text-white">
          <div className="container-cowema">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/solaire')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft size={16} className="mr-2" />
                Retour à la page solaire
              </Button>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium mb-4">
                <Play size={16} />
                <span>DÉMONSTRATIONS VIDÉO</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Produits Solaires en Action
              </h1>
              
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">
                Découvrez tous nos produits solaires avec des démonstrations vidéo détaillées. 
                Apprenez à installer, utiliser et optimiser vos équipements solaires.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{solarProductsWithVideos.length}</div>
                  <div className="text-blue-100 text-sm">Produits avec vidéo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">HD</div>
                  <div className="text-blue-100 text-sm">Qualité vidéo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-blue-100 text-sm">Tutoriels gratuits</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-white border-b">
          <div className="container-cowema">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Trier par :</span>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('name')}
                  >
                    Nom
                  </Button>
                  <Button
                    variant={sortBy === 'price' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('price')}
                  >
                    Prix
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Play size={16} className="text-blue-600" />
                <span>{solarProductsWithVideos.length} produits avec démonstration</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products with Demos */}
        <section className="py-12">
          <div className="container-cowema">
            {isLoading && visibleProducts.length === 0 ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                ))}
              </div>
            ) : visibleProducts.length > 0 ? (
              <>
                <div className="space-y-12">
                  {visibleProducts.map((product, index) => {
                    const videoThumbnail = getYouTubeThumbnailUrl(product.videoUrl || '');
                    const isVideoPlaying = playingVideos.has(product.id);
                    const embedUrl = formatYouTubeUrl(product.videoUrl || '');
                    
                    return (
                      <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12`}>
                        {/* Product Card */}
                        <div className="flex-1">
                          <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative">
                              {/* Product Image */}
                              <div 
                                className="aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
                                onClick={() => handleProductImageClick(product.id)}
                                title="Cliquer pour voir les détails du produit"
                              >
                                {product.images?.[0] ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Sun className="text-gray-400" size={64} />
                                  </div>
                                )}
                              </div>

                              {/* Badges */}
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-yellow-500 text-black font-bold shadow-lg">
                                  <Sun size={12} className="mr-1" />
                                  SOLAIRE
                                </Badge>
                                {product.isYaBaBoss && (
                                  <Badge className="bg-red-500 text-white font-bold shadow-lg">
                                    YA BA BOSS
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {product.name}
                              </h3>
                              
                              {product.description && (
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                  {product.description}
                                </p>
                              )}

                              {/* Price */}
                              <div className="flex items-baseline gap-2 mb-6">
                                {product.promoPrice ? (
                                  <>
                                    <span className="text-2xl font-black text-green-600">
                                      {product.promoPrice.toLocaleString()} FCFA
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                      {product.price.toLocaleString()} FCFA
                                    </span>
                                    <Badge className="bg-red-100 text-red-700">
                                      -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                                    </Badge>
                                  </>
                                ) : (
                                  <span className="text-2xl font-black text-green-600">
                                    {product.price.toLocaleString()} FCFA
                                  </span>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-3">
                                <Button 
                                  onClick={() => handleAddToCart(product)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  Ajouter au panier
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => navigate(`/product/${product.id}`)}
                                  className="hover:bg-gray-50"
                                >
                                  <ExternalLink size={16} className="mr-2" />
                                  Détails
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </div>

                        {/* Video Demo */}
                        <div className="flex-1">
                          <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative">
                              <div className="aspect-[4/3] bg-gray-900 overflow-hidden">
                                {isVideoPlaying ? (
                                  <iframe
                                    src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                                    title={`Démonstration ${product.name}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                  />
                                ) : (
                                  <div 
                                    className="relative cursor-pointer group w-full h-full" 
                                    onClick={() => handleVideoPlay(product.id)}
                                  >
                                    {videoThumbnail ? (
                                      <img 
                                        src={videoThumbnail}
                                        alt={`Démonstration ${product.name}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <Play className="w-16 h-16 text-white/70" />
                                      </div>
                                    )}

                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
                                      <div className="bg-white/95 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                                        <Play className="w-12 h-12 text-red-600 ml-1" fill="currentColor" />
                                      </div>
                                    </div>

                                    {/* Video badge */}
                                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                      <Play size={12} className="mr-1" fill="currentColor" />
                                      DÉMO
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Stop video button when playing */}
                              {isVideoPlaying && (
                                <button
                                  onClick={() => handleVideoStop(product.id)}
                                  className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-black/90 transition-colors"
                                >
                                  ✕ Fermer
                                </button>
                              )}
                            </div>

                            <div className="p-6">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">
                                Démonstration : {product.name}
                              </h4>
                              <p className="text-gray-600 mb-4">
                                Découvrez comment installer et utiliser ce produit solaire avec notre guide vidéo détaillé.
                              </p>
                              
                              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  ⏱️ Tutoriel complet
                                </span>
                                <span className="flex items-center gap-1">
                                  📱 Qualité HD
                                </span>
                                <span className="flex items-center gap-1">
                                  🎯 Guide pratique
                                </span>
                              </div>

                              {!isVideoPlaying ? (
                                <Button 
                                  onClick={() => handleVideoPlay(product.id)}
                                  className="w-full mt-4 bg-red-600 hover:bg-red-700"
                                >
                                  <Play size={16} className="mr-2" />
                                  Regarder la démonstration
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => handleVideoStop(product.id)}
                                  variant="outline"
                                  className="w-full mt-4 border-red-600 text-red-600 hover:bg-red-50"
                                >
                                  Arrêter la vidéo
                                </Button>
                              )}
                            </div>
                          </Card>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button 
                      onClick={loadMore}
                      disabled={isLoading}
                      size="lg"
                      className="px-8"
                    >
                      {isLoading ? 'Chargement...' : `Voir plus (${sortedProducts.length - visibleCount} restants)`}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">🎬</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Aucune démonstration trouvée
                </h3>
                <p className="text-gray-600 mb-8">
                  Nos démonstrations vidéo arrivent bientôt. Revenez plus tard !
                </p>
                <Button onClick={() => navigate('/solaire')} variant="outline">
                  Retour aux produits solaires
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SolarDemos;
