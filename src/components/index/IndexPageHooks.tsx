
import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useHybridProducts } from '../../hooks/useHybridProducts';
import { useAdvancedProductDistribution } from '../../hooks/useAdvancedProductDistribution';
import { useSEOMetadata } from '../../hooks/useSEOMetadata';
import { useIndexState } from './hooks/useIndexState';
import { useIndexApiFilters } from './hooks/useApiFilters';
import { useProductFiltering } from './hooks/useProductFiltering';
import { useApiAudit } from './hooks/useApiAudit';
import { useAutoSync } from './hooks/useAutoSync';
import { useResultsAudit } from './hooks/useResultsAudit';

export const useIndexPageHooks = () => {
  try {
    const { getCartItemsCount, handleAddToCart } = useCart();
    const { activeCategory, setActiveCategory } = useIndexState();
    const { apiFilters, categoriesData } = useIndexApiFilters(activeCategory);
    
    const seoData = useSEOMetadata();

    const { products, isLoading, refetch, triggerSync, isSyncing, error } = useHybridProducts(apiFilters);

    // Distribution avec audit de catégorie strict
    const distributedProducts = useAdvancedProductDistribution(products, activeCategory);

    // Filtrage des produits
    const { finalFilteredProducts } = useProductFiltering(products, distributedProducts, activeCategory);

    // Auto-sync
    useAutoSync(products, isLoading, isSyncing, error, triggerSync, apiFilters, activeCategory, categoriesData);

    // Audit des résultats
    useResultsAudit(finalFilteredProducts, products, distributedProducts, activeCategory, apiFilters, isLoading, isSyncing, error);

    // Audit de l'API
    const apiAudit = useApiAudit(products, finalFilteredProducts, distributedProducts, activeCategory, categoriesData, apiFilters, isLoading, isSyncing, error);

    const handleCartClick = () => {
      const cartButton = document.querySelector('[data-cart-toggle]') as HTMLElement;
      if (cartButton) {
        cartButton.click();
      }
    };

    return {
      // State
      activeCategory,
      setActiveCategory,
      
      // Data
      products,
      distributedProducts,
      finalFilteredProducts,
      seoData,
      
      // Loading states
      isLoading,
      isSyncing,
      error,
      
      // Functions
      getCartItemsCount,
      handleAddToCart,
      handleCartClick,
      refetch,
      
      // Audit complet de l'API
      apiAudit
    };
  } catch (error) {
    console.error('Error in useIndexPageHooks:', error);
    return {
      activeCategory: '',
      setActiveCategory: () => {},
      products: [],
      distributedProducts: { yaBaBossProducts: [], generalProducts: [] },
      finalFilteredProducts: [],
      seoData: null,
      isLoading: false,
      isSyncing: false,
      error: 'Erreur lors du chargement des données',
      getCartItemsCount: () => 0,
      handleAddToCart: () => {},
      handleCartClick: () => {},
      refetch: () => {},
      apiAudit: null
    };
  }
};
