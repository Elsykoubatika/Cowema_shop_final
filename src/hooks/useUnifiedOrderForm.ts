
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { usePromotionStore } from './usePromotionStore';
import { useDeliveryFees } from './useDeliveryFees';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
  discountApplied?: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  neighborhood: string;
  notes: string;
}

interface AppliedPromo {
  code: string;
  discount: number;
}

const generateHookId = () => Math.random().toString(36).substr(2, 9);

export const useUnifiedOrderForm = (
  isOpen: boolean,
  initialItems: any[] = [],
  orderType: string = 'whatsapp',
  bundleDiscount?: number
) => {
  const hookId = useRef(generateHookId()).current;
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Brazzaville',
    neighborhood: 'Centre-ville',
    notes: ''
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const initializedRef = useRef(false);

  const { promotions } = usePromotionStore();
  const { cities, getDeliveryFee } = useDeliveryFees();

  console.log(`[useUnifiedOrderForm-${hookId}] Hook called - isOpen: ${isOpen}, orderType: ${orderType}, itemsCount: ${initialItems.length}`);

  // Initialize items whenever initialItems change, regardless of isOpen state
  useEffect(() => {
    if (initialItems.length > 0) {
      console.log(`[useUnifiedOrderForm-${hookId}] Initializing items:`, initialItems);
      
      const formattedItems = initialItems.map(item => ({
        id: String(item.id),
        title: item.title || item.name,
        price: item.price,
        promoPrice: item.promoPrice || null,
        quantity: item.quantity || 1,
        image: item.image || '',
        category: item.category,
        discountApplied: item.discountApplied || bundleDiscount
      }));
      
      setItems(formattedItems);
      initializedRef.current = true;
      console.log(`[useUnifiedOrderForm-${hookId}] Items initialized:`, formattedItems.length);
    }
  }, [initialItems.length, bundleDiscount, hookId]); // Use length to avoid deep comparison

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen && initializedRef.current) {
      console.log(`[useUnifiedOrderForm-${hookId}] Resetting on modal close`);
      setPromoCode('');
      setAppliedPromo(null);
      // Don't reset items immediately, they might be needed for next opening
    }
  }, [isOpen, hookId]);

  // Customer field update
  const updateCustomer = useCallback((field: string, value: string) => {
    setCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Quantity management
  const handleQuantityChange = useCallback((itemId: string, change: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  }, []);

  // Remove item
  const handleRemoveItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Promo code handling
  const handlePromoCodeChange = useCallback((value: string) => {
    setPromoCode(value);
  }, []);

  const validatePromoCode = useCallback(() => {
    if (!promoCode.trim()) {
      toast.error('Veuillez entrer un code promo');
      return;
    }

    const activePromo = promotions.find(p => 
      p.code.toLowerCase() === promoCode.toLowerCase() && 
      p.isActive && 
      new Date(p.expiryDate) > new Date()
    );

    if (activePromo) {
      setAppliedPromo({
        code: activePromo.code,
        discount: activePromo.discount
      });
      toast.success(`Code promo ${activePromo.code} appliqué ! -${activePromo.discount}%`);
    } else {
      toast.error('Code promo invalide ou expiré');
    }
  }, [promoCode, promotions]);

  // Memoized calculations to prevent constant recalculation
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      let price = item.promoPrice !== null ? item.promoPrice : item.price;
      
      // Apply bundle discount if specified
      if (item.discountApplied) {
        price = price * (1 - item.discountApplied / 100);
      }
      
      return sum + (price * item.quantity);
    }, 0);

    const deliveryFee = getDeliveryFee(customer.city, customer.neighborhood);
    
    const promoDiscount = appliedPromo 
      ? Math.round(subtotal * (appliedPromo.discount / 100))
      : 0;

    const total = Math.max(0, subtotal - promoDiscount + deliveryFee);

    return {
      subtotal,
      deliveryFee,
      promoDiscount,
      total
    };
  }, [items, customer.city, customer.neighborhood, appliedPromo, getDeliveryFee]);

  // Form validation
  const validateForm = useCallback(() => {
    const requiredFields = [
      { field: customer.firstName, name: 'Prénom' },
      { field: customer.lastName, name: 'Nom' },
      { field: customer.phone, name: 'Téléphone' },
      { field: customer.address, name: 'Adresse' },
      { field: customer.city, name: 'Ville' },
      { field: customer.neighborhood, name: 'Quartier' }
    ];

    for (const { field, name } of requiredFields) {
      if (!field.trim()) {
        toast.error(`Le champ ${name} est requis`);
        return false;
      }
    }

    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return false;
    }

    return true;
  }, [customer, items]);

  console.log(`[useUnifiedOrderForm-${hookId}] Returning hook values - items: ${items.length}, subtotal: ${calculations.subtotal}, total: ${calculations.total}`);

  return {
    items,
    customer,
    promoCode,
    appliedPromo,
    cities,
    ...calculations,
    updateCustomer,
    handleQuantityChange,
    handleRemoveItem,
    handlePromoCodeChange,
    validatePromoCode,
    validateForm
  };
};
