import { useMemo } from 'react';
import { Product } from '../types/product';

interface AdvancedDistributedProducts {
  yaBaBossProducts: Product[];
  generalProducts: Product[];
  totalDisplayed: number;
}

// Fonction pour normaliser les chaînes de caractères avec gestion des accents et caractères spéciaux
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ') // Remplacer les caractères spéciaux par des espaces
    .replace(/\s+/g, ' ') // Remplacer les espaces multiples par un seul
    .trim();
};

// Mapping séparé et corrigé pour Beauté ET Santé & Bien-être
const categoryMapping: { [key: string]: string[] } = {
  'electronics': ['électronique', 'electronique', 'electronic', 'tech', 'technologie', 'informatique'],
  'électronique': ['electronics', 'electronic', 'tech', 'informatique'],
  'electronique': ['electronics', 'electronic', 'tech', 'informatique'],
  
  // CATÉGORIE BEAUTÉ - SÉPARÉE
  'beaute': ['beauté', 'beauty', 'cosmetic', 'cosmetique', 'cosmétique', 'maquillage', 'makeup', 'rouge', 'lipstick', 'mascara', 'foundation', 'fond de teint', 'vernis', 'nail'],
  'beauté': ['beaute', 'beauty', 'cosmetic', 'maquillage', 'makeup', 'rouge', 'lipstick'],
  'beauty': ['beaute', 'beauté', 'cosmetic', 'maquillage'],
  'cosmetic': ['beaute', 'beauté', 'cosmétique', 'maquillage'],
  'cosmetique': ['beaute', 'beauté', 'cosmetic', 'maquillage'],
  'cosmétique': ['beaute', 'beauté', 'cosmetic', 'maquillage'],
  'maquillage': ['beaute', 'beauté', 'makeup', 'cosmetic'],
  
  // CATÉGORIE SANTÉ & BIEN-ÊTRE - SÉPARÉE
  'sante': ['santé', 'health', 'medical', 'médical', 'vitamines', 'supplements', 'nutrition'],
  'santé': ['sante', 'health', 'medical', 'vitamines', 'supplements'],
  'bien etre': ['bien-être', 'wellness', 'fitness', 'sport', 'relaxation', 'massage', 'yoga'],
  'bien être': ['bien-être', 'wellness', 'fitness', 'sport', 'relaxation'],
  'bien-être': ['bien etre', 'wellness', 'fitness', 'sport', 'relaxation'],
  'wellness': ['bien-être', 'bien etre', 'fitness', 'sport'],
  'health': ['sante', 'santé', 'medical', 'vitamines'],
  'fitness': ['bien-être', 'sport', 'exercise', 'musculation'],
  'sport': ['fitness', 'bien-être', 'exercise'],
  
  'cuisine': ['kitchen', 'culinaire', 'cookware', 'electromenager', 'électroménager'],
  'kitchen': ['cuisine', 'culinaire', 'electromenager'],
  'electromenager': ['électroménager', 'appliance', 'menager', 'cuisine', 'kitchen'],
  'électroménager': ['electromenager', 'appliance', 'cuisine'],
  'habillements': ['vêtements', 'vetements', 'clothing', 'fashion', 'mode', 'textile'],
  'vêtements': ['habillements', 'clothing', 'fashion', 'vetements'],
  'vetements': ['habillements', 'clothing', 'fashion', 'vêtements'],
  'clothing': ['habillements', 'vêtements', 'vetements', 'fashion'],
  'jouets': ['toys', 'toy', 'jeu', 'jeux', 'enfant', 'bebe', 'bébé'],
  'toys': ['jouets', 'toy', 'jeu', 'jeux'],
  'solaire': ['solar', 'photovoltaique', 'photovoltaïque', 'energie', 'énergie', 'panneau'],
  'solar': ['solaire', 'photovoltaique', 'energie']
};

