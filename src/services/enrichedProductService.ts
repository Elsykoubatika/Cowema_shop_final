
import { getProductExtension } from './productExtensionsService';

export interface EnrichedProduct {
  id: string;
  externalApiId?: string;
  name: string;
  description?: string;
  price: number;
  promoPrice?: number;
  images?: string[];
  category?: string;
  subcategory?: string;
  stock?: number;
  isYaBaBoss?: boolean;
  videoUrl?: string;
  keywords?: string[];
  city?: string;
  location?: string;
  supplierName?: string;
  isActive?: boolean;
  isFlashOffer?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour la compatibilité avec l'ancien code
export interface LegacyProductExtension {
  isYaBaBoss?: boolean;
  videoUrl?: string;
  keywords?: string[];
  city?: string;
  sold?: number;
  isActive?: boolean;
  isFlashOffer?: boolean;
}

export const getProductExtensionCompat = async (productId: string): Promise<LegacyProductExtension | null> => {
  try {
    const extension = await getProductExtension(productId);
    
    if (!extension) {
      return null;
    }
    
    // Convertir au format attendu par l'ancien code
    return {
      videoUrl: extension.video_url,
      isYaBaBoss: extension.is_ya_ba_boss,
      keywords: extension.keywords,
      city: extension.city,
      isActive: extension.is_active,
      isFlashOffer: extension.is_flash_offer
    };
  } catch (error) {
    console.error('Error getting product extension:', error);
    return null;
  }
};

export const getEnrichedProductById = async (productId: string): Promise<EnrichedProduct | null> => {
  try {
    // Récupérer le produit depuis le cache local ou l'API
    const cachedProducts = localStorage.getItem('productsCache');
    const products = cachedProducts ? JSON.parse(cachedProducts) : [];
    
    const product = products.find((p: any) => p.id === productId || p.externalApiId === productId);
    
    if (product) {
      // Récupérer les extensions
      const extension = await getProductExtensionCompat(productId);
      
      return {
        id: product.id,
        externalApiId: product.externalApiId || product.id,
        name: product.name || product.title,
        description: product.description,
        price: product.price,
        promoPrice: product.promoPrice,
        images: product.images || [],
        category: product.category,
        subcategory: product.subcategory,
        stock: product.stock || 0,
        isYaBaBoss: extension?.isYaBaBoss || product.isYaBaBoss || false,
        videoUrl: extension?.videoUrl || product.videoUrl || '',
        keywords: extension?.keywords || product.keywords || [],
        city: extension?.city || product.city || '',
        location: product.location,
        supplierName: product.supplierName,
        isActive: extension?.isActive !== undefined ? extension.isActive : (product.isActive !== false),
        isFlashOffer: extension?.isFlashOffer || product.isFlashOffer || false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting enriched product:', error);
    return null;
  }
};

export const getAllEnrichedProducts = async (): Promise<EnrichedProduct[]> => {
  try {
    // Récupérer tous les produits depuis le cache local
    const cachedProducts = localStorage.getItem('productsCache');
    const products = cachedProducts ? JSON.parse(cachedProducts) : [];
    
    // Récupérer toutes les extensions
    const extensionsData = localStorage.getItem('productExtensions');
    const extensions = extensionsData ? JSON.parse(extensionsData) : {};
    
    return products.map((product: any) => {
      const extension = extensions[product.id] || {};
      
      return {
        id: product.id,
        externalApiId: product.externalApiId || product.id,
        name: product.name || product.title,
        description: product.description,
        price: product.price,
        promoPrice: product.promoPrice,
        images: product.images || [],
        category: product.category,
        subcategory: product.subcategory,
        stock: product.stock || 0,
        isYaBaBoss: extension.isYaBaBoss || product.isYaBaBoss || false,
        videoUrl: extension.videoUrl || product.videoUrl || '',
        keywords: extension.keywords || product.keywords || [],
        city: extension.city || product.city || '',
        location: product.location,
        supplierName: product.supplierName,
        isActive: extension.isActive !== undefined ? extension.isActive : (product.isActive !== false),
        isFlashOffer: extension.isFlashOffer || product.isFlashOffer || false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });
  } catch (error) {
    console.error('Error getting all enriched products:', error);
    return [];
  }
};
