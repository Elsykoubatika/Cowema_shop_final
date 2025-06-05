
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';
import EnhancedInfluencerDashboardContent from '../components/influencer/dashboard/EnhancedInfluencerDashboardContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InfluencerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useUnifiedAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  console.log('🎯 InfluencerDashboardPage render:', {
    isLoading,
    isAuthenticated,
    userRole: user?.role,
    userName: user?.nom
  });

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    console.log('🚪 InfluencerDashboard: Starting logout process');
    setIsLoggingOut(true);
    
    try {
      await logout();
      // The logout function now handles navigation internally
    } catch (error) {
      console.error('❌ InfluencerDashboard: Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Affichage du chargement avec design amélioré
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Header />
        <main className="flex-grow flex items-center justify-center relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-2000"></div>
            <Sparkles className="absolute top-1/4 right-1/3 h-8 w-8 text-purple-300 opacity-40 animate-pulse" />
            <Sparkles className="absolute bottom-1/3 left-1/4 h-6 w-6 text-pink-300 opacity-35 animate-pulse delay-1500" />
          </div>
          
          <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center animate-spin">
                <Loader2 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto opacity-20 animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✨ Préparation de votre espace ✨
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous configurons votre tableau de bord personnalisé...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-500">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Magie en cours</span>
                <Sparkles className="h-4 w-4 animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Vérification de l'authentification avec design amélioré
  if (!isAuthenticated || !user) {
    console.log('❌ User not authenticated, showing login options');
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
        <Header />
        <main className="flex-grow flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
          </div>
          
          <div className="max-w-md mx-auto text-center space-y-6 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mx-auto flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                🔐 Vous devez être connecté en tant qu'influenceur pour accéder à cette page.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/influencer/login')} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                ✨ Connexion Influenceur
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/influencer')} 
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                📋 Programme Influenceur
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="w-full text-gray-600 hover:text-gray-800"
              >
                🏠 Retour à l'accueil
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Vérification du rôle influenceur avec design amélioré
  if (user.role !== 'influencer') {
    console.log('⚠️ User role mismatch:', user.role, 'expected: influencer');
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <Header />
        <main className="flex-grow flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
          </div>
          
          <div className="max-w-md mx-auto text-center space-y-6 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                🚫 Cette page est réservée aux influenceurs approuvés. 
                <br />Votre rôle actuel : <strong>{user.role}</strong>
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/influencer')} 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                📝 Postuler au programme
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/account')} 
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                👤 Mon espace client
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="w-full text-gray-600 hover:text-gray-800"
              >
                🏠 Retour à l'accueil
              </Button>
              {/* Bouton de déconnexion pour les utilisateurs avec de mauvais rôles */}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Déconnexion...
                  </>
                ) : (
                  '🚪 Se déconnecter'
                )}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage du dashboard influenceur amélioré
  console.log('✅ Rendering enhanced influencer dashboard for:', user.nom);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <EnhancedInfluencerDashboardContent />
      </main>
      <Footer />
    </div>
  );
};

export default InfluencerDashboardPage;
