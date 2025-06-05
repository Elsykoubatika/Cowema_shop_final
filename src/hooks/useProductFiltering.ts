
import { useState, useEffect } from 'react';
import { Product, yaBaBossProducts, locations } from '../data/products';
import { removeDiacritics } from '../utils/stringUtils';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minPoints?: number;
  maxPoints?: number;
  searchQuery?: string;
  city?: string;
}

export const useProductFiltering = (products: Product[], initialVisibleCount: number = 8, initialYaBaBossCount: number = 4) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filteredYaBaBossProducts, setFilteredYaBaBossProducts] = useState<Product[]>(yaBaBossProducts);
  const [visibleProducts, setVisibleProducts] = useState(initialVisibleCount);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [cities, setCities] = useState<string[]>(locations);
  
  // Reset filters to default values
  const resetFilters = () => {
    setFilterOptions({});
    setActiveCategory('all');
  };
  
  useEffect(() => {
    let result = products;
    let resultYaBaBoss = yaBaBossProducts;
    
    // Category filtering
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
      resultYaBaBoss = resultYaBaBoss.filter(product => product.category === activeCategory);
    }
    
    // Price filtering
    if (filterOptions.minPrice !== undefined) {
      result = result.filter(product => product.price >= filterOptions.minPrice!);
      resultYaBaBoss = resultYaBaBoss.filter(product => product.price >= filterOptions.minPrice!);
    }
    
    if (filterOptions.maxPrice !== undefined) {
      result = result.filter(product => product.price <= filterOptions.maxPrice!);
      resultYaBaBoss = resultYaBaBoss.filter(product => product.price <= filterOptions.maxPrice!);
    }
    
    // Points filtering
    if (filterOptions.minPoints !== undefined) {
      result = result.filter(product => product.loyaltyPoints! >= filterOptions.minPoints!);
      resultYaBaBoss = resultYaBaBoss.filter(product => product.loyaltyPoints! >= filterOptions.minPoints!);
    }
    
    if (filterOptions.maxPoints !== undefined) {
      result = result.filter(product => product.loyaltyPoints! <= filterOptions.maxPoints!);
      resultYaBaBoss = resultYaBaBoss.filter(product => product.loyaltyPoints! <= filterOptions.maxPoints!);
    }
    
    // City filtering
    if (filterOptions.city && filterOptions.city !== 'all') {
      result = result.filter(product => product.location === filterOptions.city);
      resultYaBaBoss = resultYaBaBoss.filter(product => product.location === filterOptions.city);
    }
    
    // Search query filtering with improved fuzzy matching
    if (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') {
      const searchLower = removeDiacritics(filterOptions.searchQuery.toLowerCase());
      
      // Fuzzy search function
      const fuzzyMatch = (text: string, search: string) => {
        if (!text) return false;
        const normalizedText = removeDiacritics(text.toLowerCase());
        return normalizedText.includes(search) || 
               // Check if there's at most 2 character difference (simple Levenshtein-like approach)
               (Math.abs(normalizedText.length - search.length) <= 2 && 
                normalizedText.indexOf(search.substring(0, 3)) >= 0);
      };
      
      result = result.filter(product => 
        fuzzyMatch(product.title || product.name, searchLower) || 
        fuzzyMatch(product.description || '', searchLower) ||
        fuzzyMatch(product.category || '', searchLower) ||
        fuzzyMatch(product.location || '', searchLower)
      );
      
      resultYaBaBoss = resultYaBaBoss.filter(product => 
        fuzzyMatch(product.title || product.name, searchLower) || 
        fuzzyMatch(product.description || '', searchLower) ||
        fuzzyMatch(product.category || '', searchLower) ||
        fuzzyMatch(product.location || '', searchLower)
      );
    }
    
    setFilteredProducts(result);
    setFilteredYaBaBossProducts(resultYaBaBoss.slice(0, initialYaBaBossCount)); // Limit YA BA BOSS products to specified count
    
    // Reset visible products when filters change, but ensure we show at least the initial count
    setVisibleProducts(initialVisibleCount);
  }, [activeCategory, products, filterOptions, initialVisibleCount, initialYaBaBossCount]);
  
  const handleShowMoreProducts = () => {
    setVisibleProducts(prev => Math.min(prev + 8, filteredProducts.length));
  };

  // Apply filter options
  const applyFilters = (options: FilterOptions) => {
    setFilterOptions(prev => ({...prev, ...options}));
  };
  
  return {
    activeCategory,
    setActiveCategory,
    filteredProducts,
    filteredYaBaBossProducts,
    visibleProducts,
    handleShowMoreProducts,
    filterOptions,
    applyFilters,
    cities,
    resetFilters
  };
};
