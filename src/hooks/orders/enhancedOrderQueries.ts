
import { supabase } from '@/integrations/supabase/client';
import { getProductInfoById, getProductInfoByExternalId } from './productMapping';

// Fonction améliorée pour enrichir les order_items avec les informations des produits
export const enrichOrderItemsWithMapping = async (orderItems: any[]) => {
  if (!orderItems || orderItems.length === 0) {
    console.log('⚠️ No order items to enrich');
    return [];
  }

  console.log('🔍 Enriching order items with product mapping:', orderItems.length);
  const enrichedItems = [];

  for (const item of orderItems) {
    let enrichedItem = { ...item };
    
    console.log('🔍 Processing item:', {
      id: item.id,
      title: item.title,
      product_id: item.product_id,
      hasBasicInfo: !!(item.title && item.price_at_time)
    });

    // Si les informations essentielles sont déjà présentes et correctes, les utiliser
    if (item.title && item.price_at_time && item.title !== 'Produit sans nom') {
      console.log('✅ Item already has complete info:', item.title);
      enrichedItem = {
        ...enrichedItem,
        title: item.title,
        image: item.image || null,
        price_at_time: Number(item.price_at_time) || 0,
        promo_price: item.promo_price ? Number(item.promo_price) : null,
        quantity: Number(item.quantity) || 1
      };
    } else if (item.product_id) {
      // Essayer de récupérer les informations depuis notre système de mapping
      console.log('🔄 Fetching product info from mapping for:', item.product_id);
      
      try {
        // Essayer d'abord avec l'ID interne
        let productData = await getProductInfoById(item.product_id);
        
        // Si pas trouvé, essayer avec l'external_api_id
        if (!productData) {
          productData = await getProductInfoByExternalId(item.product_id);
        }

        // Si toujours pas trouvé, essayer les autres tables comme fallback
        if (!productData) {
          console.log('🔄 Trying fallback tables for:', item.product_id);
          
          // Essayer products_unified
          const { data: unifiedData } = await supabase
            .from('products_unified')
            .select('name, images, price, promo_price')
            .eq('id', item.product_id)
            .single();

          if (unifiedData) {
            productData = {
              name: unifiedData.name,
              images: unifiedData.images || [],
              price: unifiedData.price,
              promo_price: unifiedData.promo_price
            };
          }
        }

        // Enrichir avec les données trouvées
        if (productData) {
          console.log('✅ Found product data via mapping:', {
            name: productData.name,
            hasImages: !!(productData.images && productData.images.length > 0)
          });
          
          enrichedItem = {
            ...enrichedItem,
            title: productData.name || item.title || 'Produit sans nom',
            image: productData.images && productData.images.length > 0 
              ? productData.images[0] 
              : item.image || null,
            price_at_time: Number(item.price_at_time) || Number(productData.price) || 0,
            promo_price: item.promo_price 
              ? Number(item.promo_price) 
              : (productData.promo_price ? Number(productData.promo_price) : null),
            quantity: Number(item.quantity) || 1
          };
        } else {
          console.log('⚠️ No product data found, using defaults for:', item.product_id);
          // Utiliser des valeurs par défaut
          enrichedItem = {
            ...enrichedItem,
            title: item.title || `Produit #${item.product_id?.substring(0, 8) || 'inconnu'}`,
            image: item.image || null,
            price_at_time: Number(item.price_at_time) || 0,
            promo_price: item.promo_price ? Number(item.promo_price) : null,
            quantity: Number(item.quantity) || 1
          };
        }
      } catch (error) {
        console.error('❌ Error enriching order item with mapping:', error);
        // En cas d'erreur, utiliser les données existantes
        enrichedItem = {
          ...enrichedItem,
          title: item.title || `Produit #${item.product_id?.substring(0, 8) || 'inconnu'}`,
          image: item.image || null,
          price_at_time: Number(item.price_at_time) || 0,
          promo_price: item.promo_price ? Number(item.promo_price) : null,
          quantity: Number(item.quantity) || 1
        };
      }
    } else {
      // Aucun product_id, utiliser les données existantes
      console.log('⚠️ No product_id available for item:', item.id);
      enrichedItem = {
        ...enrichedItem,
        title: item.title || 'Produit sans nom',
        image: item.image || null,
        price_at_time: Number(item.price_at_time) || 0,
        promo_price: item.promo_price ? Number(item.promo_price) : null,
        quantity: Number(item.quantity) || 1
      };
    }

    console.log('✅ Final enriched item:', {
      title: enrichedItem.title,
      hasImage: !!enrichedItem.image,
      price: enrichedItem.price_at_time,
      quantity: enrichedItem.quantity
    });

    enrichedItems.push(enrichedItem);
  }

  console.log('✅ All items enriched with mapping:', enrichedItems.length);
  return enrichedItems;
};

// Fonction pour récupérer les commandes avec enrichissement amélioré
export const fetchOrdersWithMapping = async () => {
  const { data, error } = await supabase
    .from('customer_orders')
    .select(`
      *,
      order_items (
        id,
        title,
        quantity,
        price_at_time,
        promo_price,
        image,
        product_id,
        customer_order_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  console.log('🔍 Raw orders data from Supabase:', data);

  // Enrichir chaque commande avec les informations produits
  const enrichedData = [];
  for (const order of data) {
    const enrichedOrder = { ...order };
    
    if (order.order_items && order.order_items.length > 0) {
      console.log(`🔍 Enriching order ${order.id.substring(0, 8)} with mapping`);
      enrichedOrder.order_items = await enrichOrderItemsWithMapping(order.order_items);
    } else {
      enrichedOrder.order_items = [];
    }
    
    enrichedData.push(enrichedOrder);
  }

  console.log(`✅ Orders enriched with product mapping:`, enrichedData.length);
  return enrichedData;
};
