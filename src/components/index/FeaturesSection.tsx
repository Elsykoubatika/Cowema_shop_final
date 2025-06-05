
import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-8 bg-primary text-white">
      <div className="container-cowema text-center">
        <h2 className="text-2xl font-bold mb-4">Pourquoi choisir Cowema ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="p-4">
            <div className="bg-white/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Achat sécurisé</h3>
            <p className="text-white/70">Paiement 100% sécurisé avec garantie satisfait ou remboursé.</p>
          </div>
          
          <div className="p-4">
            <div className="bg-white/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Livraison rapide</h3>
            <p className="text-white/70">Livraison express disponible dans plusieurs villes du Congo.</p>
          </div>
          
          <div className="p-4">
            <div className="bg-white/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Paiement à la livraison</h3>
            <p className="text-white/70">Payez uniquement à la réception de votre commande.</p>
          </div>
          
          <div className="p-4">
            <div className="bg-white/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Support 24/7</h3>
            <p className="text-white/70">Une équipe disponible sur WhatsApp pour vous aider à tout moment.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
