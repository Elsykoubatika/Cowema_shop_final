
import React from 'react';
import { Percent } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormData } from './useOrderFormState';

interface PromoCodeSectionProps {
  formData: FormData;
  appliedPromo: { code: string; discount: number } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setAppliedPromo: React.Dispatch<React.SetStateAction<{ code: string; discount: number } | null>>;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({ 
  formData, 
  appliedPromo, 
  handleChange,
  setAppliedPromo
}) => {
  const validatePromoCode = () => {
    // This will be handled by the parent component via useOrderFormState
    const event = new CustomEvent('validate-promo-code', { detail: formData.promoCode });
    document.dispatchEvent(event);
  };

  // Listen for the validate promo code event
  React.useEffect(() => {
    const handler = () => {
      const { promotions } = require('@/hooks/usePromotionStore').usePromotionStore.getState();
      const now = new Date();
      const foundPromo = promotions.find(
        (p: any) => p.code.toLowerCase() === formData.promoCode.toLowerCase() && 
        p.isActive && 
        new Date(p.expiryDate) > now
      );
      
      if (foundPromo) {
        setAppliedPromo({
          code: foundPromo.code,
          discount: foundPromo.discount
        });
      } else {
        setAppliedPromo(null);
      }
    };

    document.addEventListener('validate-promo-code', handler);
    return () => {
      document.removeEventListener('validate-promo-code', handler);
    };
  }, [formData.promoCode, setAppliedPromo]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
      <label htmlFor="promoCode" className="flex items-center gap-2 text-sm font-semibold mb-3 text-blue-800">
        <Percent size={18} className="text-blue-600" /> 
        Code promotionnel
        <span className="text-xs font-normal text-blue-600">(optionnel)</span>
      </label>
      <div className="flex gap-2">
        <Input
          id="promoCode"
          name="promoCode"
          type="text"
          placeholder="Entrez votre code promo"
          value={formData.promoCode}
          onChange={handleChange}
          className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={validatePromoCode}
          className="shrink-0 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          Appliquer
        </Button>
      </div>
      {appliedPromo && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            ✅ Code "{appliedPromo.code}" appliqué! Réduction de {appliedPromo.discount}%
          </p>
        </div>
      )}
    </div>
  );
};

export default PromoCodeSection;
