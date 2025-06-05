
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';
import { getUserLevel, getPointsForNextLevel } from '../utils/loyaltyUtils';

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

export interface LoyaltyStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  currentLevel: any;
  nextLevel: any;
  achievements: Achievement[];
  progressPercentage: number;
  pointsToNext: number;
}

export const useLoyaltySystem = () => {
  const { user } = useUnifiedAuth();
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      id: 'expert_level',
      title: 'Expert Ya Ba Boss',
      description: 'Niveau Expert atteint',
      points: 50,
      unlocked: false,
      icon: 'sparkles',
      requirement: { type: 'points', value: 105 } // Points needed for Silver level
    }
  ];

  const fetchLoyaltyData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Récupérer les commandes livrées de l'utilisateur
      const { data: orders, error: ordersError } = await supabase
        .from('customer_orders')
        .select('total_amount, status, created_at')
        .eq('user_id', user.id)
        .eq('status', 'delivered');

      if (ordersError) throw ordersError;

      // Récupérer les points de fidélité actuels du profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('loyalty_points')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Calculer les statistiques
      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const loyaltyPoints = profile?.loyalty_points || 0;

      // Calculer les niveaux
      const currentLevel = getUserLevel(loyaltyPoints);
      const nextLevel = getPointsForNextLevel(loyaltyPoints);

      // Vérifier les accomplissements
      const updatedAchievements = achievements.map(achievement => {
        let unlocked = false;
        
        switch (achievement.requirement.type) {
          case 'first_purchase':
            unlocked = totalOrders >= 1;
            break;
          case 'orders':
            unlocked = totalOrders >= achievement.requirement.value;
            break;
          case 'points':
            unlocked = loyaltyPoints >= achievement.requirement.value;
            break;
          case 'spending':
            unlocked = totalSpent >= achievement.requirement.value;
            break;
        }

        return { ...achievement, unlocked };
      });

      setStats({
        totalOrders,
        totalSpent,
        loyaltyPoints,
        currentLevel,
        nextLevel,
        achievements: updatedAchievements,
        progressPercentage: nextLevel.progress,
        pointsToNext: nextLevel.pointsNeeded
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données de fidélité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, [user?.id]);

  const earnPoints = async (orderAmount: number) => {
    if (!user?.id) return;

    try {
      // Calculer les points gagnés (1 point pour 1000 FCFA)
      const pointsEarned = Math.floor(orderAmount / 1000);
      
      if (pointsEarned > 0) {
        // Mettre à jour les points dans le profil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            loyalty_points: (stats?.loyaltyPoints || 0) + pointsEarned 
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
        await fetchLoyaltyData();
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution des points:', error);
    }
  };

  return {
    stats,
    isLoading,
    earnPoints,
    refetch: fetchLoyaltyData
  };
};
