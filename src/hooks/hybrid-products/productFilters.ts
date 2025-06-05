
import { Product } from '@/types/product';
import { removeDiacritics } from '@/utils/stringUtils';

export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  return products.filter(product => 
    product.category?.toLowerCase() === category.toLowerCase()
  );
};

export const getYaBaBossProducts = (products: Product[]): Product[] => {
  return products.filter(product => product.isYaBaBoss);
};

export const getFlashOfferProducts = (products: Product[]): Product[] => {
  return products.filter(product => product.isFlashOffer);
};

// Fonction pour normaliser le texte (supprimer accents, espaces multiples, caractères spéciaux)
const normalizeText = (text: string): string => {
  if (!text) return '';
  return removeDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Supprimer tous les caractères spéciaux sauf espaces
    .replace(/\s+/g, ' ') // Remplacer espaces multiples par un seul
    .trim();
};

// Fonction pour vérifier si une chaîne contient des mots similaires
const containsSimilarWords = (text: string, searchTerm: string): boolean => {
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);
  
  // Recherche exacte après normalisation
  if (normalizedText.includes(normalizedSearch)) {
    return true;
  }
  
  // Recherche par mots individuels
  const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
  const textWords = normalizedText.split(' ').filter(word => word.length > 0);
  
  // Si tous les mots de recherche sont trouvés dans le texte
  return searchWords.every(searchWord => 
    textWords.some(textWord => 
      textWord.includes(searchWord) || 
      searchWord.includes(textWord) ||
      // Similarité basique pour des erreurs de frappe simples
      (Math.abs(textWord.length - searchWord.length) <= 2 && 
       textWord.substring(0, 3) === searchWord.substring(0, 3))
    )
  );
};

export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return products;
  
  const searchTerm = query.trim();
  
  return products.filter(product => {
    // Recherche dans le nom/titre
    if (containsSimilarWords(product.name || '', searchTerm)) {
      return true;
    }
    
    // Recherche dans la description
    if (containsSimilarWords(product.description || '', searchTerm)) {
      return true;
    }
    
    // Recherche dans les mots-clés
    if (product.keywords && product.keywords.some(keyword => 
      containsSimilarWords(keyword, searchTerm)
    )) {
      return true;
    }
    
    // Recherche dans la catégorie
    if (containsSimilarWords(product.category || '', searchTerm)) {
      return true;
    }
    
    // Recherche dans le nom du fournisseur
    if (containsSimilarWords(product.supplierName || '', searchTerm)) {
      return true;
    }
    
    return false;
  });
};
