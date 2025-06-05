
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import { useUnifiedLoyaltySystem } from '../../hooks/useUnifiedLoyaltySystem';

const LoyaltyCardSelector: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUnifiedAuth();
  const { stats, loyaltyLevels, isLoading } = useUnifiedLoyaltySystem();

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

  if (isLoading) {
    return (
      <div className="mt-12 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span className="text-gray-600">Chargement des cartes de fidélité...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-12 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Votre carte YA BA BOSS</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {loyaltyLevels.map((level, index) => (
              <button
                key={level.name}
                onClick={() => setActiveLevel(index)}
                className={`flex-1 p-2 min-w-[100px] rounded-lg transition-all ${
                  activeLevel === index 
                    ? `${level.color.replace('bg-', 'bg-').replace('-100', '-600')} text-white shadow-md` 
                    : `bg-white border-2 ${level.textColor.replace('text-', 'border-').replace('-800', '-300')} ${level.textColor}`
                }`}
              >
                <div className="text-lg font-bold">{level.name}</div>
                <div className="text-xs opacity-90">{level.minPoints}+ pts</div>
              </button>
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className={`font-bold ${loyaltyLevels[activeLevel]?.textColor || 'text-gray-800'}`}>Avantages principaux</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {loyaltyLevels[activeLevel]?.discount > 0 && (
                  <li className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${loyaltyLevels[activeLevel].color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                    <span>Remise de {(loyaltyLevels[activeLevel].discount * 100).toFixed(0)}% sur tous vos achats</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                  <span>Service client prioritaire</span>
                </li>
                {activeLevel >= 1 && (
                  <li className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                    <span>Livraison prioritaire</span>
                  </li>
                )}
                {activeLevel >= 2 && (
                  <li className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} flex items-center justify-center text-white text-xs`}>✓</div>
                    <span>Accès aux évènements exclusifs</span>
                  </li>
                )}
              </ul>
            </div>
            
            <Button onClick={handleJoinProgram} className={`w-full py-2 ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')} hover:opacity-90 text-white`}>
              {isAuthenticated ? "Accéder à mon compte" : "Rejoindre maintenant"}
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-5">
          <div className={`aspect-[1.6/1] rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 relative z-10 ${loyaltyLevels[activeLevel]?.color.replace('bg-', 'bg-').replace('-100', '-600')}`}>
            <div className="absolute inset-1 bg-white rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="font-bold text-lg text-primary">Carte YA BA BOSS</div>
                <img 
                  src="/lovable-uploads/ae0eae09-dd45-4b0a-9155-f712a36dc362.png" 
                  alt="Logo Cowema" 
                  className="h-6 absolute top-4 right-4"
                />
                <div className={`text-2xl font-extrabold mt-1 ${loyaltyLevels[activeLevel]?.textColor || 'text-gray-800'}`}>
                  {loyaltyLevels[activeLevel]?.name}
                </div>
                <div className="text-xs mt-2">
                  <span className="opacity-70">Points requis:</span>{" "}
                  <span className="font-medium">{loyaltyLevels[activeLevel]?.minPoints}+</span>
                </div>
                {loyaltyLevels[activeLevel]?.discount > 0 && (
                  <div className="text-xs mt-1">
                    <span className="opacity-70">Remise:</span>{" "}
                    <span className="font-medium">{(loyaltyLevels[activeLevel].discount * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs">
                <div className="opacity-70">{stats?.pointsPerFcfa || 1000} FCFA = 1 point</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCardSelector;
