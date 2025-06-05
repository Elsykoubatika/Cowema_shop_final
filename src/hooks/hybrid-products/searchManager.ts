
import { useCallback } from 'react';
import { Product } from '@/types/product';
import { removeDiacritics } from '@/utils/stringUtils';

export const useSearchManager = () => {
  const normalizeText = useCallback((text: string): string => {
    if (!text) return '';
    return removeDiacritics(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') 
      .replace(/\s+/g, ' ') 
      .trim();
  }, []);

  const containsSimilarWords = useCallback((text: string, searchTerm: string): boolean => {
    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(searchTerm);
    
    if (normalizedText.includes(normalizedSearch)) {
      return true;
    }
    
    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
    const textWords = normalizedText.split(' ').filter(word => word.length > 0);
    
    return searchWords.every(searchWord => 
      textWords.some(textWord => 
        textWord.includes(searchWord) || 
        searchWord.includes(textWord) ||
        (Math.abs(textWord.length - searchWord.length) <= 2 && 
         textWord.substring(0, 3) === searchWord.substring(0, 3))
      )
    );
  }, [normalizeText]);

  const searchProducts = useCallback((products: Product[], query: string): Product[] => {
    if (!query.trim()) return products;
    
    const searchTerm = query.trim();
    
    return products.filter(product => {
      return containsSimilarWords(product.name || '', searchTerm) ||
             containsSimilarWords(product.description || '', searchTerm) ||
             (product.keywords && product.keywords.some(keyword => 
               containsSimilarWords(keyword, searchTerm)
             )) ||
             containsSimilarWords(product.category || '', searchTerm) ||
             containsSimilarWords(product.supplierName || '', searchTerm);
    });
  }, [containsSimilarWords]);

  return { searchProducts };
};
