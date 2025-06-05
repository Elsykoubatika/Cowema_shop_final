
import React from 'react';

interface UpsellCallToActionProps {
  discount: number;
}

const UpsellCallToAction: React.FC<UpsellCallToActionProps> = ({ discount }) => {
  return (
    <div className="mb-4 bg-amber-200 p-3 rounded-md border border-amber-300">
      <p className="text-amber-900 font-medium text-sm md:text-base">
        <span className="font-bold">OFFRE SPÉCIALE LIMITÉE !</span> Profitez de <span className="font-bold text-red-600">-{discount}%</span> sur ces accessoires complémentaires uniquement avec votre achat actuel. Cette réduction exceptionnelle disparaîtra dès que vous quitterez cette page !
      </p>
    </div>
  );
};

export default UpsellCallToAction;
