import { useState, useCallback, useEffect, useMemo } from 'react';
import { usePromotionStore } from './usePromotionStore';
import { useDeliveryFees } from './useDeliveryFees';
import { useAddressManagement } from './useAddressManagement';
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

export const useOptimizedOrderForm = (
  isOpen: boolean,
  initialItems: any[] = [],
  product?: any
) => {
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
  const [isInitialized, setIsInitialized] = useState(false);

  const { promotions } = usePromotionStore();
  const { cities, getDeliveryFee } = useDeliveryFees();
  const { getDefaultAddress, isLoggedIn } = useAddressManagement();

  // Fonction pour transformer les données en OrderItem avec validation
  const transformToOrderItems = useCallback((data: any[]): OrderItem[] => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => {
      // Validation des données essentielles
      if (!item.id || (!item.title && !item.name)) {
        console.warn('Invalid item data:', item);
        return null;
      }

      return {
        id: String(item.id),
        title: item.title || item.name || 'Produit sans nom',
        price: Number(item.price) || 0,
        promoPrice: item.promoPrice ? Number(item.promoPrice) : null,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: Array.isArray(item.images) ? item.images[0] : item.image || item.images || '',
        category: item.category || '',
        discountApplied: item.discountApplied ? Number(item.discountApplied) : undefined
      };
    }).filter(Boolean) as OrderItem[];
  }, []);

  // Initialiser les items quand le modal s'ouvre et que les données sont disponibles
  useEffect(() => {
    if (isOpen && !isInitialized) {
      console.log('🔧 Initializing order form with:', {
        initialItemsLength: initialItems?.length || 0,
        hasProduct: !!product
      });

      let allItems: OrderItem[] = [];

      // Ajouter les items du panier
      if (initialItems && initialItems.length > 0) {
        const cartItems = transformToOrderItems(initialItems);
        allItems = [...cartItems];
        console.log('📦 Added cart items:', cartItems.length);
      }

      // Ajouter le produit principal si pas déjà présent
      if (product && !allItems.some(item => item.id === String(product.id))) {
        const productItem: OrderItem = {
          id: String(product.id),
          title: product.title || product.name || 'Produit sans nom',
          price: Number(product.price) || 0,
          promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
          quantity: 1,
          image: Array.isArray(product.images) ? product.images[0] : product.image || product.images || '',
          category: product.category || '',
          discountApplied: product.discountApplied ? Number(product.discountApplied) : undefined
        };
        allItems.push(productItem);
        console.log('🛍️ Added main product:', productItem.title);
      }

      if (allItems.length > 0) {
        setItems(allItems);
        setIsInitialized(true);
        console.log('✅ Order form initialized with', allItems.length, 'items');
      } else {
        console.warn('⚠️ No valid items to initialize');
      }

      // Initialiser l'adresse par défaut pour les utilisateurs connectés
      if (isLoggedIn) {
        const defaultAddress = getDefaultAddress();
        if (defaultAddress) {
          setCustomer(prev => ({
            ...prev,
            address: defaultAddress.street,
            city: defaultAddress.city,
            neighborhood: defaultAddress.arrondissement || prev.neighborhood
          }));
          console.log('🏠 Default address loaded for logged user');
        }
      }
    }
  }, [isOpen, initialItems, product, transformToOrderItems, isInitialized, isLoggedIn, getDefaultAddress]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPromoCode('');
      setAppliedPromo(null);
      setIsInitialized(false);
      // Reset customer info but keep default address for next time
      if (!isLoggedIn) {
        setCustomer({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
          city: 'Brazzaville',
          neighborhood: 'Centre-ville',
          notes: ''
        });
      }
      console.log('🔄 Form reset on modal close');
    }
  }, [isOpen, isLoggedIn]);

  // Customer field update avec validation
  const updateCustomerField = useCallback((field: string, value: string) => {
    if (typeof field !== 'string' || typeof value !== 'string') {
      console.warn('Invalid customer field update:', { field, value });
      return;
    }
    
    setCustomer(prev => ({
      ...prev,
      [field]: value.trim()
    }));
  }, []);

  // Quantity management avec validation
  const handleQuantityChange = useCallback((itemId: string, change: number) => {
    if (!itemId || typeof change !== 'number') {
      console.warn('Invalid quantity change:', { itemId, change });
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  }, []);

  // Remove item avec validation
  const handleRemoveItem = useCallback((itemId: string) => {
    if (!itemId) {
      console.warn('Invalid item removal: no itemId');
      return;
    }

    setItems(prev => {
      const filtered = prev.filter(item => item.id !== itemId);
      if (filtered.length === 0) {
        console.warn('⚠️ All items removed from cart');
      }
      return filtered;
    });
  }, []);

  // Promo code handling avec validation
  const handlePromoCodeChange = useCallback((value: string) => {
    setPromoCode(typeof value === 'string' ? value.trim() : '');
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

  // Memoized calculations avec gestion d'erreurs
  const calculations = useMemo(() => {
    try {
      const subtotal = items.reduce((sum, item) => {
        let price = item.promoPrice !== null ? item.promoPrice : item.price;
        
        // Apply bundle discount if specified
        if (item.discountApplied && item.discountApplied > 0) {
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
        subtotal: Math.round(subtotal * 100) / 100,
        deliveryFee: Math.round(deliveryFee * 100) / 100,
        promoDiscount: Math.round(promoDiscount * 100) / 100,
        total: Math.round(total * 100) / 100
      };
    } catch (error) {
      console.error('Error calculating totals:', error);
      return {
        subtotal: 0,
        deliveryFee: 0,
        promoDiscount: 0,
        total: 0
      };
    }
  }, [items, customer.city, customer.neighborhood, appliedPromo, getDeliveryFee]);

  // Form validation améliorée
  const validateForm = useCallback(() => {
    try {
      const requiredFields = [
        { field: customer.firstName, name: 'Prénom' },
        { field: customer.lastName, name: 'Nom' },
        { field: customer.phone, name: 'Téléphone' },
        { field: customer.address, name: 'Adresse' },
        { field: customer.city, name: 'Ville' },
        { field: customer.neighborhood, name: 'Quartier' }
      ];

      for (const { field, name } of requiredFields) {
        if (!field || !field.trim()) {
          toast.error(`Le champ ${name} est requis`);
          return false;
        }
      }

      if (!items || items.length === 0) {
        toast.error('Votre panier est vide');
        return false;
      }

      // Validation des items
      for (const item of items) {
        if (!item.id || !item.title || item.price < 0 || item.quantity < 1) {
          toast.error('Certains articles sont invalides');
          return false;
        }
      }

      // Validation du téléphone
      if (!/^[\d\s\+\-\(\)]{8,}$/.test(customer.phone.trim())) {
        toast.error('Numéro de téléphone invalide');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Form validation error:', error);
      toast.error('Erreur lors de la validation du formulaire');
      return false;
    }
  }, [customer, items]);

  console.log('📊 useOptimizedOrderForm state:', {
    itemsCount: items.length,
    isInitialized,
    customerCity: customer.city,
    subtotal: calculations.subtotal,
    total: calculations.total,
    hasDefaultAddress: isLoggedIn && !!getDefaultAddress()
  });

  return {
    items,
    customer,
    promoCode,
    appliedPromo,
    cities,
    isInitialized,
    ...calculations,
    updateCustomerField,
    handleQuantityChange,
    handleRemoveItem,
    handlePromoCodeChange,
    validatePromoCode,
    validateForm
  };
};