// Algorithme de scoring YaBaBoss ultra-avancé
const calculateAdvancedYaBaBossScore = (product: Product): number => {
  let score = 0;
  
  if (!product.isYaBaBoss) return 0;
  score += 100; // Base YaBaBoss
  
  // Promotion (plus attractif) - Scoring amélioré
  if (product.promoPrice && product.promoPrice < product.price) {
    const discountPercent = ((product.price - product.promoPrice) / product.price) * 100;
    score += discountPercent * 3; // Bonus important pour les promos
    if (discountPercent > 30) score += 20; // Bonus extra pour grosses promos
  }
  
  // Stock (popularité) - Scoring plus nuancé
  if (product.stock > 100) score += 60;
  else if (product.stock > 50) score += 45;
  else if (product.stock > 20) score += 25;
  else if (product.stock > 10) score += 15;
  else if (product.stock > 0) score += 5;
  
  // Qualité du contenu - Scoring amélioré
  if (product.images && product.images.length > 5) score += 50;
  else if (product.images && product.images.length > 3) score += 35;
  else if (product.images && product.images.length > 1) score += 20;
  
  if (product.videoUrl) score += 40; // Bonus important pour les vidéos
  
  // Gamme de prix optimale - Scoring plus précis
  if (product.price >= 20000 && product.price <= 150000) score += 30; // Sweet spot
  else if (product.price >= 10000 && product.price <= 200000) score += 20;
  else if (product.price >= 5000 && product.price <= 300000) score += 10;
  
  // Mots-clés tendance ultra-étendus
  const productText = `${product.name} ${product.description || ''}`.toLowerCase();
  const trendingKeywords = [
    'air fryer', 'friteuse', 'smartphone', 'bluetooth', 'sans fil', 'portable',
    'robot', 'machine', 'automatique', 'intelligent', 'led', 'solaire',
    'rechargeable', 'multifonction', 'professionnel', 'premium', 'wifi',
    'smart', 'digital', 'écran', 'tactile', 'wireless', 'usb', 'gaming',
    'fitness', 'sport', 'beauté', 'cuisine', 'maison', 'jardin'
  ];
  
  let keywordMatches = 0;
  trendingKeywords.forEach(keyword => {
    if (productText.includes(keyword)) {
      keywordMatches++;
      score += 18; // Bonus par mot-clé
    }
  });
  
  // Bonus combiné pour plusieurs mots-clés
  if (keywordMatches >= 4) score += 40;
  else if (keywordMatches >= 3) score += 25;
  else if (keywordMatches >= 2) score += 15;
  
  // Longueur de description (qualité du contenu)
  if (product.description && product.description.length > 300) score += 25;
  else if (product.description && product.description.length > 200) score += 15;
  else if (product.description && product.description.length > 100) score += 10;
  
  return score;
};

// Algorithme de scoring général amélioré
const calculateGeneralProductScore = (product: Product): number => {
  let score = 0;
  
  score += 15; // Base score augmenté
  
  // Promotion
  if (product.promoPrice && product.promoPrice < product.price) {
    const discountPercent = ((product.price - product.promoPrice) / product.price) * 100;
    score += discountPercent * 2.5;
  }
  
  // Stock
  if (product.stock > 100) score += 35;
  else if (product.stock > 50) score += 25;
  else if (product.stock > 20) score += 18;
  else if (product.stock > 0) score += 8;
  
  // Qualité
  if (product.images && product.images.length > 3) score += 20;
  else if (product.images && product.images.length > 1) score += 12;
  if (product.videoUrl) score += 15;
  
  // YaBaBoss bonus
  if (product.isYaBaBoss) score += 25;
  
  // Prix raisonnable
  if (product.price >= 3000 && product.price <= 500000) score += 15;
  
  // Contenu
  if (product.description && product.description.length > 150) score += 10;
  else if (product.description && product.description.length > 100) score += 5;
  
  return score;
};

// Fonction pour mélanger un tableau (Fisher-Yates shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Distribution équitable par catégorie pour "Tous" - Version améliorée
const distributeByCategory = (products: Product[], maxProducts: number = 100): Product[] => {
  const productsByCategory: { [category: string]: Product[] } = {};
  
  products.forEach(product => {
    const category = product.category || 'Autres';
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });

  // Trier chaque catégorie par score
  Object.keys(productsByCategory).forEach(category => {
    productsByCategory[category] = productsByCategory[category]
      .sort((a, b) => calculateGeneralProductScore(b) - calculateGeneralProductScore(a));
  });

  const categories = Object.keys(productsByCategory);
  const maxProductsPerCategory = Math.max(4, Math.floor(maxProducts / categories.length)); // Minimum 4 par catégorie
  const distributedProducts: Product[] = [];

  // Distribution équitable améliorée
  let categoryIndex = 0;
  let productIndex = 0;
  
  while (distributedProducts.length < maxProducts && categoryIndex < categories.length * 25) {
    const currentCategory = categories[categoryIndex % categories.length];
    const categoryProducts = productsByCategory[currentCategory];
    
    if (productIndex < categoryProducts.length && 
        distributedProducts.filter(p => p.category === currentCategory).length < maxProductsPerCategory) {
      const product = categoryProducts[productIndex];
      if (!distributedProducts.find(p => p.id === product.id)) {
        distributedProducts.push(product);
      }
    }
    
    categoryIndex++;
    if (categoryIndex % categories.length === 0) {
      productIndex++;
    }
  }

  // Compléter avec les meilleurs produits restants
  if (distributedProducts.length < maxProducts) {
    const remainingProducts = products
      .filter(p => !distributedProducts.find(dp => dp.id === p.id))
      .sort((a, b) => calculateGeneralProductScore(b) - calculateGeneralProductScore(a));
    
    const needed = maxProducts - distributedProducts.length;
    distributedProducts.push(...remainingProducts.slice(0, needed));
  }

  return shuffleArray(distributedProducts);
};

