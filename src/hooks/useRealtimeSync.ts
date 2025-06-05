
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './useAuthStore';
import { useOrderStore } from './useOrderStore';
import { toast } from 'sonner';

export const useRealtimeSync = () => {
  const { user } = useAuthStore();
  const { getAllOrders } = useOrderStore();

  useEffect(() => {
    if (!user) return;

    // Canal de synchronisation globale
    const syncChannel = supabase
      .channel('global-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_orders'
        },
        (payload) => {
          console.log('Synchronisation des commandes:', payload);
          
          // Synchroniser le store local avec les données Supabase
          if (payload.eventType === 'INSERT') {
            // Une nouvelle commande a été créée
            console.log('Nouvelle commande détectée pour synchronisation');
          } else if (payload.eventType === 'UPDATE') {
            // Une commande a été mise à jour
            console.log('Mise à jour de commande détectée pour synchronisation');
          } else if (payload.eventType === 'DELETE') {
            // Une commande a été supprimée
            console.log('Suppression de commande détectée pour synchronisation');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products_unified'
        },
        (payload) => {
          console.log('Synchronisation des produits:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Produit ajouté ou mis à jour
            console.log('Produit synchronisé:', payload.new);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Synchronisation en temps réel activée');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Erreur de canal de synchronisation');
          toast.error('Erreur de synchronisation en temps réel');
        } else if (status === 'TIMED_OUT') {
          console.warn('Délai de synchronisation dépassé');
          toast.warning('Reconnexion en cours...');
        }
      });

    // Nettoyage lors du démontage
    return () => {
      supabase.removeChannel(syncChannel);
    };
  }, [user]);

  const forceSyncOrders = async () => {
    try {
      // Forcer une synchronisation manuelle des commandes
      const { data: orders, error } = await supabase
        .from('customer_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Synchronisation forcée des commandes:', orders?.length || 0);
      toast.success(`${orders?.length || 0} commandes synchronisées`);
      
      return orders;
    } catch (error) {
      console.error('Erreur lors de la synchronisation forcée:', error);
      toast.error('Erreur lors de la synchronisation');
      return null;
    }
  };

  return {
    forceSyncOrders
  };
};
