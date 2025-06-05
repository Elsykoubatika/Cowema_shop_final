
import { useMemo } from 'react';
import { Product } from '@/types/product';

interface UseOptimizedRecommendationsProps {
  currentProduct: Product;
  allProducts: Product[];
  maxRecommendations: number;
}

export const useOptimizedRecommendations = ({
  currentProduct,
  allProducts,
  maxRecommendations
}: UseOptimizedRecommendationsProps) => {
  const recommendations = useMemo(() => {
    if (!currentProduct || !allProducts?.length) {
      return [];
    }

    // Stable filtering and sorting to prevent constant recalculation
    const filtered = allProducts
      .filter(p => p.id !== currentProduct.id)
      .filter(p => p.category === currentProduct.category || p.isYaBaBoss)
      .sort((a, b) => {
        // Prioritize YaBaBoss products
        if (a.isYaBaBoss && !b.isYaBaBoss) return -1;
        if (!a.isYaBaBoss && b.isYaBaBoss) return 1;
        
        // Then by price similarity
        const currentPrice = currentProduct.promoPrice || currentProduct.price;
        const aDiff = Math.abs((a.promoPrice || a.price) - currentPrice);
        const bDiff = Math.abs((b.promoPrice || b.price) - currentPrice);
        return aDiff - bDiff;
      })
      .slice(0, maxRecommendations);

    return filtered;
  }, [currentProduct.id, currentProduct.category, currentProduct.price, currentProduct.promoPrice, allProducts, maxRecommendations]);

  const hasRecommendations = recommendations.length > 0;

  return {
    recommendations,
    hasRecommendations
  };
};
