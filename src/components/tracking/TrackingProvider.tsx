
import React, { createContext, useContext, useEffect } from 'react';
import { useBehavioralTracking } from '@/hooks/useBehavioralTracking';
import ConsentBanner from './ConsentBanner';
import { useLocation } from 'react-router-dom';

interface TrackingContextType {
  isTrackingEnabled: boolean;
  hasConsent: boolean;
  trackEvent: (eventType: string, details?: any) => void;
  trackPageView: (page: string) => void;
  trackCartAction: (action: 'add' | 'remove', productData: any) => void;
  trackFacebookEvent: (eventName: string, parameters?: any) => void;
  trackFacebookCustomEvent: (eventName: string, parameters?: any) => void;
  trackAddToCart: (productData: any) => void;
  trackPurchase: (orderData: any) => void;
  trackBeginCheckout: (checkoutData: any) => void;
  trackViewContent: (productData: any) => void;
  trackSearch: (searchTerm: string) => void;
  trackProspect: (prospectData: any) => void;
  trackInfluencerEvents: (eventType: string, data: any) => void;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within TrackingProvider');
  }
  return context;
};

interface TrackingProviderProps {
  children: React.ReactNode;
  facebookPixelId?: string;
}

const TrackingProvider: React.FC<TrackingProviderProps> = ({ 
  children, 
  facebookPixelId = '562190026611572' 
}) => {
  const location = useLocation();
  const {
    isTrackingEnabled,
    hasConsent,
    enableTracking,
    disableTracking,
    trackEvent,
    trackPageView,
    trackCartAction,
    trackFacebookEvent,
    trackFacebookCustomEvent,
    tracker
  } = useBehavioralTracking({ facebookPixelId });

  // Tracker les changements de page
  useEffect(() => {
    if (isTrackingEnabled) {
      trackPageView(location.pathname);
    }
  }, [location.pathname, isTrackingEnabled, trackPageView]);

  // Méthodes spécifiques pour les événements e-commerce
  const trackAddToCart = (productData: any) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackAddToCart(productData);
    }
  };

  const trackPurchase = (orderData: any) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackPurchase(orderData);
    }
  };

  const trackBeginCheckout = (checkoutData: any) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackBeginCheckout(checkoutData);
    }
  };

  const trackViewContent = (productData: any) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackViewContent(productData);
    }
  };

  const trackSearch = (searchTerm: string) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackSearch(searchTerm);
    }
  };

  const trackProspect = (prospectData: any) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackProspect(prospectData);
    }
  };

  const trackInfluencerEvents = (eventType: string, data: any) => {
    if (tracker && isTrackingEnabled) {
      tracker.trackInfluencerEvents(eventType, data);
    }
  };

  const value: TrackingContextType = {
    isTrackingEnabled,
    hasConsent,
    trackEvent,
    trackPageView,
    trackCartAction,
    trackFacebookEvent,
    trackFacebookCustomEvent,
    trackAddToCart,
    trackPurchase,
    trackBeginCheckout,
    trackViewContent,
    trackSearch,
    trackProspect,
    trackInfluencerEvents
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
      <ConsentBanner 
        onAccept={enableTracking}
        onDecline={disableTracking}
      />
    </TrackingContext.Provider>
  );
};

export default TrackingProvider;
