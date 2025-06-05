import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../data/products';
import { removeDiacritics } from '../utils/stringUtils';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minPoints?: number;
  maxPoints?: number;
  searchQuery?: string;
  city?: string;
}

// Fonction pour mélanger un tableau de manière aléatoire (Fisher-Yates shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fonction pour supprimer les doublons en gardant la diversité
const removeDuplicatesWithDiversity = (products: Product[]): Product[] => {
  const seen = new Set<string>();
  const result: Product[] = [];
  const categorySeen = new Map<string, number>();
  
  // Mélanger d'abord pour la randomisation
  const shuffledProducts = shuffleArray(products);
  
  for (const product of shuffledProducts) {
    const productKey = `${product.title}-${product.price}`;
    const category = product.category || 'Autres';
    const categoryCount = categorySeen.get(category) || 0;
    
    // Éviter les doublons exacts et limiter les produits par catégorie
    if (!seen.has(productKey) && categoryCount < 8) {
      seen.add(productKey);
      categorySeen.set(category, categoryCount + 1);
      result.push(product);
    }
  }
  
  return result;
};

export const useEnhancedProductFiltering = (
  products: Product[], 
  initialVisibleCount: number = 30
) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(initialVisibleCount);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  
  // Reset filters to default values
  const resetFilters = () => {
    setFilterOptions({});
    setActiveCategory('all');
  };
  
  // Enhanced search query filtering with grammar error tolerance
  const enhancedSearchFilter = useCallback((products: Product[], searchQuery: string) => {
    if (!searchQuery || !searchQuery.trim()) return products;
    
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
      
      // Word-by-word search with fuzzy matching
      const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
      const textWords = normalizedText.split(' ').filter(word => word.length > 0);
      
      return searchWords.every(searchWord => 
        textWords.some(textWord => {
          // Direct inclusion
          if (textWord.includes(searchWord) || searchWord.includes(textWord)) {
            return true;
          }
          
          // Fuzzy matching for typos (similar length and same start)
          if (Math.abs(textWord.length - searchWord.length) <= 2 && 
              textWord.substring(0, 3) === searchWord.substring(0, 3)) {
            return true;
          }
          
          // Additional fuzzy matching for common character substitutions
          if (searchWord.length >= 4 && textWord.length >= 4) {
            let differences = 0;
            const minLength = Math.min(searchWord.length, textWord.length);
            for (let i = 0; i < minLength; i++) {
              if (searchWord[i] !== textWord[i]) differences++;
              if (differences > 2) break; // Allow max 2 character differences
            }
            return differences <= 2;
          }
          
          return false;
        })
      );
    };
    
    return products.filter(product => {
      const searchLower = searchQuery.trim();
      
      return containsSimilarWords(product.title || product.name, searchLower) || 
             containsSimilarWords(product.description || '', searchLower) ||
             containsSimilarWords(product.category || '', searchLower) ||
             containsSimilarWords(product.location || '', searchLower) ||
             (product.keywords && product.keywords.some(keyword => 
               containsSimilarWords(keyword, searchLower)
             ));
    });
  }, []);
  
  // Filtrage et tri optimisés avec mémorisation
  const filteredProducts = useMemo(() => {
    console.log('🔍 Starting enhanced filtering with:', {
      totalProducts: products.length,
      activeCategory,
      filterOptions
    });

    let result = [...products];
    
    // Category filtering avec meilleure logique
    if (activeCategory !== 'all' && activeCategory !== '') {
      const categoryLower = activeCategory.toLowerCase();
      result = result.filter(product => {
        const productCategory = (product.category || '').toLowerCase();
        const productSubcategory = (product.subcategory || '').toLowerCase();
        const productTitle = (product.title || product.name || '').toLowerCase();
        
        return productCategory.includes(categoryLower) ||
               productSubcategory.includes(categoryLower) ||
               productTitle.includes(categoryLower);
      });
      
      console.log(`📂 Category "${activeCategory}" filtered to:`, result.length, 'products');
    }
    
    // Price filtering
    if (filterOptions.minPrice !== undefined) {
      result = result.filter(product => product.price >= filterOptions.minPrice!);
    }
    
    if (filterOptions.maxPrice !== undefined) {
      result = result.filter(product => product.price <= filterOptions.maxPrice!);
    }
    
    // Points filtering
    if (filterOptions.minPoints !== undefined) {
      result = result.filter(product => (product.loyaltyPoints || 0) >= filterOptions.minPoints!);
    }
    
    if (filterOptions.maxPoints !== undefined) {
      result = result.filter(product => (product.loyaltyPoints || 0) <= filterOptions.maxPoints!);
    }
    
    // City filtering
    if (filterOptions.city && filterOptions.city !== 'all') {
      result = result.filter(product => product.location === filterOptions.city);
    }
    
    // Enhanced search query filtering with grammar error tolerance
    if (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') {
      result = enhancedSearchFilter(result, filterOptions.searchQuery);
    }
    
    // Supprimer les doublons et assurer la diversité
    const uniqueResult = removeDuplicatesWithDiversity(result);
    
    console.log('✨ Enhanced filtering complete:', {
      originalCount: products.length,
      filteredCount: result.length,
      uniqueCount: uniqueResult.length,
      categoryBreakdown: uniqueResult.reduce((acc, product) => {
        const category = product.category || 'Autres';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    });
    
    return uniqueResult;
  }, [products, activeCategory, filterOptions, enhancedSearchFilter]);
  
  const handleShowMoreProducts = () => {
    setVisibleProducts(prev => Math.min(prev + 20, filteredProducts.length));
  };

  // Apply filter options
  const applyFilters = (options: FilterOptions) => {
    setFilterOptions(prev => ({...prev, ...options}));
  };
  
  return {
    activeCategory,
    setActiveCategory,
    filteredProducts,
    visibleProducts,
    handleShowMoreProducts,
    filterOptions,
    applyFilters,
    resetFilters
  };
};
