
import { useState, useEffect } from 'react';
import { Product } from '../../data/products';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { usePromotionStore } from '../../hooks/usePromotionStore';
import { SelectedUpsell } from '../upsell/types';

export const useProductModal = (
  product: Product | null, 
  onAddToCart: (product: Product) => void,
  onClose: () => void
) => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedUpsells, setSelectedUpsells] = useState<SelectedUpsell[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { promotions } = usePromotionStore();
  const navigate = useNavigate();

  // Reset added state when modal opens/closes or product changes
  useEffect(() => {
    setIsAddedToCart(false);
  }, [product]);

  // Get active promotion discount
  const getActivePromoDiscount = () => {
    const now = new Date();
    const activePromos = promotions.filter(p => 
      p.isActive && new Date(p.expiryDate) > now
    );
    
    if (activePromos.length > 0) {
      return Math.max(...activePromos.map(p => p.discount));
    }
    
    return 15; // Default discount
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product);
      setIsAddedToCart(true);
    }
  };
  
  const handleWhatsAppBuy = (e?: React.MouseEvent) => {
    // Prevent default if event is provided to avoid any bubbling issues
    if (e) e.preventDefault();
    console.log("WhatsApp buy button clicked");
    setIsOrderFormOpen(true);
  };

  // Handle upsell selection
  const handleUpsellSelection = (upsells: SelectedUpsell[]) => {
    setSelectedUpsells(upsells);
  };

  // Get upsell WhatsApp message with recommended related product
  const getUpsellMessage = (product: Product) => {
    let baseUrl = `https://wa.me/1234567890?text=Je souhaite commander ${product.title}`;
    
    // Add upsell products if selected
    if (selectedUpsells.length > 0) {
      baseUrl += ` et également `;
      selectedUpsells.forEach((upsell, index) => {
        if (index > 0) baseUrl += ', ';
        baseUrl += upsell.name;
      });
      baseUrl += ` en complément`;
    }
    
    return baseUrl;
  };

  // Determine appropriate complementary product based on category and usage patterns
  const getIntelligentUpsellProduct = (category?: string) => {
    // Advanced version would use actual purchase data correlation
    // For now we're using predefined categories with smart pairings
    switch (category) {
      case "phones":
        return ["COQUE DE PROTECTION", "ÉCOUTEURS SANS FIL", "CHARGEUR RAPIDE"][Math.floor(Math.random() * 3)];
      case "computers":
        return ["SOURIS SANS FIL", "CLAVIER RÉTROÉCLAIRÉ", "SUPPORT POUR ORDINATEUR"][Math.floor(Math.random() * 3)];
      case "electronics":
        return ["CÂBLE DE CHARGEMENT", "ADAPTATEUR SECTEUR", "ÉTUI DE RANGEMENT"][Math.floor(Math.random() * 3)];
      case "beauty": 
        return ["MASQUE VISAGE", "CRÈME HYDRATANTE", "SÉRUM ANTI-ÂGE"][Math.floor(Math.random() * 3)];
      default: 
        return "ACCESSOIRE COMPLÉMENTAIRE";
    }
  };
  
  const handleViewDetails = () => {
    onClose();
    if (product) {
      navigate(`/product/${product.id}`);
    }
  };

  return {
    isOrderFormOpen,
    isAddedToCart,
    selectedUpsells,
    isAuthenticated,
    user,
    getUpsellMessage,
    getIntelligentUpsellProduct,
    getActivePromoDiscount,
    handleAddToCart,
    handleWhatsAppBuy,
    handleUpsellSelection,
    handleViewDetails,
    setIsOrderFormOpen
  };
};
