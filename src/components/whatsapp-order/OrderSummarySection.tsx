
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface OrderSummarySectionProps {
  subtotal: number;
  appliedPromo: { code: string; discount: number } | null;
  discount: number;
  deliveryFee: number;
  total: number;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  subtotal,
  appliedPromo,
  discount,
  deliveryFee,
  total
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Récapitulatif de la Commande</h3>
      
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span>Sous-total articles:</span>
          <span>{subtotal.toLocaleString()} FCFA</span>
        </div>
        
        {discount > 0 && appliedPromo && (
          <div className="flex justify-between text-green-600">
            <span>Réduction promo (-{appliedPromo.discount}%):</span>
            <span>-{discount.toLocaleString()} FCFA</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Frais de livraison:</span>
          <span>{deliveryFee.toLocaleString()} FCFA</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>TOTAL À PAYER:</span>
          <span className="text-blue-600">{total.toLocaleString()} FCFA</span>
        </div>
        
        <p className="text-sm text-gray-600 text-center mt-2">
          💳 Paiement à la livraison
        </p>
      </div>
    </div>
  );
};

export default OrderSummarySection;
