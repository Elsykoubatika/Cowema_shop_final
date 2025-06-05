
// Service de tracking comportemental avancé
class AdvancedBehavioralTracker {
  private sessionId: string;
  private deviceId: string;
  private data: {
    sessionStart: string;
    events: any[];
    pageViews: any[];
    user: any;
    [key: string]: any;
  };
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateUUID();
    this.deviceId = this.getDeviceFingerprint();
    this.data = {
      sessionStart: new Date().toISOString(),
      events: [],
      pageViews: [],
      user: null
    };
    this.initEventListeners();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getDeviceFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('CowemaTracker', 2, 15);
      
      return canvas.toDataURL();
    } catch (error) {
      console.warn('Cannot generate device fingerprint:', error);
      return 'fallback-' + Date.now();
    }
  }

  private initEventListeners(): void {
    // Tracking des clics
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      this.logEvent('click', {
        target: target.tagName,
        classList: target.classList.toString(),
        innerText: target.innerText?.substring(0, 100),
        xPos: e.clientX,
        yPos: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        href: target.getAttribute('href'),
        dataTrack: target.getAttribute('data-track')
      });
    });

    // Tracking du scroll
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.logEvent('scroll', {
          scrollPercentage: Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          ),
          currentSection: this.getCurrentSection(),
          scrollTop: window.scrollY
        });
      }, 500);
    });

    // Tracking des formulaires
    this.trackFormInteractions();

    // Tracking du temps de visualisation
    this.trackElementViewTime();

    // Tracking des produits ajoutés au panier
    this.trackCartActions();
  }

  private trackFormInteractions(): void {
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, select, textarea')) {
        this.logEvent('form_focus', {
          field: target.getAttribute('name') || target.getAttribute('id') || 'unknown',
          type: target.getAttribute('type') || target.tagName.toLowerCase()
        });
      }
    });

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.matches('input, select, textarea')) {
        this.logEvent('form_blur', {
          field: target.getAttribute('name') || target.getAttribute('id') || 'unknown',
          hasValue: !!target.value,
          valueLength: target.value?.length || 0
        });
      }
    });
  }

  private trackElementViewTime(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
        const elementId = element.id || element.getAttribute('data-track') || 'unknown';
        
        if (entry.isIntersecting) {
          const timerKey = `view_${elementId}`;
          this.data[timerKey] = Date.now();
        } else if (this.data[`view_${elementId}`]) {
          this.logEvent('element_view_time', {
            element: elementId,
            duration: (Date.now() - this.data[`view_${elementId}`]) / 1000
          });
          delete this.data[`view_${elementId}`];
        }
      });
    }, { threshold: 0.5 });

    // Observer les éléments avec data-track
    document.querySelectorAll('[data-track]').forEach(el => observer.observe(el));
    
    // Observer les sections importantes
    document.querySelectorAll('section, [data-section]').forEach(el => observer.observe(el));
  }

  private trackCartActions(): void {
    // Écouter les événements personnalisés pour le panier
    window.addEventListener('cart:add', (e: any) => {
      this.logEvent('cart_add', {
        productId: e.detail?.productId,
        productName: e.detail?.productName,
        price: e.detail?.price,
        quantity: e.detail?.quantity
      });
    });

    window.addEventListener('cart:remove', (e: any) => {
      this.logEvent('cart_remove', {
        productId: e.detail?.productId,
        quantity: e.detail?.quantity
      });
    });
  }

  private getCurrentSection(): string {
    const sections = document.querySelectorAll('section[id], div[data-section]');
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        return section.id || section.getAttribute('data-section') || 'unknown';
      }
    }
    return 'unknown';
  }

  public logEvent(type: string, details: any = {}): void {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      referrer: document.referrer,
      ...details
    };
    
    this.data.events.push(event);
    
    // Envoi batch toutes les 30s ou 10 événements
    if (this.data.events.length >= 10) {
      this.sendData();
    } else {
      this.scheduleBatchSend();
    }
  }

  private scheduleBatchSend(): void {
    if (this.batchTimeout) return;
    
    this.batchTimeout = setTimeout(() => {
      this.sendData();
      this.batchTimeout = null;
    }, 30000);
  }

  public sendData(): void {
    if (this.data.events.length === 0) return;
    
    const payload = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      events: [...this.data.events],
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // Envoi vers l'API Supabase
    this.sendToSupabase(payload);
    
    this.data.events = [];
  }

  private async sendToSupabase(payload: any): Promise<void> {
    try {
      // Utiliser l'API endpoint Supabase Edge Function
      const response = await fetch(`https://hvrlcwfbujadozdhwvon.supabase.co/functions/v1/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true
      });

      if (!response.ok) {
        console.warn('Tracking failed:', response.status);
      }
    } catch (error) {
      console.warn('Tracking error:', error);
      // Fallback: utiliser sendBeacon si disponible
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`https://hvrlcwfbujadozdhwvon.supabase.co/functions/v1/tracking`, JSON.stringify(payload));
      }
    }
  }

  public setUser(userData: any): void {
    this.data.user = userData;
    this.logEvent('user_identified', {
      userId: userData.id,
      userType: userData.type || 'customer'
    });
  }

  public trackPageView(page: string): void {
    this.logEvent('page_view', {
      page,
      timestamp: new Date().toISOString()
    });
  }

  public destroy(): void {
    this.sendData();
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
  }
}

export default AdvancedBehavioralTracker;
