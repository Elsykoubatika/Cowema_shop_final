
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from './useUnifiedAuth';

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

export interface AddressFormData {
  street: string;
  city: string;
  arrondissement: string;
  is_default?: boolean;
}

export const useAddressManagement = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUnifiedAuth();
  const { toast } = useToast();

  const fetchAddresses = async () => {
    if (!user?.id) {
      setAddresses([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(address => ({
        ...address,
        arrondissement: address.state || '',
        updated_at: address.created_at
      }));
      
      setAddresses(transformedData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des adresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: AddressFormData, shouldSetDefault = false): Promise<UserAddress | null> => {
    if (!user?.id) return null;

    try {
      // Si c'est la première adresse ou si explicitement demandé, la marquer par défaut
      const isDefault = addresses.length === 0 || shouldSetDefault;
      
      // Si on veut marquer cette adresse par défaut, retirer le défaut des autres
      if (isDefault && addresses.length > 0) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          street: addressData.street,
          city: addressData.city,
          state: addressData.arrondissement,
          country: 'Congo',
          is_default: isDefault,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newAddress: UserAddress = {
        ...data,
        arrondissement: data.state || '',
        updated_at: data.created_at
      };

      await fetchAddresses(); // Rafraîchir la liste
      
      toast({
        title: "Adresse ajoutée",
        description: "Votre nouvelle adresse a été ajoutée avec succès.",
      });

      return newAddress;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'adresse.",
      });
      return null;
    }
  };

  const updateAddress = async (id: string, updates: Partial<AddressFormData>): Promise<boolean> => {
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

      await fetchAddresses();
      
      toast({
        title: "Adresse mise à jour",
        description: "Votre adresse a été mise à jour avec succès.",
      });

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

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchAddresses();
      
      toast({
        title: "Adresse supprimée",
        description: "L'adresse a été supprimée avec succès.",
      });

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

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    try {
      // Retirer le statut par défaut de toutes les adresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Définir la nouvelle adresse par défaut
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchAddresses();
      
      toast({
        title: "Adresse par défaut",
        description: "Cette adresse est maintenant votre adresse par défaut.",
      });

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

  const getDefaultAddress = (): UserAddress | null => {
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  };

  const formatAddressForDisplay = (address: UserAddress): string => {
    return `${address.street}, ${address.city} - ${address.arrondissement}`;
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
    getDefaultAddress,
    formatAddressForDisplay,
    refreshAddresses: fetchAddresses,
    isLoggedIn: !!user?.id
  };
};
