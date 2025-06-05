
import { Product } from '@/types/product';

export const applyProductExtensions = async (products: Product[]): Promise<Product[]> => {
  try {
    // Récupérer les extensions depuis le localStorage ou une API
    const extensionsData = localStorage.getItem('productExtensions');
    const extensions = extensionsData ? JSON.parse(extensionsData) : {};
    
    return products.map(product => {
      const extension = extensions[product.id];
      if (extension) {
        return {
          ...product,
          isYaBaBoss: extension.isYaBaBoss ?? product.isYaBaBoss,
          videoUrl: extension.videoUrl ?? product.videoUrl,
          keywords: extension.keywords ?? product.keywords,
          city: extension.city ?? product.city,
          sold: extension.sold ?? product.sold,
          isActive: extension.isActive ?? product.isActive,
          isFlashOffer: extension.isFlashOffer ?? product.isFlashOffer
        };
      }
      return product;
    });
  } catch (error) {
    console.error('Error applying product extensions:', error);
    return products;
  }
};
