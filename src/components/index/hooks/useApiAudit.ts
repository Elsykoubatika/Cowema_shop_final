
import { useMemo } from 'react';
import { Product } from '../../../data/products';

export const useApiAudit = (
  products: Product[],
  finalFilteredProducts: Product[],
  distributedProducts: any,
  activeCategory: string,
  categoriesData: any[],
  apiFilters: any,
  isLoading: boolean,
  isSyncing: boolean,
  error: string | null
) => {
  return useMemo(() => ({
    apiUrl: 'https://eu.cowema.org/api/public/products',
    currentFilters: apiFilters,
    categoriesAvailable: categoriesData.length,
    lastSyncAttempt: new Date().toISOString(),
    dataQuality: {
      totalProducts: products.length,
      yaBaBossCount: distributedProducts.yaBaBossProducts.length,
      generalCount: distributedProducts.generalProducts.length,
      categoryCoverage: Array.from(new Set(products.map(p => p.category))).filter(Boolean).length,
      imageQuality: {
        averageImagesPerProduct: finalFilteredProducts.reduce((acc, p) => acc + p.images.length, 0) / (finalFilteredProducts.length || 1),
        productsWithValidImages: finalFilteredProducts.filter(p => 
          p.images.length > 1 || (p.images.length === 1 && !p.images[0].includes('placeholder'))
        ).length
      }
    },
    categoryMapping: categoriesData.map(cat => ({
      id: cat.id,
      name: cat.name,
      products_count: cat.products_count,
      isActive: activeCategory === cat.name
    }))
  }), [
    products,
    finalFilteredProducts,
    distributedProducts,
    activeCategory,
    categoriesData,
    apiFilters,
    isLoading,
    isSyncing,
    error
  ]);
};
