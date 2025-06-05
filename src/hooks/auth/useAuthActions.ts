
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RegisterData } from './types';

export const useAuthActions = () => {
  const login = useCallback(async (email: string, password: string, expectedRoleType?: 'admin' | 'influencer' | 'client'): Promise<boolean> => {
    console.log('🔐 Starting login for:', email, 'Expected role type:', expectedRoleType);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login error:', error);
        let errorMessage = 'Erreur de connexion';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        }
        
        toast.error(errorMessage);
        return false;
      }

      if (data.user) {
        // Récupérer le profil utilisateur pour vérifier le rôle avec timeout
        try {
          const profilePromise = supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
            
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          );
          
          const { data: profile, error: profileError } = await Promise.race([
            profilePromise,
            timeoutPromise
          ]) as any;

          if (profileError) {
            console.error('❌ Profile fetch error:', profileError);
            toast.error('Erreur lors de la récupération du profil');
            await supabase.auth.signOut();
            return false;
          }

          const userRole = profile?.role;
          console.log('👤 User role:', userRole, 'Expected:', expectedRoleType);

          // Vérifier si le rôle correspond au type de connexion attendu
          if (expectedRoleType) {
            const roleTypeMap = {
              admin: ['admin', 'sales_manager', 'team_lead', 'seller'],
              influencer: ['influencer'],
              client: ['user']
            };

            const allowedRoles = roleTypeMap[expectedRoleType];
            
            if (!allowedRoles.includes(userRole)) {
              console.warn('⚠️ Role mismatch - disconnecting user');
              await supabase.auth.signOut();
              
              let errorMessage = '';
              if (expectedRoleType === 'admin') {
                errorMessage = 'Ce compte n\'a pas les droits d\'administration. Utilisez la page de connexion client ou influenceur.';
              } else if (expectedRoleType === 'influencer') {
                errorMessage = 'Ce compte n\'est pas un compte influenceur. Utilisez la page de connexion appropriée.';
              } else if (expectedRoleType === 'client') {
                errorMessage = 'Ce compte a des privilèges spéciaux. Utilisez la page de connexion admin ou influenceur.';
              }
              
              toast.error(errorMessage);
              return false;
            }
          }

          console.log('✅ Login successful for user:', data.user.id);
          toast.success('Connexion réussie!');
          return true;
        } catch (error) {
          console.warn('⚠️ Profile verification timed out, allowing login');
          toast.success('Connexion réussie!');
          return true;
        }
      }

      return false;
    } catch (error: any) {
      console.error('❌ Unexpected login error:', error);
      toast.error('Une erreur inattendue s\'est produite');
      return false;
    }
  }, []);

  const register = useCallback(async (registerData: RegisterData): Promise<boolean> => {
    console.log('📝 Starting registration for:', registerData.email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            nom: registerData.nom,
            first_name: registerData.firstName || registerData.nom,
            last_name: registerData.lastName || '',
            phone: registerData.phone || '',
            gender: registerData.gender,
            role: registerData.role || 'user',
            city: registerData.city || ''
          }
        }
      });

      if (error) {
        console.error('❌ Registration error:', error);
        let errorMessage = 'Erreur lors de l\'inscription';
        if (error.message.includes('User already registered')) {
          errorMessage = 'Un compte existe déjà avec cet email';
        }
        toast.error(errorMessage);
        return false;
      }

      if (data.user) {
        console.log('✅ Registration successful for user:', data.user.id);
        toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('❌ Unexpected registration error:', error);
      toast.error('Une erreur inattendue s\'est produite');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🚪 Starting logout process...');
    
    try {
      // Timeout pour éviter que le logout se bloque
      const logoutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timeout')), 5000)
      );
      
      try {
        const { error } = await Promise.race([logoutPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('❌ Logout error:', error);
          
          // Si l'erreur indique que la session n'existe pas, on considère que c'est un succès
          if (error.message?.includes('session_not_found') || 
              error.message?.includes('Session not found') ||
              error.message?.includes('no session')) {
            console.log('ℹ️ Session already expired, treating as successful logout');
          } else {
            toast.error('Erreur lors de la déconnexion');
            return;
          }
        }
      } catch (timeoutError) {
        console.warn('⚠️ Logout timed out, forcing redirect');
      }

      console.log('✅ Logout successful - redirecting to home');
      toast.success('Déconnexion réussie');
      
      // Clear any cached data and redirect immediately
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Use replace to avoid browser back button issues
      window.location.replace('/');
      
    } catch (error: any) {
      console.error('❌ Unexpected logout error:', error);
      
      // Even if there's an error, clear local data and redirect
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      toast.success('Déconnexion réussie');
      window.location.replace('/');
    }
  }, []);

  return {
    login,
    register,
    logout
  };
};
