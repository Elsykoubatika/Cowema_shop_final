
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Zap, Target, TrendingUp, Gift, Crown } from 'lucide-react';

interface MotivationalBannerProps {
  influencerName: string;
  totalEarned: number;
  totalOrders: number;
}

const MotivationalBanner: React.FC<MotivationalBannerProps> = ({
  influencerName,
  totalEarned,
  totalOrders
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const motivationalMessages = [
    {
      icon: Star,
      message: `Bravo ${influencerName} ! Vous inspirez vos followers chaque jour ! ✨`,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      icon: Zap,
      message: `${totalOrders} commandes générées ! Votre influence grandit ! ⚡`,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: Target,
      message: `${totalEarned.toLocaleString()} FCFA gagnés ! Continuez comme ça ! 🎯`,
      color: "from-green-400 to-blue-500",
      bgColor: "from-green-50 to-blue-50"
    },
    {
      icon: TrendingUp,
      message: `Votre succès ne fait que commencer ! Restez motivé(e) ! 📈`,
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      icon: Gift,
      message: `Chaque partage compte ! Vous créez de la valeur ! 🎁`,
      color: "from-pink-400 to-red-500",
      bgColor: "from-pink-50 to-red-50"
    },
    {
      icon: Crown,
      message: `Vous êtes un(e) vrai(e) ambassadeur(trice) COWEMA ! 👑`,
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [motivationalMessages.length]);

  const currentMessage = motivationalMessages[currentMessageIndex];
  const IconComponent = currentMessage.icon;

  return (
    <Card className={`mb-6 bg-gradient-to-r ${currentMessage.bgColor} border-0 shadow-lg overflow-hidden relative animate-fade-in`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gradient-to-r ${currentMessage.color} shadow-lg animate-pulse`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 animate-fade-in">
                {currentMessage.message}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Message motivant {currentMessageIndex + 1}/{motivationalMessages.length}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {motivationalMessages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMessageIndex 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 w-6' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalBanner;
