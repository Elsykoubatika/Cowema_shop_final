
import { UnifiedCartItem, AddToCartProduct } from '../types/cart.types';

export const convertToCartItem = (product: AddToCartProduct, quantity: number = 1): UnifiedCartItem => {
  // Normaliser l'ID en string
  const normalizedId = String(product.id);
  
  // Gérer les différents formats de prix
  const price = typeof product.price === 'string' 
    ? parseFloat(product.price.replace(/\s/g, '')) || 0
    : Number(product.price) || 0;
    
  const promoPrice = product.promoPrice 
    ? (typeof product.promoPrice === 'string' 
        ? parseFloat(product.promoPrice.replace(/\s/g, '')) || undefined
        : Number(product.promoPrice) || undefined)
    : undefined;

  // Gérer les différents formats d'images
  let imageUrl = '';
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    imageUrl = product.images[0];
  } else if (product.image) {
    imageUrl = product.image;
  }

  const title = product.title || product.name || 'Produit sans nom';

  return {
    id: normalizedId,
    productId: normalizedId,
    title,
    name: title,
    price,
    promoPrice,
    quantity,
    image: imageUrl,
    category: product.category || 'Non catégorisé',
    stock: Number(product.stock) || 100, // Stock par défaut si non spécifié
    metadata: {
      isYaBaBoss: Boolean(product.isYaBaBoss),
      isFlashOffer: Boolean(product.isFlashOffer),
      supplier: product.supplier,
      location: product.location
    }
  };
};

export const convertFromCartItem = (cartItem: UnifiedCartItem): AddToCartProduct => {
  return {
    id: cartItem.id,
    title: cartItem.title,
    name: cartItem.name,
    price: cartItem.price,
    promoPrice: cartItem.promoPrice,
    image: cartItem.image,
    images: cartItem.image ? [cartItem.image] : [],
    category: cartItem.category,
    stock: cartItem.stock,
    isYaBaBoss: cartItem.metadata?.isYaBaBoss,
    isFlashOffer: cartItem.metadata?.isFlashOffer,
    supplier: cartItem.metadata?.supplier,
    location: cartItem.metadata?.location
  };
};

export const sanitizeCartData = (data: any): UnifiedCartItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item: any) => {
      // Vérifier que l'item a les propriétés essentielles
      return item && 
             (item.id || item.productId) && 
             (item.title || item.name) && 
             typeof item.price === 'number' && 
             item.price > 0 &&
             typeof item.quantity === 'number' && 
             item.quantity > 0;
    })
    .map((item: any): UnifiedCartItem => {
      // Normaliser l'ID
      const id = String(item.id || item.productId);
      const title = item.title || item.name || 'Produit sans nom';
      
      return {
        id,
        productId: id,
        title,
        name: title,
        price: Number(item.price) || 0,
        promoPrice: item.promoPrice ? Number(item.promoPrice) : undefined,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: item.image || '',
        category: item.category || 'Non catégorisé',
        stock: Number(item.stock) || 100,
        metadata: {
          isYaBaBoss: Boolean(item.metadata?.isYaBaBoss || item.isYaBaBoss),
          isFlashOffer: Boolean(item.metadata?.isFlashOffer || item.isFlashOffer),
          supplier: item.metadata?.supplier || item.supplier,
          location: item.metadata?.location || item.location
        }
      };
    });
};
