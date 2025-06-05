
import { ProductCache } from '@/types/productCache';

export const filterProductsByCategory = (products: ProductCache[], category: string): ProductCache[] => {
  return products.filter(product => 
    product.category?.toLowerCase() === category.toLowerCase()
  );
};

export const filterYaBaBossProducts = (products: ProductCache[]): ProductCache[] => {
  return products.filter(product => product.isYaBaBoss);
};

export const filterFlashOfferProducts = (products: ProductCache[]): ProductCache[] => {
  return products.filter(product => product.isFlashOffer);
};

export const searchProducts = (products: ProductCache[], query: string): ProductCache[] => {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description?.toLowerCase().includes(searchTerm) ||
    product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    product.category?.toLowerCase().includes(searchTerm) ||
    product.supplierName?.toLowerCase().includes(searchTerm)
  );
};
