
import { supabase } from '@/integrations/supabase/client';

// Interface pour le mapping des produits
interface ProductMapping {
  internal_id: string;
  external_api_id: string;
  cowema_product_data: any;
  last_updated: string;
}

// Cache en mémoire pour éviter les appels répétés
const productCache = new Map<string, any>();

// Fonction pour créer ou récupérer le mapping d'un produit
export const getOrCreateProductMapping = async (cowemaProduct: any): Promise<string> => {
  try {
    // Vérifier si le produit existe déjà dans le mapping
    const { data: existingMapping } = await supabase
      .from('products_cache')
      .select('id, external_api_id')
      .eq('external_api_id', cowemaProduct.id.toString())
      .single();

    if (existingMapping) {
      return existingMapping.id;
    }

    // Créer un nouveau mapping si le produit n'existe pas
    const { data: newMapping, error } = await supabase
      .from('products_cache')
      .insert({
        external_api_id: cowemaProduct.id.toString(),
        name: cowemaProduct.title || `Produit ${cowemaProduct.id}`,
        description: cowemaProduct.description || cowemaProduct.title,
        price: cowemaProduct.regular_price || cowemaProduct.price || 0,
        promo_price: cowemaProduct.on_sales ? cowemaProduct.price : null,
        images: cowemaProduct.thumbnail ? [cowemaProduct.thumbnail] : [],
        category: cowemaProduct.category || 'Général',
        subcategory: cowemaProduct.sub_category,
        stock: cowemaProduct.available_stock || 0,
        city: cowemaProduct.supplier_city,
        supplier_name: cowemaProduct.supplier,
        metadata: {
          source: 'cowema_api',
          original_data: cowemaProduct
        }
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Error creating product mapping:', error);
      throw error;
    }

    return newMapping.id;
  } catch (error) {
    console.error('❌ Error in getOrCreateProductMapping:', error);
    // Retourner un ID par défaut en cas d'erreur
    return `temp-${cowemaProduct.id}`;
  }
};

// Fonction pour récupérer les informations d'un produit par son ID interne
export const getProductInfoById = async (internalId: string): Promise<any> => {
  try {
    // Vérifier le cache en mémoire d'abord
    if (productCache.has(internalId)) {
      return productCache.get(internalId);
    }

    // Récupérer depuis Supabase
    const { data, error } = await supabase
      .from('products_cache')
      .select('*')
      .eq('id', internalId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error fetching product info:', error);
      return null;
    }

    if (data) {
      // Mettre en cache
      productCache.set(internalId, data);
      return data;
    }

    return null;
  } catch (error) {
    console.error('❌ Error in getProductInfoById:', error);
    return null;
  }
};

// Fonction pour récupérer les informations d'un produit par son external_api_id
export const getProductInfoByExternalId = async (externalApiId: string): Promise<any> => {
  try {
    // Vérifier le cache en mémoire d'abord
    const cachedProduct = Array.from(productCache.values()).find(
      product => product.external_api_id === externalApiId
    );
    
    if (cachedProduct) {
      return cachedProduct;
    }

    // Récupérer depuis Supabase
    const { data, error } = await supabase
      .from('products_cache')
      .select('*')
      .eq('external_api_id', externalApiId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error fetching product by external ID:', error);
      return null;
    }

    if (data) {
      // Mettre en cache
      productCache.set(data.id, data);
      return data;
    }

    return null;
  } catch (error) {
    console.error('❌ Error in getProductInfoByExternalId:', error);
    return null;
  }
};

// Fonction pour synchroniser un produit avec les dernières données de l'API
export const syncProductWithAPI = async (internalId: string, apiData: any): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products_cache')
      .update({
        name: apiData.title || 'Produit sans nom',
        description: apiData.description || apiData.title,
        price: apiData.regular_price || apiData.price || 0,
        promo_price: apiData.on_sales ? apiData.price : null,
        images: apiData.thumbnail ? [apiData.thumbnail] : [],
        category: apiData.category || 'Général',
        subcategory: apiData.sub_category,
        stock: apiData.available_stock || 0,
        city: apiData.supplier_city,
        supplier_name: apiData.supplier,
        metadata: {
          source: 'cowema_api',
          original_data: apiData
        },
        last_sync: new Date().toISOString()
      })
      .eq('id', internalId);

    if (error) {
      console.error('❌ Error syncing product:', error);
    } else {
      // Supprimer du cache pour forcer le rechargement
      productCache.delete(internalId);
      console.log(`✅ Product ${internalId} synced with API`);
    }
  } catch (error) {
    console.error('❌ Error in syncProductWithAPI:', error);
  }
};

// Fonction pour nettoyer le cache
export const clearProductCache = (): void => {
  productCache.clear();
};
