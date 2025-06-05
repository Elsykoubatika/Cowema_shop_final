import { supabase } from '@/integrations/supabase/client';

export const fetchOrdersQuery = async () => {
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
  console.log('🔍 Sample order with items:', data?.[0]);
  return data;
};

export const fetchSingleOrderQuery = async (orderId: string) => {
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
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching single order:', error);
    throw error;
  }

  console.log('🔍 Single order with items:', data);
  return data;
};

// Fonction améliorée pour enrichir les order_items avec toutes les informations nécessaires
export const enrichOrderItemsQuery = async (orderItems: any[]) => {
  if (!orderItems || orderItems.length === 0) {
    console.log('⚠️ No order items to enrich');
    return [];
  }

  console.log('🔍 Enriching order items:', orderItems);
  const enrichedItems = [];

  for (const item of orderItems) {
    let enrichedItem = { ...item };
    
    console.log('🔍 Processing item:', {
      id: item.id,
      title: item.title,
      image: item.image,
      price_at_time: item.price_at_time,
      quantity: item.quantity,
      product_id: item.product_id
    });

    // Si les informations essentielles sont déjà présentes, les utiliser
    if (item.title && item.price_at_time) {
      console.log('✅ Item already has essential info:', item.title);
      enrichedItem = {
        ...enrichedItem,
        title: item.title,
        image: item.image || null,
        price_at_time: Number(item.price_at_time) || 0,
        promo_price: item.promo_price ? Number(item.promo_price) : null,
        quantity: Number(item.quantity) || 1
      };
    } else if (item.product_id) {
      // Sinon, essayer de récupérer depuis les tables produits
      console.log('🔄 Fetching product info for:', item.product_id);
      
      try {
        // Essayer d'abord products_unified
        let { data: productData } = await supabase
          .from('products_unified')
          .select('name, images, price, promo_price')
          .eq('id', item.product_id)
          .single();

        // Si pas trouvé, essayer active_products
        if (!productData) {
          console.log('🔄 Trying active_products for:', item.product_id);
          const { data: activeProductData } = await supabase
            .from('active_products')
            .select('name, images, price, promo_price')
            .eq('id', item.product_id)
            .single();
          
          productData = activeProductData;
        }

        // Si pas trouvé, essayer products_cache avec external_api_id
        if (!productData) {
          console.log('🔄 Trying products_cache with external_api_id for:', item.product_id);
          const { data: cacheProductData } = await supabase
            .from('products_cache')
            .select('name, images, price, promo_price')
            .eq('external_api_id', item.product_id)
            .single();
          
          productData = cacheProductData;
        }

        // Enrichir avec les données produit trouvées
        if (productData) {
          console.log('✅ Found product data:', productData);
          enrichedItem = {
            ...enrichedItem,
            title: enrichedItem.title || productData.name || 'Produit sans nom',
            image: enrichedItem.image || (productData.images && productData.images[0]) || null,
            price_at_time: enrichedItem.price_at_time || Number(productData.price) || 0,
            promo_price: enrichedItem.promo_price || (productData.promo_price ? Number(productData.promo_price) : null),
            quantity: Number(enrichedItem.quantity) || 1
          };
        } else {
          console.log('⚠️ No product data found for:', item.product_id);
          // Utiliser des valeurs par défaut si aucune donnée produit n'est trouvée
          enrichedItem = {
            ...enrichedItem,
            title: enrichedItem.title || `Produit #${item.product_id?.substring(0, 8) || 'inconnu'}`,
            image: enrichedItem.image || null,
            price_at_time: Number(enrichedItem.price_at_time) || 0,
            promo_price: enrichedItem.promo_price ? Number(enrichedItem.promo_price) : null,
            quantity: Number(enrichedItem.quantity) || 1
          };
        }
      } catch (error) {
        console.error('❌ Error enriching order item:', error);
        // En cas d'erreur, utiliser les données existantes ou des valeurs par défaut
        enrichedItem = {
          ...enrichedItem,
          title: enrichedItem.title || `Produit #${item.product_id?.substring(0, 8) || 'inconnu'}`,
          image: enrichedItem.image || null,
          price_at_time: Number(enrichedItem.price_at_time) || 0,
          promo_price: enrichedItem.promo_price ? Number(enrichedItem.promo_price) : null,
          quantity: Number(enrichedItem.quantity) || 1
        };
      }
    } else {
      // Aucun product_id, utiliser les données existantes ou des valeurs par défaut
      console.log('⚠️ No product_id available for item:', item.id);
      enrichedItem = {
        ...enrichedItem,
        title: enrichedItem.title || 'Produit sans nom',
        image: enrichedItem.image || null,
        price_at_time: Number(enrichedItem.price_at_time) || 0,
        promo_price: enrichedItem.promo_price ? Number(enrichedItem.promo_price) : null,
        quantity: Number(enrichedItem.quantity) || 1
      };
    }

    console.log('✅ Enriched item final:', {
      title: enrichedItem.title,
      image: enrichedItem.image,
      price: enrichedItem.price_at_time,
      quantity: enrichedItem.quantity
    });

    enrichedItems.push(enrichedItem);
  }

  console.log('✅ All items enriched:', enrichedItems.length);
  return enrichedItems;
};

export const createOrderQuery = async (orderData: any) => {
  const { data, error } = await supabase
    .from('customer_orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return data;
};

export const assignOrderQuery = async (orderId: string, userId: string) => {
  const { error } = await supabase
    .from('customer_orders')
    .update({ assigned_to: userId, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error assigning order:', error);
    throw error;
  }
};

export const updateOrderStatusQuery = async (orderId: string, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') => {
  const { error } = await supabase
    .from('customer_orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
