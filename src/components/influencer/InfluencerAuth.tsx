
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import LoginForm from '../auth/LoginForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

const InfluencerAuth: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Callback après succès de connexion
  const handleAuthSuccess = () => {
    if (isProcessing) return; // Éviter les appels multiples
    
    console.log('🎯 InfluencerAuth: Login success callback triggered');
    setIsProcessing(true);
    
    toast({
      title: "Connexion en cours...",
      description: "Vérification de vos droits d'accès...",
    });
    
    // Laisser InfluencerLogin gérer la redirection
    // Réinitialiser après un délai pour permettre une nouvelle tentative si nécessaire
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  // Fonction pour rediriger vers la page de candidature
  const handleApplyClick = () => {
    navigate('/influencer');
    // Attendre que la navigation soit terminée puis scroll vers la section apply
    setTimeout(() => {
      const element = document.getElementById('apply');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Espace influenceur
        </CardTitle>
        <CardDescription className="text-center">
          Connectez-vous pour accéder à votre espace influenceur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-50 text-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Les comptes influenceurs sont créés par les administrateurs après validation de votre candidature.
            Connectez-vous avec l'email et le mot de passe qui vous ont été fournis.
          </AlertDescription>
        </Alert>
        
        <LoginForm 
          onSuccess={handleAuthSuccess} 
          expectedRoleType="influencer" 
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Vous n'avez pas encore de compte influenceur?{" "}
            <Button 
              variant="link" 
              onClick={handleApplyClick} 
              className="p-0"
              disabled={isProcessing}
            >
              Postulez ici
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerAuth;
