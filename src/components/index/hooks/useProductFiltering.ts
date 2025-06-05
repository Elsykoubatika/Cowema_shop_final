
import { useMemo } from 'react';
import { Product } from '../../../data/products';

export const useProductFiltering = (
  products: Product[], 
  distributedProducts: any, 
  activeCategory: string
) => {
  // Logique de filtrage strict par catégorie avec audit complet
  const getFilteredProducts = () => {
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      console.log('🔍 Category Filtering Audit - Strict Mode:', {
        selectedCategory: activeCategory,
        totalProducts: products.length,
        distributedGeneral: distributedProducts.generalProducts.length,
        availableCategories: Array.from(new Set(products.map(p => p.category))).filter(Boolean),
        categoryProductsBreakdown: products.reduce((acc, p) => {
          const cat = p.category || 'Non catégorisé';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        timestamp: new Date().toISOString()
      });

      // Utiliser strictement les produits distribués pour la catégorie
      return distributedProducts.generalProducts;
    }
    
    // Pour "Tous", retourner la distribution intelligente
    return distributedProducts.generalProducts;
  };

  const finalFilteredProducts = useMemo(() => getFilteredProducts(), [
    products, 
    distributedProducts, 
    activeCategory
  ]);

  return { finalFilteredProducts };
};
