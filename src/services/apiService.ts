
// Re-export everything from the refactored services for backward compatibility
export type { EnrichedProduct, LegacyProductExtension } from './enrichedProductService';
export type { Category } from './categoryService';

export { 
  getEnrichedProductById, 
  getAllEnrichedProducts,
  getProductExtensionCompat as getProductExtension 
} from './enrichedProductService';

export { 
  saveProductExtensionCompat as saveProductExtension,
  deleteProductExtensionCompat as deleteProductExtension 
} from './productExtensionCompatService';

export { 
  getAllCategories,
  saveCategory,
  deleteCategory,
  addSubcategory,
  deleteSubcategory 
} from './categoryService';

export { refreshProductsCache } from './productsCacheService';
