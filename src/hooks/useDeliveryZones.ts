
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DeliveryZone {
  id: string;
  zone_name: string;
  city: string;
  base_fee: number;
  additional_fee?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useDeliveryZones = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchZones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('city', { ascending: true });

      if (error) throw error;
      setZones(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des zones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createZone = async (zoneData: Omit<DeliveryZone, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .insert([zoneData])
        .select()
        .single();

      if (error) throw error;

      setZones(prev => [...prev, data]);
      toast({
        title: "Zone créée",
        description: "La nouvelle zone de livraison a été créée avec succès.",
      });
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la création:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la zone de livraison.",
      });
      return false;
    }
  };

  const updateZone = async (id: string, updates: Partial<DeliveryZone>) => {
    try {
      const { error } = await supabase
        .from('delivery_zones')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setZones(prev => prev.map(zone => 
        zone.id === id ? { ...zone, ...updates } : zone
      ));

      toast({
        title: "Zone mise à jour",
        description: "Les modifications ont été enregistrées.",
      });
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la zone.",
      });
      return false;
    }
  };

  const deleteZone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setZones(prev => prev.filter(zone => zone.id !== id));
      toast({
        title: "Zone supprimée",
        description: "La zone de livraison a été supprimée.",
      });
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la zone.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return {
    zones,
    loading,
    error,
    fetchZones,
    createZone,
    updateZone,
    deleteZone
  };
};
