
import { useEffect, useRef, useState } from 'react';
import EnhancedBehavioralTracker from '@/services/enhancedBehavioralTracking';
import { useAuthStore } from '@/hooks/useAuthStore';

interface TrackingHookOptions {
  enableAutoTracking?: boolean;
  batchSize?: number;
  batchInterval?: number;
  facebookPixelId?: string;
}

export const useBehavioralTracking = (options: TrackingHookOptions = {}) => {
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const trackerRef = useRef<EnhancedBehavioralTracker | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    // Vérifier le consentement
    const consent = localStorage.getItem('cowema_tracking_consent');
    const cookieConsent = document.cookie.includes('cowema_tracking=allowed');
    
    if (consent === 'accepted' || cookieConsent) {
      setHasConsent(true);
      initializeTracking();
    }
  }, []);

  useEffect(() => {
    // Mettre à jour les informations utilisateur si disponible
    if (trackerRef.current && user) {
      trackerRef.current.setUser({
        id: user.id,
        email: user.email,
        type: user.role || 'customer',
        city: user.city
      });
    }
  }, [user]);

  const initializeTracking = () => {
    if (!trackerRef.current) {
      try {
        // Utiliser le tracker amélioré avec Facebook Pixel
        trackerRef.current = new EnhancedBehavioralTracker(
          options.facebookPixelId || '562190026611572'
        );
        setIsTrackingEnabled(true);
        
        // Envoyer les données avant la fermeture de la page
        const handleBeforeUnload = () => {
          if (trackerRef.current) {
            trackerRef.current.sendData();
          }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Cleanup
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          if (trackerRef.current) {
            trackerRef.current.destroy();
          }
        };
      } catch (error) {
        console.error('Failed to initialize enhanced tracking:', error);
      }
    }
  };

  const enableTracking = () => {
    setHasConsent(true);
    initializeTracking();
    
    // Émettre l'événement pour Facebook Pixel
    window.dispatchEvent(new CustomEvent('tracking:consent:enabled'));
  };

  const disableTracking = () => {
    setHasConsent(false);
    setIsTrackingEnabled(false);
    
    // Émettre l'événement pour Facebook Pixel
    window.dispatchEvent(new CustomEvent('tracking:consent:disabled'));
    
    if (trackerRef.current) {
      trackerRef.current.destroy();
      trackerRef.current = null;
    }
  };

  const trackEvent = (eventType: string, details: any = {}) => {
    if (trackerRef.current && isTrackingEnabled) {
      trackerRef.current.logEvent(eventType, details);
    }
  };

  const trackPageView = (page: string) => {
    if (trackerRef.current && isTrackingEnabled) {
      trackerRef.current.trackPageView(page);
    }
  };

  const trackCartAction = (action: 'add' | 'remove', productData: any) => {
    if (isTrackingEnabled) {
      // Émettre un événement personnalisé pour le tracker
      const event = new CustomEvent(`cart:${action}`, {
        detail: productData
      });
      window.dispatchEvent(event);
    }
  };

  // Nouvelles méthodes pour Facebook Pixel
  const trackFacebookEvent = (eventName: string, parameters?: any) => {
    if (trackerRef.current && isTrackingEnabled) {
      trackerRef.current.trackFacebookEvent(eventName, parameters);
    }
  };

  const trackFacebookCustomEvent = (eventName: string, parameters?: any) => {
    if (trackerRef.current && isTrackingEnabled) {
      trackerRef.current.trackFacebookCustomEvent(eventName, parameters);
    }
  };

  return {
    isTrackingEnabled,
    hasConsent,
    enableTracking,
    disableTracking,
    trackEvent,
    trackPageView,
    trackCartAction,
    trackFacebookEvent,
    trackFacebookCustomEvent,
    tracker: trackerRef.current
  };
};