// Fonction ULTRA-PERMISSIVE pour filtrer par catégorie - CORRIGÉE pour séparer Beauté et Santé & Bien-être
const flexibleCategoryFilter = (products: Product[], category: string): Product[] => {
  if (!category || category === '' || category === 'Tous') {
    return products;
  }
  
  console.log('🔍 Flexible Category Filter - Separate Beauty & Health:', {
    targetCategory: category,
    totalProducts: products.length,
    availableCategories: Array.from(new Set(products.map(p => p.category))).filter(Boolean)
  });
  
  const normalizedCategory = normalizeString(category);
  
  // Extraire les mots-clés de la catégorie
  const categoryKeywords = normalizedCategory.split(' ').filter(word => word.length > 2);
  
  console.log('🎯 Category Keywords Extracted:', {
    original: category,
    normalized: normalizedCategory,
    keywords: categoryKeywords
  });
  
  // 1. Correspondance exacte (priorité maximale)
  const exactMatches = products.filter(product => {
    const productCategory = normalizeString(product.category || '');
    return productCategory === normalizedCategory;
  });
  
  // 2. Correspondance partielle dans la catégorie et sous-catégorie
  const partialMatches = products.filter(product => {
    const productCategory = normalizeString(product.category || '');
    const productSubcategory = normalizeString(product.subcategory || '');
    
    return productCategory.includes(normalizedCategory) || 
           normalizedCategory.includes(productCategory) ||
           productSubcategory.includes(normalizedCategory) ||
           categoryKeywords.some(keyword => 
             productCategory.includes(keyword) || 
             productSubcategory.includes(keyword)
           );
  });
  
  // 3. Correspondance par mapping de synonymes - CORRIGÉ
  const mappingMatches = products.filter(product => {
    const productCategory = normalizeString(product.category || '');
    const productSubcategory = normalizeString(product.subcategory || '');
    
    // Utiliser le mapping de catégories corrigé
    const mappings = categoryMapping[normalizedCategory] || [];
    const categoryMappings = categoryMapping[productCategory] || [];
    
    // Vérifier aussi les mots-clés individuels
    const keywordMappings = categoryKeywords.flatMap(keyword => categoryMapping[keyword] || []);
    
    const hasMapping = [...mappings, ...keywordMappings].some(mapping => {
      const normalizedMapping = normalizeString(mapping);
      return productCategory.includes(normalizedMapping) || 
             productSubcategory.includes(normalizedMapping);
    });
    
    const hasCategoryMapping = categoryMappings.some(mapping => {
      const normalizedMapping = normalizeString(mapping);
      return normalizedMapping.includes(normalizedCategory) ||
             categoryKeywords.some(keyword => normalizedMapping.includes(keyword));
    });
    
    return hasMapping || hasCategoryMapping;
  });
  
  // 4. Correspondance dans le nom et description du produit
  const nameMatches = products.filter(product => {
    const productName = normalizeString(product.name || '');
    const productDescription = normalizeString(product.description || '');
    const searchText = `${productName} ${productDescription}`;
    
    // Recherche par mots-clés individuels
    return categoryKeywords.some(keyword => searchText.includes(keyword)) ||
           searchText.includes(normalizedCategory);
  });
  
  // 5. Correspondance spécifique pour BEAUTÉ uniquement
  let beautyMatches: Product[] = [];
  if (['beaute', 'beauté', 'beauty'].includes(normalizedCategory)) {
    const beautyKeywords = ['beaute', 'beauté', 'cosmetique', 'cosmétique', 'maquillage', 'makeup', 'rouge', 'lipstick', 'mascara', 'foundation', 'vernis', 'nail', 'parfum'];
    beautyMatches = products.filter(product => {
      const searchText = normalizeString(`${product.name} ${product.description} ${product.category}`);
      return beautyKeywords.some(keyword => searchText.includes(keyword));
    });
  }
  
  // 6. Correspondance spécifique pour SANTÉ & BIEN-ÊTRE uniquement
  let healthWellnessMatches: Product[] = [];
  if (['sante', 'santé', 'bien etre', 'bien être', 'bien-être', 'wellness', 'health'].includes(normalizedCategory)) {
    const healthKeywords = ['sante', 'santé', 'health', 'medical', 'médical', 'vitamines', 'supplements', 'bien etre', 'bien-être', 'wellness', 'fitness', 'sport', 'yoga', 'massage', 'relaxation'];
    healthWellnessMatches = products.filter(product => {
      const searchText = normalizeString(`${product.name} ${product.description} ${product.category}`);
      return healthKeywords.some(keyword => searchText.includes(keyword));
    });
  }
  
  // Combiner tous les résultats en évitant les doublons
  const allMatches = new Map<string, Product>();
  
  // Ajouter dans l'ordre de priorité
  exactMatches.forEach(p => allMatches.set(p.id, p));
  partialMatches.forEach(p => allMatches.set(p.id, p));
  mappingMatches.forEach(p => allMatches.set(p.id, p));
  nameMatches.forEach(p => allMatches.set(p.id, p));
  beautyMatches.forEach(p => allMatches.set(p.id, p));
  healthWellnessMatches.forEach(p => allMatches.set(p.id, p));
  
  const finalResults = Array.from(allMatches.values());
  
  console.log('✅ Separate Category Filter Results:', {
    category,
    exactMatches: exactMatches.length,
    partialMatches: partialMatches.length,
    mappingMatches: mappingMatches.length,
    nameMatches: nameMatches.length,
    beautyMatches: beautyMatches.length,
    healthWellnessMatches: healthWellnessMatches.length,
    totalUnique: finalResults.length,
    sampleResults: finalResults.slice(0, 3).map(p => ({
      name: p.name.substring(0, 30),
      category: p.category,
      description: p.description?.substring(0, 50)
    }))
  });
  
  return finalResults;
};

