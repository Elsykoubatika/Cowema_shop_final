
// Service Facebook Pixel intégré au système de tracking comportemental
class FacebookPixelService {
  private pixelId: string;
  private isInitialized: boolean = false;
  private isConsentGiven: boolean = false;

  constructor(pixelId: string) {
    this.pixelId = pixelId;
    this.checkConsent();
  }

  private checkConsent(): void {
    const consent = localStorage.getItem('cowema_tracking_consent');
    const cookieConsent = document.cookie.includes('cowema_tracking=allowed');
    
    if (consent === 'accepted' || cookieConsent) {
      this.isConsentGiven = true;
      this.initializePixel();
    }
  }

  public initializePixel(): void {
    if (this.isInitialized || !this.isConsentGiven) return;

    // Chargement du script Facebook Pixel avec la signature correcte
    (function(f: any, b: Document, e: string, v: string, n: any, t: HTMLScriptElement, s: HTMLScriptElement) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0] as HTMLScriptElement;
      s.parentNode?.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
      undefined,
      undefined,
      undefined
    );

    // Initialisation du pixel
    (window as any).fbq('init', this.pixelId);
    (window as any).fbq('track', 'PageView');

    // Ajout du noscript fallback
    this.addNoScriptFallback();
    
    this.isInitialized = true;
    console.log('Facebook Pixel initialized:', this.pixelId);
  }

  private addNoScriptFallback(): void {
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${this.pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  }

  public trackEvent(eventName: string, parameters?: any): void {
    if (!this.isInitialized || !this.isConsentGiven) return;

    try {
      if ((window as any).fbq) {
        (window as any).fbq('track', eventName, parameters);
        console.log('Facebook Pixel event tracked:', eventName, parameters);
      }
    } catch (error) {
      console.warn('Facebook Pixel tracking error:', error);
    }
  }

  public trackCustomEvent(eventName: string, parameters?: any): void {
    if (!this.isInitialized || !this.isConsentGiven) return;

    try {
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', eventName, parameters);
        console.log('Facebook Pixel custom event tracked:', eventName, parameters);
      }
    } catch (error) {
      console.warn('Facebook Pixel custom tracking error:', error);
    }
  }

  public enableConsent(): void {
    this.isConsentGiven = true;
    this.initializePixel();
  }

  public disableConsent(): void {
    this.isConsentGiven = false;
    console.log('Facebook Pixel consent disabled');
  }

  // Méthodes spécifiques pour les événements e-commerce
  public trackAddToCart(productData: any): void {
    this.trackEvent('AddToCart', {
      content_ids: [productData.id],
      content_name: productData.name,
      content_type: 'product',
      value: productData.price,
      currency: 'XAF'
    });
  }

  public trackPurchase(orderData: any): void {
    this.trackEvent('Purchase', {
      content_ids: orderData.items?.map((item: any) => item.id) || [],
      content_type: 'product',
      value: orderData.total,
      currency: 'XAF',
      num_items: orderData.items?.length || 1
    });
  }

  public trackViewContent(productData: any): void {
    this.trackEvent('ViewContent', {
      content_ids: [productData.id],
      content_name: productData.name,
      content_type: 'product',
      value: productData.price,
      currency: 'XAF'
    });
  }

  public trackInitiateCheckout(cartData: any): void {
    this.trackEvent('InitiateCheckout', {
      content_ids: cartData.items?.map((item: any) => item.id) || [],
      content_type: 'product',
      value: cartData.total,
      currency: 'XAF',
      num_items: cartData.items?.length || 1
    });
  }

  public trackSearch(searchTerm: string): void {
    this.trackEvent('Search', {
      search_string: searchTerm
    });
  }

  // Nouveaux événements personnalisés
  public trackProspect(prospectData: any): void {
    this.trackCustomEvent('Prospect', {
      lead_type: prospectData.type || 'general',
      source: prospectData.source || 'website',
      value: prospectData.value || 0,
      currency: 'XAF'
    });
  }

  public trackHighEngagement(engagementData: any): void {
    this.trackCustomEvent('HighEngagement', {
      engagement_type: engagementData.type || 'scroll',
      page_url: window.location.pathname,
      time_spent: engagementData.timeSpent || 0,
      scroll_percentage: engagementData.scrollPercentage || 0
    });
  }

  public trackLeadFormEngagement(formData: any): void {
    this.trackCustomEvent('LeadFormEngagement', {
      field_type: formData.fieldType,
      form_name: formData.formName || 'unknown',
      engagement_level: formData.engagementLevel || 'basic'
    });
  }

  public trackInfluencerSignup(influencerData: any): void {
    this.trackCustomEvent('InfluencerSignup', {
      niche: influencerData.niche || [],
      follower_range: influencerData.followerRange || 'unknown',
      platform: influencerData.platforms || []
    });
  }

  public trackInfluencerSale(saleData: any): void {
    this.trackCustomEvent('InfluencerSale', {
      influencer_id: saleData.influencerId,
      commission_amount: saleData.commissionAmount,
      order_value: saleData.orderValue,
      currency: 'XAF'
    });
  }

  public trackBeginCheckout(checkoutData: any): void {
    this.trackEvent('InitiateCheckout', {
      content_ids: checkoutData.items?.map((item: any) => item.id) || [],
      content_type: 'product',
      value: checkoutData.total,
      currency: 'XAF',
      num_items: checkoutData.items?.length || 1
    });
  }

  public trackCTAClick(ctaData: any): void {
    this.trackCustomEvent('CTAClick', {
      button_text: ctaData.buttonText,
      page_url: window.location.pathname,
      cta_type: ctaData.ctaType || 'button'
    });
  }
}

export default FacebookPixelService;
