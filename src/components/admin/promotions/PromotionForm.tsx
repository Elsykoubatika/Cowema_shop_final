
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from "lucide-react";

import DetailsSection from './FormSections/DetailsSection';
import SettingsSection from './FormSections/SettingsSection';
import AdvancedSettingsSection from './FormSections/AdvancedSettingsSection';
import FormFooter from './FormSections/FormFooter';
import { usePromotionForm, PromotionFormData } from '../../../hooks/admin/usePromotionForm';
import { DiscountType, PromoTarget } from '../../../hooks/usePromotionStore';

interface PromotionFormProps {
  formData: {
    code: string;
    discount: number;
    discountType: DiscountType;
    minPurchaseAmount: number;
    expiryDays: number;
    expiryHours: number;
    isActive: boolean;
    target: PromoTarget;
    description: string;
    usageType?: string;
    maxUsesPerUser?: number;
    targetCities?: string[];
    targetCategories?: string[];
    customerHistoryRequirement?: any;
    isCombinable?: boolean;
    combinationRules?: any;
  };
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onUpdateFormData: (updates: any) => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  formData: initialFormData,
  isEditing,
  onSave,
  onCancel,
  onUpdateFormData
}) => {
  const {
    formData,
    activeTab,
    setActiveTab,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleSave,
    formattedExpiryDate
  } = usePromotionForm(initialFormData, () => onSave());

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          {isEditing ? 'Modifier la promotion' : 'Créer une promotion'}
        </DialogTitle>
        <DialogDescription>
          {isEditing 
            ? 'Modifiez les détails de cette promotion avec toutes les options avancées.' 
            : 'Créez une nouvelle promotion avec ciblage géographique, limites d\'usage et combinaisons.'}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="details" className="mt-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <DetailsSection 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSetActiveTab={setActiveTab}
            formattedExpiryDate={formattedExpiryDate}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsSection
            formData={formData}
            onSelectChange={handleSelectChange}
            onSwitchChange={handleSwitchChange}
            onSetActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedSettingsSection
            formData={formData}
            onUpdateFormData={onUpdateFormData}
          />
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <FormFooter
          isEditing={isEditing}
          onCancel={onCancel}
          onSave={handleSave}
        />
      </DialogFooter>
    </DialogContent>
  );
};

export default PromotionForm;
