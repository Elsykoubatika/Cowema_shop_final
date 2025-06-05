
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { ApiFilters, PaginationInfo } from './types';
import { fetchProductsFromAPI } from './apiClient';
import { transformProduct } from './productTransformer';
import { useProductEnrichment } from './productEnrichment';

export const useApiManager = (apiFilters: ApiFilters = {}) => {
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const { toast } = useToast();
  const { enrichProductsWithExtensions } = useProductEnrichment();

  const canMakeApiCall = useCallback(() => {
    const now = Date.now();
    return now - lastApiCall > 2000;
  }, [lastApiCall]);

  const fetchFromAPI = useCallback(async () => {
    if (!canMakeApiCall()) {
      console.log('Rate limiting: skipping API call (2 second cooldown)');
      return { success: false, error: 'Rate limited' };
    }

    try {
      setIsLoadingAPI(true);
      setApiError(null);
      setLastApiCall(Date.now());
      
      console.log('🌐 Making API call with filters:', apiFilters);
      
      const response = await fetchProductsFromAPI(apiFilters);
      
      if (response.error) {
        if (response.status === 429) {
          setApiError('Rate limit exceeded');
          toast({
            title: "Limite de requêtes atteinte",
            description: "Utilisation des données en cache. Réessai dans 2 secondes.",
            variant: "destructive",
            duration: 3000,
          });
          return { success: false, error: 'Rate limit exceeded' };
        }
        throw new Error(response.error);
      }
      
      if (response.data) {
        const transformed = response.data.map((apiProduct) => transformProduct(apiProduct));
        
        const enrichedProducts = await enrichProductsWithExtensions(transformed);
        setApiProducts(enrichedProducts);
        
        setPagination({
          currentPage: response.current_page || 1,
          totalPages: response.last_page || 1,
          total: response.total || transformed.length,
          hasNext: (response.current_page || 1) < (response.last_page || 1),
          hasPrev: (response.current_page || 1) > 1
        });
        
        console.log(`✅ Loaded ${enrichedProducts.length} products from API with extensions`);
        return { success: true, data: enrichedProducts };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching from API:', error);
      setApiError(error instanceof Error ? error.message : 'Unknown error');
      
      if (!error?.message?.includes('429')) {
        toast({
          title: "Erreur de chargement",
          description: "Utilisation des données locales disponibles.",
          variant: "destructive",
          duration: 3000,
        });
      }
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoadingAPI(false);
    }
  }, [canMakeApiCall, toast, apiFilters, enrichProductsWithExtensions]);

  return {
    apiProducts,
    isLoadingAPI,
    apiError,
    pagination,
    fetchFromAPI,
    canMakeApiCall
  };
};
