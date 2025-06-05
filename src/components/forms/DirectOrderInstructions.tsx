
import React from 'react';

const DirectOrderInstructions: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="font-medium text-green-900 mb-2">✅ Commande directe</h3>
      <p className="text-sm text-green-800">
        Votre commande sera traitée directement par notre équipe COWEMA. 
        Vous recevrez une confirmation par email et nous vous contacterons pour la livraison.
      </p>
    </div>
  );
};

export default DirectOrderInstructions;
