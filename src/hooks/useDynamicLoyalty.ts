
import { useState, useEffect } from 'react';
import { 
  getDynamicLoyaltyLevels, 
  getDynamicUserLevel, 
  getDynamicPointsForNextLevel,
  DynamicLoyaltyLevel 
} from '../utils/dynamicLoyaltyUtils';

export const useDynamicLoyalty = (userPoints: number = 0) => {
  const [loyaltyLevels, setLoyaltyLevels] = useState<DynamicLoyaltyLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<DynamicLoyaltyLevel | null>(null);
  const [nextLevelInfo, setNextLevelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLoyaltyData = async () => {
      try {
        setLoading(true);
        
        const [levels, userLevel, nextLevel] = await Promise.all([
          getDynamicLoyaltyLevels(),
          getDynamicUserLevel(userPoints),
          getDynamicPointsForNextLevel(userPoints)
        ]);

        setLoyaltyLevels(levels);
        setCurrentLevel(userLevel);
        setNextLevelInfo(nextLevel);
      } catch (error) {
        console.error('Erreur lors du chargement des données de fidélité:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLoyaltyData();
  }, [userPoints]);

  return {
    loyaltyLevels,
    currentLevel,
    nextLevelInfo,
    loading,
    refetch: () => {
      const loadLoyaltyData = async () => {
        try {
          setLoading(true);
          
          const [levels, userLevel, nextLevel] = await Promise.all([
            getDynamicLoyaltyLevels(),
            getDynamicUserLevel(userPoints),
            getDynamicPointsForNextLevel(userPoints)
          ]);

          setLoyaltyLevels(levels);
          setCurrentLevel(userLevel);
          setNextLevelInfo(nextLevel);
        } catch (error) {
          console.error('Erreur lors du chargement des données de fidélité:', error);
        } finally {
          setLoading(false);
        }
      };
      loadLoyaltyData();
    }
  };
};
