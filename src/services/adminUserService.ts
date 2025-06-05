
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData, UserProfile } from '@/types/userManager';

export class AdminUserService {
  // Créer un utilisateur avec accès public
  static async createUser(userData: CreateUserData): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
      console.log('🚀 Début création utilisateur public:', userData.nom);

      // 1. Créer l'utilisateur avec inscription normale
      console.log('📧 Tentative création user avec signup...');
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
        console.error('❌ Erreur auth création:', authError);
        return { 
          success: false, 
          error: this.formatAuthError(authError) 
        };
      }

      if (!authData.user) {
        return { success: false, error: 'Aucun utilisateur créé' };
      }

      console.log('✅ Auth user créé:', authData.user.id);

      // 2. Attendre un petit délai pour laisser les triggers Supabase se déclencher
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Vérifier si le profil a été créé automatiquement, sinon le créer
      console.log('👤 Vérification du profil...');
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        // Le profil n'existe pas, le créer
        console.log('🆕 Création du profil manquant...');
        const { error: profileError } = await supabase
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
          return { 
            success: false, 
            error: `Erreur création profil: ${profileError.message}` 
          };
        }
      } else if (existingProfile) {
        console.log('✅ Profil existant trouvé');
      }

      console.log('✅ Utilisateur créé avec succès:', authData.user.id);
      
      return { 
        success: true, 
        user: {
          id: authData.user.id,
          email: authData.user.email,
          ...userData
        }
      };

    } catch (error: any) {
      console.error('❌ Erreur inattendue:', error);
      return { 
        success: false, 
        error: `Erreur inattendue: ${error.message || 'Inconnue'}` 
      };
    }
  }

  // Formater les erreurs d'authentification
  private static formatAuthError(error: any): string {
    const message = error.message || '';
    
    if (message.includes('User already registered') || message.includes('déjà utilisé')) {
      return `L'email est déjà utilisé par un autre utilisateur`;
    }
    
    if (message.includes('weak_password')) {
      return 'Le mot de passe est trop faible (minimum 6 caractères requis)';
    }
    
    if (message.includes('invalid_email')) {
      return 'Format d\'email invalide';
    }
    
    return `Erreur d'authentification: ${message}`;
  }

  // Récupérer tous les utilisateurs sans restriction
  static async fetchUsers(): Promise<{ success: boolean; users?: UserProfile[]; error?: string }> {
    try {
      console.log('📋 Récupération utilisateurs publique...');

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération:', error);
        return { success: false, error: error.message };
      }

      const users: UserProfile[] = (profiles || []).map((profile: any) => {
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

      console.log('✅ Utilisateurs récupérés avec succès:', users.length);
      return { success: true, users };
    } catch (error: any) {
      console.error('❌ Erreur inattendue récupération:', error);
      return { success: false, error: error.message };
    }
  }
}
