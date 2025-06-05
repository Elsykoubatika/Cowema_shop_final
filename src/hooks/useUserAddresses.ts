
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from './useAuthStore';

export interface UserAddress {
  id: string;
  street: string;
  city: string;
  country?: string;
  state?: string;
  postal_code?: string;
  arrondissement?: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

export const useUserAddresses = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const fetchAddresses = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformer les données pour ajouter arrondissement si nécessaire
      const transformedData = (data || []).map(address => ({
        ...address,
        arrondissement: address.state || '',
        updated_at: address.created_at // utiliser created_at car updated_at n'existe pas dans la table
      }));
      
      setAddresses(transformedData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des adresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: Omit<UserAddress, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .insert({
          street: addressData.street,
          city: addressData.city,
          state: addressData.arrondissement,
          country: 'Congo',
          is_default: addressData.is_default,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Adresse ajoutée",
        description: "Votre nouvelle adresse a été ajoutée avec succès.",
      });

      await fetchAddresses();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'adresse.",
      });
      return false;
    }
  };

  const updateAddress = async (id: string, updates: Partial<UserAddress>) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .update({
          street: updates.street,
          city: updates.city,
          state: updates.arrondissement,
          is_default: updates.is_default
        })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Adresse mise à jour",
        description: "Votre adresse a été mise à jour avec succès.",
      });

      await fetchAddresses();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'adresse.",
      });
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Adresse supprimée",
        description: "L'adresse a été supprimée avec succès.",
      });

      await fetchAddresses();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'adresse.",
      });
      return false;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      // D'abord, retirer le statut par défaut de toutes les adresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Puis définir la nouvelle adresse par défaut
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Adresse par défaut",
        description: "Cette adresse est maintenant votre adresse par défaut.",
      });

      await fetchAddresses();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la définition par défaut:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de définir cette adresse par défaut.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.id]);

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses: fetchAddresses
  };
};
