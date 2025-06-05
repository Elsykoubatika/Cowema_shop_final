
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfluencerStore } from './useInfluencerStore';
import { useToast } from './use-toast';

export const useReferralCode = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { getInfluencerByCode } = useInfluencerStore();
  
  useEffect(() => {
    const referralCode = searchParams.get('ref');
    
    if (referralCode) {
      // Stocker le code de parrainage pour l'utiliser lors de l'inscription
      localStorage.setItem('cowema_ref_code', referralCode);
      localStorage.setItem('cowema_ref_time', Date.now().toString());
      
      // Pour les codes influenceurs (existant)
      const influencer = getInfluencerByCode(referralCode);
      if (influencer) {
        const influencerName = searchParams.get('by') || '';
        if (influencerName) {
          localStorage.setItem('cowema_ref_name', influencerName);
        }
        
        toast({
          title: "Code de parrainage appliqué",
          description: `Vous naviguez avec le code influenceur de ${influencer.firstName} ${influencer.lastName}`,
        });
      } else if (referralCode.startsWith('YBB')) {
        // Code de parrainage Ya Ba Boss
        toast({
          title: "Code de parrainage Ya Ba Boss détecté",
          description: "Le code sera appliqué lors de votre inscription",
        });
      }
    }
  }, [searchParams, getInfluencerByCode, toast]);
  
  const getCurrentReferralCode = () => {
    const code = localStorage.getItem('cowema_ref_code');
    const time = localStorage.getItem('cowema_ref_time');
    
    // Si le code a plus de 30 jours, on le supprime
    if (code && time) {
      const timestamp = parseInt(time);
      const now = Date.now();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      
      if (now - timestamp > thirtyDaysInMs) {
        localStorage.removeItem('cowema_ref_code');
        localStorage.removeItem('cowema_ref_time');
        localStorage.removeItem('cowema_ref_name');
        return null;
      }
      
      return code;
    }
    
    return null;
  };
  
  const getInfluencerFromCurrentCode = () => {
    const code = getCurrentReferralCode();
    if (!code) return null;
    
    return getInfluencerByCode(code);
  };

  const getInfluencerName = () => {
    return localStorage.getItem('cowema_ref_name') || '';
  };

  const clearReferralCode = () => {
    localStorage.removeItem('cowema_ref_code');
    localStorage.removeItem('cowema_ref_time');
    localStorage.removeItem('cowema_ref_name');
  };
  
  return {
    getCurrentReferralCode,
    getInfluencerFromCurrentCode,
    getInfluencerName,
    clearReferralCode
  };
};
