
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorDetails {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useErrorNotification = () => {
  const showError = useCallback((error: unknown, context?: string, details?: ErrorDetails) => {
    let title = details?.title || 'Erreur';
    let description = details?.description;

    // Parse different error types
    if (error instanceof Error) {
      if (!description) {
        description = error.message;
      }
      if (context) {
        title = `Erreur - ${context}`;
      }
    } else if (typeof error === 'string') {
      description = error;
    } else {
      description = 'Une erreur inattendue s\'est produite';
    }

    toast.error(title, {
      description,
      duration: 5000,
      action: details?.action ? {
        label: details.action.label,
        onClick: details.action.onClick,
      } : undefined,
    });
  }, []);

  const showSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }, []);

  const showWarning = useCallback((message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  }, []);

  const showInfo = useCallback((message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  }, []);

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo
  };
};
