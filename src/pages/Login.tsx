
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LogIn, AlertCircle } from 'lucide-react';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';
import LoginForm from '../components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user, error, getDashboardRoute } = useUnifiedAuth();
  const [hasRedirected, setHasRedirected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading && !hasRedirected) {
      console.log('🔄 Login page: User authenticated, determining redirect...', user.role);
      setHasRedirected(true);
      
      let dashboardPath = getDashboardRoute(user.role);
      
      // Si l'utilisateur vient de la page influenceur et qu'il est influenceur
      if (location.state?.from?.startsWith('/influencer') && user.role === 'influencer') {
        dashboardPath = '/influencer/dashboard';
      }
      
      console.log('➡️ Redirecting to:', dashboardPath);
      
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, user, hasRedirected, navigate, getDashboardRoute, location.state]);

  const handleLoginSuccess = () => {
    console.log('📝 Login success callback triggered');
    // La redirection sera gérée par useEffect
  };

  const handleRetryAuth = () => {
    window.location.reload();
  };

  const handleContactSupport = () => {
    toast({
      title: "Contacter le support",
      description: "Envoyez un email à support@cowema.org pour obtenir de l'aide.",
    });
  };

  // Affichage pendant le chargement initial
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Chargement...</p>
              <p className="text-sm text-gray-500">Initialisation de la session</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage de redirection pour les utilisateurs authentifiés
  if (isAuthenticated && user && !hasRedirected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <div className="animate-pulse h-12 w-12 bg-primary rounded-full mx-auto"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Connexion réussie!</p>
              <p className="text-sm text-gray-500">Redirection vers votre espace...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage d'erreur amélioré
  if (error && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container-cowema">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-600 mb-2">Problème de connexion</h1>
                <p className="text-gray-600 mb-4">{error}</p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetryAuth} 
                    className="w-full bg-primary hover:bg-primary-hover text-white"
                  >
                    Réessayer
                  </Button>
                  
                  <Button 
                    onClick={handleContactSupport} 
                    variant="outline" 
                    className="w-full"
                  >
                    Contacter le support
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Si le problème persiste, votre profil pourrait nécessiter une restauration.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Formulaire de connexion pour les utilisateurs non authentifiés
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container-cowema">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <LogIn size={24} />
              Connexion à votre compte
            </h1>
            
            {location.state?.from && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Information:</span> Vous devez vous connecter pour accéder à cette page.
                </p>
              </div>
            )}
            
            <LoginForm onSuccess={handleLoginSuccess} expectedRoleType="client" />
            
            <div className="mt-6 text-center">
              <p>
                Vous n'avez pas de compte?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
