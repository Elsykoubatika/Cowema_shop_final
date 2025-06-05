
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductCache } from '@/types/productCache';

export const fetchProductsFromCache = async (): Promise<ProductCache[]> => {
  console.log('Fetching products from optimized active_products view...');
  
  const { data, error } = await supabase
    .from('active_products')
    .select('*')
    .order('last_sync', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching products:', error);
    toast.error('Erreur lors du chargement des produits');
    throw error;
  }

  const formattedProducts: ProductCache[] = (data || []).map(product => ({
    id: product.id,
    externalApiId: product.external_api_id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    promoPrice: product.promo_price ? Number(product.promo_price) : undefined,
    images: product.images || [],
    category: product.category,
    subcategory: product.subcategory,
    stock: product.stock || 0,
    city: product.city,
    location: product.location,
    supplierName: product.supplier_name,
    videoUrl: product.video_url,
    keywords: product.keywords || [],
    isYaBaBoss: product.is_ya_ba_boss || false,
    isFlashOffer: product.is_flash_offer || false,
    isActive: product.is_active || true,
    lastSync: product.last_sync,
    metadata: product.metadata as Record<string, any> || {},
    createdAt: product.created_at,
    updatedAt: product.updated_at
  }));

  console.log(`Successfully loaded ${formattedProducts.length} products from active_products view`);
  return formattedProducts;
};

export const upsertProductInCache = async (
  productData: Omit<ProductCache, 'id' | 'createdAt' | 'updatedAt' | 'lastSync'>
): Promise<ProductCache | null> => {
  try {
    console.log('Upserting product:', productData.name);
    
    const { data, error } = await supabase
      .from('products_cache')
      .upsert({
        external_api_id: productData.externalApiId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        promo_price: productData.promoPrice,
        images: productData.images,
        category: productData.category,
        subcategory: productData.subcategory,
        stock: productData.stock,
        city: productData.city,
        location: productData.location,
        supplier_name: productData.supplierName,
        video_url: productData.videoUrl,
        keywords: productData.keywords,
        is_ya_ba_boss: productData.isYaBaBoss,
        is_flash_offer: productData.isFlashOffer,
        is_active: productData.isActive,
        metadata: productData.metadata,
        last_sync: new Date().toISOString()
      }, {
        onConflict: 'external_api_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting product:', error);
      toast.error('Erreur lors de la sauvegarde du produit');
      return null;
    }

    const newProduct: ProductCache = {
      id: data.id,
      externalApiId: data.external_api_id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      promoPrice: data.promo_price ? Number(data.promo_price) : undefined,
      images: data.images || [],
      category: data.category,
      subcategory: data.subcategory,
      stock: data.stock || 0,
      city: data.city,
      location: data.location,
      supplierName: data.supplier_name,
      videoUrl: data.video_url,
      keywords: data.keywords || [],
      isYaBaBoss: data.is_ya_ba_boss || false,
      isFlashOffer: data.is_flash_offer || false,
      isActive: data.is_active || true,
      lastSync: data.last_sync,
      metadata: data.metadata as Record<string, any> || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    toast.success('Produit sauvegardé avec succès');
    return newProduct;
  } catch (error) {
    console.error('Error in upsertProduct:', error);
    toast.error('Erreur lors de la sauvegarde du produit');
    return null;
  }
};
