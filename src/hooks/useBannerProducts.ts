
import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { bannerProductScoring } from '@/services/bannerProductScoring';

interface UseBannerProductsOptions {
  products: Product[];
  count?: number;
  refreshInterval?: number; // en millisecondes
  maxPrice?: number; // nouveau
  genderBalance?: boolean; // nouveau
}

interface BannerProductData {
  id: string;
  url: string;
  title: string;
  price: string;
  oldPrice?: string;
  discount?: number;
  badge: string;
  color: string;
}

export const useBannerProducts = ({ 
  products, 
  count = 4, 
  refreshInterval = 30000, // 30 secondes par défaut
  maxPrice = 1500000, // 1.5M FCFA par défaut
  genderBalance = true // équilibrage activé par défaut
}: UseBannerProductsOptions) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Couleurs pour les badges des produits
  const badgeColors = [
    'from-pink-500 to-rose-500',
    'from-orange-500 to-red-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-amber-500'
  ];

  // Badges possibles basés sur les caractéristiques du produit
  const getBadgeForProduct = (product: Product): string => {
    if (product.isFlashOffer) return 'FLASH';
    if (product.isYaBaBoss) return 'TOP';
    if (product.promoPrice && product.promoPrice < product.price) return 'PROMO';
    if (product.stock <= 5) return 'RARE';
    if (parseInt(product.id) > 800) return 'NEW'; // Simulation "nouveau"
    return 'HOT';
  };

  // Sélection intelligente des produits avec nouvelles options
  const selectBannerProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    console.log(`🔄 Selecting ${count} banner products from ${products.length} available products`);
    return bannerProductScoring.selectBannerProducts(products, count, {
      maxPrice,
      genderBalance,
      diversityWeight: 0.15,
      priceWeight: 0.10
    });
  }, [products, count, lastRefresh, maxPrice, genderBalance]);

  // Conversion vers le format attendu par la banner
  const featuredProducts: BannerProductData[] = useMemo(() => {
    return selectedProducts.map((product, index) => {
      const hasPromo = product.promoPrice && product.promoPrice < product.price;
      const discount = hasPromo 
        ? Math.round(((product.price - (product.promoPrice || product.price)) / product.price) * 100)
        : 0;

      return {
        id: product.id,
        url: product.images?.[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
        title: product.name || product.title || 'Produit',
        price: (hasPromo ? product.promoPrice! : product.price).toLocaleString(),
        oldPrice: hasPromo ? product.price.toLocaleString() : undefined,
        discount: discount > 0 ? discount : undefined,
        badge: getBadgeForProduct(product),
        color: badgeColors[index % badgeColors.length]
      };
    });
  }, [selectedProducts]);

  // Effet pour mettre à jour la sélection
  useEffect(() => {
    if (products && products.length > 0) {
      const newSelection = selectBannerProducts;
      setSelectedProducts(newSelection);
      console.log('✅ Banner products updated:', newSelection.length);
    }
  }, [selectBannerProducts]);

  // Effet pour le rafraîchissement automatique
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing banner products');
        setLastRefresh(new Date());
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  // Fonction pour forcer le rafraîchissement
  const refreshProducts = () => {
    console.log('🔄 Manual refresh of banner products');
    setLastRefresh(new Date());
  };

  // Fonction pour obtenir des statistiques de debug améliorées
  const getDebugStats = () => {
    const basicStats = {
      totalProducts: products.length,
      selectedCount: selectedProducts.length,
      lastRefresh: lastRefresh.toLocaleTimeString(),
      maxPrice: maxPrice.toLocaleString(),
      genderBalance: genderBalance,
      hasYaBaBoss: selectedProducts.some(p => p.isYaBaBoss),
      hasFlashOffers: selectedProducts.some(p => p.isFlashOffer),
      hasPromos: selectedProducts.some(p => p.promoPrice && p.promoPrice < p.price)
    };

    const advancedStats = bannerProductScoring.getAdvancedStats(products);
    
    return {
      ...basicStats,
      ...advancedStats
    };
  };

  return {
    featuredProducts,
    selectedProducts,
    refreshProducts,
    getDebugStats,
    isLoading: products.length === 0,
    lastRefresh
  };
};
