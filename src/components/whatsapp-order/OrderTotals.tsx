
import React from 'react';
import { FormData } from './useOrderFormState';

interface OrderTotalsProps {
  calculateSubtotal: () => number;
  calculateDiscount: (subtotal: number) => number;
  calculateTotal: () => number;
  appliedPromo: { code: string; discount: number } | null;
  deliveryFee: number;
  formData: FormData;
}

const OrderTotals: React.FC<OrderTotalsProps> = ({
  calculateSubtotal,
  calculateDiscount,
  calculateTotal,
  appliedPromo,
  deliveryFee,
  formData
}) => {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const total = calculateTotal();

  return (
    <div className="border-t border-gray-200 pt-3">
      <div className="flex justify-between text-sm mb-1">
        <span>Sous-total:</span>
        <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
      </div>
      
      {appliedPromo && (
        <div className="flex justify-between text-sm text-green-600 mb-1">
          <span>Réduction ({appliedPromo.code}):</span>
          <span>-{discount.toLocaleString()} FCFA</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm mb-1">
        <span>Frais de livraison ({formData.neighborhood}, {formData.city}):</span>
        <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
      </div>
      
      <div className="flex justify-between font-bold text-lg">
        <span>Total à payer:</span>
        <span className="text-primary">{total.toLocaleString()} FCFA</span>
      </div>
    </div>
  );
};

export default OrderTotals;
