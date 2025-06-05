
import React from 'react';
import { Product } from '@/types/product';
import { useSolarProductsWithDemo } from './hooks/useSolarProductsWithDemo';
import SolarDemoHeader from './components/SolarDemoHeader';
import SolarDemoProductCard from './components/SolarDemoProductCard';
import SolarDemoVideoCard from './components/SolarDemoVideoCard';
import SolarDemoCallToAction from './components/SolarDemoCallToAction';

interface SolarProductsWithDemoProps {
  products: Product[];
}

const SolarProductsWithDemo: React.FC<SolarProductsWithDemoProps> = ({ products }) => {
  const {
    productsWithVideos,
    playingVideos,
    isLoading,
    handleAddToCart,
    handleVideoPlay,
    handleVideoStop,
    handleProductImageClick,
    navigate
  } = useSolarProductsWithDemo(products);

  console.log('🌞 SolarProductsWithDemo:', {
    inputProducts: products.length,
    productsWithVideos: productsWithVideos.length,
    isLoading
  });

  // Afficher un indicateur de chargement pendant que les extensions se chargent
  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container-cowema">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des démonstrations vidéo...</p>
          </div>
        </div>
      </section>
    );
  }

  // Si aucun produit avec vidéo n'est trouvé, ne pas afficher la section
  if (productsWithVideos.length === 0) {
    // En mode développement, afficher un message discret
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️ Aucun produit solaire avec vidéo trouvé pour la démonstration');
    }
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container-cowema">
        {/* Header */}
        <SolarDemoHeader productsCount={productsWithVideos.length} />

        {/* Products with demos grid */}
        <div className="grid gap-6 max-w-5xl mx-auto mb-8">
          {productsWithVideos.slice(0, 3).map((product, index) => {
            const isVideoPlaying = playingVideos.has(product.id);
            
            return (
              <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-4 lg:gap-6`}>
                {/* Product Card */}
                <div className="flex-1">
                  <SolarDemoProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onProductImageClick={handleProductImageClick}
                    onViewDetails={(productId) => navigate(`/product/${productId}`)}
                  />
                </div>

                {/* Demo Video */}
                <div className="flex-1">
                  <SolarDemoVideoCard
                    product={product}
                    isPlaying={isVideoPlaying}
                    onPlay={handleVideoPlay}
                    onStop={handleVideoStop}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <SolarDemoCallToAction
          productsCount={productsWithVideos.length}
          onNavigate={() => navigate('/solar-demos')}
        />
      </div>
    </section>
  );
};

export default SolarProductsWithDemo;
