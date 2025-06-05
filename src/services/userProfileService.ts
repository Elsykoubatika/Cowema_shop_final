
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userManager';

export const fetchUserProfiles = async (): Promise<UserProfile[]> => {
  console.log('🔄 Fetching users from profiles table...');
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('❌ Error fetching profiles:', profilesError);
    throw profilesError;
  }

  console.log('✅ Profiles fetched:', profiles?.length || 0);

  // Transform profiles to UserProfile format
  const transformedUsers: UserProfile[] = (profiles || []).map((profile: any) => ({
    id: profile.id,
    nom: profile.nom || 'Utilisateur',
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: `${profile.nom?.toLowerCase().replace(/\s+/g, '.')}@cowema.local`,
    phone: profile.phone,
    role: profile.role || 'user',
    gender: profile.gender || 'male',
    city: profile.city,
    loyalty_points: profile.loyalty_points || 0,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    email_confirmed_at: new Date().toISOString(),
  }));

  return transformedUsers;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      nom: updates.nom,
      first_name: updates.first_name,
      last_name: updates.last_name,
      phone: updates.phone,
      role: updates.role,
      gender: updates.gender,
      city: updates.city,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) throw error;
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  
  if (error) throw error;
};
