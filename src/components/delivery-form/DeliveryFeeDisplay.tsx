
import React from 'react';

interface DeliveryFeeDisplayProps {
  city: string;
  neighborhood: string;
  deliveryFee: number;
  show: boolean;
}

const DeliveryFeeDisplay: React.FC<DeliveryFeeDisplayProps> = ({ city, neighborhood, deliveryFee, show }) => {
  if (!show) return null;

  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
      <p className="text-sm flex items-center justify-between">
        <span>Frais de livraison pour {neighborhood}, {city}:</span>
        <span className="font-bold text-primary">{deliveryFee.toLocaleString()} FCFA</span>
      </p>
    </div>
  );
};

export default DeliveryFeeDisplay;
