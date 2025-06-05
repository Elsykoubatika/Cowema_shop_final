
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, Check, X, Percent } from 'lucide-react';

interface PromoCodeSectionProps {
  promoCode: string;
  appliedPromo: { code: string; discount: number } | null;
  onPromoCodeChange: (value: string) => void;
  onValidatePromo: () => void;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  promoCode,
  appliedPromo,
  onPromoCodeChange,
  onValidatePromo
}) => {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate validation delay
    onValidatePromo();
    setIsValidating(false);
  };

  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-purple-600" />
          Code promotionnel
        </h4>

        {appliedPromo ? (
          // Code promo appliqué avec succès
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">
                    Code "{appliedPromo.code}" appliqué
                  </p>
                  <p className="text-sm text-green-700 flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Réduction de {appliedPromo.discount}%
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onPromoCodeChange('');
                  // Reset applied promo by calling validate with empty code
                  onValidatePromo();
                }}
                className="text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Formulaire de saisie du code promo
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="promoCode" className="text-sm font-medium text-gray-700">
                Avez-vous un code promo ?
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="promoCode"
                    type="text"
                    value={promoCode}
                    onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
                    placeholder="Entrez votre code"
                    className="pl-10 uppercase font-mono text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleValidate();
                      }
                    }}
                  />
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  type="button"
                  onClick={handleValidate}
                  disabled={!promoCode.trim() || isValidating}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Vérification...
                    </>
                  ) : (
                    'Appliquer'
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>Astuce :</strong> Les codes promo s'appliquent automatiquement au total de votre commande.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeSection;
