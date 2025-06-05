
import React, { useState, useEffect } from 'react';
import { Clock, Gift, MapPin } from 'lucide-react';
import { useFlashBannerSettings } from '../../hooks/useFlashBannerSettings';

interface FlashSaleBannerProps {
  city?: string;
}

const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ city }) => {
  const { settings, loading } = useFlashBannerSettings();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  // Calculer le temps restant jusqu'à l'heure d'expiration configurée
  useEffect(() => {
    if (!settings) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(settings.expiryHour, 59, 59, 999);
      
      const difference = endOfDay.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [settings?.expiryHour]);

  // Ne pas afficher si désactivé ou en cours de chargement
  if (loading || !settings?.enabled || isExpired) return null;

  const handleCopyPromoCode = () => {
    const promoCode = isBzPn ? settings.codeBzpn : settings.codeGeneral;
    navigator.clipboard.writeText(promoCode);
    
    // Toast notification
    const toast = document.createElement('div');
    toast.textContent = `Code ${promoCode} copié !`;
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  // Détecter si c'est une ville ciblée
  const isBzPn = city?.toLowerCase() && settings.targetCities.some(targetCity => 
    city.toLowerCase().includes(targetCity.toLowerCase())
  );

  const gradientStyle = {
    background: `linear-gradient(to right, ${settings.colors.from}, ${settings.colors.to})`
  };

  return (
    <div className="w-full text-white py-3 px-4 relative overflow-hidden shadow-lg" style={gradientStyle}>
      {/* Animation background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      <div className="container-cowema relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          
          {/* Message principal */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="text-xl">🔥</span>
            <span className="font-bold">
              {isBzPn ? settings.messageBzpn : settings.messageGeneral}
            </span>
            <span className="hidden md:inline">aujourd'hui seulement |</span>
          </div>

          {/* Code promo cliquable */}
          <div className="flex items-center gap-2">
            <Gift size={16} />
            <span>Code:</span>
            <button
              onClick={handleCopyPromoCode}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg font-bold transition-all duration-200 border border-white/30 hover:scale-105"
            >
              {isBzPn ? settings.codeBzpn : settings.codeGeneral}
            </button>
            <span className="text-sm opacity-90">
              (-{isBzPn ? settings.discountBzpn : settings.discountGeneral}% supplémentaire)
            </span>
          </div>

          {/* Compte à rebours */}
          <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-lg">
            <Clock size={16} />
            <span className="font-mono font-bold text-lg">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Localisation */}
          {city && (
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin size={14} />
              <span>{city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Effet de brillance */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[slide_3s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
