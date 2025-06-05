
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useUnifiedCart } from '../../cart/components/CartProvider';

interface CartButtonProps {
  onCartClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onCartClick }) => {
  const { totalItems } = useUnifiedCart();

  const handleClick = () => {
    console.log('Cart button clicked, items count:', totalItems);
    onCartClick();
  };

  return (
    <button 
      className="relative" 
      onClick={handleClick}
      aria-label={`Panier - ${totalItems} articles`}
    >
      <ShoppingCart size={22} className="text-gray-700 hover:text-primary transition-colors" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold min-w-5">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
