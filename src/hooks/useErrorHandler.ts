
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const handleError = useCallback((error: any, context?: string) => {
    console.error('Error occurred:', error, 'Context:', context);

    let appError: AppError;

    // Gestion des erreurs Supabase
    if (error?.code === 'PGRST301') {
      appError = {
        code: 'AUTH_REQUIRED',
        message: 'Vous devez être connecté pour effectuer cette action',
        severity: 'medium'
      };
    } else if (error?.code === 'PGRST116') {
      appError = {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée',
        severity: 'low'
      };
    } else if (error?.code === '23505') {
      appError = {
        code: 'DUPLICATE_ENTRY',
        message: 'Cette donnée existe déjà',
        severity: 'medium'
      };
    } else if (error?.message?.includes('permission denied')) {
      appError = {
        code: 'PERMISSION_DENIED',
        message: 'Vous n\'avez pas les droits pour effectuer cette action',
        severity: 'high'
      };
    } else if (error?.message?.includes('violates row-level security')) {
      appError = {
        code: 'RLS_VIOLATION',
        message: 'Accès non autorisé aux données',
        severity: 'high'
      };
    } else if (error?.name === 'ValidationError') {
      appError = {
        code: 'VALIDATION_ERROR',
        message: error.message || 'Données invalides',
        details: error.errors,
        severity: 'medium'
      };
    } else if (error?.name === 'NetworkError') {
      appError = {
        code: 'NETWORK_ERROR',
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        severity: 'medium'
      };
    } else {
      appError = {
        code: 'UNKNOWN_ERROR',
        message: error?.message || 'Une erreur inattendue s\'est produite',
        details: error,
        severity: 'medium'
      };
    }

    // Ajouter le contexte si fourni
    if (context) {
      appError.message = `${context}: ${appError.message}`;
    }

    // Stocker l'erreur
    setErrors(prev => [appError, ...prev.slice(0, 9)]); // Garder seulement les 10 dernières erreurs

    // Afficher l'erreur appropriée selon la sévérité
    switch (appError.severity) {
      case 'critical':
        toast.error(appError.message, {
          duration: 10000,
          action: {
            label: 'Contacter le support',
            onClick: () => window.open('mailto:support@cowema.org', '_blank')
          }
        });
        break;
      case 'high':
        toast.error(appError.message, { duration: 8000 });
        break;
      case 'medium':
        toast.error(appError.message, { duration: 5000 });
        break;
      case 'low':
        toast.warning(appError.message, { duration: 3000 });
        break;
    }

    return appError;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    errors,
    handleError,
    clearErrors,
    clearError
  };
};
