
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-8 bg-gray-100">
      <div className="container-cowema">
        <div className="section-title">
          <h2 className="text-2xl font-bold text-center mb-8">Ce que nos clients disent</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-cowema">
            <div className="flex text-yellow-400 mb-3">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>
            <p className="italic mb-4">
              "J'ai reçu ma commande en moins de 24h à Brazzaville. Le produit est exactement comme sur la photo. Je recommande Cowema pour leur professionnalisme !"
            </p>
            <div className="font-semibold">Sarah K.</div>
            <div className="text-sm text-cowema-lightText">Brazzaville</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-cowema">
            <div className="flex text-yellow-400 mb-3">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} className="text-gray-300" />
            </div>
            <p className="italic mb-4">
              "Livraison gratuite même à Pointe-Noire! Le service client est réactif sur WhatsApp. J'ai déjà commandé 3 fois et je suis toujours satisfait."
            </p>
            <div className="font-semibold">Marc T.</div>
            <div className="text-sm text-cowema-lightText">Pointe-Noire</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-cowema">
            <div className="flex text-yellow-400 mb-3">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>
            <p className="italic mb-4">
              "Les réductions sur les soldes sont réelles! J'ai économisé 15 000 FCFA sur ma commande. Le colis était bien protégé et livré à temps."
            </p>
            <div className="font-semibold">Aminata D.</div>
            <div className="text-sm text-cowema-lightText">Dolisie</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
