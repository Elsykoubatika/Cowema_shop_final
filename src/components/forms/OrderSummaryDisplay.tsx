
import React from 'react';
import { Receipt, Truck, Percent, CreditCard } from 'lucide-react';

interface OrderSummaryDisplayProps {
  subtotal: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  appliedPromo?: { code: string; discount: number } | null;
  city?: string;
  neighborhood?: string;
}

const OrderSummaryDisplay: React.FC<OrderSummaryDisplayProps> = ({
  subtotal,
  promoDiscount,
  deliveryFee,
  total,
  appliedPromo,
  city,
  neighborhood
}) => {
  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Receipt className="h-4 w-4 text-green-600" />
          Récapitulatif de la commande
        </h4>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {/* Sous-total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Sous-total</span>
            <span className="font-medium text-gray-900">
              {subtotal.toLocaleString()} FCFA
            </span>
          </div>

          {/* Réduction promo */}
          {promoDiscount > 0 && appliedPromo && (
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center gap-1">
                <Percent className="h-3 w-3" />
                Réduction ({appliedPromo.code})
              </span>
              <span className="font-medium">
                -{promoDiscount.toLocaleString()} FCFA
              </span>
            </div>
          )}

          {/* Frais de livraison */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-gray-700">
              <Truck className="h-3 w-3" />
              Livraison
              {city && neighborhood && (
                <span className="text-xs text-gray-500 ml-1">
                  ({city}, {neighborhood})
                </span>
              )}
            </span>
            <span className="font-medium text-gray-900">
              {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString()} FCFA`}
            </span>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-900">Total à payer</span>
            <span className="text-blue-600">
              {total.toLocaleString()} FCFA
            </span>
          </div>

          {/* Mode de paiement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-blue-800">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Paiement à la livraison</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Vous payerez en espèces lors de la réception de votre commande
            </p>
          </div>
        </div>

        {/* Économies réalisées */}
        {promoDiscount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="text-center">
              <p className="text-green-800 font-medium">
                🎉 Félicitations ! Vous économisez {promoDiscount.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-green-700 mt-1">
                Grâce à votre code promo {appliedPromo?.code}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryDisplay;
