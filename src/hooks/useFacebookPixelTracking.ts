
import { useTracking } from '@/components/tracking/TrackingProvider';

interface ProductData {
  id: string;
  name: string;
  price: number;
  category?: string;
}

interface OrderData {
  items: ProductData[];
  total: number;
  orderId?: string;
}

interface ProspectData {
  type: 'email_signup' | 'phone_signup' | 'newsletter' | 'form_submission';
  source: string;
  value?: number;
}

export const useFacebookPixelTracking = () => {
  const { trackFacebookEvent, trackFacebookCustomEvent, isTrackingEnabled } = useTracking();

  const trackAddToCart = (product: ProductData) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookEvent('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'XAF'
    });
  };

  const trackPurchase = (order: OrderData) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookEvent('Purchase', {
      content_ids: order.items.map(item => item.id),
      content_type: 'product',
      value: order.total,
      currency: 'XAF',
      num_items: order.items.length
    });
  };

  const trackViewContent = (product: ProductData) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookEvent('ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'XAF'
    });
  };

  const trackBeginCheckout = (order: OrderData) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookEvent('InitiateCheckout', {
      content_ids: order.items.map(item => item.id),
      content_type: 'product',
      value: order.total,
      currency: 'XAF',
      num_items: order.items.length
    });
  };

  const trackSearch = (searchTerm: string) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookEvent('Search', {
      search_string: searchTerm
    });
  };

  const trackProspect = (prospect: ProspectData) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookCustomEvent('Prospect', {
      lead_type: prospect.type,
      source: prospect.source,
      value: prospect.value || 0,
      currency: 'XAF'
    });
  };

  const trackHighEngagement = (data: { type: string; timeSpent?: number; scrollPercentage?: number }) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookCustomEvent('HighEngagement', {
      engagement_type: data.type,
      page_url: window.location.pathname,
      time_spent: data.timeSpent || 0,
      scroll_percentage: data.scrollPercentage || 0
    });
  };

  const trackInfluencerSignup = (data: { niche: string[]; followerRange: string; platforms: string[] }) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookCustomEvent('InfluencerSignup', {
      niche: data.niche,
      follower_range: data.followerRange,
      platform: data.platforms
    });
  };

  const trackInfluencerSale = (data: { influencerId: string; commissionAmount: number; orderValue: number }) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookCustomEvent('InfluencerSale', {
      influencer_id: data.influencerId,
      commission_amount: data.commissionAmount,
      order_value: data.orderValue,
      currency: 'XAF'
    });
  };

  const trackCTAClick = (data: { buttonText: string; ctaType?: string }) => {
    if (!isTrackingEnabled) return;
    
    trackFacebookCustomEvent('CTAClick', {
      button_text: data.buttonText,
      page_url: window.location.pathname,
      cta_type: data.ctaType || 'button'
    });
  };

  return {
    trackAddToCart,
    trackPurchase,
    trackViewContent,
    trackBeginCheckout,
    trackSearch,
    trackProspect,
    trackHighEngagement,
    trackInfluencerSignup,
    trackInfluencerSale,
    trackCTAClick,
    isTrackingEnabled
  };
};
