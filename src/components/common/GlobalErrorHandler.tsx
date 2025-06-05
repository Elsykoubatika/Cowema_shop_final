
import React, { useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const GlobalErrorHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { handleError } = useErrorHandler();

  useEffect(() => {
    // Gestionnaire global pour les erreurs JavaScript non gérées
    const handleUnhandledError = (event: ErrorEvent) => {
      handleError({
        name: 'UnhandledError',
        message: event.message,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      }, 'Erreur JavaScript non gérée');
    };

    // Gestionnaire pour les promesses rejetées non gérées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError({
        name: 'UnhandledPromiseRejection',
        message: event.reason?.message || 'Promise rejection non gérée',
        details: event.reason
      }, 'Promise rejetée non gérée');
      
      // Empêcher l'affichage de l'erreur dans la console
      event.preventDefault();
    };

    // Gestionnaire pour les erreurs de ressources (images, scripts, etc.)
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      handleError({
        name: 'ResourceError',
        message: `Erreur de chargement de ressource: ${target.tagName}`,
        details: {
          src: (target as any).src || (target as any).href,
          tagName: target.tagName
        }
      }, 'Erreur de chargement de ressource');
    };

    // Ajouter les gestionnaires d'événements
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    // Gestionnaire pour les erreurs de fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Vérifier si la réponse indique une erreur
        if (!response.ok) {
          const errorData = {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          };
          
          // Ne pas traiter comme erreur critique si c'est une 404 sur une ressource optionnelle
          if (response.status === 404) {
            console.warn('Ressource non trouvée:', errorData);
          } else {
            handleError({
              name: 'FetchError',
              message: `Erreur HTTP ${response.status}: ${response.statusText}`,
              details: errorData
            }, 'Erreur de requête réseau');
          }
        }
        
        return response;
      } catch (error) {
        handleError(error, 'Erreur de requête fetch');
        throw error;
      }
    };

    // Nettoyage
    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResourceError, true);
      window.fetch = originalFetch;
    };
  }, [handleError]);

  return <>{children}</>;
};
