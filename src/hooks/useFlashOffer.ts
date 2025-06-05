
import { useState } from 'react';
import { Product } from '../data/products';

export const useFlashOffer = () => {
  const [isFlashModalOpen, setIsFlashModalOpen] = useState(false);
  const [flashProduct] = useState<Product | null>(null);

  const handleOpenFlashModal = () => {
    setIsFlashModalOpen(true);
  };

  const handleCloseFlashModal = () => {
    setIsFlashModalOpen(false);
  };

  return {
    flashProduct,
    isFlashOfferOpen: isFlashModalOpen, // Map to expected property name
    openFlashOffer: handleOpenFlashModal, // Map to expected property name
    closeFlashOffer: handleCloseFlashModal, // Map to expected property name
    isFlashModalOpen,
    handleOpenFlashModal,
    handleCloseFlashModal
  };
};
