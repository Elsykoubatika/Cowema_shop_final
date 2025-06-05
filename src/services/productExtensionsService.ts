
import { supabase } from '@/integrations/supabase/client';

export interface ProductExtension {
  id?: string;
  product_id: string;
  video_url?: string;
  is_ya_ba_boss?: boolean;
  keywords?: string[];
  city?: string;
  is_active?: boolean;
  is_flash_offer?: boolean;
}

export const getProductExtension = async (productId: string): Promise<ProductExtension | null> => {
  try {
    const { data, error } = await supabase
      .from('product_extensions')
      .select('*')
      .eq('product_id', productId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching product extension:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Error in getProductExtension:', error);
    return null;
  }
};

export const getAllProductExtensions = async (): Promise<Record<string, ProductExtension>> => {
  try {
    const { data, error } = await supabase
      .from('product_extensions')
      .select('*');

    if (error) {
      console.error('❌ Error fetching product extensions:', error);
      return {};
    }

    // Convertir en objet avec product_id comme clé
    const extensionsMap: Record<string, ProductExtension> = {};
    data?.forEach(extension => {
      extensionsMap[extension.product_id] = extension;
      
      // Aussi ajouter une entrée avec l'ID en tant que nombre si c'est différent
      const numericId = parseInt(extension.product_id);
      if (!isNaN(numericId) && numericId.toString() === extension.product_id) {
        extensionsMap[numericId] = extension;
      }
    });

    console.log(`✅ Loaded ${data?.length || 0} product extensions from Supabase`);

    return extensionsMap;
  } catch (error) {
    console.error('❌ Error in getAllProductExtensions:', error);
    return {};
  }
};

export const saveProductExtension = async (extension: ProductExtension): Promise<ProductExtension | null> => {
  try {
    const { data, error } = await supabase
      .from('product_extensions')
      .upsert({
        product_id: extension.product_id,
        video_url: extension.video_url,
        is_ya_ba_boss: extension.is_ya_ba_boss,
        keywords: extension.keywords,
        city: extension.city,
        is_active: extension.is_active,
        is_flash_offer: extension.is_flash_offer
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving product extension:', error);
      return null;
    }

    console.log(`✅ Saved extension for product ${extension.product_id}`);
    return data;
  } catch (error) {
    console.error('❌ Error in saveProductExtension:', error);
    return null;
  }
};

export const deleteProductExtension = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('product_extensions')
      .delete()
      .eq('product_id', productId);

    if (error) {
      console.error('❌ Error deleting product extension:', error);
      return false;
    }

    console.log(`✅ Deleted extension for product ${productId}`);
    return true;
  } catch (error) {
    console.error('❌ Error in deleteProductExtension:', error);
    return false;
  }
};
