
import React from 'react';

const FaqSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container-cowema">
        <h2 className="text-3xl font-bold mb-10 text-center">Questions fréquentes</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Comment rejoindre le programme YA BA BOSS ?</h3>
            <p className="text-gray-600">Pour rejoindre le programme YA BA BOSS, il vous suffit de créer un compte sur notre site et d'effectuer votre premier achat. Vous serez automatiquement inscrit au niveau Bronze du programme.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Comment monter de niveau dans le programme ?</h3>
            <p className="text-gray-600">Votre niveau dans le programme YA BA BOSS est déterminé par le montant total de vos achats sur une période de 12 mois. Plus vous achetez, plus vous progressez rapidement vers les niveaux supérieurs.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Les remises sont-elles cumulables avec d'autres promotions ?</h3>
            <p className="text-gray-600">Les remises du programme YA BA BOSS sont généralement cumulables avec les promotions saisonnières, mais pas avec d'autres codes promo. Le système appliquera automatiquement la remise la plus avantageuse pour vous.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Comment puis-je voir mon niveau actuel ?</h3>
            <p className="text-gray-600">Vous pouvez consulter votre niveau actuel dans le programme YA BA BOSS en vous connectant à votre compte client et en visitant la section "Mon programme de fidélité" dans votre tableau de bord.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