export const useAdvancedProductDistribution = (
  allProducts: Product[], 
  activeCategory: string = ''
): AdvancedDistributedProducts => {
  return useMemo(() => {
    console.log('🚀 Advanced Distribution - Separate Beauty & Health Categories:', {
      totalProducts: allProducts.length,
      activeCategory,
      categoriesBreakdown: allProducts.reduce((acc, product) => {
        const category = product.category || 'Non catégorisé';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    });

    let workingProducts = [...allProducts];
    
    // Filtrage CORRIGÉ par catégorie si sélectionnée
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      workingProducts = flexibleCategoryFilter(allProducts, activeCategory);
      console.log(`📂 Separate Category Filter Result for "${activeCategory}":`, {
        originalCount: allProducts.length,
        filteredCount: workingProducts.length,
        improvementRatio: (workingProducts.length / allProducts.length * 100).toFixed(1) + '%',
        sampleProducts: workingProducts.slice(0, 5).map(p => ({
          name: p.name.substring(0, 25),
          category: p.category,
          imageCount: p.images.length
        }))
      });
    }

    const distributed: AdvancedDistributedProducts = {
      yaBaBossProducts: [],
      generalProducts: [],
      totalDisplayed: 0
    };

    const usedProductIds = new Set<string>();

    // Distribution YaBaBoss par catégorie
    const yaBaBossProducts = workingProducts
      .filter(product => product.isYaBaBoss)
      .map(product => ({
        product,
        score: calculateAdvancedYaBaBossScore(product)
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, activeCategory && activeCategory !== 'Tous' ? 25 : 30)
      .map(({ product }) => product);
    
    distributed.yaBaBossProducts = yaBaBossProducts;
    yaBaBossProducts.forEach(product => usedProductIds.add(product.id));

    // Distribution générale par catégorie
    const remainingProducts = workingProducts.filter(product => 
      !usedProductIds.has(product.id)
    );

    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      // Pour une catégorie spécifique
      const categoryProducts = remainingProducts
        .map(product => ({
          product,
          score: calculateGeneralProductScore(product)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 200)
        .map(({ product }) => product);
      
      distributed.generalProducts = shuffleArray(categoryProducts);
    } else {
      // Pour "Tous" : distribution équitable par catégorie
      distributed.generalProducts = distributeByCategory(remainingProducts, 120);
    }

    distributed.totalDisplayed = distributed.yaBaBossProducts.length + distributed.generalProducts.length;

    // Audit final
    console.log('✅ Distribution Complete - Separate Beauty & Health:', {
      category: activeCategory || 'Tous',
      results: {
        yaBaBoss: distributed.yaBaBossProducts.length,
        general: distributed.generalProducts.length,
        total: distributed.totalDisplayed
      },
      categoryDistribution: distributed.generalProducts.reduce((acc, product) => {
        const category = product.category || 'Non catégorisé';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    });

    return distributed;
  }, [allProducts, activeCategory]);
};
