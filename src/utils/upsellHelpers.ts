
import { Product } from '../data/products';
import { UnifiedCartItem } from '../cart/types/cart.types';
import { ProductRecommender } from './ProductRecommender';

// Get product title for upsell based on category
export const getUpsellProductTitle = (category?: string): string => {
  const categoryMap: Record<string, string> = {
    "phones": "ÉCOUTEURS BLUETOOTH PREMIUM",
    "computers": "CLAVIER MÉCANIQUE RÉTROÉCLAIRÉ",
    "electronics": "BATTERIE EXTERNE 20000MAH",
    "fashion": "ENSEMBLE ACCESSOIRES LUXE",
    "beauty": "COFFRET SOINS PREMIUM",
    "default": "PRODUIT PREMIUM COMPLÉMENTAIRE"
  };
  
  return categoryMap[category || 'default'] || categoryMap.default;
};

// Determine if a product is a good candidate for upsell
export const isGoodUpsellCandidate = (product: Product, mainProduct: Product | UnifiedCartItem): boolean => {
  const recommender = new ProductRecommender();
  const score = recommender.findSimilarProducts(mainProduct, [product], 'checkout_upsell')[0]?.score || 0;
  return score > 0.5; // Relevance threshold
};

// Generate post-purchase upsell message for WhatsApp
export const getPostPurchaseUpsellMessage = (product: Product, discount: number, customerName: string = ''): string => {
  const name = customerName || '';
  const greeting = name ? `${name}, m` : 'M';
  
  return `Merci pour votre commande ! 🎁 OFFRE EXCLUSIVE : ${getUpsellProductTitle(product.category)} à -${discount}% juste pour vous aujourd'hui. Dites 'OUI' pour l'ajouter !`;
};
