
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedCart } from '@/cart/components/CartProvider';
import { Product } from '@/types/product';
import { isYouTubeUrl } from '@/utils/videoUtils';
import { getAllProductExtensions } from '@/services/productExtensionsService';

export const useSolarProductsWithDemo = (products: Product[]) => {
  const navigate = useNavigate();
  const { addItem } = useUnifiedCart();
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [enrichedProducts, setEnrichedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les extensions depuis Supabase
  useEffect(() => {
    const loadProductExtensions = async () => {
      try {
        setIsLoading(true);
        
        const extensions = await getAllProductExtensions();
        
        // Enrichir les produits avec les extensions depuis Supabase
        const enriched = products.map(product => {
          const productId = product.id?.toString();
          const externalId = product.externalApiId?.toString();
          
          let productExtension = null;
          
          // Chercher l'extension par différentes clés
          if (productId && extensions[productId]) {
            productExtension = extensions[productId];
          } else if (externalId && extensions[externalId]) {
            productExtension = extensions[externalId];
          }
          
          return {
            ...product,
            videoUrl: productExtension?.video_url || product.videoUrl || '',
            isYaBaBoss: productExtension?.is_ya_ba_boss !== undefined ? productExtension.is_ya_ba_boss : product.isYaBaBoss,
            isFlashOffer: productExtension?.is_flash_offer !== undefined ? productExtension.is_flash_offer : product.isFlashOffer,
            isActive: productExtension?.is_active !== undefined ? productExtension.is_active : product.isActive
          };
        });

        setEnrichedProducts(enriched);
        
      } catch (error) {
        console.error('❌ Error loading product extensions:', error);
        // Fallback vers les produits originaux
        setEnrichedProducts(products);
      } finally {
        setIsLoading(false);
      }
    };

    if (products.length > 0) {
      loadProductExtensions();
    } else {
      setEnrichedProducts([]);
      setIsLoading(false);
    }
  }, [products]);

  // Filtrer uniquement les produits avec des vidéos YouTube valides
  const productsWithVideos = enrichedProducts.filter(product => {
    const hasVideoUrl = product.videoUrl && product.videoUrl.trim() !== '';
    const isValidYouTube = hasVideoUrl && isYouTubeUrl(product.videoUrl);
    return isValidYouTube;
  });

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

  const handleProductImageClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return {
    productsWithVideos,
    playingVideos,
    isLoading,
    handleAddToCart,
    handleVideoPlay,
    handleVideoStop,
    handleProductImageClick,
    navigate
  };
};
