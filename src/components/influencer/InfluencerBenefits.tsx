
import React from 'react';
import { DollarSign, Link, BarChart, Check } from 'lucide-react';

const benefits = [
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: "Commissions attractives",
    description: "Gagnez entre 5% et 10% sur chaque vente générée par votre code promotionnel ou lien d'affiliation."
  },
  {
    icon: <Link className="h-10 w-10 text-primary" />,
    title: "Liens et codes personnalisés",
    description: "Recevez un lien de parrainage et un code promo uniques pour suivre facilement vos performances."
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Tableau de bord détaillé",
    description: "Suivez vos performances, commissions et paiements en temps réel dans votre espace personnel."
  }
];

const InfluencerBenefits: React.FC = () => {
  return (
    <div id="benefits" className="py-16 bg-white">
      <div className="container-cowema">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi devenir influenceur Cowema?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Notre programme offre des avantages exceptionnels pour les créateurs de contenu qui souhaitent monétiser leur audience tout en recommandant des produits qu'ils apprécient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-cowema border border-gray-100">
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Comment ça marche?</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <span>Remplissez le formulaire de candidature avec vos informations et vos réseaux sociaux.</span>
            </li>
            <li className="flex items-start">
              <Check className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <span>Notre équipe examine votre profil et vous contacte sous 7 jours.</span>
            </li>
            <li className="flex items-start">
              <Check className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <span>Une fois approuvé, recevez votre lien et code de parrainage uniques.</span>
            </li>
            <li className="flex items-start">
              <Check className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <span>Partagez ces liens avec votre audience et suivez vos performances.</span>
            </li>
            <li className="flex items-start">
              <Check className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <span>Recevez vos commissions tous les mois pour les ventes générées.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfluencerBenefits;
