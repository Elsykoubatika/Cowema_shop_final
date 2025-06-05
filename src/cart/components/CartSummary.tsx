
import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useUnifiedCart } from './CartProvider';
import { Badge } from '../../components/ui/badge';
import { Truck, Tag, X } from 'lucide-react';

interface CartSummaryProps {
  showPromoInput?: boolean;
  showDeliverySelection?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  showPromoInput = true, 
  showDeliverySelection = false 
}) => {
  const {
    subtotal,
    deliveryFee,
    promotionDiscount,
    totalAmount,
    appliedPromotion,
    applyPromotion,
    removePromotion,
    deliveryInfo
  } = useUnifiedCart();

  const [promoCode, setPromoCode] = React.useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      const success = applyPromotion(promoCode.trim());
      if (success) {
        setPromoCode('');
      }
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <h3 className="font-semibold text-lg">Résumé de la commande</h3>
      
      {/* Subtotal */}
      <div className="flex justify-between">
        <span>Sous-total:</span>
        <span>{subtotal.toLocaleString()} FCFA</span>
      </div>

      {/* Promotion */}
      {appliedPromotion && (
        <div className="flex justify-between items-center text-green-600">
          <span className="flex items-center gap-2">
            <Tag size={16} />
            Promotion ({appliedPromotion})
          </span>
          <div className="flex items-center gap-2">
            <span>-{promotionDiscount.toLocaleString()} FCFA</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={removePromotion}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Promo Code Input */}
      {showPromoInput && !appliedPromotion && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Code promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleApplyPromo}
              disabled={!promoCode.trim()}
              size="sm"
            >
              Appliquer
            </Button>
          </div>
        </div>
      )}

      {/* Delivery Fee */}
      {deliveryFee > 0 && (
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Truck size={16} />
            Livraison
            {deliveryInfo && (
              <Badge variant="secondary" className="text-xs">
                {deliveryInfo.neighborhood}, {deliveryInfo.city}
              </Badge>
            )}
          </span>
          <span>{deliveryFee.toLocaleString()} FCFA</span>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">{totalAmount.toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Savings Summary */}
      {promotionDiscount > 0 && (
        <div className="text-center text-green-600 text-sm">
          🎉 Vous économisez {promotionDiscount.toLocaleString()} FCFA !
        </div>
      )}
    </div>
  );
};

export default CartSummary;
