
import { useEffect } from 'react';
import { Product } from '../../../data/products';

export const useResultsAudit = (
  finalFilteredProducts: Product[],
  products: Product[],
  distributedProducts: any,
  activeCategory: string,
  apiFilters: any,
  isLoading: boolean,
  isSyncing: boolean,
  error: string | null
) => {
  // Audit final des résultats avec focus sur les images
  useEffect(() => {
    const imageAudit = finalFilteredProducts.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name.substring(0, 30),
      category: product.category,
      imageCount: product.images.length,
      hasValidImages: product.images.length > 1 || 
                     (product.images.length === 1 && !product.images[0].includes('placeholder')),
      firstImage: product.images[0]?.substring(0, 50) + '...'
    }));

    console.log('📊 Final Results Audit - Complete:', {
      activeCategory: activeCategory || 'Tous',
      totalProducts: products.length,
      finalFiltered: finalFilteredProducts.length,
      yaBaBoss: distributedProducts.yaBaBossProducts.length,
      general: distributedProducts.generalProducts.length,
      apiFilters,
      apiStatus: {
        isLoading,
        isSyncing,
        hasError: !!error,
        errorMessage: error
      },
      categoryStats: {
        uniqueCategories: Array.from(new Set(products.map(p => p.category))).filter(Boolean).length,
        categoryBreakdown: finalFilteredProducts.reduce((acc, p) => {
          const cat = p.category || 'Non catégorisé';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      imageQualityAudit: {
        sampleProducts: imageAudit,
        averageImagesPerProduct: finalFilteredProducts.reduce((acc, p) => acc + p.images.length, 0) / finalFilteredProducts.length,
        productsWithMultipleImages: finalFilteredProducts.filter(p => p.images.length > 1).length,
        productsWithPlaceholder: finalFilteredProducts.filter(p => p.images.some(img => img.includes('placeholder'))).length
      },
      timestamp: new Date().toISOString()
    });
  }, [activeCategory, products.length, finalFilteredProducts.length, distributedProducts, isLoading, isSyncing, error]);
};
