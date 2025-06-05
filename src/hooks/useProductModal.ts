
import { useState } from 'react';
import { Product } from '../data/products';
import { useAuthStore } from './useAuthStore';
import { usePromotionStore } from './usePromotionStore';
import { SelectedUpsell } from '../components/upsell/types';

export interface UpsellProduct {
  name: string;
  isAdded: boolean;
  discount: number;
  price?: number;
  image?: string;
}

export const useProductModal = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUpsellProducts, setSelectedUpsellProducts] = useState<UpsellProduct[]>([]);
  const { isAuthenticated, user } = useAuthStore();
  const { promotions } = usePromotionStore();
  
  // Get active promotion discount
  const getActivePromotionDiscount = () => {
    const now = new Date();
    const activePromos = promotions.filter(p => 
      p.isActive && new Date(p.expiryDate) > now
    );
    
    if (activePromos.length > 0) {
      const highestDiscount = Math.max(...activePromos.map(p => p.discount));
      return highestDiscount;
    }
    
    return 15; // Default discount percentage
  };
  
  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSelectedUpsellProducts([]);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUpsellProducts([]);
  };
  
  const handleUpsellSelection = (selectedUpsells: SelectedUpsell[]) => {
    setSelectedUpsellProducts(selectedUpsells);
  };
  
  return {
    selectedProduct,
    isModalOpen,
    isAuthenticated,
    user,
    selectedUpsellProducts,
    getActivePromotionDiscount,
    handleOpenModal,
    handleCloseModal,
    handleUpsellSelection
  };
};
