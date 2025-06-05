
import { supabase } from '@/integrations/supabase/client';

export interface DynamicLoyaltyLevel {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  textColor: string;
  discount: number;
  benefits: string[];
}

// Configuration par défaut des niveaux
const DEFAULT_LEVELS: DynamicLoyaltyLevel[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    color: 'bg-orange-100',
    textColor: 'text-orange-800',
    discount: 0,
    benefits: ['Accès aux nouvelles collections', 'Livraison prioritaire']
  },
  {
    name: 'Argent',
    minPoints: 500,
    maxPoints: 1499,
    color: 'bg-gray-100',
    textColor: 'text-gray-800',
    discount: 0.05,
    benefits: ['5% de remise', 'Accès aux nouvelles collections', 'Livraison prioritaire', 'Cadeau surprise']
  },
  {
    name: 'Or',
    minPoints: 1500,
    maxPoints: 2999,
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    discount: 0.10,
    benefits: ['10% de remise', 'Accès aux nouvelles collections', 'Livraison prioritaire', 'Cadeau surprise']
  },
  {
    name: 'Diamant',
    minPoints: 3000,
    maxPoints: null,
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    discount: 0.20,
    benefits: ['20% de remise', 'Accès aux nouvelles collections', 'Livraison prioritaire', 'Cadeau surprise', 'Support VIP']
  }
];

// Fonction pour valider si les données correspondent à notre interface
const isValidLoyaltyLevels = (data: unknown): data is DynamicLoyaltyLevel[] => {
  if (!Array.isArray(data)) return false;
  
  return data.every(level => 
    typeof level === 'object' && 
    level !== null &&
    typeof level.name === 'string' &&
    typeof level.minPoints === 'number' &&
    (level.maxPoints === null || typeof level.maxPoints === 'number') &&
    typeof level.color === 'string' &&
    typeof level.textColor === 'string' &&
    typeof level.discount === 'number' &&
    Array.isArray(level.benefits)
  );
};

// Récupérer les niveaux depuis les paramètres système ou utiliser les valeurs par défaut
export const getDynamicLoyaltyLevels = async (): Promise<DynamicLoyaltyLevel[]> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'loyalty_levels')
      .single();

    if (error || !data) {
      return DEFAULT_LEVELS;
    }

    // Conversion sécurisée avec validation
    const settingValue = data.setting_value as unknown;
    if (isValidLoyaltyLevels(settingValue)) {
      return settingValue;
    } else {
      console.warn('Format des niveaux de fidélité invalide, utilisation des valeurs par défaut');
      return DEFAULT_LEVELS;
    }
  } catch (error) {
    console.log('Utilisation des niveaux par défaut:', error);
    return DEFAULT_LEVELS;
  }
};

// Récupérer les points par FCFA depuis les paramètres système
export const getDynamicPointsPerFcfa = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'points_per_fcfa')
      .single();

    if (error || !data) {
      return 1000; // 1 point pour 1000 FCFA par défaut
    }

    const settingValue = data.setting_value as unknown;
    if (typeof settingValue === 'number' && settingValue > 0) {
      return settingValue;
    } else {
      console.warn('Valeur points_per_fcfa invalide, utilisation de la valeur par défaut');
      return 1000;
    }
  } catch (error) {
    console.log('Utilisation de la valeur par défaut pour points_per_fcfa:', error);
    return 1000;
  }
};

// Calculer le niveau d'un utilisateur en fonction de ses points
export const getDynamicUserLevel = async (loyaltyPoints: number): Promise<DynamicLoyaltyLevel> => {
  const levels = await getDynamicLoyaltyLevels();
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (loyaltyPoints >= levels[i].minPoints) {
      return levels[i];
    }
  }
  
  return levels[0]; // Niveau Bronze par défaut
};

// Calculer les points nécessaires pour le prochain niveau
export const getDynamicPointsForNextLevel = async (loyaltyPoints: number) => {
  const levels = await getDynamicLoyaltyLevels();
  const currentLevel = await getDynamicUserLevel(loyaltyPoints);
  
  const currentLevelIndex = levels.findIndex(level => level.name === currentLevel.name);
  
  if (currentLevelIndex === levels.length - 1) {
    // Niveau maximum atteint
    return {
      nextLevel: null,
      pointsNeeded: 0,
      progress: 100
    };
  }
  
  const nextLevel = levels[currentLevelIndex + 1];
  const pointsNeeded = nextLevel.minPoints - loyaltyPoints;
  const levelRange = nextLevel.minPoints - currentLevel.minPoints;
  const currentProgress = loyaltyPoints - currentLevel.minPoints;
  const progress = levelRange > 0 ? (currentProgress / levelRange) * 100 : 0;
  
  return {
    nextLevel: nextLevel.name,
    pointsNeeded: Math.max(0, pointsNeeded),
    progress: Math.min(100, Math.max(0, progress))
  };
};

// Calculer les points gagnés pour un montant donné
export const calculateDynamicLoyaltyPoints = async (amount: number): Promise<number> => {
  const pointsPerFcfa = await getDynamicPointsPerFcfa();
  return Math.floor(amount / pointsPerFcfa);
};
