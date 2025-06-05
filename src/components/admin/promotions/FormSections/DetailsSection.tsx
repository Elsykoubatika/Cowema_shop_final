
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock, CalendarIcon, Percent, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiscountType } from "../../../../hooks/usePromotionStore";

interface DetailsSectionProps {
  formData: {
    code: string;
    discount: number;
    discountType: DiscountType;
    minPurchaseAmount: number;
    expiryDays: number;
    expiryHours: number;
    description: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string, field: string) => void;
  onSetActiveTab: (tab: string) => void;
  formattedExpiryDate: () => string;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onSetActiveTab,
  formattedExpiryDate
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Code Promo
          </Label>
          <div className="col-span-3">
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={onInputChange}
              placeholder="PROMO20"
              className="uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">
              Le code que les clients pourront utiliser lors du paiement
            </p>
          </div>
        </div>
        
        {/* Discount Type Selection */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discountType" className="text-right">
            Type de remise
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.discountType}
              onValueChange={(value) => onSelectChange(value, 'discountType')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                <SelectItem value="fixed">Montant fixe (€)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Type de réduction à appliquer
            </p>
          </div>
        </div>
        
        {/* Discount Amount */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discount" className="text-right flex items-center gap-1">
            {formData.discountType === 'percentage' ? (
              <Percent size={16} className="text-green-600" />
            ) : (
              <DollarSign size={16} className="text-green-600" />
            )}
            Réduction
          </Label>
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <Input
                id="discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={onInputChange}
                min={1}
                max={formData.discountType === 'percentage' ? 100 : undefined}
                className="w-24"
              />
              <span>{formData.discountType === 'percentage' ? '%' : '€'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.discountType === 'percentage' 
                ? 'Pourcentage de réduction appliqué' 
                : 'Montant fixe de réduction en euros'}
            </p>
          </div>
        </div>
        
        {/* Minimum Purchase Amount */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="minPurchaseAmount" className="text-right flex items-center gap-1">
            <DollarSign size={16} className="text-blue-600" />
            Achat minimum
          </Label>
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <Input
                id="minPurchaseAmount"
                name="minPurchaseAmount"
                type="number"
                value={formData.minPurchaseAmount}
                onChange={onInputChange}
                min={0}
                className="w-24"
              />
              <span>€</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Montant minimum d'achat pour appliquer la promotion (0 = pas de minimum)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="expiry" className="text-right flex items-center gap-1">
            <Clock size={16} className="text-amber-600" />
            Expire dans
          </Label>
          <div className="col-span-3">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id="expiryDays"
                name="expiryDays"
                type="number"
                value={formData.expiryDays}
                onChange={onInputChange}
                className="w-20"
                min={0}
              />
              <Label className="text-sm">jours</Label>
              <Input
                id="expiryHours"
                name="expiryHours"
                type="number"
                value={formData.expiryHours}
                onChange={onInputChange}
                className="w-20"
                min={0}
                max={23}
              />
              <Label className="text-sm">heures</Label>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <CalendarIcon size={14} />
              Expire le: {formattedExpiryDate()}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <div className="col-span-3">
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Offre spéciale : 20% de réduction sur tous les produits !"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Description visible par les clients (affichée dans la bannière)
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onSetActiveTab("settings")}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default DetailsSection;
