
import { useMemo } from 'react';
import { useApiFilters } from '../../../hooks/useApiFilters';

export const useIndexApiFilters = (activeCategory: string) => {
  const { categoriesData } = useApiFilters();
  
  // Construction des filtres API avec audit complet
  const apiFilters = useMemo(() => {
    const filters: any = {
      page: 1
    };

    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      // Trouver l'ID de catégorie correspondant
      const categoryMatch = categoriesData.find(cat => {
        const normalizedCat = cat.name.toLowerCase().trim();
        const normalizedActive = activeCategory.toLowerCase().trim();
        return normalizedCat === normalizedActive || 
               normalizedCat.includes(normalizedActive) ||
               normalizedActive.includes(normalizedCat);
      });

      if (categoryMatch) {
        filters.category = categoryMatch.id;
      }
    }

    console.log('🎯 API Filters Construction Audit:', {
      activeCategory,
      categoriesAvailable: categoriesData.length,
      selectedCategoryId: filters.category,
      categoryMatch: filters.category ? categoriesData.find(c => c.id === filters.category) : null,
      finalFilters: filters,
      timestamp: new Date().toISOString()
    });

    return filters;
  }, [activeCategory, categoriesData]);

  return { apiFilters, categoriesData };
};
