
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '../../../data/products';

export const useAutoSync = (
  products: Product[],
  isLoading: boolean,
  isSyncing: boolean,
  error: string | null,
  triggerSync: (filters?: any) => Promise<any>,
  apiFilters: any,
  activeCategory: string,
  categoriesData: any[]
) => {
  // Auto-trigger sync avec audit détaillé
  useEffect(() => {
    if (!isLoading && !isSyncing && products.length === 0 && !error) {
      console.log('🚀 Auto-Sync Trigger Audit:', {
        reason: 'No products found',
        filters: apiFilters,
        activeCategory,
        categoriesDataLength: categoriesData.length,
        timestamp: new Date().toISOString()
      });
      
      const timer = setTimeout(() => {
        triggerSync(apiFilters)
          .then((result) => {
            console.log('✅ Sync Success Audit:', {
              success: result.success,
              dataCount: result.data?.length || 0,
              activeCategory,
              filters: apiFilters,
              timestamp: new Date().toISOString()
            });
          })
          .catch((error) => {
            console.error('❌ Sync Failed Audit:', {
              error: error.message,
              activeCategory,
              filters: apiFilters,
              timestamp: new Date().toISOString()
            });
            toast.error('Erreur lors de la synchronisation des produits');
          });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [products.length, isLoading, isSyncing, triggerSync, error, JSON.stringify(apiFilters)]);
};
