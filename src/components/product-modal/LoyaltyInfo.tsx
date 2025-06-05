
import React from 'react';
import { Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import { useUnifiedLoyaltySystem } from '../../hooks/useUnifiedLoyaltySystem';

interface LoyaltyInfoProps {
  price: number;
  promoPrice: number | null;
}

const LoyaltyInfo: React.FC<LoyaltyInfoProps> = ({ price, promoPrice }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUnifiedAuth();
  const { stats, calculatePointsForAmount } = useUnifiedLoyaltySystem();
  
  // Calculer les points gagnés avec le système dynamique
  const [loyaltyPoints, setLoyaltyPoints] = React.useState<number>(0);
  
  React.useEffect(() => {
    const calculatePoints = async () => {
      if (calculatePointsForAmount) {
        const points = await calculatePointsForAmount(promoPrice || price);
        setLoyaltyPoints(points);
      }
    };
    calculatePoints();
  }, [price, promoPrice, calculatePointsForAmount]);
  
  return (
    <>
      <div className="flex items-center gap-2 mb-4 bg-yellow-50 p-3 rounded-md">
        <Star size={18} className="text-yellow-500" fill="currentColor" />
        {isAuthenticated ? (
          <span className="text-sm">Gagnez <b>{loyaltyPoints}</b> point{loyaltyPoints !== 1 ? 's' : ''} YA BA BOSS avec cet achat</span>
        ) : (
          <span 
            className="text-sm cursor-pointer hover:underline text-primary"
            onClick={() => navigate('/register')}
          >
            <b>Créez un compte</b> pour gagner des points YA BA BOSS avec vos achats
          </span>
        )}
      </div>
      
      {/* Loyalty progress for logged-in users */}
      {isAuthenticated && user && stats && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Niveau: {stats.currentLevel.name}</span>
            <span>{stats.loyaltyPoints} points</span>
          </div>
          <Progress value={stats.progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>{stats.currentLevel.name}</span>
            <span>{stats.nextLevelInfo?.nextLevel || 'Maximum'}</span>
          </div>
          {stats.progressPercentage < 100 && stats.pointsToNext > 0 && (
            <div className="text-sm text-center mt-2 text-gray-600">
              Plus que {stats.pointsToNext} points pour le niveau {stats.nextLevelInfo?.nextLevel}!
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LoyaltyInfo;
