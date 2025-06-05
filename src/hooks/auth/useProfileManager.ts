
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from './types';

export const useProfileManager = () => {
  const transformProfile = useCallback((profile: any, email: string): AuthUser => {
    return {
      id: profile.id,
      email: email,
      nom: profile.nom || 'Utilisateur',
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone,
      gender: profile.gender === 'other' ? 'male' : profile.gender || 'male',
      role: profile.role || 'user',
      city: profile.city,
      loyaltyPoints: profile.loyalty_points || 0,
      createdAt: profile.created_at
    };
  }, []);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return transformProfile(profile, email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [transformProfile]);

  const getDashboardRoute = useCallback((role: string): string => {
    switch (role) {
      case 'admin':
      case 'sales_manager':
      case 'team_lead':
      case 'seller':
        return '/admin';
      case 'influencer':
        return '/influencer/dashboard';
      default:
        return '/client-space';
    }
  }, []);

  return {
    fetchProfile,
    getDashboardRoute
  };
};
