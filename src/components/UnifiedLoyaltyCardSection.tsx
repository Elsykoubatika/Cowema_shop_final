
import React, { useState } from 'react';
import { Star, Shield, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';
import { useUnifiedLoyaltySystem } from '../hooks/useUnifiedLoyaltySystem';

const UnifiedLoyaltyCardSection: React.FC = () => {
  const { isAuthenticated, user } = useUnifiedAuth();
  const navigate = useNavigate();
  const { stats, loyaltyLevels, isLoading } = useUnifiedLoyaltySystem();
  const [activeLevel, setActiveLevel] = useState<number>(0);
  
  React.useEffect(() => {
    if (isAuthenticated && user && stats?.currentLevel) {
      const currentLevelIndex = loyaltyLevels.findIndex(level => level.name === stats.currentLevel.name);
      setActiveLevel(currentLevelIndex >= 0 ? currentLevelIndex : 0);
    }
  }, [isAuthenticated, user, stats, loyaltyLevels]);
  
  const handleJoinProgram = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/account?tab=loyalty');
    }
  };
  
  const getMotivationalMessage = () => {
    if (!user || !stats?.nextLevelInfo) return "";
    
    if (stats.pointsToNext <= 5) {
      return "Vous êtes si proche ! Quelques points de plus et vous atteignez le prochain niveau !";
    } else if (stats.progressPercentage >= 75) {
      return "La ligne d'arrivée est en vue ! Continuez vos achats pour débloquer plus d'avantages !";
    } else if (stats.progressPercentage >= 50) {
      return "Vous êtes à mi-chemin ! Continuez sur votre lancée !";
    } else if (stats.progressPercentage >= 25) {
      return "Bon début ! Continuez à accumuler des points pour monter de niveau !";
    } else {
      return "Commencez à gagner des points avec vos achats pour profiter d'avantages exclusifs !";
    }
  };
  
  const getUrgencyMessage = () => {
    if (!user || !stats?.currentLevel || !stats?.nextLevelInfo) return "";
    
    if (stats.currentLevel.name === "Diamant") {
      return "Félicitations, vous avez atteint le niveau Diamant ! Profitez de 20% de remise sur tous vos achats !";
    }
    
    const daysLeft = 30 - (new Date().getDate() % 30);
    
    return `Plus que ${daysLeft} jours pour atteindre le niveau ${stats.nextLevelInfo.nextLevel} et obtenir une remise supplémentaire !`;
  };

  const benefits = [
    {
      icon: Sparkles,
      title: "Effectuer des achats",
      description: `1 point pour chaque ${stats?.pointsPerFcfa || 1000} FCFA dépensés`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      points: `1 point/${stats?.pointsPerFcfa || 1000} FCFA`
    },
    {
      icon: Star,
      title: "Laisser des avis",
      description: "Partagez votre expérience produit",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
      points: "+50 points"
    },
    {
      icon: Shield,
      title: "Parrainer des amis",
      description: "Invitez vos proches à rejoindre Ya Ba Boss",
      color: "bg-green-50 text-green-600 border-green-200",
      points: "+100 points"
    }
  ];

  if (isLoading) {
    return (
      <section className="py-8 bg-gradient-to-r from-yellow-50 to-white">
        <div className="container-cowema max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-gray-600">Chargement du programme de fidélité...</span>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8 bg-gradient-to-r from-yellow-50 to-white">
      <div className="container-cowema max-w-4xl">
        <div className="section-title mb-4 text-center">
          <h2 className="text-2xl font-bold mb-1">Programme YA BA BOSS</h2>
          <p className="text-cowema-lightText max-w-xl mx-auto text-sm">
            Gagnez des points à chaque achat et profitez d'avantages exclusifs ! {stats?.pointsPerFcfa || 1000} FCFA = 1 point. 
            Augmentez votre niveau pour débloquer plus d'avantages.
          </p>
        </div>
        
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 md:col-span-7">
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {loyaltyLevels.map((level, index) => (
                <button
                  key={level.name}
                  onClick={() => setActiveLevel(index)}
                  className={`flex-1 p-2 min-w-[90px] rounded-lg transition-all ${
                    activeLevel === index 
                      ? `${level.color.replace('bg-', 'bg-').replace('-100', '-600')} text-white shadow-md` 
                      : `bg-white ${level.textColor.replace('text-', 'border-').replace('-800', '-300')} ${level.textColor}`
                  }`}
                >
                  <div className="text-lg font-bold">{level.name}</div>
                  <div className="text-xs opacity-90">{level.minPoints}+ pts</div>
                </button>
              ))}
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h3 className={`text-lg font-bold mb-2 flex items-center gap-1 ${loyaltyLevels[activeLevel]?.textColor}`}>
                <Star size={18} fill="currentColor" />
                Avantages Niveau {loyaltyLevels[activeLevel]?.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <ul className="space-y-1 text-xs">
                  {loyaltyLevels[activeLevel]?.discount > 0 && (
                    <li className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${loyaltyLevels[activeLevel].color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                      <span>Remise de {(loyaltyLevels[activeLevel].discount * 100).toFixed(0)}%</span>
                    </li>
                  )}
                  <li className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                    <span>Accès aux nouvelles collections</span>
                  </li>
                </ul>
                
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                    <span>Livraison prioritaire</span>
                  </li>
                  {activeLevel >= 1 && (
                    <li className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                      <span>Cadeau surprise</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {isAuthenticated && user && stats && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Niveau actuel: {stats.currentLevel.name}</span>
                    <span className="text-xs font-medium">{stats.loyaltyPoints} points</span>
                  </div>
                  
                  <Progress 
                    value={stats.progressPercentage} 
                    className="h-2 mb-2" 
                  />
                  
                  <div className="text-xs text-gray-600 mb-2">
                    {stats.pointsToNext > 0 ? (
                      <p>Plus que <span className="font-medium">{stats.pointsToNext}</span> points pour le niveau {stats.nextLevelInfo?.nextLevel}!</p>
                    ) : (
                      <p>Félicitations! Vous avez atteint le niveau maximum!</p>
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 p-2 rounded text-xs text-amber-800 mb-2 border border-yellow-200">
                    <p className="font-medium">{getUrgencyMessage()}</p>
                  </div>
                  
                  <Button 
                    className={`w-full text-white flex items-center justify-center gap-1 transition-colors pulse-animation text-xs ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')}`}
                    onClick={() => navigate('/account?tab=loyalty')}
                    size="sm"
                  >
                    Voir mes avantages détaillés <ChevronRight size={14} />
                  </Button>
                </div>
              )}
              
              {!isAuthenticated && (
                <Button 
                  className={`mt-3 w-full text-white flex items-center justify-center gap-1 transition-colors pulse-animation text-xs ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')}`}
                  onClick={handleJoinProgram}
                  size="sm"
                >
                  Rejoindre le programme <ChevronRight size={14} />
                </Button>
              )}
            </div>
          </div>
          
          <div className="hidden md:block md:col-span-5">
            <div className={`aspect-[1.6/1] rounded-xl overflow-hidden shadow-lg rotate-3 transform transition-transform hover:rotate-0 relative z-10 ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')}`}>
              <div className="absolute inset-1 bg-white rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-lg text-primary">Carte YA BA BOSS</div>
                  <img 
                    src="/lovable-uploads/ae0eae09-dd45-4b0a-9155-f712a36dc362.png" 
                    alt="Logo Cowema" 
                    className="h-6 absolute top-4 right-4"
                  />
                  <div className={`text-2xl font-extrabold mt-1 ${loyaltyLevels[activeLevel]?.textColor}`}>
                    {loyaltyLevels[activeLevel]?.name}
                  </div>
                  <div className="text-xs mt-1">
                    <span className="opacity-70">Points requis:</span>{" "}
                    <span className="font-medium">{loyaltyLevels[activeLevel]?.minPoints}+</span>
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="opacity-70">{stats?.pointsPerFcfa || 1000} FCFA = 1 point</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isAuthenticated && user && stats && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-medium">{getMotivationalMessage()}</p>
          </div>
        )}

        {/* Comment gagner des points */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-center mb-4">Comment gagner plus de points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${benefit.color}`}
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <benefit.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">{benefit.title}</p>
                  <p className="text-sm opacity-80 mb-2">{benefit.description}</p>
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded">
                    {benefit.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedLoyaltyCardSection;
