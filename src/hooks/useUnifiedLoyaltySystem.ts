
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';
import { 
  getDynamicLoyaltyLevels, 
  getDynamicUserLevel, 
  getDynamicPointsForNextLevel, 
  getDynamicPointsPerFcfa,
  calculateDynamicLoyaltyPoints,
  DynamicLoyaltyLevel 
} from '../utils/dynamicLoyaltyUtils';

export interface UnifiedLoyaltyStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  currentLevel: DynamicLoyaltyLevel;
  nextLevelInfo: any;
  achievements: Achievement[];
  progressPercentage: number;
  pointsToNext: number;
  pointsPerFcfa: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  icon: string;
  requirement: {
    type: 'orders' | 'points' | 'spending' | 'first_purchase';
    value: number;
  };
}

export const useUnifiedLoyaltySystem = () => {
  const { user } = useUnifiedAuth();
  const [stats, setStats] = useState<UnifiedLoyaltyStats | null>(null);
  const [loyaltyLevels, setLoyaltyLevels] = useState<DynamicLoyaltyLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const achievements: Achievement[] = [
    {
      id: 'first_purchase',
      title: 'Premier achat',
      description: 'Bienvenue chez Ya Ba Boss !',
      points: 10,
      unlocked: false,
      icon: 'crown',
      requirement: { type: 'first_purchase', value: 1 }
    },
    {
      id: 'loyal_customer',
      title: 'Client fidèle',
      description: '10 commandes effectuées',
      points: 25,
      unlocked: false,
      icon: 'zap',
      requirement: { type: 'orders', value: 10 }
    },
    {
      id: 'bronze_level',
      title: 'Niveau Bronze',
      description: 'Premier niveau atteint',
      points: 15,
      unlocked: false,
      icon: 'award',
      requirement: { type: 'points', value: 0 }
    },
    {
      id: 'silver_level',
      title: 'Expert Ya Ba Boss',
      description: 'Niveau Argent atteint',
      points: 50,
      unlocked: false,
      icon: 'sparkles',
      requirement: { type: 'points', value: 500 }
    },
    {
      id: 'gold_level',
      title: 'Maître Ya Ba Boss',
      description: 'Niveau Or atteint',
      points: 100,
      unlocked: false,
      icon: 'star',
      requirement: { type: 'points', value: 1500 }
    }
  ];

  const fetchUnifiedLoyaltyData = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Chargement des données de fidélité pour:', user.id);

      // 1. Charger les niveaux dynamiques
      const levels = await getDynamicLoyaltyLevels();
      setLoyaltyLevels(levels);

      // 2. Récupérer les points de fidélité actuels du profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('loyalty_points')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erreur profile:', profileError);
        throw profileError;
      }

      const loyaltyPoints = profile?.loyalty_points || 0;
      console.log('💎 Points de fidélité actuels:', loyaltyPoints);

      // 3. Récupérer UNIQUEMENT les commandes livrées du user_id ET par correspondance phone/email
      console.log('📦 Recherche des commandes LIVRÉES pour user_id:', user.id);
      console.log('📞 Téléphone utilisateur:', user.phone);
      console.log('📧 Email utilisateur:', user.email);

      // Requête pour récupérer SEULEMENT les commandes LIVRÉES par user_id
      const { data: userIdOrders, error: userIdOrdersError } = await supabase
        .from('customer_orders')
        .select('total_amount, status, created_at, customer_info')
        .eq('user_id', user.id)
        .eq('status', 'delivered'); // SEULES LES COMMANDES LIVRÉES

      if (userIdOrdersError) {
        console.error('Erreur commandes user_id:', userIdOrdersError);
      }

      // Requête pour récupérer SEULEMENT les commandes LIVRÉES par téléphone/email dans customer_info
      let phoneEmailOrders: any[] = [];
      if (user.phone || user.email) {
        const { data: phoneEmailOrdersData, error: phoneEmailOrdersError } = await supabase
          .from('customer_orders')
          .select('total_amount, status, created_at, customer_info')
          .eq('status', 'delivered'); // SEULES LES COMMANDES LIVRÉES

        if (phoneEmailOrdersError) {
          console.error('Erreur commandes phone/email:', phoneEmailOrdersError);
        } else {
          // Filtrer les commandes par téléphone/email
          phoneEmailOrders = phoneEmailOrdersData?.filter(order => {
            const customerInfo = order.customer_info as any;
            const customerPhone = customerInfo?.phone;
            const customerEmail = customerInfo?.email;
            
            return (user.phone && customerPhone === user.phone) || 
                   (user.email && customerEmail === user.email);
          }) || [];
        }
      }

      // Combiner et dédupliquer les commandes LIVRÉES
      const allDeliveredOrders = [...(userIdOrders || []), ...phoneEmailOrders];
      const uniqueDeliveredOrders = allDeliveredOrders.filter((order, index, self) =>
        index === self.findIndex(o => o.created_at === order.created_at && o.total_amount === order.total_amount)
      );

      console.log('📊 Commandes LIVRÉES trouvées:', {
        userIdOrders: userIdOrders?.length || 0,
        phoneEmailOrders: phoneEmailOrders.length,
        uniqueDeliveredOrders: uniqueDeliveredOrders.length
      });

      // 4. Calculer les statistiques basées UNIQUEMENT sur les commandes livrées
      const totalOrders = uniqueDeliveredOrders.length;
      const totalSpent = uniqueDeliveredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      console.log('📈 Statistiques calculées (COMMANDES LIVRÉES UNIQUEMENT):', {
        totalOrders,
        totalSpent,
        loyaltyPoints
      });

      // 5. Calculer les niveaux avec la logique dynamique
      const currentLevel = await getDynamicUserLevel(loyaltyPoints);
      const nextLevelInfo = await getDynamicPointsForNextLevel(loyaltyPoints);
      const pointsPerFcfa = await getDynamicPointsPerFcfa();

      console.log('🎯 Niveau et progression:', {
        currentLevel: currentLevel.name,
        nextLevel: nextLevelInfo.nextLevel,
        progress: nextLevelInfo.progress,
        pointsNeeded: nextLevelInfo.pointsNeeded
      });

      // 6. Vérifier les accomplissements avec les seuils dynamiques
      const updatedAchievements = await Promise.all(
        achievements.map(async (achievement) => {
          let unlocked = false;
          
          switch (achievement.requirement.type) {
            case 'first_purchase':
              unlocked = totalOrders >= 1;
              break;
            case 'orders':
              unlocked = totalOrders >= achievement.requirement.value;
              break;
            case 'points':
              // Utiliser les seuils dynamiques pour les niveaux
              if (achievement.id === 'bronze_level') {
                unlocked = loyaltyPoints >= (levels[0]?.minPoints || 0);
              } else if (achievement.id === 'silver_level') {
                unlocked = loyaltyPoints >= (levels[1]?.minPoints || 500);
              } else if (achievement.id === 'gold_level') {
                unlocked = loyaltyPoints >= (levels[2]?.minPoints || 1500);
              } else {
                unlocked = loyaltyPoints >= achievement.requirement.value;
              }
              break;
            case 'spending':
              unlocked = totalSpent >= achievement.requirement.value;
              break;
          }

          return { ...achievement, unlocked };
        })
      );

      const finalStats = {
        totalOrders,
        totalSpent,
        loyaltyPoints,
        currentLevel,
        nextLevelInfo,
        achievements: updatedAchievements,
        progressPercentage: nextLevelInfo.progress,
        pointsToNext: nextLevelInfo.pointsNeeded,
        pointsPerFcfa
      };

      console.log('✅ Stats finales (basées sur commandes livrées uniquement):', finalStats);
      setStats(finalStats);

    } catch (err: any) {
      console.error('❌ Erreur lors du chargement des données de fidélité unifiées:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnifiedLoyaltyData();
  }, [user?.id]);

  // Fonction pour calculer les points gagnés pour un montant donné
  const calculatePointsForAmount = async (amount: number): Promise<number> => {
    return await calculateDynamicLoyaltyPoints(amount);
  };

  // Fonction pour attribuer des points après une commande
  const earnPoints = async (orderAmount: number): Promise<boolean> => {
    if (!user?.id || !stats) return false;

    try {
      const pointsEarned = await calculateDynamicLoyaltyPoints(orderAmount);
      
      if (pointsEarned > 0) {
        // Mettre à jour les points dans le profil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            loyalty_points: stats.loyaltyPoints + pointsEarned 
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        // Enregistrer la transaction de fidélité
        const { error: transactionError } = await supabase
          .from('loyalty_transactions')
          .insert({
            user_id: user.id,
            points: pointsEarned,
            transaction_type: 'earned',
            description: `Points gagnés pour achat de ${orderAmount.toLocaleString()} FCFA`
          });

        if (transactionError) throw transactionError;

        // Actualiser les données
        await fetchUnifiedLoyaltyData();
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution des points:', error);
      return false;
    }

    return false;
  };

  return {
    stats,
    loyaltyLevels,
    isLoading,
    error,
    refetch: fetchUnifiedLoyaltyData,
    calculatePointsForAmount,
    earnPoints
  };
};
