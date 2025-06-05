
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, isLoading } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AdminLogin - Auth state:', { isAuthenticated, userRole: user?.role, isLoading });
    
    // Only redirect if we're not loading and user is authenticated
    if (!isLoading && isAuthenticated && user) {
      console.log('User authenticated with role:', user.role);
      
      // Vérifier si l'utilisateur a un rôle admin
      if (['admin', 'sales_manager', 'team_lead', 'seller'].includes(user.role || '')) {
        console.log('User has admin privileges, redirecting to /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('User does not have admin privileges, role:', user.role);
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès à l'interface d'administration.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, isLoading, toast]);

  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Attempting admin login with:', email);
      
      const success = await login(email, password);
      
      console.log('Admin login result:', success);
      
      if (!success) {
        toast({
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      }
      // Si la connexion réussit, le useEffect gérera la redirection
    } catch (error) {
      console.error("Erreur de connexion admin:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    handleLogin
  };
};
