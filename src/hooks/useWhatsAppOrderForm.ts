
import { useState, useEffect, useCallback } from 'react';
import { usePromotionStore } from '@/hooks/usePromotionStore';
import { useDeliveryFeesData } from '@/hooks/useDeliveryFeesData';
import { toast } from "sonner";

interface CartItem {
  id: string;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  neighborhood: string;
  notes: string;
  promoCode: string;
}

export const useWhatsAppOrderForm = (isOpen: boolean, initialItems: any[] = [], product?: any) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Brazzaville',
    neighborhood: 'Centre-ville',
    notes: '',
    promoCode: ''
  });

  const { promotions } = usePromotionStore();
  const { cities, neighborhoods, getDeliveryFee } = useDeliveryFeesData();
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // Initialize items only when modal opens (not on every render)
  useEffect(() => {
    if (isOpen) {
      console.log('WhatsApp Form - Initializing items:', { cartItems: initialItems, product });
      
      let allItems: CartItem[] = [];
      
      // Add cart items first
      if (initialItems && initialItems.length > 0) {
        const cartOrderItems = initialItems.map(item => ({
          id: String(item.id),
          title: item.title || item.name,
          price: item.price,
          promoPrice: item.promoPrice || null,
          quantity: item.quantity || 1,
          image: Array.isArray(item.images) ? item.images[0] : item.image || item.images || '',
          category: item.category
        }));
        allItems = [...allItems, ...cartOrderItems];
      }
      
      // Add main product if not already in cart
      if (product && !allItems.some(item => item.id === String(product.id))) {
        allItems.push({
          id: String(product.id),
          title: product.title || product.name,
          price: product.price,
          promoPrice: product.promoPrice || null,
          quantity: 1,
          image: Array.isArray(product.images) ? product.images[0] : product.images || '',
          category: product.category
        });
      }
      
      console.log('WhatsApp Form - Final items to display:', allItems);
      setItems(allItems);
      
      // Reset form data only when opening
      setCustomerInfo({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        city: 'Brazzaville',
        neighborhood: 'Centre-ville',
        notes: '',
        promoCode: ''
      });
      setAppliedPromo(null);
    }
  }, [isOpen]); // Only depend on isOpen to prevent constant resets

  // Calculate functions
  const calculateSubtotal = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.promoPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  const calculateDeliveryFee = useCallback((): number => {
    return getDeliveryFee(customerInfo.city, customerInfo.neighborhood);
  }, [customerInfo.city, customerInfo.neighborhood, getDeliveryFee]);

  const calculateDiscount = useCallback((subtotal: number): number => {
    if (!appliedPromo) return 0;
    return Math.round(subtotal * (appliedPromo.discount / 100));
  }, [appliedPromo]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const deliveryFee = calculateDeliveryFee();
    return subtotal - discount + deliveryFee;
  }, [calculateSubtotal, calculateDiscount, calculateDeliveryFee]);

  // Event handlers
  const validatePromoCode = useCallback(() => {
    setAppliedPromo(null);
    
    if (!customerInfo.promoCode) return;
    
    const now = new Date();
    const foundPromo = promotions.find(
      p => p.code.toLowerCase() === customerInfo.promoCode.toLowerCase() && 
      p.isActive && 
      new Date(p.expiryDate) > now
    );
    
    if (foundPromo) {
      setAppliedPromo({
        code: foundPromo.code,
        discount: foundPromo.discount
      });
      toast.success(`Code promo '${foundPromo.code}' appliqué avec succès! -${foundPromo.discount}%`);
    } else {
      toast.error("Code promo invalide ou expiré");
    }
  }, [customerInfo.promoCode, promotions]);

  const handleQuantityChange = useCallback((itemId: string, change: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  // Fixed input change handler to prevent field clearing
  const handleInputChange = useCallback((field: string, value: string) => {
    console.log(`[WhatsApp Form] Updating ${field} with value:`, value);
    
    setCustomerInfo(prev => {
      const newCustomerInfo = { ...prev };
      
      if (field === 'city') {
        const newNeighborhoods = neighborhoods[value as keyof typeof neighborhoods];
        const firstNeighborhood = newNeighborhoods?.[0] || 'Centre-ville';
        console.log(`[WhatsApp Form] City changed to ${value}, neighborhood set to ${firstNeighborhood}`);
        
        newCustomerInfo.city = value;
        newCustomerInfo.neighborhood = firstNeighborhood;
      } else {
        newCustomerInfo[field as keyof CustomerInfo] = value;
      }
      
      console.log('[WhatsApp Form] New customer info:', newCustomerInfo);
      return newCustomerInfo;
    });
  }, [neighborhoods]);

  return {
    items,
    customerInfo,
    appliedPromo,
    cities,
    neighborhoods,
    calculateSubtotal,
    calculateDeliveryFee,
    calculateDiscount,
    calculateTotal,
    validatePromoCode,
    handleQuantityChange,
    handleRemoveItem,
    handleInputChange,
    setCustomerInfo,
    setAppliedPromo
  };
};
