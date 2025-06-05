
import { saveProductExtension, deleteProductExtension, ProductExtension } from './productExtensionsService';
import { LegacyProductExtension } from './enrichedProductService';

export const saveProductExtensionCompat = async (productId: string, extension: Partial<LegacyProductExtension>): Promise<void> => {
  try {
    console.log(`🔄 Saving product extension for product ${productId}:`, extension);
    
    const extensionData: ProductExtension = {
      product_id: productId,
      video_url: extension.videoUrl,
      is_ya_ba_boss: extension.isYaBaBoss,
      keywords: extension.keywords,
      city: extension.city,
      is_active: extension.isActive,
      is_flash_offer: extension.isFlashOffer
    };
    
    const result = await saveProductExtension(extensionData);
    
    if (!result) {
      throw new Error('Failed to save product extension to Supabase');
    }
    
    console.log('✅ Product extension saved to Supabase successfully');
  } catch (error) {
    console.error('❌ Error saving product extension:', error);
    throw new Error('Failed to save product extension');
  }
};

export const deleteProductExtensionCompat = async (productId: string): Promise<void> => {
  try {
    const success = await deleteProductExtension(productId);
    
    if (!success) {
      throw new Error('Failed to delete product extension from Supabase');
    }
    
    console.log('✅ Product extension deleted successfully');
  } catch (error) {
    console.error('Error deleting product extension:', error);
    throw new Error('Failed to delete product extension');
  }
};

const updateProductInCache = async (productId: string, extension: Partial<LegacyProductExtension>): Promise<void> => {
  try {
    const cachedProducts = localStorage.getItem('productsCache');
    if (cachedProducts) {
      const products = JSON.parse(cachedProducts);
      const updatedProducts = products.map((product: any) => {
        if (product.id === productId || product.externalApiId === productId) {
          return {
            ...product,
            videoUrl: extension.videoUrl !== undefined ? extension.videoUrl : product.videoUrl,
            isYaBaBoss: extension.isYaBaBoss !== undefined ? extension.isYaBaBoss : product.isYaBaBoss,
            isFlashOffer: extension.isFlashOffer !== undefined ? extension.isFlashOffer : product.isFlashOffer,
            isActive: extension.isActive !== undefined ? extension.isActive : product.isActive,
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      });
      
      localStorage.setItem('productsCache', JSON.stringify(updatedProducts));
      console.log('✅ Product cache updated for product:', productId);
    }
  } catch (error) {
    console.error('❌ Error updating product cache:', error);
  }
};
