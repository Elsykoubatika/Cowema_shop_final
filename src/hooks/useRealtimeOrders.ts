
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './useAuthStore';
import { toast } from 'sonner';

interface RealtimeOrder {
  id: string;
  status: string;
  total_amount: number;
  customer_info: {
    city?: string;
    [key: string]: any;
  };
  delivery_address?: {
    city?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export const useRealtimeOrders = () => {
  const [newOrders, setNewOrders] = useState<RealtimeOrder[]>([]);
  const [updatedOrders, setUpdatedOrders] = useState<RealtimeOrder[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime orders channel for user:', user.id);

    // Configurer le canal Realtime pour les commandes
    const ordersChannel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_orders'
        },
        (payload) => {
          console.log('Nouvelle commande reçue:', payload.new);
          const newOrder = payload.new as RealtimeOrder;
          
          // Vérifier si l'utilisateur peut voir cette commande (selon sa ville)
          const canSeeOrder = canUserSeeOrder(newOrder, user);
          
          if (canSeeOrder) {
            setNewOrders(prev => {
              // Éviter les doublons
              const exists = prev.find(o => o.id === newOrder.id);
              if (exists) return prev;
              return [...prev, newOrder];
            });
            
            // Notification pour les admins et managers
            if (['admin', 'sales_manager', 'team_lead'].includes(user.role || '')) {
              toast.success(`Nouvelle commande reçue! #${newOrder.id.slice(0, 8)}`, {
                description: `Montant: ${newOrder.total_amount.toLocaleString()} FCFA`,
                duration: 5000,
              });
              
              // Jouer un son de notification (optionnel)
              playNotificationSound();
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_orders'
        },
        (payload) => {
          console.log('Commande mise à jour:', payload.new);
          const updatedOrder = payload.new as RealtimeOrder;
          
          // Vérifier si l'utilisateur peut voir cette commande
          const canSeeOrder = canUserSeeOrder(updatedOrder, user);
          
          if (canSeeOrder) {
            setUpdatedOrders(prev => {
              const existing = prev.find(o => o.id === updatedOrder.id);
              if (existing) {
                return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
              }
              return [...prev, updatedOrder];
            });
            
            // Notification pour changement de statut
            if (payload.old && (payload.old as any).status !== updatedOrder.status) {
              toast.info(`Commande #${updatedOrder.id.slice(0, 8)} mise à jour`, {
                description: `Nouveau statut: ${getStatusText(updatedOrder.status)}`,
                duration: 3000,
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Nettoyer lors du démontage
    return () => {
      console.log('Cleaning up realtime orders channel');
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  // Fonction pour vérifier si l'utilisateur peut voir une commande
  const canUserSeeOrder = (order: RealtimeOrder, user: any) => {
    if (!user) return false;
    
    // Admin et sales_manager voient tout si pas de ville spécifiée
    if ((user.role === 'admin' || user.role === 'sales_manager') && !user.city) {
      return true;
    }
    
    const orderCity = order.customer_info?.city || order.delivery_address?.city;
    
    if (!orderCity) return true; // Afficher les commandes sans ville
    
    if (!user.city) {
      // Utilisateur sans ville spécifiée peut voir selon son rôle
      return user.role === 'admin' || user.role === 'sales_manager';
    }
    
    const userCity = user.city.toLowerCase();
    const deliveryCity = orderCity.toLowerCase();
    
    // Logique de filtrage par ville
    if (userCity === 'pointe-noire') {
      return deliveryCity === 'pointe-noire' || deliveryCity === 'dolisie';
    }
    
    if (userCity === 'brazzaville') {
      return deliveryCity !== 'pointe-noire' && deliveryCity !== 'dolisie';
    }
    
    return userCity === deliveryCity;
  };

  const playNotificationSound = () => {
    try {
      // Créer et jouer un son de notification simple
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  };

  const clearNewOrders = () => {
    console.log('Clearing new orders');
    setNewOrders([]);
  };
  
  const clearUpdatedOrders = () => {
    console.log('Clearing updated orders');
    setUpdatedOrders([]);
  };

  return {
    newOrders,
    updatedOrders,
    hasNewOrders: newOrders.length > 0,
    hasUpdatedOrders: updatedOrders.length > 0,
    clearNewOrders,
    clearUpdatedOrders
  };
};
