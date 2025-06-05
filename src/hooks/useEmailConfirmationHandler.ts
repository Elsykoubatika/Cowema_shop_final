
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEmailConfirmationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on email confirmation page or if we have auth tokens in URL
    if (location.pathname === '/email-confirmation' || location.hash.includes('access_token')) {
      const handleEmailConfirmation = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            toast.error('Erreur de confirmation email');
            return;
          }

          if (data.session) {
            toast.success('Email confirmé avec succès!');
            navigate('/');
          }
        } catch (error) {
          console.error('Email confirmation error:', error);
          toast.error('Erreur de confirmation email');
        }
      };

      handleEmailConfirmation();
    }
  }, [location, navigate]);
};
