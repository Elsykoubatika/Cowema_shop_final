
import { useState, useEffect } from 'react';
import { usePromotionStore } from '../../hooks/usePromotionStore';
import { useDeliveryFees } from '@/hooks/useDeliveryFees';
import { toast } from "sonner";

type CartItem = {
  id: string; // Changé de number à string pour la cohérence
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
};

export type FormData = {
  name: string;
  phone: string;
  email: string;
  city: string;
  neighborhood: string;
  address: string;
  notes: string;
  promoCode: string;
};

export function useOrderFormState(isOpen: boolean, cartItems: CartItem[] = []) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    city: 'Brazzaville',
    neighborhood: 'Centre-ville',
    address: '',
    notes: '',
    promoCode: ''
  });

  // État local pour les articles de panier pour permettre les modifications
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      // Normaliser les IDs en string lors de l'initialisation
      const normalizedItems = cartItems.map(item => ({
        ...item,
        id: String(item.id)
      }));
      setLocalCartItems(normalizedItems);
    }
  }, [isOpen, cartItems]);
  
  const { promotions } = usePromotionStore();
  const { cities, getDeliveryFee } = useDeliveryFees();
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  
  // État pour les quartiers disponibles selon la ville sélectionnée
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
  
  // Mettre à jour les quartiers disponibles lorsque la ville change
  useEffect(() => {
    const cityConfig = cities.find(c => c.name === formData.city) || cities[0];
    if (cityConfig) {
      setAvailableNeighborhoods(cityConfig.neighborhoods.map(n => n.name));
      
      // Si le quartier actuel n'existe pas dans la nouvelle ville, sélectionner le premier quartier
      const neighborhoodExists = cityConfig.neighborhoods.some(n => n.name === formData.neighborhood);
      if (!neighborhoodExists && cityConfig.neighborhoods.length > 0) {
        setFormData(prev => ({
          ...prev,
          neighborhood: cityConfig.neighborhoods[0].name
        }));
      }
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [formData.city, cities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Si on change de ville, on met à jour le quartier avec le premier quartier disponible
      if (name === 'city') {
        const cityConfig = cities.find(c => c.name === value);
        const firstNeighborhood = cityConfig?.neighborhoods[0]?.name || '';
        
        return {
          ...prev,
          [name]: value,
          neighborhood: firstNeighborhood
        };
      }
      
      return { ...prev, [name]: value };
    });
  };
  
  const validatePromoCode = () => {
    // Reset applied promo
    setAppliedPromo(null);
    
    if (!formData.promoCode) return;
    
    const now = new Date();
    const foundPromo = promotions.find(
      p => p.code.toLowerCase() === formData.promoCode.toLowerCase() && 
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
  };
  
  const calculateDeliveryFee = (): number => {
    return getDeliveryFee(formData.city, formData.neighborhood);
  };

  // Calculated values
  const deliveryFee = calculateDeliveryFee();
  
  const calculateSubtotal = (): number => {
    let subtotal = 0;
    
    // Add main product if not already in cart
    const product = null; // This will be passed from parent component
    if (product && !localCartItems.some(item => String(item.id) === String(product.id))) {
      subtotal = product.promoPrice || product.price;
    }
    
    if (localCartItems.length > 0) {
      // Ajouter tous les articles du panier
      subtotal += localCartItems.reduce((sum, item) => {
        const price = item.promoPrice !== null ? item.promoPrice : item.price;
        return sum + (price * item.quantity);
      }, 0);
    }
    
    // Add upsell products - these will be handled by parent
    
    return subtotal;
  };
  
  const calculateDiscount = (subtotal: number): number => {
    if (!appliedPromo) return 0;
    return Math.round(subtotal * (appliedPromo.discount / 100));
  };
  
  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    
    return subtotal - discount + deliveryFee;
  };
  
  // Fonction pour supprimer un article du panier local
  const handleRemoveItem = (id: string) => {
    setLocalCartItems(prevItems => prevItems.filter(item => String(item.id) !== String(id)));
    toast.success("Article retiré de votre commande");
  };
  
  // Fonction pour ajuster la quantité d'un article
  const handleAdjustQuantity = (id: string, change: number) => {
    setLocalCartItems(prevItems => 
      prevItems.map(item => {
        if (String(item.id) === String(id)) {
          const newQuantity = Math.max(1, item.quantity + change); // Minimum quantity of 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  return {
    formData,
    localCartItems,
    appliedPromo,
    availableNeighborhoods,
    deliveryFee,
    setFormData,
    setLocalCartItems,
    setAppliedPromo,
    handleChange,
    validatePromoCode,
    handleRemoveItem,
    handleAdjustQuantity,
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
  };
}
