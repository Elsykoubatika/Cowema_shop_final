
import { Product } from '@/types/product';

interface RecommendationScore {
  product: Product;
  score: number;
  reasons: string[];
}

export class SmartProductRecommender {
  // Seed based on product ID for consistent but different results per product
  private getProductSeed(productId: string): number {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Seeded random function for consistent randomness per product
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Enhanced category compatibility matrix with more precise relationships
  private getCategoryCompatibility(): Record<string, string[]> {
    return {
      'phones': ['accessories', 'electronics', 'audio', 'tech', 'mobile'],
      'computers': ['accessories', 'electronics', 'peripherals', 'tech', 'software'],
      'electronics': ['phones', 'computers', 'accessories', 'audio', 'tech'],
      'fashion': ['accessories', 'beauty', 'lifestyle', 'clothing', 'style'],
      'beauty': ['fashion', 'accessories', 'health', 'lifestyle', 'skincare'],
      'accessories': ['phones', 'computers', 'electronics', 'fashion', 'beauty'],
      'audio': ['phones', 'electronics', 'accessories', 'tech', 'music'],
      'health': ['beauty', 'lifestyle', 'fitness', 'wellness'],
      'home': ['electronics', 'accessories', 'lifestyle', 'furniture'],
      'sports': ['health', 'fitness', 'lifestyle', 'equipment'],
      'automotive': ['electronics', 'accessories', 'tech', 'auto'],
      'gaming': ['electronics', 'computers', 'accessories', 'tech'],
      'books': ['education', 'lifestyle', 'entertainment'],
      'kitchen': ['home', 'electronics', 'appliances'],
      'clothing': ['fashion', 'accessories', 'style', 'apparel']
    };
  }

  // Enhanced price range compatibility with more nuanced scoring
  private getPriceCompatibilityScore(mainPrice: number, targetPrice: number): number {
    if (mainPrice <= 0 || targetPrice <= 0) return 0.1;
    
    const ratio = targetPrice / mainPrice;
    
    // Very similar price range (80% to 120%) - highest score
    if (ratio >= 0.8 && ratio <= 1.2) return 1.0;
    
    // Similar price range (50% to 200%) - good score
    if (ratio >= 0.5 && ratio <= 2.0) return 0.8;
    
    // Acceptable price range (30% to 300%) - moderate score
    if (ratio >= 0.3 && ratio <= 3.0) return 0.6;
    
    // Different but not extreme (10% to 1000%) - low score
    if (ratio >= 0.1 && ratio <= 10.0) return 0.3;
    
    return 0.1;
  }

  // Enhanced keyword extraction with better French language support
  private extractKeywords(product: Product): string[] {
    const text = `${product.name} ${product.description || ''}`.toLowerCase();
    
    // French stop words to exclude
    const stopWords = [
      'le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'avec', 'pour', 
      'dans', 'sur', 'un', 'une', 'ce', 'cette', 'ces', 'son', 'sa', 
      'ses', 'leur', 'leurs', 'très', 'plus', 'tout', 'sans', 'par',
      'est', 'sont', 'avoir', 'être', 'faire', 'aller', 'voir', 'savoir'
    ];
    
    // Extract meaningful words (length > 2, not stop words)
    const words = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !stopWords.includes(word) &&
        !/^\d+$/.test(word) // Exclude pure numbers
      );
    
    // Add category and subcategory as important keywords
    const categoryKeywords = [
      product.category?.toLowerCase(),
      product.subcategory?.toLowerCase()
    ].filter(Boolean);
    
    return [...new Set([...words, ...categoryKeywords])];
  }

  // Calculate keyword similarity with weighted importance
  private getKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;
    
    const intersection = keywords1.filter(k => keywords2.some(k2 => 
      k2.includes(k) || k.includes(k2) || k === k2
    ));
    
    const union = [...new Set([...keywords1, ...keywords2])];
    const jaccardIndex = intersection.length / union.length;
    
    // Bonus for exact matches
    const exactMatches = keywords1.filter(k => keywords2.includes(k)).length;
    const exactBonus = exactMatches / Math.max(keywords1.length, keywords2.length, 1);
    
