
export interface LoyaltyLevel {
  name: string;
  minPoints: number;
  discount: number;
  color: string;
  textColor: string;
}

export const loyaltyLevels: LoyaltyLevel[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    discount: 0,
    color: 'bg-amber-100',
    textColor: 'text-amber-800'
  },
  {
    name: 'Argent',
    minPoints: 500,
    discount: 0.05,
    color: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  {
    name: 'Or',
    minPoints: 1500,
    discount: 0.10,
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  {
    name: 'Platine',
    minPoints: 3000,
    discount: 0.15,
    color: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    name: 'Diamant',
    minPoints: 5000,
    discount: 0.20,
    color: 'bg-purple-100',
    textColor: 'text-purple-800'
  }
];

export const getUserLevel = (points: number): LoyaltyLevel => {
  // Trouve le niveau le plus élevé accessible avec les points actuels
  for (let i = loyaltyLevels.length - 1; i >= 0; i--) {
    if (points >= loyaltyLevels[i].minPoints) {
      return loyaltyLevels[i];
    }
  }
  return loyaltyLevels[0]; // Niveau Bronze par défaut
};

export const getPointsForNextLevel = (points: number) => {
  const currentLevel = getUserLevel(points);
  const currentLevelIndex = loyaltyLevels.findIndex(level => level.name === currentLevel.name);
  
  // Si c'est déjà le niveau maximum
  if (currentLevelIndex === loyaltyLevels.length - 1) {
    return {
      pointsNeeded: 0,
      nextLevel: currentLevel.name,
      progress: 100
    };
  }
  
  const nextLevel = loyaltyLevels[currentLevelIndex + 1];
  const pointsNeeded = nextLevel.minPoints - points;
  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsToNextLevel = nextLevel.minPoints - currentLevel.minPoints;
  const progress = (pointsInCurrentLevel / pointsToNextLevel) * 100;
  
  return {
    pointsNeeded: Math.max(0, pointsNeeded),
    nextLevel: nextLevel.name,
    progress: Math.min(100, Math.max(0, progress))
  };
};

export const calculateLoyaltyPoints = (orderAmount: number): number => {
  // 1 point pour chaque 1000 FCFA dépensés
  return Math.floor(orderAmount / 1000);
};

export const calculateAndFormatLoyaltyPoints = (orderAmount: number): string => {
  const points = calculateLoyaltyPoints(orderAmount);
  return points.toString();
};
