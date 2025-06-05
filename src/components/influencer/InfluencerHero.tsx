
import React from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InfluencerHero: React.FC = () => {
  const scrollToForm = () => {
    const element = document.getElementById('apply');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
      <div className="container-cowema">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary-100 text-primary mb-6">
            <Users size={18} className="mr-2" />
            <span className="font-medium">Programme Influenceurs Cowema</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gagnez des commissions en recommandant nos produits
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Rejoignez notre programme d'affiliation exclusif et recevez jusqu'à 10% de commission sur les ventes générées par votre audience.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="flex items-center gap-2">
              Postuler maintenant
              <ArrowRight size={18} />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
              Découvrir les avantages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerHero;
