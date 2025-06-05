
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabaseProducts } from './useSupabaseProducts';
import { Product } from '../data/products';
import { ApiFilters } from './hybrid-products/types';
import { useApiManager } from './hybrid-products/apiManager';
import { useSearchManager } from './hybrid-products/searchManager';

export const useHybridProducts = (apiFilters: ApiFilters = {}) => {
  const {
    products: supabaseProducts,
    isLoading: isLoadingSupabase,
    getProductsByCategory,
    getYaBaBossProducts,
    getFlashOfferProducts,
    searchProducts: searchSupabaseProducts,
    refetch: refetchSupabase
  } = useSupabaseProducts();

  const {
    apiProducts,
    isLoadingAPI,
    apiError,
    pagination,
    fetchFromAPI,
    canMakeApiCall
  } = useApiManager(apiFilters);

  const { searchProducts: searchProductsFunction } = useSearchManager();

  const triggerSync = useCallback(async (filters?: ApiFilters) => {
    console.log('🔄 Manual sync triggered');
    return await fetchFromAPI();
  }, [fetchFromAPI]);

  const refetch = useCallback(async () => {
    await refetchSupabase();
    return await fetchFromAPI();
  }, [refetchSupabase, fetchFromAPI]);

  useEffect(() => {
    console.log('🚀 Initial API fetch with filters:', apiFilters);
    
    const timer = setTimeout(() => {
      fetchFromAPI();
    }, 100);

    return () => clearTimeout(timer);
  }, [JSON.stringify(apiFilters)]);

  const products = useMemo(() => {
    if (apiProducts.length > 0) {
      return apiProducts;
    }
    
    return supabaseProducts;
  }, [supabaseProducts, apiProducts]);

  const isLoading = isLoadingSupabase || isLoadingAPI;
  const error = apiError && products.length === 0 ? apiError : null;

  const searchProducts = useCallback((query: string): Product[] => {
    const supabaseResults = searchSupabaseProducts(query);
    const apiResults = searchProductsFunction(apiProducts, query);
    
    const resultMap = new Map<string, Product>();
    [...supabaseResults, ...apiResults].forEach(product => {
      resultMap.set(product.id, product);
    });
    
    return Array.from(resultMap.values());
  }, [searchSupabaseProducts, apiProducts, searchProductsFunction]);

  return {
    products,
    isLoading,
    error,
    pagination,
    getProductsByCategory,
    getYaBaBossProducts,
    getFlashOfferProducts,
    searchProducts,
    refreshAPI: fetchFromAPI,
    canRefreshAPI: canMakeApiCall,
    apiProductsCount: apiProducts.length,
    supabaseProductsCount: supabaseProducts.length,
    triggerSync,
    refetch,
    isSyncing: isLoadingAPI
  };
};
