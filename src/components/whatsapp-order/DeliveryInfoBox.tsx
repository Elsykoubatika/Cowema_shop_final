
import React from 'react';
import { Info, Truck, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const DeliveryInfoBox: React.FC = () => {
  return (
    <div className="bg-green-50 p-4 rounded-md mb-4 border border-green-200">
      <h4 className="flex items-center gap-2 font-medium text-green-800 mb-2">
        <Info size={18} /> Instructions de paiement
      </h4>
      <ul className="space-y-2 text-sm text-green-700">
        <li className="flex items-start gap-2">
          <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Livraison disponible partout au Congo</span>
        </li>
        <li className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Paiement à la livraison</span>
        </li>
        <li className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Pas de carte bancaire requise</span>
        </li>
        <li className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Pas de Mobile Money (MoMo) requis</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Satisfait ou remboursé</span>
        </li>
      </ul>
    </div>
  );
};

export default DeliveryInfoBox;
