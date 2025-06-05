
import { Product } from '../../types/product';
import { UnifiedCartItem } from '../../cart/types/cart.types';
import { useUnifiedCart } from '../../cart/components/CartProvider';

export const useCartInteractions = (
  product: Product | null,
  addedToCart: boolean, 
  setAddedToCart: (value: boolean) => void,
  handleAddToCart: (product: Product) => void, 
  handleRemoveFromCart: (productId: string | number) => void
) => {
  const { isInCart, addItem, removeItem } = useUnifiedCart();
  
  const handleAddToCartClick = () => {
    if (product) {
      // Utiliser directement le panier unifié pour s'assurer de la synchronisation
      const productToAdd = {
        id: String(product.id),
        title: product.title || product.name,
        name: product.name || product.title,
        price: product.price,
        promoPrice: product.promoPrice,
        image: Array.isArray(product.images) ? product.images[0] : product.images[0],
        images: product.images,
        category: product.category,
        stock: product.stock || 100,
        isYaBaBoss: product.isYaBaBoss,
        isFlashOffer: product.isFlashOffer,
        supplier: product.supplierName,
        location: product.location
      };
      
      addItem(productToAdd);
      setAddedToCart(true);
      
      console.log('Product added via useCartInteractions:', productToAdd);
    }
  };

  const handleRemoveFromCartClick = () => {
    if (product) {
      const productId = String(product.id);
      removeItem(productId);
      setAddedToCart(false);
      
      console.log('Product removed via useCartInteractions:', productId);
    }
  };
  
  const handleCartClick = () => {
    const cartButton = document.querySelector('[data-cart-toggle]');
    if (cartButton instanceof HTMLElement) {
      cartButton.click();
    }
  };

  // Vérifier si le produit est déjà dans le panier en utilisant le panier unifié
  const isProductInCart = product ? isInCart(String(product.id)) : false;

  // Function to combine cart items with current product
  const getAllOrderItems = (product: Product | null, upsellProduct: Product | null, cartItems: UnifiedCartItem[]) => {
    const currentProductItem = product ? [{
      id: String(product.id),
      title: product.title || product.name,
      price: product.price,
      promoPrice: product.promoPrice || null,
      quantity: 1,
      image: Array.isArray(product.images) ? product.images[0] : product.images[0] || '',
      category: product.category || ''
    }] : [];
    
    // Only include upsell product if it was accepted (not null)
    const upsellProductItem = upsellProduct ? [{
      id: String(upsellProduct.id),
      title: upsellProduct.title || upsellProduct.name,
      price: upsellProduct.price,
      promoPrice: upsellProduct.promoPrice || null,
      quantity: 1,
      image: Array.isArray(upsellProduct.images) ? upsellProduct.images[0] : upsellProduct.images[0] || '',
      category: upsellProduct.category || ''
    }] : [];
    
    const cartItemsFormatted = cartItems.map(item => ({
      id: String(item.id),
      title: item.title || item.name,
      price: item.price,
      promoPrice: item.promoPrice || null,
      quantity: item.quantity,
      image: item.image || '',
      category: item.category || ''
    }));
    
    // Show current product first, then upsell product, then cart items
    // But exclude current product if it's already in the cart to avoid duplication
    const filteredCartItems = product
      ? cartItemsFormatted.filter(item => String(item.id) !== String(product.id))
      : cartItemsFormatted;
    
    return [...currentProductItem, ...upsellProductItem, ...filteredCartItems];
  };

  return {
    handleAddToCartClick,
    handleRemoveFromCartClick,
    handleCartClick,
    getAllOrderItems,
    isProductInCart
  };
};
