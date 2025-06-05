
// Interface for our product matching system
interface ProductMatchScore {
  product: any;
  score: number;
}

// Enhanced ML model for product suggestions with multiple algorithms
export class ProductRecommender {
  private categoryWeights: Record<string, number> = {
    'same_category': 0.3,
    'complementary_category': 0.5,
    'subcategory_match': 0.8,
    'keyword_match': 0.7,
    'price_range': 0.4,
    'brand_match': 0.6,
    'popularity': 0.3
  };
  
  private complementaryCategories: Record<string, string[]> = {
    "phones": ["accessories", "electronics", "audio", "cases", "chargers"],
    "computers": ["accessories", "electronics", "peripherals", "software", "storage"],
    "electronics": ["accessories", "phones", "computers", "audio", "gaming"],
    "fashion": ["accessories", "beauty", "clothing", "shoes", "bags"],
    "beauty": ["fashion", "accessories", "skincare", "makeup", "wellness"],
    "accessories": ["phones", "computers", "electronics", "fashion", "beauty"],
    "audio": ["phones", "electronics", "accessories", "music", "gaming"],
    "peripherals": ["computers", "accessories", "electronics", "gaming"],
    "skincare": ["beauty", "health", "cosmetics", "wellness"],
    "clothing": ["fashion", "accessories", "footwear", "style"],
    "health": ["beauty", "skincare", "fitness", "wellness", "supplements"]
  };

  private keywordMap: Record<string, string[]> = {
    "smartphone": ["coque", "écouteurs", "chargeur", "protection", "sans fil", "bluetooth"],
    "laptop": ["souris", "clavier", "sac", "chargeur", "support", "cooling", "externe"],
    "audio": ["casque", "enceinte", "bluetooth", "sans fil", "microphone", "studio"],
    "skincare": ["hydratant", "sérum", "nettoyant", "masque", "crème", "anti-âge"],
    "fashion": ["accessoire", "bijoux", "ceinture", "sac", "portefeuille", "style"],
    "gaming": ["manette", "clavier", "souris", "casque", "écran", "console"],
    "sport": ["équipement", "vêtement", "chaussures", "fitness", "entrainement"]
  };

  // Algorithm 1: Content-based similarity (for "Articles similaires")
  public findSimilarProducts(mainProduct: any, allProducts: any[], type: 'frequently_bought' | 'checkout_upsell'): ProductMatchScore[] {
    if (!mainProduct || !Array.isArray(allProducts) || allProducts.length === 0) {
      console.warn('ProductRecommender: Invalid inputs for recommendations');
      return [];
    }
    
    try {
      const scores: ProductMatchScore[] = [];
      const mainCategory = (mainProduct.category?.toLowerCase() || '');
      const mainSubcategory = ((mainProduct as any).subcategory?.toLowerCase() || '');
      const mainKeywords = this.extractKeywords(mainProduct.title || mainProduct.name || '', mainProduct.description || '');
      const mainPrice = mainProduct.promoPrice || mainProduct.price || 0;
      
      for (const product of allProducts) {
        if (!product || !product.id || product.id === mainProduct.id) continue;
        
        let score = 0;
        const category = product.category?.toLowerCase() || '';
        const subcategory = (product as any).subcategory?.toLowerCase() || '';
        const productPrice = product.promoPrice || product.price || 0;
        
        if (type === 'frequently_bought') {
          // Algorithm for "Articles similaires" - focus on content similarity
          score = this.calculateContentSimilarity(mainProduct, product, mainCategory, category, mainSubcategory, subcategory, mainKeywords, mainPrice, productPrice);
        } else {
          // Algorithm for "Vous aimeriez ceci" - focus on collaborative filtering
          score = this.calculateCollaborativeSimilarity(mainProduct, product, mainCategory, category, mainPrice, productPrice);
        }
        
        scores.push({ product, score });
      }
      
      return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error in product recommendation algorithm:', error);
      return [];
    }
  }