    return Math.min(1.0, jaccardIndex + (exactBonus * 0.3));
  }

  // Enhanced brand/supplier similarity
  private getBrandSimilarity(brand1: string | undefined, brand2: string | undefined): number {
    if (!brand1 || !brand2) return 0;
    
    const b1 = brand1.toLowerCase().trim();
    const b2 = brand2.toLowerCase().trim();
    
    if (b1 === b2) return 1.0;
    
    // Partial brand name matching
    if (b1.includes(b2) || b2.includes(b1)) return 0.7;
    
    return 0;
  }

  // Main recommendation algorithm with enhanced similarity scoring
  public getRecommendations(
    currentProduct: Product, 
    allProducts: Product[], 
    maxRecommendations: number = 3
  ): Product[] {
    if (!currentProduct || !allProducts.length) return [];

    const seed = this.getProductSeed(currentProduct.id);
    const compatibilityMatrix = this.getCategoryCompatibility();
    const currentPrice = currentProduct.promoPrice || currentProduct.price;
    const currentCategory = currentProduct.category?.toLowerCase() || 'general';
    const currentSubcategory = currentProduct.subcategory?.toLowerCase() || '';
    const currentKeywords = this.extractKeywords(currentProduct);
    const currentBrand = currentProduct.supplierName;
    
    console.log('🎯 Smart Algorithm Processing:', {
      productId: currentProduct.id,
      category: currentCategory,
      subcategory: currentSubcategory,
      price: currentPrice,
      keywords: currentKeywords.slice(0, 5),
      totalProducts: allProducts.length
    });
    
    // Score all products
    const scoredProducts: RecommendationScore[] = allProducts
      .filter(product => 
        product.id !== currentProduct.id && 
        product.isActive !== false &&
        product.name && product.name.trim() !== ''
      )
      .map((product, index) => {
        const targetPrice = product.promoPrice || product.price;
        const targetCategory = product.category?.toLowerCase() || 'general';
        const targetSubcategory = product.subcategory?.toLowerCase() || '';
        const targetKeywords = this.extractKeywords(product);
        const targetBrand = product.supplierName;
        
        let score = 0;
        const reasons: string[] = [];
        
        // 1. Exact category match (40% weight) - HIGHEST PRIORITY for similarity
        if (targetCategory === currentCategory) {
          score += 0.4;
          reasons.push('same_category');
          
          // Bonus for exact subcategory match
          if (targetSubcategory && currentSubcategory && targetSubcategory === currentSubcategory) {
            score += 0.15;
            reasons.push('same_subcategory');
          }
        } else if (compatibilityMatrix[currentCategory]?.includes(targetCategory)) {
          score += 0.15; // Lower score for related categories
          reasons.push('related_category');
        }
        
        // 2. Price similarity (25% weight) - Very important for similarity
        const priceScore = this.getPriceCompatibilityScore(currentPrice, targetPrice);
        score += priceScore * 0.25;
        if (priceScore > 0.8) reasons.push('similar_price');
        
        // 3. Keyword similarity (20% weight) - Content similarity
        const keywordScore = this.getKeywordSimilarity(currentKeywords, targetKeywords);
        score += keywordScore * 0.2;
        if (keywordScore > 0.2) reasons.push('content_match');
        
        // 4. Brand similarity (10% weight)
        const brandScore = this.getBrandSimilarity(currentBrand, targetBrand);
        score += brandScore * 0.1;
        if (brandScore > 0) reasons.push('same_brand');
        
        // 5. Quality indicators (5% total weight)
        if (product.isYaBaBoss) {
          score += 0.03;
          reasons.push('ya_ba_boss');
        }
        if (product.isFlashOffer) {
          score += 0.02;
          reasons.push('flash_offer');
        }
        
        // 6. Location bonus for similarity
        if (currentProduct.city && product.city && currentProduct.city === product.city) {
          score += 0.05;
          reasons.push('same_location');
        }
        
        // 7. Seeded randomness for variety while maintaining consistency
        const randomFactor = this.seededRandom(seed + index) * 0.05;
        score += randomFactor;
        
        // Penalty for very different categories to prioritize true similarity
        if (targetCategory !== currentCategory && 
            !compatibilityMatrix[currentCategory]?.includes(targetCategory)) {
          score *= 0.3; // Significant penalty for unrelated categories
        }
        
        return {
          product,
          score,
          reasons
        };
      });

    // Sort by score and apply intelligent selection
    const sortedProducts = scoredProducts.sort((a, b) => b.score - a.score);
    
    console.log('🔍 Top Similar Products Found:', 
      sortedProducts.slice(0, 5).map(p => ({
        name: p.product.name?.substring(0, 30),
        category: p.product.category,
        score: p.score.toFixed(3),
        reasons: p.reasons
      }))
    );
    
    // For similarity, we want the most similar products, so take top candidates
    // with some controlled randomization to avoid always showing exact same products
    const topCandidates = sortedProducts.slice(0, Math.min(maxRecommendations * 2, sortedProducts.length));
    const finalSelection: Product[] = [];
    
    // Select products with weighted randomization favoring higher scores
    for (let i = 0; i < maxRecommendations && topCandidates.length > 0; i++) {
      const weights = topCandidates.map((_, index) => Math.pow(0.85, index)); // Strong preference for higher scores
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      let randomValue = this.seededRandom(seed + i + 200) * totalWeight;
      let selectedIndex = 0;
      
      for (let j = 0; j < weights.length; j++) {
        randomValue -= weights[j];
        if (randomValue <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      finalSelection.push(topCandidates[selectedIndex].product);
      topCandidates.splice(selectedIndex, 1); // Remove to avoid duplicates
    }
    
    console.log(`✅ Final Similar Products for ${currentProduct.name}:`, {
      count: finalSelection.length,
      products: finalSelection.map(p => ({ 
        id: p.id, 
        name: p.name?.substring(0, 25),
        category: p.category 
      }))
    });
    
    return finalSelection;
  }

  // Get diverse recommendations (for variety)
  public getDiverseRecommendations(
    currentProduct: Product,
    allProducts: Product[],
    maxRecommendations: number = 3
  ): Product[] {
    const seed = this.getProductSeed(currentProduct.id + '_diverse');
    
    // Filter products from different categories for diversity
    const differentCategoryProducts = allProducts.filter(product => 
      product.id !== currentProduct.id && 
      product.category !== currentProduct.category &&
      product.isActive !== false
    );
    
    // Add some randomization based on product seed for consistency
    const shuffled = differentCategoryProducts
      .map((product, index) => ({
        product,
        randomValue: this.seededRandom(seed + index)
      }))
      .sort((a, b) => b.randomValue - a.randomValue)
      .slice(0, maxRecommendations)
      .map(item => item.product);
    
    return shuffled;
  }
}
