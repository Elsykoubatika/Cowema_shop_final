
import { supabaseAdmin, testAdminConnection } from '@/integrations/supabase/adminClient';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, CreateUserData } from '@/types/userManager';

export class UserService {
  static async fetchUsers(): Promise<UserProfile[]> {
    console.log('📋 Récupération des utilisateurs...');
    
    try {
      const adminConnected = await testAdminConnection();
      if (adminConnected) {
        console.log('🔑 Utilisation des privilèges admin...');
        return await this.fetchUsersWithAdmin();
      }
    } catch (error) {
      console.warn('⚠️ Privilèges admin non disponibles, fallback vers méthode normale');
    }
    
    console.log('👤 Fallback: récupération des profils uniquement...');
    return await this.fetchUsersFromProfiles();
  }

  private static async fetchUsersWithAdmin(): Promise<UserProfile[]> {
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Erreur auth users:', authError);
      throw new Error(`Erreur récupération utilisateurs: ${authError.message}`);
    }

    console.log('✅ Utilisateurs auth récupérés:', authUsers.users.length);

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.warn('⚠️ Erreur profils:', profilesError);
    }

    const combinedUsers: UserProfile[] = authUsers.users.map((authUser: any) => {
      const profile = profiles?.find(p => p.id === authUser.id);
      
      return {
        id: authUser.id,
        nom: profile?.nom || authUser.user_metadata?.nom || authUser.email?.split('@')[0] || 'Utilisateur',
        first_name: profile?.first_name || authUser.user_metadata?.first_name,
        last_name: profile?.last_name || authUser.user_metadata?.last_name,
        email: authUser.email || 'Email non défini',
        phone: profile?.phone || authUser.user_metadata?.phone,
        role: profile?.role || authUser.user_metadata?.role || 'user',
        gender: profile?.gender || authUser.user_metadata?.gender || 'male',
        city: profile?.city || authUser.user_metadata?.city,
        loyalty_points: profile?.loyalty_points || 0,
        created_at: authUser.created_at,
        updated_at: profile?.updated_at || authUser.updated_at,
        email_confirmed_at: authUser.email_confirmed_at,
      };
    });

    return combinedUsers;
  }

  private static async fetchUsersFromProfiles(): Promise<UserProfile[]> {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Erreur récupération profils:', profilesError);
      throw new Error(`Erreur récupération profils: ${profilesError.message}`);
    }

    console.log('✅ Profils récupérés:', profiles?.length || 0);

    const users: UserProfile[] = (profiles || []).map((profile: any) => ({
      id: profile.id,
      nom: profile.nom || 'Utilisateur',
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: `${profile.nom?.toLowerCase()?.replace(/\s+/g, '.')}@cowema.local` || 'email@cowema.local',
      phone: profile.phone,
      role: profile.role || 'user',
      gender: profile.gender || 'male',
      city: profile.city,
      loyalty_points: profile.loyalty_points || 0,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      email_confirmed_at: profile.created_at,
    }));

    return users;
  }

  static async createUser(userData: CreateUserData): Promise<void> {
    console.log('🔨 Création utilisateur:', userData.nom, userData.role);
    
    const adminConnected = await testAdminConnection();
    
    if (adminConnected) {
      console.log('🔑 Création avec privilèges admin...');
      await this.createUserWithAdmin(userData);
    } else {
      console.log('👤 Création profil uniquement (pas d\'auth)...');
      await this.createProfileOnly(userData);
    }
  }

  private static async createUserWithAdmin(userData: CreateUserData): Promise<void> {
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
      console.error('❌ Erreur création auth:', authError);
      let errorMessage = `Erreur création utilisateur: ${authError.message}`;
      
      if (authError.message?.includes('User already registered')) {
        errorMessage = `L'email ${userData.email} est déjà utilisé`;
      } else if (authError.message?.includes('weak_password')) {
        errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères)';
      }
      
      throw new Error(errorMessage);
    }

    if (!authData.user) {
      throw new Error('Utilisateur non créé');
    }

    console.log('✅ Utilisateur auth créé:', authData.user.id);
    await this.createProfile(authData.user.id, userData);
  }

  private static async createProfileOnly(userData: CreateUserData): Promise<void> {
    const profileId = crypto.randomUUID();
    console.log('📝 Création profil sans auth pour ID:', profileId);
    await this.createProfile(profileId, userData);
  }

  private static async createProfile(userId: string, userData: CreateUserData): Promise<void> {
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
      console.error('❌ Erreur création profil:', profileError);
      throw new Error(`Erreur création profil: ${profileError.message}`);
    }

    console.log('✅ Profil créé avec succès');
  }

  static async updateUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error: profileError } = await supabase
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

    if (profileError) {
      throw profileError;
    }

    // Essayer de mettre à jour les métadonnées auth si possible
    try {
      const adminConnected = await testAdminConnection();
      if (adminConnected && updates.role) {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { role: updates.role }
        });
      }
    } catch (error) {
      console.warn('⚠️ Impossible de mettre à jour auth metadata:', error);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const adminConnected = await testAdminConnection();
      if (adminConnected) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn('⚠️ Erreur suppression auth:', authError);
        }
      }
    } catch (error) {
      console.warn('⚠️ Impossible de supprimer de auth:', error);
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }
  }

  static async resetPassword(userId: string, newPassword: string): Promise<void> {
    const adminConnected = await testAdminConnection();
    
    if (!adminConnected) {
      throw new Error('Privilèges administrateur requis pour réinitialiser les mots de passe');
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) {
      throw error;
    }
  }
}
