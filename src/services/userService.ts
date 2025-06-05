
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin, testAdminConnection } from '@/integrations/supabase/adminClient';
import { UserProfile, CreateUserData } from '@/types/userManager';

export const fetchUsersFromDatabase = async (): Promise<UserProfile[]> => {
  console.log('📋 Récupération des utilisateurs...');

  // Récupérer tous les profils
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('❌ Erreur profils:', profilesError);
    throw profilesError;
  }

  console.log('✅ Profils récupérés:', profiles?.length || 0);

  // Transformer les profils en utilisateurs
  const transformedUsers: UserProfile[] = (profiles || []).map((profile: any) => {
    // Générer un email basé sur le nom si pas d'email réel
    let email = profile.email;
    if (!email) {
      const nomFormatted = profile.nom?.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '') || 'user';
      email = `${nomFormatted}@cowema.local`;
    }

    return {
      id: profile.id,
      nom: profile.nom || 'Utilisateur',
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: email,
      phone: profile.phone,
      role: profile.role || 'user',
      gender: profile.gender === 'other' ? 'male' : (profile.gender as 'male' | 'female'),
      city: profile.city,
      loyalty_points: profile.loyalty_points || 0,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      email_confirmed_at: new Date().toISOString(),
    };
  });

  return transformedUsers;
};

export const createUserInDatabase = async (userData: CreateUserData): Promise<boolean> => {
  console.log('🔨 Création utilisateur avec auth:', userData.nom, userData.role);
  
  try {
    // Test de la connexion admin avant de commencer
    console.log('🔍 Test de la connexion admin...');
    const adminConnected = await testAdminConnection();
    if (!adminConnected) {
      throw new Error('Connexion administrateur impossible - vérifiez la configuration');
    }

    // Étape 1: Créer l'utilisateur dans le système d'authentification
    console.log('📧 Création de l\'utilisateur auth avec email:', userData.email);
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        nom: userData.nom,
        first_name: userData.firstName || userData.nom,
        last_name: userData.lastName || '',
        phone: userData.phone,
        gender: userData.gender,
        role: userData.role,
        city: userData.city
      }
    });

    if (authError) {
      console.error('❌ Erreur création auth user:', authError);
      console.error('❌ Code erreur:', authError.code);
      console.error('❌ Message erreur:', authError.message);
      
      // Messages d'erreur plus spécifiques
      if (authError.message?.includes('User already registered')) {
        throw new Error(`L'email ${userData.email} est déjà utilisé`);
      } else if (authError.message?.includes('weak_password')) {
        throw new Error('Le mot de passe est trop faible (minimum 6 caractères)');
      } else if (authError.message?.includes('invalid_email')) {
        throw new Error('Format d\'email invalide');
      } else if (authError.code === '401' || authError.message?.includes('not authorized')) {
        throw new Error('Erreur d\'autorisation - vérifiez la configuration admin');
      }
      
      throw new Error(`Erreur création utilisateur: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Aucun utilisateur créé dans le système d\'authentification');
    }

    console.log('✅ Utilisateur auth créé avec ID:', authData.user.id);

    // Étape 2: Créer explicitement le profil utilisateur
    console.log('👤 Création du profil utilisateur...');
    
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
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
      console.error('❌ Erreur création profil:', profileError);
      
      // Essayer de supprimer l'utilisateur auth si le profil n'a pas pu être créé
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        console.log('🗑️ Utilisateur auth supprimé après échec profil');
      } catch (deleteError) {
        console.error('❌ Erreur suppression utilisateur auth:', deleteError);
      }
      
      throw new Error(`Erreur création profil: ${profileError.message}`);
    }

    console.log('✅ Profil créé avec succès pour:', authData.user.id);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création utilisateur complète:', error);
    throw error;
  }
};

export const updateUserInDatabase = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
  console.log('🔄 Mise à jour utilisateur:', userId, updates);
  
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

  if (error) {
    console.error('❌ Erreur mise à jour:', error);
    throw error;
  }

  return true;
};

export const deleteUserFromDatabase = async (userId: string): Promise<boolean> => {
  console.log('🗑️ Suppression utilisateur:', userId);
  
  try {
    // Supprimer l'utilisateur auth (cela supprimera automatiquement le profil grâce à la cascade)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('❌ Erreur suppression auth user:', authError);
      throw authError;
    }

    console.log('✅ Utilisateur supprimé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
};

export const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  console.log('🔐 Réinitialisation mot de passe pour:', userId);
  
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) {
      console.error('❌ Erreur réinitialisation:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
};
