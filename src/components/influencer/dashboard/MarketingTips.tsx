
import React from 'react';

const MarketingTips: React.FC = () => {
  return (
    <div className="mt-8 bg-primary-50 rounded-lg p-6">
      <h3 className="font-semibold mb-2">Conseils pour maximiser vos gains</h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
        <li>Partagez régulièrement votre lien dans vos stories et publications.</li>
        <li>Créez du contenu authentique montrant comment vous utilisez nos produits.</li>
        <li>Encouragez votre audience à utiliser votre code promo exclusif.</li>
        <li>Collaborez avec nous sur des offres spéciales pour votre audience.</li>
      </ul>
    </div>
  );
};

export default MarketingTips;
