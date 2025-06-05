
import React from 'react';
import { ChevronRight, Star, Gift, Sparkles } from 'lucide-react';

const PromotionalBanner = () => {
  const handleShopClick = () => {
    // Scroll vers les produits ou redirection
    const productsSection = document.querySelector('#products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-gradient-to-r from-green-400 via-primary to-green-600 overflow-hidden relative">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-10 w-8 h-8 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-12 right-20 w-6 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-1/4 w-4 h-4 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-1/3 w-5 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container-cowema relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Contenu textuel */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-800 px-4 py-2 rounded-full font-bold text-sm mb-3 animate-pulse">
                <Gift size={16} />
                <span>OFFRES SPÉCIALES</span>
                <Sparkles size={16} />
              </div>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-3 leading-tight">
                Des milliers d'articles
                <span className="block text-yellow-300">à prix incroyables !</span>
              </h2>
              
              <p className="text-white/90 text-lg font-medium mb-6">
                Découvrez notre sélection exceptionnelle avec des réductions jusqu'à -70% 
                sur des milliers de produits tendance.
              </p>
            </div>

            {/* Bouton d'action principal */}
            <button 
              onClick={handleShopClick}
              className="bg-white text-green-600 hover:text-green-700 font-black text-lg px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center gap-3 group"
            >
              <span>JE SHOPPE</span>
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-white/80 text-sm mt-3 font-medium">
              *Sur une sélection d'articles uniquement
            </p>
          </div>

          {/* Zone visuelle/décorative */}
          <div className="flex-1 lg:flex-none lg:w-96 relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-white font-bold text-xl mb-2">JUSQU'À</div>
                <div className="text-yellow-300 font-black text-4xl mb-2">-70%</div>
                <div className="text-white/90 text-sm">sur des milliers d'articles</div>
                
                {/* Étoiles décoratives */}
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="text-yellow-300 fill-current animate-pulse" 
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-8">
          <path d="M0,0V6c0,21.6,291,111,741,110S1200,27.6,1200,6V0H0Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </section>
  );
};

export default PromotionalBanner;
