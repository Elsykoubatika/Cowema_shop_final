import { useState } from 'react';
import { Product } from '../data/products';
import { UnifiedCartItem } from '../cart/types/cart.types';
import { ProductRecommender } from '../utils/ProductRecommender';

export const useProductRecommendations = () => {
  const [frequentlyBoughtProducts, setFrequentlyBoughtProducts] = useState<Product[]>([]);
  const [recommendedUpsellProducts, setRecommendedUpsellProducts] = useState<Product[]>([]);
  
  // Generate recommendations for a given product
  const generateRecommendations = (product: Product | UnifiedCartItem, allProducts: Product[]) => {
    const recommender = new ProductRecommender();
    
    // Recommendations for "Articles similaires" - content-based
    const frequentlyBoughtScores = recommender.findSimilarProducts(
      product, 
      allProducts, 
      'frequently_bought'
    );
    
    // Recommendations for "Vous aimeriez ceci" - collaborative filtering
    const checkoutUpsellScores = recommender.findSimilarProducts(
      product,
      allProducts,
      'checkout_upsell'
    );
    
    // Filter out products that appear in both lists to ensure uniqueness
    const similarProductIds = new Set(frequentlyBoughtScores.slice(0, 15).map(item => item.product.id));
    const filteredUpsellScores = checkoutUpsellScores.filter(item => !similarProductIds.has(item.product.id));
    
    // Set larger result sets
    setFrequentlyBoughtProducts(frequentlyBoughtScores.slice(0, 15).map(item => item.product));
    setRecommendedUpsellProducts(filteredUpsellScores.slice(0, 15).map(item => item.product));
  };
  
  // Get products frequently bought together with pagination support
  const getFrequentlyBoughtTogether = (product: Product, allProducts: Product[], limit: number = 30): Product[] => {
    const recommender = new ProductRecommender();
    const scores = recommender.findSimilarProducts(product, allProducts, 'frequently_bought');
    return scores.slice(0, limit).map(item => item.product);
  };
  
  // Get recommended products for checkout upsell with pagination support
  const getCheckoutUpsellProducts = (product: Product, allProducts: Product[], limit: number = 30): Product[] => {
    const recommender = new ProductRecommender();
    const upsellScores = recommender.findSimilarProducts(product, allProducts, 'checkout_upsell');
    
    // Get similar products to filter them out
    const similarScores = recommender.findSimilarProducts(product, allProducts, 'frequently_bought');
    const similarProductIds = new Set(similarScores.slice(0, 15).map(item => item.product.id));
    
    // Filter out products that appear in similar products
    const filteredScores = upsellScores.filter(item => !similarProductIds.has(item.product.id));
    
    return filteredScores.slice(0, limit).map(item => item.product);
  };

  return {
    frequentlyBoughtProducts,
    recommendedUpsellProducts,
    generateRecommendations,
    getFrequentlyBoughtTogether,
    getCheckoutUpsellProducts
  };
};
