
import React, { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useUnifiedCart } from './CartProvider';
import { AddToCartProduct } from '../types/cart.types';

interface AddToCartButtonProps {
  product: AddToCartProduct;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  disabled?: boolean;
  onAddSuccess?: () => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  size = 'md',
  className = '',
  showText = true,
  disabled = false,
  onAddSuccess
}) => {
  const { addItem, isInCart } = useUnifiedCart();
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isProductInCart = isInCart(String(product.id));

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // UI feedback delay
      addItem(product);
      setJustAdded(true);
      onAddSuccess?.();
      
      // Reset success state
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
          {showText && size !== 'sm' && <span className="ml-2">Ajout...</span>}
        </>
      );
    }

    if (justAdded) {
      return (
        <>
          <Check size={size === 'sm' ? 14 : 18} className="animate-bounce" />
          {showText && size !== 'sm' && <span className="ml-2">Ajouté!</span>}
        </>
      );
    }

    return (
      <>
        <ShoppingCart size={size === 'sm' ? 14 : 18} />
        {showText && size !== 'sm' && (
          <span className="ml-2">
            {isProductInCart ? 'Ajouter encore' : 'Ajouter au panier'}
          </span>
        )}
      </>
    );
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <Button
      variant={justAdded ? 'default' : variant}
      size={buttonSize}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        transition-all duration-300 transform
        ${justAdded ? 'bg-green-600 hover:bg-green-700 scale-105' : ''}
        ${size === 'sm' && !showText ? 'w-10 h-10 rounded-full p-0' : ''}
        ${className}
      `}
      aria-label={disabled ? "Produit épuisé" : "Ajouter au panier"}
    >
      {getButtonContent()}
    </Button>
  );
};
