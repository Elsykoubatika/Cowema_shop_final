
import { useMemo } from 'react';
import { Product } from '../types/product';

interface DistributedProducts {
  yaBaBossProducts: Product[];
  womenProducts: Product[];
  cuisineProducts: Product[];
  generalProducts: Product[];
}

interface ProductScore {
  product: Product;
  yaBaBossScore: number;
  womenScore: number;
  cuisineScore: number;
  generalScore: number;
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

// Fonction pour distribuer équitablement par catégorie
const distributeEquitablyByCategory = (allProducts: Product[], maxProducts: number = 60): Product[] => {
  // Regrouper les produits par catégorie
  const productsByCategory: { [category: string]: Product[] } = {};
  
  allProducts.forEach(product => {
    const category = product.category || 'Autres';
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });

  // Trier chaque catégorie par score de popularité (simulation basée sur les données disponibles)
  Object.keys(productsByCategory).forEach(category => {
    productsByCategory[category] = productsByCategory[category]
      .sort((a, b) => {
        // Simuler un score de popularité basé sur les critères disponibles
        const scoreA = calculatePopularityScore(a);
        const scoreB = calculatePopularityScore(b);
        return scoreB - scoreA;
      });
  });

  // Prendre les meilleurs produits de chaque catégorie de manière équitable
  const categories = Object.keys(productsByCategory);
  const maxProductsPerCategory = Math.max(1, Math.floor(maxProducts / categories.length));
  const distributedProducts: Product[] = [];

  // Distribution équitable : prendre alternativement dans chaque catégorie
  let categoryIndex = 0;
  let productIndex = 0;
  
  while (distributedProducts.length < maxProducts && categoryIndex < categories.length * 15) {
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

  // Compléter avec les produits restants si nécessaire
  if (distributedProducts.length < maxProducts) {
    const remainingProducts = allProducts.filter(p => 
      !distributedProducts.find(dp => dp.id === p.id)
    );
    
    const needed = maxProducts - distributedProducts.length;
    const shuffledRemaining = shuffleArray(remainingProducts);
    distributedProducts.push(...shuffledRemaining.slice(0, needed));
  }

  return shuffleArray(distributedProducts);
};

// Fonction pour calculer un score de popularité simulé avec critères avancés
const calculatePopularityScore = (product: Product): number => {
  let score = 0;
  
  // Privilégier les produits YaBaBoss
  if (product.isYaBaBoss) score += 50;
  
  // Privilégier les produits en promotion
  if (product.promoPrice && product.promoPrice < product.price) {
    const discountPercent = ((product.price - product.promoPrice) / product.price) * 100;
    score += discountPercent;
  }
  
  // Privilégier les produits avec plusieurs images (signe de qualité)
  if (product.images && product.images.length > 2) score += 20;
  
  // Privilégier les produits avec stock élevé (signe de popularité)
  if (product.stock > 50) score += 15;
  if (product.stock > 100) score += 25;
  
  // Privilégier les produits avec vidéo
  if (product.videoUrl) score += 10;
  
  // Simuler la popularité basée sur le prix (produits milieu de gamme plus populaires)
  if (product.price >= 10000 && product.price <= 100000) score += 15;
  if (product.price >= 50000 && product.price <= 150000) score += 10;
  
  // Simuler les ventes basées sur le nom/description (mots clés populaires)
  const productText = `${product.name} ${product.description || ''}`.toLowerCase();
  const popularKeywords = ['air fryer', 'friteuse', 'smartphone', 'iphone', 'samsung', 'robot', 'machine', 'portable', 'bluetooth', 'sans fil'];
  popularKeywords.forEach(keyword => {
    if (productText.includes(keyword)) score += 8;
  });
  
  // Ajouter un facteur aléatoire pour éviter toujours le même ordre
  score += Math.random() * 10;
  
  return score;
};

// Algorithme avancé de scoring YaBaBoss avec critères multiples
const calculateAdvancedYaBaBossScore = (product: Product): number => {
  let score = 0;
  
  // Base: doit être YaBaBoss
  if (!product.isYaBaBoss) return 0;
  
  score += 100; // Score de base pour YaBaBoss
  
  // Critère 1: Promotion (prix réduit = plus attractif)
  if (product.promoPrice && product.promoPrice < product.price) {
    const discountPercent = ((product.price - product.promoPrice) / product.price) * 100;
    score += discountPercent * 2; // Multiplier par 2 pour plus d'impact
  }
  
  // Critère 2: Stock disponible (plus de stock = plus populaire)
  if (product.stock > 100) score += 40;
  else if (product.stock > 50) score += 25;
  else if (product.stock > 20) score += 15;
  else if (product.stock > 0) score += 5;
  
  // Critère 3: Qualité du contenu (images multiples = meilleure présentation)
  if (product.images && product.images.length > 3) score += 30;
  else if (product.images && product.images.length > 1) score += 15;
  
  // Critère 4: Présence de vidéo (engagement plus élevé)
  if (product.videoUrl) score += 25;
  
  // Critère 5: Gamme de prix optimale (ni trop cher, ni trop bon marché)
  const optimalPriceRange = product.price >= 15000 && product.price <= 200000;
  if (optimalPriceRange) score += 20;
  
  // Critère 6: Mots-clés tendance dans le nom/description
  const productText = `${product.name} ${product.description || ''}`.toLowerCase();
  const trendingKeywords = [
    'air fryer', 'friteuse', 'smartphone', 'bluetooth', 'sans fil', 'portable',
    'robot', 'machine', 'automatique', 'intelligent', 'led', 'solaire',
    'rechargeable', 'multifonction', 'professionnel', 'premium'
  ];
  
  let keywordMatches = 0;
  trendingKeywords.forEach(keyword => {
    if (productText.includes(keyword)) {
      keywordMatches++;
      score += 12;
    }
  });
  
  // Bonus pour plusieurs mots-clés tendance
  if (keywordMatches >= 3) score += 20;
  else if (keywordMatches >= 2) score += 10;
  
  // Critère 7: Longueur de description (plus de détails = meilleure qualité)
  if (product.description && product.description.length > 200) score += 15;
  else if (product.description && product.description.length > 100) score += 8;
  
  // Facteur aléatoire réduit pour maintenir une certaine variété
  score += Math.random() * 5;
  
  return score;
};

export const useSmartProductDistribution = (allProducts: Product[]): DistributedProducts => {
  return useMemo(() => {
    // Mélanger les produits de manière aléatoire dès le début
    const randomizedProducts = shuffleArray(allProducts);
    
    // Calculer les scores pour chaque produit mélangé
    const productsWithScores: ProductScore[] = randomizedProducts.map(product => ({
      product,
      yaBaBossScore: calculateAdvancedYaBaBossScore(product), // Utiliser l'algorithme avancé
      womenScore: calculateWomenScore(product),
      cuisineScore: calculateCuisineScore(product),
      generalScore: calculatePopularityScore(product)
    }));

    // Trier par scores globaux pour optimiser la distribution
    productsWithScores.sort((a, b) => {
      const aMaxScore = Math.max(a.yaBaBossScore, a.womenScore, a.cuisineScore, a.generalScore);
      const bMaxScore = Math.max(b.yaBaBossScore, b.womenScore, b.cuisineScore, b.generalScore);
      return bMaxScore - aMaxScore;
    });

    const distributed: DistributedProducts = {
      yaBaBossProducts: [],
      womenProducts: [],
      cuisineProducts: [],
      generalProducts: []
    };

    const usedProductIds = new Set<string>();

    // Étape 1: Distribuer les produits YaBaBoss avec algorithme avancé - AUGMENTÉ À 60
    const yaBaBossProducts = productsWithScores
      .filter(({ yaBaBossScore }) => yaBaBossScore > 0) // Seuls les vrais YaBaBoss
      .sort((a, b) => b.yaBaBossScore - a.yaBaBossScore) // Trier par score décroissant
      .slice(0, 60) // Prendre les 60 meilleurs
      .map(({ product }) => product);
    
    distributed.yaBaBossProducts = yaBaBossProducts;
    yaBaBossProducts.forEach(product => usedProductIds.add(product.id));

    // Étape 2: Distribuer les produits féminins - AUGMENTÉ À 120
    const womenProducts = productsWithScores
      .filter(({ product, womenScore }) => womenScore > 15 && !usedProductIds.has(product.id))
      .slice(0, 120)
      .map(({ product }) => product);
    
    distributed.womenProducts = shuffleArray(womenProducts);
    womenProducts.forEach(product => usedProductIds.add(product.id));

    // Étape 3: Distribuer les produits cuisine - AUGMENTÉ À 50
    const cuisineProducts = productsWithScores
      .filter(({ product, cuisineScore }) => cuisineScore > 15 && !usedProductIds.has(product.id))
      .slice(0, 50)
      .map(({ product }) => product);
    
    distributed.cuisineProducts = shuffleArray(cuisineProducts);
    cuisineProducts.forEach(product => usedProductIds.add(product.id));

    // Étape 4: Pour les produits généraux, utiliser la distribution équitable par catégorie - AUGMENTÉ À 80
    const remainingProducts = randomizedProducts.filter(product => !usedProductIds.has(product.id));
    distributed.generalProducts = distributeEquitablyByCategory(remainingProducts, 80);

    console.log('🎯 Smart Distribution Results avec algorithme YaBaBoss avancé:', {
      yaBaBoss: distributed.yaBaBossProducts.length,
      women: distributed.womenProducts.length,
      cuisine: distributed.cuisineProducts.length,
      general: distributed.generalProducts.length,
      yaBaBossTopScores: distributed.yaBaBossProducts.slice(0, 5).map(p => ({
        name: p.name.substring(0, 30),
        score: calculateAdvancedYaBaBossScore(p),
        hasPromo: !!p.promoPrice,
        stock: p.stock,
        images: p.images?.length || 0
      })),
      generalByCategory: distributed.generalProducts.reduce((acc, product) => {
        const category = product.category || 'Autres';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      totalUsed: usedProductIds.size + distributed.generalProducts.length,
      totalAvailable: allProducts.length
    });

    return distributed;
  }, [allProducts]);
};

// Algorithme de scoring YaBaBoss simplifié
const calculateYaBaBossScore = (product: Product): number => {
  let score = 0;
  
  if (product.isYaBaBoss) score += 50;
  if (product.promoPrice) score += 20;
  if (product.images && product.images.length > 2) score += 10;
  
  return score;
};

const calculateWomenScore = (product: Product): number => {
  const productText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  let score = 0;

  const ultraFeminineKeywords = [
    'perruque', 'extension cheveux', 'soutien-gorge', 'lingerie', 'rouge à lèvres',
    'mascara', 'robe', 'jupe', 'escarpins', 'sac à main', 'collier', 'bracelet'
  ];

  ultraFeminineKeywords.forEach(keyword => {
    if (productText.includes(keyword)) score += 25;
  });

  const feminineCategories = ['beauté', 'mode femme', 'cosmétiques', 'bijoux'];
  feminineCategories.forEach(category => {
    if (productText.includes(category)) score += 20;
  });

  return score;
};

const calculateCuisineScore = (product: Product): number => {
  const productText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  let score = 0;

  const cuisineKeywords = [
    'air fryer', 'friteuse', 'robot cuiseur', 'machine à café', 'blender',
    'couteau', 'casserole', 'poêle', 'ustensile', 'électroménager'
  ];

  cuisineKeywords.forEach(keyword => {
    if (productText.includes(keyword)) score += 25;
  });

  const cuisineCategories = ['cuisine', 'électroménager', 'ustensiles'];
  cuisineCategories.forEach(category => {
    if (productText.includes(category)) score += 20;
  });

  return score;
};
