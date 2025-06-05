
import { useState, useEffect } from 'react';
import { useSystemSettings } from './useSystemSettings';

export interface FlashBannerSettings {
  enabled: boolean;
  messageGeneral: string;
  messageBzpn: string;
  codeGeneral: string;
  codeBzpn: string;
  discountGeneral: number;
  discountBzpn: number;
  colors: {
    from: string;
    to: string;
  };
  expiryHour: number;
  targetCities: string[];
  cartAbandonDiscount: number;
}

export const useFlashBannerSettings = () => {
  const { getSetting, loading } = useSystemSettings();
  const [settings, setSettings] = useState<FlashBannerSettings | null>(null);

  useEffect(() => {
    if (!loading) {
      const enabled = getSetting('flash_banner_enabled') === true || getSetting('flash_banner_enabled') === 'true';
      const messageGeneral = getSetting('flash_banner_message_general') || 'MEGA FLASH SALE';
      const messageBzpn = getSetting('flash_banner_message_bzpn') || 'LIVRAISON GRATUITE à BZ et PN';
      const codeGeneral = getSetting('flash_banner_code_general') || 'FLASH10';
      const codeBzpn = getSetting('flash_banner_code_bzpn') || 'BZPN10';
      const discountGeneral = Number(getSetting('flash_banner_discount_general')) || 15;
      const discountBzpn = Number(getSetting('flash_banner_discount_bzpn')) || 10;
      const cartAbandonDiscount = Number(getSetting('cart_abandon_discount')) || 10;
      
      let colors = { from: '#f97316', to: '#dc2626' };
      try {
        const colorsRaw = getSetting('flash_banner_colors');
        if (typeof colorsRaw === 'string') {
          colors = JSON.parse(colorsRaw);
        } else if (colorsRaw && typeof colorsRaw === 'object') {
          colors = colorsRaw as { from: string; to: string };
        }
      } catch (e) {
        console.warn('Error parsing flash banner colors:', e);
      }

      const expiryHour = Number(getSetting('flash_banner_expiry_hour')) || 23;
      
      let targetCities = ['brazzaville', 'pointe-noire', 'pn'];
      try {
        const citiesRaw = getSetting('flash_banner_target_cities');
        if (typeof citiesRaw === 'string') {
          targetCities = JSON.parse(citiesRaw);
        } else if (Array.isArray(citiesRaw)) {
          targetCities = citiesRaw;
        }
      } catch (e) {
        console.warn('Error parsing target cities:', e);
      }

      setSettings({
        enabled,
        messageGeneral: typeof messageGeneral === 'string' ? messageGeneral.replace(/"/g, '') : messageGeneral,
        messageBzpn: typeof messageBzpn === 'string' ? messageBzpn.replace(/"/g, '') : messageBzpn,
        codeGeneral: typeof codeGeneral === 'string' ? codeGeneral.replace(/"/g, '') : codeGeneral,
        codeBzpn: typeof codeBzpn === 'string' ? codeBzpn.replace(/"/g, '') : codeBzpn,
        discountGeneral,
        discountBzpn,
        colors,
        expiryHour,
        targetCities,
        cartAbandonDiscount
      });
    }
  }, [getSetting, loading]);

  return { settings, loading };
};
