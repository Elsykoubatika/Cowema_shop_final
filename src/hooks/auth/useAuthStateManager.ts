
import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from './types';
import { useProfileManager } from './useProfileManager';

export const useAuthStateManager = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    session: null,
    error: null
  });

  const { fetchProfile } = useProfileManager();
  const [initializationTimeout, setInitializationTimeout] = useState(false);

  const createMissingProfile = useCallback(async (userId: string, email: string, userMetadata: any) => {
    console.log('🔧 Creating missing profile for user:', userId);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          nom: userMetadata?.nom || userMetadata?.first_name || email.split('@')[0],
          first_name: userMetadata?.first_name,
          last_name: userMetadata?.last_name,
          phone: userMetadata?.phone,
          role: userMetadata?.role || 'user',
          gender: userMetadata?.gender === 'female' ? 'female' : 'male',
          city: userMetadata?.city,
          loyalty_points: 0
        });

      if (error) {
        console.error('❌ Error creating profile:', error);
        throw error;
      }

      console.log('✅ Profile created successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to create missing profile:', error);
      return false;
    }
  }, []);

  const updateAuthState = useCallback(async (session: Session | null) => {
    console.log('🔄 updateAuthState called with session:', !!session);
    
    if (!session) {
      console.log('❌ No session - setting unauthenticated state');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        error: null
      });
      return;
    }

    try {
      console.log('✅ Session found - fetching profile for user:', session.user.id);
      
      // Timeout pour éviter les appels qui traînent
      const profilePromise = fetchProfile(session.user.id, session.user.email || '');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
      );
      
      let profile;
      try {
        profile = await Promise.race([profilePromise, timeoutPromise]);
      } catch (timeoutError) {
        console.warn('⚠️ Profile fetch timed out, using session data');
        profile = null;
      }
      
      // Si le profil n'existe pas, essayer de le créer (mais avec timeout)
      if (!profile) {
        console.log('⚠️ Profile not found, attempting to create it...');
        try {
          const createPromise = createMissingProfile(
            session.user.id, 
            session.user.email || '', 
            session.user.user_metadata
          );
          const createTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile creation timeout')), 5000)
          );
          
          const profileCreated = await Promise.race([createPromise, createTimeoutPromise]);
          
          if (profileCreated) {
            profile = await fetchProfile(session.user.id, session.user.email || '');
          }
        } catch (createError) {
          console.warn('⚠️ Profile creation timed out or failed');
        }
      }
      
      if (profile) {
        console.log('✅ Profile loaded successfully:', profile.nom, 'Role:', profile.role);
        setAuthState({
          user: profile,
          isAuthenticated: true,
          isLoading: false,
          session,
          error: null
        });
      } else {
        // Fallback: créer un profil minimal basé sur la session
        console.log('⚠️ Using fallback profile from session data');
        const fallbackProfile = {
          id: session.user.id,
          email: session.user.email || '',
          nom: session.user.user_metadata?.nom || session.user.email?.split('@')[0] || 'Utilisateur',
          firstName: session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.last_name,
          phone: session.user.user_metadata?.phone,
          gender: 'male' as const,
          role: session.user.user_metadata?.role || 'user' as const,
          city: session.user.user_metadata?.city,
          loyaltyPoints: 0,
          createdAt: new Date().toISOString()
        };
        
        setAuthState({
          user: fallbackProfile,
          isAuthenticated: true,
          isLoading: false,
          session,
          error: null
        });
      }
    } catch (error) {
      console.error('❌ Error in updateAuthState:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        error: 'Erreur lors du chargement du profil'
      });
    }
  }, [fetchProfile, createMissingProfile]);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;
    
    console.log('🚀 Setting up auth state manager...');

    // Timeout de sécurité pour l'initialisation
    const initTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Initialization timeout reached');
        setInitializationTimeout(true);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }, 15000); // 15 secondes max pour l'initialisation

    const initializeAuth = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              session: null,
              error: 'Erreur d\'initialisation'
            });
          }
          return;
        }

        console.log('📋 Initial session check:', !!session);
        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('❌ Error in initializeAuth:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            session: null,
            error: 'Erreur d\'initialisation'
          });
        }
      } finally {
        clearTimeout(initTimeout);
      }
    };

    // Fonction pour gérer les changements d'état d'authentification
    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('🔄 Auth state change event:', event, 'session:', !!session);
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, ignoring auth state change');
        return;
      }

      // Éviter les appels multiples pendant l'initialisation
      if (event === 'INITIAL_SESSION') {
        return; // Géré par initializeAuth
      }

      await updateAuthState(session);
    };

    // Configurer l'écoute des changements d'état
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    subscription = authSubscription;
    
    // Initialiser l'authentification
    initializeAuth();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth state manager');
      mounted = false;
      clearTimeout(initTimeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Pas de dépendances pour éviter les boucles

  console.log('📊 Current auth state:', {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    hasUser: !!authState.user,
    userName: authState.user?.nom,
    userRole: authState.user?.role,
    hasTimedOut: initializationTimeout
  });

  return authState;
};
