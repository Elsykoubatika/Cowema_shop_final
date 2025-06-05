
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  icon: string;
  unlockedAt?: string;
  requirement: {
    type: 'orders' | 'points' | 'spending' | 'first_purchase' | 'reviews' | 'referrals';
    value: number;
  };
}

export const useUserAchievements = () => {
  const { user } = useUnifiedAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const achievementDefinitions: Achievement[] = [
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
    },
    {
      id: 'big_spender',
      title: 'Gros acheteur',
      description: '50 000 FCFA dépensés',
      points: 75,
      unlocked: false,
      icon: 'sparkles',
      requirement: { type: 'spending', value: 50000 }
    }
  ];

  const checkAchievements = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Récupérer les statistiques utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('loyalty_points')
        .eq('id', user.id)
        .single();

      const { data: orders } = await supabase
        .from('customer_orders')
        .select('total_amount, status, created_at')
        .eq('user_id', user.id)
        .eq('status', 'delivered');

      const loyaltyPoints = profile?.loyalty_points || 0;
      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      // Vérifier les accomplissements déjà débloqués
      const { data: userAchievements } = await supabase
        .from('loyalty_transactions')
        .select('description, created_at')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earned')
        .like('description', '%Accomplissement%');

      const unlockedAchievementIds = new Set(
        userAchievements?.map(ua => {
          const match = ua.description.match(/Accomplissement: ([\w_]+)/);
          return match ? match[1] : null;
        }).filter(Boolean) || []
      );

      const updatedAchievements = achievementDefinitions.map(achievement => {
        let unlocked = unlockedAchievementIds.has(achievement.id);
        
        if (!unlocked) {
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
        }

        const userAchievement = userAchievements?.find(ua => 
          ua.description.includes(achievement.id)
        );

        return {
          ...achievement,
          unlocked,
          unlockedAt: userAchievement?.created_at
        };
      });

      setAchievements(updatedAchievements);

      // Débloquer automatiquement les nouveaux accomplissements
      const newlyUnlocked = updatedAchievements.filter(
        a => a.unlocked && !unlockedAchievementIds.has(a.id)
      );

      for (const achievement of newlyUnlocked) {
        await supabase
          .from('loyalty_transactions')
          .insert({
            user_id: user.id,
            points: achievement.points,
            transaction_type: 'earned',
            description: `Accomplissement: ${achievement.id} - ${achievement.title}`
          });

        // Mettre à jour les points de fidélité
        await supabase
          .from('profiles')
          .update({ 
            loyalty_points: loyaltyPoints + achievement.points 
          })
          .eq('id', user.id);
      }

    } catch (err: any) {
      console.error('Erreur lors de la vérification des accomplissements:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAchievements();
  }, [user?.id]);

  return {
    achievements,
    isLoading,
    error,
    refetch: checkAchievements
  };
};
