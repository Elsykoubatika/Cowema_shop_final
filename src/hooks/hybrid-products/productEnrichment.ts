
import { useCallback } from 'react';
import { Product } from '@/types/product';
import { getProductExtension } from '@/services/productExtensionsService';

export const useProductEnrichment = () => {
  const enrichProductsWithExtensions = useCallback(async (products: Product[]): Promise<Product[]> => {
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          const extension = await getProductExtension(product.externalApiId || product.id);
          
          if (extension) {
            return {
              ...product,
              videoUrl: extension.video_url || product.videoUrl || '',
              isYaBaBoss: extension.is_ya_ba_boss !== undefined ? extension.is_ya_ba_boss : product.isYaBaBoss,
              isFlashOffer: extension.is_flash_offer !== undefined ? extension.is_flash_offer : product.isFlashOffer,
              isActive: extension.is_active !== undefined ? extension.is_active : product.isActive,
              keywords: extension.keywords || product.keywords || []
            };
          }
          
          return product;
        } catch (error) {
          console.error(`❌ Error loading extension for product ${product.id}:`, error);
          return product;
        }
      })
    );

    console.log('🔄 Products enriched with Supabase extensions:', {
      total: enrichedProducts.length,
      withVideo: enrichedProducts.filter(p => p.videoUrl).length,
      yaBaBoss: enrichedProducts.filter(p => p.isYaBaBoss).length
    });

    return enrichedProducts;
  }, []);

  return { enrichProductsWithExtensions };
};
