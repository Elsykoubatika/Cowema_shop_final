
import AdvancedBehavioralTracker from './behavioralTracking';
import FacebookPixelService from './facebookPixel';

// Service de tracking comportemental amélioré avec Facebook Pixel
class EnhancedBehavioralTracker extends AdvancedBehavioralTracker {
  private facebookPixel: FacebookPixelService;

  constructor(facebookPixelId: string = '562190026611572') {
    super();
    this.facebookPixel = new FacebookPixelService(facebookPixelId);
    this.initializeFacebookIntegration();
  }

  private initializeFacebookIntegration(): void {
    // Écouter les événements de consentement
    window.addEventListener('tracking:consent:enabled', () => {
      this.facebookPixel.enableConsent();
    });

    window.addEventListener('tracking:consent:disabled', () => {
      this.facebookPixel.disableConsent();
    });

    // Écouter les événements de panier
    window.addEventListener('cart:add', (event: any) => {
      this.facebookPixel.trackAddToCart(event.detail);
    });

    window.addEventListener('cart:remove', (event: any) => {
      this.facebookPixel.trackCustomEvent('RemoveFromCart', {
        content_ids: [event.detail.productId],
        content_type: 'product'
      });
    });
  }

  // Override de la méthode logEvent pour synchroniser avec Facebook
  public logEvent(eventType: string, details: any = {}): void {
    // Appeler la méthode parent pour le tracking interne
    super.logEvent(eventType, details);

    // Synchroniser avec Facebook Pixel selon le type d'événement
    this.syncWithFacebookPixel(eventType, details);
  }

  private syncWithFacebookPixel(eventType: string, details: any): void {
    switch (eventType) {
      case 'page_view':
        // PageView est déjà tracké automatiquement par Facebook
        break;

      case 'cart_add':
        this.facebookPixel.trackAddToCart({
          id: details.productId,
          name: details.productName,
          price: details.price
        });
        break;

      case 'cart_remove':
        this.facebookPixel.trackCustomEvent('RemoveFromCart', {
          content_ids: [details.productId],
          content_type: 'product'
        });
        break;

      case 'checkout_start':
      case 'begin_checkout':
        this.facebookPixel.trackBeginCheckout({
          items: details.items,
          total: details.total
        });
        break;

      case 'purchase_complete':
      case 'purchase':
        this.facebookPixel.trackPurchase({
          items: details.items,
          total: details.total
        });
        break;

      case 'product_view':
        this.facebookPixel.trackViewContent({
          id: details.productId,
          name: details.productName,
          price: details.price
        });
        break;

      case 'search':
        this.facebookPixel.trackSearch(details.searchTerm);
        break;

      case 'prospect':
        this.facebookPixel.trackProspect({
          type: details.type,
          source: details.source,
          value: details.value
        });
        break;

      case 'high_engagement':
        this.facebookPixel.trackHighEngagement({
          type: details.type,
          timeSpent: details.timeSpent,
          scrollPercentage: details.scrollPercentage
        });
        break;

      case 'lead_form_engagement':
        this.facebookPixel.trackLeadFormEngagement({
          fieldType: details.fieldType,
          formName: details.formName,
          engagementLevel: details.engagementLevel
        });
        break;

      case 'influencer_signup':
        this.facebookPixel.trackInfluencerSignup({
          niche: details.niche,
          followerRange: details.followerRange,
          platforms: details.platforms
        });
        break;

      case 'influencer_sale':
        this.facebookPixel.trackInfluencerSale({
          influencerId: details.influencerId,
          commissionAmount: details.commissionAmount,
          orderValue: details.orderValue
        });
        break;

      case 'cta_click':
        this.facebookPixel.trackCTAClick({
          buttonText: details.buttonText,
          ctaType: details.ctaType
        });
        break;

      case 'scroll':
        // Tracker l'engagement de contenu pour les scrolls importants
        if (details.scrollPercentage >= 75) {
          this.facebookPixel.trackHighEngagement({
            type: 'scroll',
            scrollPercentage: details.scrollPercentage
          });
        }
        break;

      case 'form_focus':
        // Tracker l'engagement avec les formulaires
        if (details.field?.includes('email') || details.field?.includes('phone')) {
          this.facebookPixel.trackLeadFormEngagement({
            fieldType: details.field,
            formName: details.formName || 'contact_form'
          });
        }
        break;

      case 'click':
        // Tracker les clics sur des éléments spécifiques
        if (details.classList?.includes('cta-button')) {
          this.facebookPixel.trackCTAClick({
            buttonText: details.innerText,
            ctaType: 'button'
          });
        }
        break;

      default:
        // Pour tous les autres événements, les tracker comme événements personnalisés
        if (eventType !== 'element_view_time' && eventType !== 'form_blur') {
          this.facebookPixel.trackCustomEvent(`Custom_${eventType}`, details);
        }
        break;
    }
  }

  // Méthodes publiques pour un contrôle manuel des événements Facebook
  public trackFacebookEvent(eventName: string, parameters?: any): void {
    this.facebookPixel.trackEvent(eventName, parameters);
  }

  public trackFacebookCustomEvent(eventName: string, parameters?: any): void {
    this.facebookPixel.trackCustomEvent(eventName, parameters);
  }

  // Méthodes spécifiques pour les événements e-commerce
  public trackAddToCart(productData: any): void {
    this.logEvent('cart_add', productData);
  }

  public trackPurchase(orderData: any): void {
    this.logEvent('purchase', orderData);
  }

  public trackBeginCheckout(checkoutData: any): void {
    this.logEvent('begin_checkout', checkoutData);
  }

  public trackViewContent(productData: any): void {
    this.logEvent('product_view', productData);
  }

  public trackSearch(searchTerm: string): void {
    this.logEvent('search', { searchTerm });
  }

  public trackProspect(prospectData: any): void {
    this.logEvent('prospect', prospectData);
  }

  public trackInfluencerEvents(eventType: string, data: any): void {
    this.logEvent(`influencer_${eventType}`, data);
  }

  // Getter pour accéder au service Facebook Pixel si nécessaire
  public get pixelService(): FacebookPixelService {
    return this.facebookPixel;
  }
}

export default EnhancedBehavioralTracker;
