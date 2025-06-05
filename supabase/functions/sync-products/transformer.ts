
import { CowemaProduct, ProductCache } from './types.ts';

export class ProductTransformer {
  static transformProducts(products: CowemaProduct[]): ProductCache[] {
    return products.map(product => ({
      external_api_id: product.id.toString(),
      name: product.title,
      description: product.description || product.title, // Utiliser la description originale ou juste le titre
      price: product.regular_price || product.price,
      promo_price: product.on_sales ? product.price : null,
      images: product.thumbnail ? [product.thumbnail] : [],
      category: product.category || 'Électronique',
      subcategory: product.sub_category,
      stock: product.available_stock || 0,
      city: product.supplier_city,
      location: product.supplier_city,
      supplier_name: product.supplier,
      video_url: null,
      keywords: [
        product.category || '',
        product.sub_category || '',
        product.brand || '',
        product.supplier || ''
      ].filter(Boolean),
      is_ya_ba_boss: Math.random() > 0.7, // 30% chance d'être YA BA BOSS
      is_flash_offer: product.on_sales,
      is_active: product.available_stock > 0,
      metadata: {
        source: 'cowema',
        original_id: product.id,
        brand: product.brand,
        state: product.etat,
        published_at: product.published_at
      },
      last_sync: new Date().toISOString()
    }));
  }
}
