
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from './useAuthStore';

export interface UserProfileData {
  id: string;
  nom: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  gender: 'male' | 'female';
  role: 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer';
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedProfile: UserProfileData = {
        id: data.id,
        nom: data.nom,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        city: data.city,
        gender: data.gender === 'other' ? 'male' : data.gender as 'male' | 'female',
        role: data.role as 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer',
        loyalty_points: data.loyalty_points || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setProfile(transformedProfile);
    } catch (err: any) {
      console.error('Erreur lors du chargement du profil:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfileData>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour localement
      setProfile(prev => prev ? { ...prev, ...updates } : null);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });

      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile
  };
};
