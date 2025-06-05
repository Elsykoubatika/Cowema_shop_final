import { Product } from '@/types/product';

interface BannerScoringOptions {
  maxPrice?: number;
  genderBalance?: boolean;
  diversityWeight?: number;
  priceWeight?: number;
}

class BannerProductScoring {
  private lastSelectedProducts: string[] = [];
  private readonly COOLDOWN_SIZE = 8; // Éviter de re-sélectionner les 8 derniers produits

  // Déterminer le genre cible d'un produit basé sur mots-clés et catégories
  private determineProductGender(product: Product): 'male' | 'female' | 'unisex' {
    const name = product.name?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const keywords = product.keywords?.join(' ').toLowerCase() || '';
    
    const text = `${name} ${description} ${category} ${keywords}`;
    
    // Mots-clés féminins
    const femaleKeywords = [
      'femme', 'féminin', 'dame', 'robe', 'jupe', 'soutien-gorge', 'culotte',
      'maquillage', 'rouge à lèvres', 'vernis', 'bijoux femme', 'sac à main',
      'talon', 'collier', 'boucles d\'oreilles', 'bracelet femme', 'parfum femme',
      'cheveux femme', 'beauté', 'cosmétique', 'manucure', 'pédicure'
    ];
    
    // Mots-clés masculins
    const maleKeywords = [
      'homme', 'masculin', 'monsieur', 'costume', 'cravate', 'barbe',
      'rasoir', 'aftershave', 'parfum homme', 'bracelet homme', 'montre homme',
      'chaussures homme', 'pantalon homme', 'chemise homme', 'sport homme',
      'musculation', 'bricolage', 'outil', 'auto', 'moto'
    ];
    
    const femaleMatches = femaleKeywords.filter(keyword => text.includes(keyword)).length;
    const maleMatches = maleKeywords.filter(keyword => text.includes(keyword)).length;
    
    if (femaleMatches > maleMatches) return 'female';
    if (maleMatches > femaleMatches) return 'male';
    return 'unisex';
  }

  // Calculer le score d'un produit avec les nouveaux critères
  private calculateProductScore(
    product: Product, 
    options: BannerScoringOptions = {}
  ): number {
    const {
      maxPrice = 1500000,
      diversityWeight = 0.25,
      priceWeight = 0.20
    } = options;

    // Filtrer par prix maximum
    if (product.price > maxPrice) {
      return 0; // Exclure complètement
    }

    let score = 0;
    
    // 1. Score de performance (25%)
    const performanceScore = this.calculatePerformanceScore(product) * 0.25;
    
    // 2. Score d'urgence (30%) - augmenté
    const urgencyScore = this.calculateUrgencyScore(product) * 0.30;
    
    // 3. Score de fraîcheur (20%)
    const freshnessScore = this.calculateFreshnessScore(product) * 0.20;
    
    // 4. Score de diversité (15%)
    const diversityScore = this.calculateDiversityScore(product) * diversityWeight;
    
    // 5. Score de prix attractif (10%) - nouveau
    const priceScore = this.calculatePriceScore(product, maxPrice) * priceWeight;
    
    // 6. Facteur aléatoire réduit (10%)
    const randomFactor = Math.random() * 0.10;
    
    // 7. Pénalité pour produits récemment affichés
    const cooldownPenalty = this.lastSelectedProducts.includes(product.id) ? -0.3 : 0;
    
    score = performanceScore + urgencyScore + freshnessScore + diversityScore + priceScore + randomFactor + cooldownPenalty;
    
    return Math.max(0, score); // Assurer que le score ne soit pas négatif
  }

  // Nouveau : Score basé sur l'attractivité du prix
  private calculatePriceScore(product: Product, maxPrice: number): number {
    const price = product.promoPrice || product.price;
    
    // Plus le prix est bas par rapport au maximum, meilleur le score
    const priceRatio = price / maxPrice;
    const priceScore = 1 - priceRatio;
    
    // Bonus pour les promotions
    const promoBonus = product.promoPrice ? 0.3 : 0;
    
    return Math.min(1, priceScore + promoBonus);
  }

  private calculatePerformanceScore(product: Product): number {
    let score = 0;
    
    if (product.isYaBaBoss) score += 0.4;
    if (product.isFlashOffer) score += 0.3;
    if (product.promoPrice && product.promoPrice < product.price) score += 0.2;
    if (product.stock && product.stock <= 5) score += 0.1;
    
    return Math.min(1, score);
  }

