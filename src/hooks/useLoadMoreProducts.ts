
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { useHybridProducts } from './useHybridProducts';

interface ApiFilters {
  search?: string;
  category?: number;
  city?: number;
  sort?: 'date' | 'price' | 'title';
  direction?: 'asc' | 'desc';
  per_page?: number;
}

export const useLoadMoreProducts = (filters: ApiFilters = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Enhanced filters with current page - force API call
  const enhancedFilters = {
    ...filters,
    per_page: 30,
    page: currentPage
  };

  console.log('🔍 useLoadMoreProducts filters:', enhancedFilters);

  // Use the hybrid hook with current page
  const { 
    products: pageProducts, 
    isLoading, 
    pagination,
    triggerSync,
    error 
  } = useHybridProducts(enhancedFilters);

  // Reset everything when filters change (except page)
  useEffect(() => {
    console.log('🔄 Filters changed, resetting pagination');
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [JSON.stringify({ ...filters, page: undefined, per_page: undefined })]);

  // Update products when new page data arrives
  useEffect(() => {
    console.log('📦 Page products received:', {
      products: pageProducts?.length || 0,
      currentPage,
      pagination
    });

    if (pageProducts && pageProducts.length > 0) {
      if (currentPage === 1) {
        // First page: replace all products
        setAllProducts(pageProducts);
        console.log('🔄 First page loaded:', {
          products: pageProducts.length,
          total: pagination.total
        });
      } else {
        // Subsequent pages: add to existing products (deduplicate)
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = pageProducts.filter(p => !existingIds.has(p.id));
          const updated = [...prev, ...newProducts];
          
          console.log('📄 Page loaded:', {
            page: currentPage,
            newProducts: newProducts.length,
            totalLoaded: updated.length,
            totalAvailable: pagination.total
          });
          
          return updated;
        });
      }
      setIsLoadingMore(false);
    }

    // Update hasMore based on pagination info
    const stillHasMore = pagination.hasNext && currentPage < pagination.totalPages;
    setHasMore(stillHasMore);
    
    console.log('✅ Pagination state updated:', {
      hasMore: stillHasMore,
      currentPage,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext
    });
    
  }, [pageProducts, currentPage, pagination]);

  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && currentPage < pagination.totalPages) {
      console.log('🚀 Loading more products...', {
        currentPage,
        totalPages: pagination.totalPages,
        currentlyLoaded: allProducts.length
      });
      
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoading, isLoadingMore, hasMore, currentPage, pagination.totalPages, allProducts.length]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages && page !== currentPage) {
      console.log('🎯 Going to page:', page);
      setCurrentPage(page);
      setIsLoadingMore(false);
      
      // For direct page navigation, we need to trigger a sync
      setTimeout(() => {
        triggerSync();
      }, 100);
    }
  }, [pagination.totalPages, currentPage, triggerSync]);

  // Enhanced auto-load function for complete product accessibility
  const autoLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      if (allProducts.length < pagination.total) {
        console.log('🔄 Auto-loading more products...', {
          loaded: allProducts.length,
          total: pagination.total,
          progress: `${((allProducts.length / pagination.total) * 100).toFixed(1)}%`
        });
        loadMore();
      }
    }
  }, [isLoading, isLoadingMore, hasMore, allProducts.length, pagination.total, loadMore]);

  // Load ALL remaining products function
  const loadAllProducts = useCallback(async () => {
    console.log('🚀 Loading ALL remaining products...');
    
    // Continue loading until we have all products or no more available
    while (hasMore && allProducts.length < pagination.total && !isLoading) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadMore();
    }
  }, [hasMore, allProducts.length, pagination.total, isLoading, loadMore]);

  // Enhanced stats for better monitoring
  const stats = {
    totalProducts: pagination.total,
    loadedProducts: allProducts.length,
    currentPage,
    totalPages: pagination.totalPages,
    coveragePercentage: pagination.total > 0 ? (allProducts.length / pagination.total) * 100 : 0,
    hasMore: hasMore,
    isComplete: allProducts.length >= pagination.total
  };

  console.log('📊 useLoadMoreProducts Stats:', stats);

  return {
    products: allProducts,
    isLoading: isLoading || isLoadingMore,
    error,
    hasMore,
    loadMore,
    autoLoadMore,
    loadAllProducts,
    goToPage,
    currentPage,
    totalPages: pagination.totalPages,
    totalLoaded: allProducts.length,
    totalProducts: pagination.total,
    triggerSync,
    stats
  };
};
