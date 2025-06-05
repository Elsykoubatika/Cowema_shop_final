
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfluencerAuth from '../components/influencer/InfluencerAuth';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InfluencerLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useUnifiedAuth();
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Timeout pour éviter le chargement infini
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !isAuthenticated) {
        console.log('⏰ Loading timeout reached on influencer login');
        setLoadingTimeout(true);
      }
    }, 12000); // 12 secondes

    return () => clearTimeout(timeout);
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    console.log('🎯 InfluencerLogin useEffect:', {
      isAuthenticated,
      userRole: user?.role,
      isLoading,
      redirecting,
      loadingTimeout
    });

    // Si timeout atteint ou si on n'est plus en chargement
    if (loadingTimeout || !isLoading) {
      // Si l'utilisateur est authentifié et qu'on n'est pas déjà en cours de redirection
      if (isAuthenticated && user && !redirecting) {
        console.log('✅ User authenticated, checking role for redirect...');
        
        if (user.role === 'influencer') {
          console.log('🚀 Redirecting influencer to dashboard...');
          setRedirecting(true);
          
          toast({
            title: "Connexion réussie",
            description: `Bienvenue ${user.nom}, redirection vers votre espace influenceur...`,
          });
          
          // Redirection après un court délai pour permettre au toast de s'afficher
          setTimeout(() => {
            navigate('/influencer/dashboard', { replace: true });
          }, 1000);
        } else {
          console.log('⚠️ User is not an influencer, redirecting to program page...');
          toast({
            title: "Accès refusé",
            description: "Vous n'êtes pas encore approuvé comme influenceur.",
            variant: "destructive"
          });
          
          setTimeout(() => {
            navigate('/influencer', { replace: true });
          }, 2000);
        }
      }
    }
  }, [isAuthenticated, user, isLoading, redirecting, navigate, toast, loadingTimeout]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setLoadingTimeout(false);
    window.location.reload();
  };

  // Affichage pendant le chargement initial avec timeout
  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Vérification de l'accès...</h2>
              <p className="text-gray-600">Chargement de votre profil influenceur</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage en cas de timeout
  if (loadingTimeout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-orange-600">Délai de connexion dépassé</h2>
              <p className="text-gray-600">
                Le chargement prend plus de temps que prévu. Cela peut être dû à une connexion lente.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/influencer')}
                className="w-full"
              >
                Retour au programme influenceur
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage de redirection
  if (redirecting) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-pulse h-12 w-12 bg-primary rounded-full mx-auto"></div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-600">Connexion réussie!</h2>
              <p className="text-gray-600">Redirection vers votre espace...</p>
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
      
      <main className="flex-grow py-12">
        <div className="container-cowema">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Accéder à votre espace influenceur</h1>
            <p className="text-gray-600 mb-8 text-center">
              Connectez-vous avec les identifiants qui vous ont été fournis pour accéder à votre espace influenceur et suivre vos performances.
            </p>
            
            <InfluencerAuth />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InfluencerLogin;