  private calculateUrgencyScore(product: Product): number {
    let score = 0;
    
    if (product.stock && product.stock <= 3) score += 0.5;
    else if (product.stock && product.stock <= 10) score += 0.3;
    
    if (product.isFlashOffer) score += 0.4;
    if (product.promoPrice) score += 0.2;
    
    return Math.min(1, score);
  }

  private calculateFreshnessScore(product: Product): number {
    const productId = parseInt(product.id);
    if (isNaN(productId)) return 0.5;
    
    return productId > 800 ? 0.8 : 0.3;
  }

  private calculateDiversityScore(product: Product): number {
    const categories = ['Électronique', 'Electronics', 'Vêtements', 'Beauté', 'Maison', 'Sport'];
    const categoryBonus = categories.includes(product.category || '') ? 0.3 : 0.1;
    
    return Math.min(1, categoryBonus + Math.random() * 0.7);
  }

  // Sélection avec équilibrage de genre
  selectBannerProducts(
    products: Product[], 
    count: number = 4, 
    options: BannerScoringOptions = {}
  ): Product[] {
    const {
      maxPrice = 1500000,
      genderBalance = true
    } = options;

    console.log(`🔄 Filtering ${products.length} products to valid products for banner`);
    
    // Filtrer les produits valides
    const validProducts = products.filter(product => 
      product && 
      product.name && 
      product.price <= maxPrice &&
      product.isActive !== false &&
      product.stock !== 0
    );

    console.log(`🔄 Filtering ${products.length} products to ${validProducts.length} valid products for banner (max price: ${maxPrice.toLocaleString()} FCFA)`);

    if (validProducts.length === 0) return [];

    // Calculer les scores
    const scoredProducts = validProducts.map(product => ({
      product,
      score: this.calculateProductScore(product, options),
      gender: this.determineProductGender(product)
    })).filter(item => item.score > 0);

    // Trier par score
    scoredProducts.sort((a, b) => b.score - a.score);

    let selectedProducts: Product[] = [];

    if (genderBalance && count >= 2) {
      // Équilibrage de genre
      const targetFemale = Math.floor(count / 2);
      const targetMale = Math.floor(count / 2);
      const targetUnisex = count - targetFemale - targetMale;

      const femaleProducts = scoredProducts.filter(item => item.gender === 'female');
      const maleProducts = scoredProducts.filter(item => item.gender === 'male');
      const unisexProducts = scoredProducts.filter(item => item.gender === 'unisex');

      // Sélectionner par genre
      selectedProducts.push(
        ...femaleProducts.slice(0, targetFemale).map(item => item.product),
        ...maleProducts.slice(0, targetMale).map(item => item.product),
        ...unisexProducts.slice(0, targetUnisex).map(item => item.product)
      );

      // Compléter si nécessaire
      const remaining = count - selectedProducts.length;
      if (remaining > 0) {
        const allRemaining = scoredProducts
          .filter(item => !selectedProducts.includes(item.product))
          .slice(0, remaining);
        selectedProducts.push(...allRemaining.map(item => item.product));
      }
    } else {
      // Sélection simple par score
      selectedProducts = scoredProducts.slice(0, count).map(item => item.product);
    }

    // Mettre à jour la liste des produits récemment sélectionnés
    this.lastSelectedProducts = [
      ...selectedProducts.map(p => p.id),
      ...this.lastSelectedProducts
    ].slice(0, this.COOLDOWN_SIZE);

    // Log des résultats
    const selectedScored = selectedProducts.map(product => {
      const scored = scoredProducts.find(item => item.product.id === product.id);
      return {
        name: product.name,
        score: scored?.score || 0,
        gender: scored?.gender || 'unknown',
        category: product.category,
        stock: product.stock,
        price: product.price
      };
    });

    console.log('🎯 Banner products selected with scores and gender balance:', selectedScored);

    return selectedProducts;
  }

  // Méthode pour obtenir des statistiques de debug améliorées
  getAdvancedStats(products: Product[]): any {
    const genderStats = products.reduce((acc, product) => {
      const gender = this.determineProductGender(product);
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priceRanges = {
      'low': products.filter(p => p.price <= 50000).length,
      'medium': products.filter(p => p.price > 50000 && p.price <= 500000).length,
      'high': products.filter(p => p.price > 500000 && p.price <= 1500000).length,
      'excluded': products.filter(p => p.price > 1500000).length
    };

    return {
      total: products.length,
      genderDistribution: genderStats,
      priceRanges,
      lastSelected: this.lastSelectedProducts.length
    };
  }
}

export const bannerProductScoring = new BannerProductScoring();
