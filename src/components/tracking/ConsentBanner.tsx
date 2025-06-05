
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Cookie, X, Facebook } from 'lucide-react';

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cowema_tracking_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cowema_tracking_consent', 'accepted');
    document.cookie = 'cowema_tracking=allowed; path=/; max-age=31536000'; // 1 an
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cowema_tracking_consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black bg-opacity-50">
      <Card className="mx-auto max-w-4xl p-6 bg-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <Cookie className="text-orange-500" size={24} />
              <Shield className="text-green-500" size={20} />
              <Facebook className="text-blue-600" size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                Respect de votre vie privée
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Nous utilisons des cookies et des technologies de suivi (y compris Facebook Pixel) pour améliorer votre expérience, 
                analyser le trafic, personnaliser le contenu et optimiser nos campagnes publicitaires. 
                Vos données sont traitées de manière sécurisée et conforme au RGPD.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center space-x-1 text-xs bg-green-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Analyse du comportement</span>
                </div>
                <div className="flex items-center space-x-1 text-xs bg-blue-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Amélioration UX</span>
                </div>
                <div className="flex items-center space-x-1 text-xs bg-purple-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Recommandations personnalisées</span>
                </div>
                <div className="flex items-center space-x-1 text-xs bg-blue-100 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Publicités Facebook</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDecline}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <a 
            href="/privacy-policy" 
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            Politique de confidentialité
          </a>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleDecline}
              size="sm"
            >
              Refuser
            </Button>
            <Button 
              onClick={handleAccept}
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Accepter et continuer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsentBanner;
