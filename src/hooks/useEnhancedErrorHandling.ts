
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AuthError {
  code: string;
  message: string;
  context?: string;
  timestamp: number;
}

export const useEnhancedErrorHandling = () => {
  const [lastError, setLastError] = useState<AuthError | null>(null);
  const [errorHistory, setErrorHistory] = useState<AuthError[]>([]);

  const logError = useCallback((error: any, context?: string) => {
    const authError: AuthError = {
      code: error?.code || 'UNKNOWN_ERROR',
      message: error?.message || 'Une erreur inattendue s\'est produite',
      context,
      timestamp: Date.now()
    };

    console.error(`[AUTH ERROR] ${context || 'Unknown context'}:`, {
      code: authError.code,
      message: authError.message,
      originalError: error,
      timestamp: new Date(authError.timestamp).toISOString()
    });

    setLastError(authError);
    setErrorHistory(prev => [authError, ...prev.slice(0, 9)]);

    return authError;
  }, []);

  const handleAuthError = useCallback((error: any, context?: string) => {
    const authError = logError(error, context);
    
    // Messages d'erreur spécifiques et plus clairs
    let userMessage = authError.message;
    
    switch (authError.code) {
      case 'invalid_credentials':
      case 'PGRST301':
        userMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos informations.';
        break;
      case 'email_not_confirmed':
        userMessage = 'Votre compte n\'est pas encore confirmé. Vérifiez votre email.';
        break;
      case 'too_many_requests':
        userMessage = 'Trop de tentatives de connexion. Veuillez patienter quelques minutes.';
        break;
      case 'PGRST116':
        userMessage = 'Profil utilisateur introuvable. Contactez l\'assistance.';
        break;
      case 'network_error':
        userMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
        break;
      case 'signup_disabled':
        userMessage = 'Les inscriptions sont temporairement désactivées.';
        break;
      case 'weak_password':
        userMessage = 'Le mot de passe est trop faible. Utilisez au moins 6 caractères.';
        break;
      case 'email_address_invalid':
        userMessage = 'L\'adresse email n\'est pas valide.';
        break;
      case 'user_already_exists':
        userMessage = 'Un compte avec cette adresse email existe déjà.';
        break;
      default:
        // Handle database errors more specifically
        if (authError.message.includes('Database error saving new user')) {
          userMessage = 'Erreur lors de l\'enregistrement. Veuillez réessayer ou contacter le support.';
        } else if (authError.message.includes('gender_type')) {
          userMessage = 'Erreur de configuration. Veuillez contacter l\'administrateur.';
        } else if (context) {
          userMessage = `Erreur lors de ${context.toLowerCase()}: ${userMessage}`;
        }
    }

    toast.error(userMessage, {
      duration: authError.code === 'too_many_requests' ? 8000 : 5000,
      action: authError.code === 'PGRST116' ? {
        label: 'Contacter le support',
        onClick: () => window.open('mailto:support@cowema.org', '_blank')
      } : undefined
    });

    return authError;
  }, [logError]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    lastError,
    errorHistory,
    handleAuthError,
    logError,
    clearError
  };
};
