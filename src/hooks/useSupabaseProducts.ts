import { useState, useEffect, useCallback } from 'react';
import { ProductCache } from '@/types/productCache';
import { fetchProductsFromCache, upsertProductInCache } from '@/services/productCacheService';
import { 
  filterProductsByCategory, 
  filterYaBaBossProducts, 
  filterFlashOfferProducts,
} from '@/utils/productCacheFilters';
import { removeDiacritics } from '@/utils/stringUtils';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<ProductCache[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products using the optimized active_products view
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const formattedProducts = await fetchProductsFromCache();
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add or update product in cache with better error handling
  const upsertProduct = useCallback(async (
    productData: Omit<ProductCache, 'id' | 'createdAt' | 'updatedAt' | 'lastSync'>
  ): Promise<ProductCache | null> => {
    const newProduct = await upsertProductInCache(productData);
    
    if (newProduct) {
      // Update local state efficiently
      setProducts(prev => {
        const existingIndex = prev.findIndex(p => p.externalApiId === newProduct.externalApiId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newProduct;
          return updated;
        } else {
          return [newProduct, ...prev];
        }
      });
    }
    
    return newProduct;
  }, []);

  // Optimized filtering functions
  const getProductsByCategory = useCallback((category: string): ProductCache[] => {
    return filterProductsByCategory(products, category);
  }, [products]);

  const getYaBaBossProducts = useCallback((): ProductCache[] => {
    return filterYaBaBossProducts(products);
  }, [products]);

  const getFlashOfferProducts = useCallback((): ProductCache[] => {
    return filterFlashOfferProducts(products);
  }, [products]);

  // Enhanced search function with grammar error tolerance
  const searchProductsCallback = useCallback((query: string): ProductCache[] => {
    if (!query.trim()) return products;
    
    const normalizeText = (text: string): string => {
      if (!text) return '';
      return removeDiacritics(text)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    };

    const containsSimilarWords = (text: string, searchTerm: string): boolean => {
      const normalizedText = normalizeText(text);
      const normalizedSearch = normalizeText(searchTerm);
      
      // Exact match after normalization
      if (normalizedText.includes(normalizedSearch)) {
        return true;
      }
      
      // Word-by-word search
      const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
      const textWords = normalizedText.split(' ').filter(word => word.length > 0);
      
      // All search words must be found in the text
      return searchWords.every(searchWord => 
        textWords.some(textWord => 
          textWord.includes(searchWord) || 
          searchWord.includes(textWord) ||
          // Basic similarity for simple typos
          (Math.abs(textWord.length - searchWord.length) <= 2 && 
           textWord.substring(0, 3) === searchWord.substring(0, 3))
        )
      );
    };
    
    return products.filter(product => {
      const searchTerm = query.trim();
      
      return containsSimilarWords(product.name || '', searchTerm) ||
             containsSimilarWords(product.description || '', searchTerm) ||
             (product.keywords && product.keywords.some(keyword => 
               containsSimilarWords(keyword, searchTerm)
             )) ||
             containsSimilarWords(product.category || '', searchTerm) ||
             containsSimilarWords(product.supplierName || '', searchTerm);
    });
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    upsertProduct,
    getProductsByCategory,
    getYaBaBossProducts,
    getFlashOfferProducts,
    searchProducts: searchProductsCallback,
    refetch: fetchProducts
  };
};