  // Content-based algorithm for "Articles similaires"
  private calculateContentSimilarity(
    mainProduct: any, 
    product: any, 
    mainCategory: string, 
    category: string, 
    mainSubcategory: string, 
    subcategory: string, 
    mainKeywords: string[], 
    mainPrice: number, 
    productPrice: number
  ): number {
    let score = 0;
    
    // Strong preference for same category
    if (category === mainCategory) {
      score += this.categoryWeights.same_category * 2;
    }
    
    // Subcategory exact match
    if (subcategory && mainSubcategory && subcategory === mainSubcategory) {
      score += this.categoryWeights.subcategory_match;
    }
    
    // Keyword analysis with higher weight
    const productKeywords = this.extractKeywords(product.title || product.name || '', product.description || '');
    const keywordMatches = this.countKeywordMatches(mainKeywords, productKeywords);
    score += (keywordMatches / Math.max(1, mainKeywords.length)) * this.categoryWeights.keyword_match * 1.5;
    
    // Similar price range preference
    const priceDifference = Math.abs(mainPrice - productPrice) / Math.max(mainPrice, productPrice, 1);
    if (priceDifference < 0.3) { // Within 30% price range
      score += this.categoryWeights.price_range;
    }
    
    // Brand similarity
    if (mainProduct.supplierName && product.supplierName && 
        mainProduct.supplierName.toLowerCase() === product.supplierName.toLowerCase()) {
      score += this.categoryWeights.brand_match;
    }
    
    return score;
  }

  // Collaborative filtering algorithm for "Vous aimeriez ceci"
  private calculateCollaborativeSimilarity(
    mainProduct: any, 
    product: any, 
    mainCategory: string, 
    category: string, 
    mainPrice: number, 
    productPrice: number
  ): number {
    let score = 0;
    
    // Complementary categories get higher score
    if (this.complementaryCategories[mainCategory]?.includes(category)) {
      score += this.categoryWeights.complementary_category * 1.5;
    }
    
    // Different category but related keywords
    if (category !== mainCategory) {
      score += 0.4; // Bonus for diversity
    }
    
    // Price-based recommendations (upsell opportunities)
    if (productPrice > mainPrice * 0.3 && productPrice < mainPrice * 2) {
      score += this.categoryWeights.price_range * 1.2;
    }
    
    // Popularity boost (based on stock levels - lower stock = more popular)
    if (product.stock && product.stock < 10) {
      score += this.categoryWeights.popularity;
    }
    
    // Ya Ba Boss products get priority
    if (product.isYaBaBoss) {
      score += 0.8;
    }
    
    // Flash offers get priority
    if (product.isFlashOffer) {
      score += 0.6;
    }
    
    // Location-based similarity
    if (mainProduct.city && product.city && mainProduct.city === product.city) {
      score += 0.3;
    }
    
    return score;
  }
  
  private extractKeywords(title: string, description: string): string[] {
    if (!title && !description) return [];
    
    try {
      const text = (title + ' ' + description).toLowerCase();
      let keywords: string[] = [];
      
      // Extract keywords from our mapping
      Object.entries(this.keywordMap).forEach(([key, values]) => {
        if (text.includes(key.toLowerCase())) {
          keywords.push(key.toLowerCase());
          keywords = [...keywords, ...values];
        }
      });
      
      // Add specific keywords from the text
      const words = text.split(/\s+/);
      const significantWords = words.filter(word => 
        word.length > 4 && !["avec", "pour", "dans", "cette", "votre", "notre", "leurs", "très", "plus", "tout", "sans"].includes(word)
      );
      
      return [...new Set([...keywords, ...significantWords])];
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return [];
    }
  }
  
  private countKeywordMatches(keywords1: string[], keywords2: string[]): number {
    if (!Array.isArray(keywords1) || !Array.isArray(keywords2)) return 0;
    return keywords1.filter(kw => keywords2.includes(kw)).length;
  }
}
