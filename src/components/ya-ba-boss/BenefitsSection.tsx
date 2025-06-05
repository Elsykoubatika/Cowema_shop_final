
import React from 'react';
import { Star } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-cowema">
        <h2 className="text-3xl font-bold mb-10 text-center">Les avantages du programme YA BA BOSS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-yellow-500" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-2">Réductions exclusives</h3>
            <p className="text-gray-600">Jusqu'à 20% de remise sur tous vos achats</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-500 text-2xl font-bold">24h</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Livraison prioritaire</h3>
            <p className="text-gray-600">Vos commandes traitées en priorité</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-500 text-2xl font-bold">%</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Promotions spéciales</h3>
            <p className="text-gray-600">Accès à des offres réservées aux membres</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-500 text-2xl font-bold">VIP</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Support dédié</h3>
            <p className="text-gray-600">Un service client prioritaire par WhatsApp</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
