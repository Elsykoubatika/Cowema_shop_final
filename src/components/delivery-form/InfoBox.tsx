
import React from 'react';
import { Info, Truck, Banknote } from 'lucide-react';

const InfoBox: React.FC = () => {
  return (
    <div className="bg-gray-50 p-3 rounded-md mb-4">
      <h4 className="flex items-center gap-2 font-medium text-primary mb-2">
        <Info size={16} /> Informations importantes
      </h4>
      <p className="flex items-center gap-2 mb-1">
        <Truck size={14} className="shrink-0" />
        <strong>Livraison:</strong> Disponible partout au Congo
      </p>
      <p className="flex items-center gap-2 mb-1">
        <Banknote size={14} className="shrink-0" />
        <strong>Paiement:</strong>
      </p>
      <ul className="ml-6 text-sm">
        <li className="mb-1">Paiement à la livraison pour Brazzaville (BZ) et Pointe-Noire (PN)</li>
        <li className="mb-1">Pas de paiement par carte bancaire</li>
        <li className="mb-1">Pas de paiement par Mobile Money (Momo)</li>
      </ul>
    </div>
  );
};

export default InfoBox;
