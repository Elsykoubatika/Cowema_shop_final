
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SupabasePromotion } from '@/hooks/admin/useSupabasePromotions';

interface DynamicPromotionFormProps {
  promotion?: SupabasePromotion | null;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const DynamicPromotionForm: React.FC<DynamicPromotionFormProps> = ({
  promotion,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    promo_code: '',
    discount_value: 10,
    discount_type: 'percentage' as 'percentage' | 'fixed',
    description: '',
    min_order_amount: 0,
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    is_active: true,
    usage_limit: undefined as number | undefined,
    usage_type: 'unlimited' as 'unlimited' | 'limited' | 'single_use',
    max_uses_per_user: undefined as number | undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name,
        promo_code: promotion.promo_code || '',
        discount_value: promotion.discount_value,
        discount_type: promotion.discount_type,
        description: promotion.description || '',
        min_order_amount: promotion.min_order_amount || 0,
        start_date: new Date(promotion.start_date),
        end_date: new Date(promotion.end_date),
        is_active: promotion.is_active,
        usage_limit: promotion.usage_limit,
        usage_type: promotion.usage_type || 'unlimited',
        max_uses_per_user: promotion.max_uses_per_user
      });
    }
  }, [promotion]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.promo_code.trim()) {
      newErrors.promo_code = 'Le code promo est requis';
    } else if (!/^[A-Z0-9]+$/.test(formData.promo_code)) {
      newErrors.promo_code = 'Le code doit contenir uniquement des lettres majuscules et des chiffres';
    }

    if (formData.discount_value <= 0) {
      newErrors.discount_value = 'La réduction doit être supérieure à 0';
    }

    if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
      newErrors.discount_value = 'La réduction en pourcentage ne peut pas dépasser 100%';
    }

    if (formData.min_order_amount < 0) {
      newErrors.min_order_amount = 'Le montant minimum ne peut pas être négatif';
    }

    if (formData.end_date <= formData.start_date) {
      newErrors.end_date = 'La date de fin doit être postérieure à la date de début';
    }

    if (formData.usage_type === 'limited' && (!formData.max_uses_per_user || formData.max_uses_per_user <= 0)) {
      newErrors.max_uses_per_user = 'Le nombre maximum d\'utilisations par utilisateur est requis pour un usage limité';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        name: formData.name.trim(),
        promo_code: formData.promo_code.toUpperCase(),
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString()
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom de la promotion */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la promotion *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ex: Promotion d'été 2024"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Code de promotion */}
      <div className="space-y-2">
        <Label htmlFor="promo_code">Code de promotion *</Label>
        <Input
          id="promo_code"
          value={formData.promo_code}
          onChange={(e) => handleInputChange('promo_code', e.target.value.toUpperCase())}
          placeholder="Ex: SUMMER2024"
          className={errors.promo_code ? 'border-red-500' : ''}
        />
        {errors.promo_code && <p className="text-sm text-red-500">{errors.promo_code}</p>}
      </div>

      {/* Type et valeur de réduction */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_type">Type de réduction</Label>
          <Select
            value={formData.discount_type}
            onValueChange={(value: 'percentage' | 'fixed') => handleInputChange('discount_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Pourcentage (%)</SelectItem>
              <SelectItem value="fixed">Montant fixe (FCFA)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount_value">
            Valeur de réduction * {formData.discount_type === 'percentage' ? '(%)' : '(FCFA)'}
          </Label>
          <Input
            id="discount_value"
            type="number"
            value={formData.discount_value}
            onChange={(e) => handleInputChange('discount_value', parseFloat(e.target.value) || 0)}
            min="0"
            max={formData.discount_type === 'percentage' ? 100 : undefined}
            className={errors.discount_value ? 'border-red-500' : ''}
          />
          {errors.discount_value && <p className="text-sm text-red-500">{errors.discount_value}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Description de la promotion"
          rows={3}
        />
      </div>

      {/* Montant minimum d'achat */}
      <div className="space-y-2">
        <Label htmlFor="min_order_amount">Montant minimum d'achat (FCFA)</Label>
        <Input
          id="min_order_amount"
          type="number"
          value={formData.min_order_amount}
          onChange={(e) => handleInputChange('min_order_amount', parseFloat(e.target.value) || 0)}
          min="0"
          className={errors.min_order_amount ? 'border-red-500' : ''}
        />
        {errors.min_order_amount && <p className="text-sm text-red-500">{errors.min_order_amount}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date de début *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.start_date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date ? format(formData.start_date, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.start_date}
                onSelect={(date) => date && handleInputChange('start_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Date de fin *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.end_date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.end_date ? format(formData.end_date, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.end_date}
                onSelect={(date) => date && handleInputChange('end_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
        </div>
      </div>

      {/* Type d'utilisation et limites */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="usage_type">Type d'utilisation</Label>
          <Select
            value={formData.usage_type}
            onValueChange={(value: 'unlimited' | 'limited' | 'single_use') => handleInputChange('usage_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unlimited">Illimitée</SelectItem>
              <SelectItem value="limited">Limitée par utilisateur</SelectItem>
              <SelectItem value="single_use">Usage unique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="usage_limit">Limite d'utilisation globale</Label>
          <Input
            id="usage_limit"
            type="number"
            value={formData.usage_limit || ''}
            onChange={(e) => handleInputChange('usage_limit', e.target.value ? parseInt(e.target.value) : undefined)}
            min="0"
            placeholder="Illimitée"
          />
        </div>
      </div>

      {/* Utilisations max par utilisateur */}
      {formData.usage_type === 'limited' && (
        <div className="space-y-2">
          <Label htmlFor="max_uses_per_user">Utilisations max par utilisateur *</Label>
          <Input
            id="max_uses_per_user"
            type="number"
            value={formData.max_uses_per_user || ''}
            onChange={(e) => handleInputChange('max_uses_per_user', e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            className={errors.max_uses_per_user ? 'border-red-500' : ''}
          />
          {errors.max_uses_per_user && <p className="text-sm text-red-500">{errors.max_uses_per_user}</p>}
        </div>
      )}

      {/* Statut actif */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Promotion active</Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {promotion ? 'Mettre à jour' : 'Créer'} la promotion
        </Button>
      </div>
    </form>
  );
};

export default DynamicPromotionForm;
