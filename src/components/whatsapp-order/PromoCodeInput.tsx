
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface PromoCodeInputProps {
  promoCode: string;
  appliedPromo: { code: string; discount: number } | null;
  onPromoCodeChange: (value: string) => void;
  onValidatePromo: () => void;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  promoCode,
  appliedPromo,
  onPromoCodeChange,
  onValidatePromo
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Tag size={18} />
        Code Promo
      </h3>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            placeholder="Entrez votre code promo"
            className="w-full"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onValidatePromo}
          disabled={!promoCode.trim()}
        >
          Appliquer
        </Button>
      </div>
      
      {appliedPromo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">
            ✅ Code promo "{appliedPromo.code}" appliqué (-{appliedPromo.discount}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
