
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';
import { calculateDynamicLoyaltyPoints } from '@/utils/dynamicLoyaltyUtils';

export const useLoyaltySync = () => {
  const { user } = useUnifiedAuth();

  // Écouter les nouvelles commandes livrées pour attribuer automatiquement les points
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('loyalty-sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_orders',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const newOrder = payload.new;
          const oldOrder = payload.old;
          
          // Si le statut passe à 'delivered'
          if (newOrder.status === 'delivered' && oldOrder.status !== 'delivered') {
            try {
              // Calculer les points à attribuer
              const pointsToEarn = await calculateDynamicLoyaltyPoints(newOrder.total_amount);
              
              if (pointsToEarn > 0) {
                // Récupérer les points actuels
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('loyalty_points')
                  .eq('id', user.id)
                  .single();

                const currentPoints = profile?.loyalty_points || 0;

                // Mettre à jour les points
                await supabase
                  .from('profiles')
                  .update({ 
                    loyalty_points: currentPoints + pointsToEarn 
                  })
                  .eq('id', user.id);

                // Enregistrer la transaction
                await supabase
                  .from('loyalty_transactions')
                  .insert({
                    user_id: user.id,
                    points: pointsToEarn,
                    transaction_type: 'earned',
                    description: `Points gagnés pour commande #${newOrder.id.slice(0, 8)} - ${newOrder.total_amount.toLocaleString()} FCFA`,
                    order_id: newOrder.id
                  });

                console.log(`🎉 ${pointsToEarn} points Ya Ba Boss attribués pour la commande ${newOrder.id}`);
              }
            } catch (error) {
              console.error('Erreur lors de l\'attribution des points:', error);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return null;
};
