
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData } from '@/types/userManager';
import { createInfluencerProfile } from '@/services/influencerService';

export const createAuthUser = async (userData: CreateUserData): Promise<string> => {
  console.log('🚀 Creating auth user:', userData.nom);
  
  // Create auth user first
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        nom: userData.nom,
        first_name: userData.firstName || userData.nom,
        last_name: userData.lastName || '',
        phone: userData.phone,
        gender: userData.gender,
        role: userData.role,
        city: userData.city
      }
    }
  });

  if (authError) {
    console.error('❌ Auth error:', authError);
    
    // Handle specific error cases
    if (authError.message?.includes('User already registered')) {
      throw new Error(`L'email ${userData.email} est déjà utilisé`);
    } else if (authError.message?.includes('weak_password')) {
      throw new Error('Le mot de passe est trop faible (minimum 6 caractères)');
    } else if (authError.message?.includes('invalid_email')) {
      throw new Error('Format d\'email invalide');
    }
    
    throw new Error(`Erreur d'authentification: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error('Aucun utilisateur créé');
  }

  console.log('✅ Auth user created:', authData.user.id);
  return authData.user.id;
};

export const createUserProfile = async (userId: string, userData: CreateUserData): Promise<void> => {
  // Create profile directly in the profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      nom: userData.nom,
      first_name: userData.firstName || userData.nom,
      last_name: userData.lastName || '',
      phone: userData.phone,
      role: userData.role,
      gender: userData.gender,
      city: userData.city,
      loyalty_points: 0
    });

  if (profileError) {
    console.error('❌ Profile error:', profileError);
    
    // Try to clean up the auth user if profile creation failed
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (cleanupError) {
      console.warn('⚠️ Could not clean up auth user after profile error');
    }
    
    throw new Error(`Erreur création profil: ${profileError.message}`);
  }

  console.log('✅ Profile created successfully');

  // Create influencer profile if needed
  if (userData.role === 'influencer') {
    try {
      await createInfluencerProfile(userId);
      console.log('✅ Influencer profile created');
    } catch (influencerError) {
      console.warn('⚠️ Influencer profile error:', influencerError);
    }
  }
};

export const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  // Note: This functionality is not available in the current implementation
  return false;
};
