
import { useMemo } from 'react';
import { Product } from '@/types/product';
import { SmartProductRecommender } from '@/utils/SmartProductRecommender';

interface UseSmartRecommendationsProps {
  currentProduct: Product;
  allProducts: Product[];
  maxRecommendations?: number;
}

export const useSmartRecommendations = ({
  currentProduct,
  allProducts,
  maxRecommendations = 3
}: UseSmartRecommendationsProps) => {
  const recommender = useMemo(() => new SmartProductRecommender(), []);
  
  const recommendations = useMemo(() => {
    if (!currentProduct || !allProducts.length) return [];
    
    return recommender.getRecommendations(
      currentProduct,
      allProducts,
      maxRecommendations
    );
  }, [currentProduct, allProducts, maxRecommendations, recommender]);
  
  const diverseRecommendations = useMemo(() => {
    if (!currentProduct || !allProducts.length) return [];
    
    return recommender.getDiverseRecommendations(
      currentProduct,
      allProducts,
      maxRecommendations
    );
  }, [currentProduct, allProducts, maxRecommendations, recommender]);
  
  return {
    recommendations,
    diverseRecommendations,
    hasRecommendations: recommendations.length > 0
  };
};
