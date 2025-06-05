
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DiscountType, PromoTarget } from '../usePromotionStore';

export interface PromotionFormData {
  code: string;
  discount: number;
  discountType: DiscountType;
  minPurchaseAmount: number;
  expiryDays: number;
  expiryHours: number;
  isActive: boolean;
  target: PromoTarget;
  description: string;
}

export const usePromotionForm = (
  initialFormData: PromotionFormData,
  onSaveCallback: (formData: PromotionFormData) => void
) => {
  const [formData, setFormData] = useState<PromotionFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const validateForm = (): boolean => {
    // Générer un code automatique si vide
    if (!formData.code.trim()) {
      const autoCode = `PROMO${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, code: autoCode }));
      console.log(`Code promo généré automatiquement: ${autoCode}`);
    }
    
    if (formData.discount <= 0) {
      toast({
        title: "Erreur",
        description: "La réduction doit être supérieure à 0",
        variant: "destructive"
      });
      setActiveTab("details"); // Rediriger vers l'onglet détails
      return false;
    }
    
    // Additional validation for percentage discount
    if (formData.discountType === 'percentage' && formData.discount > 100) {
      toast({
        title: "Erreur",
        description: "La réduction en pourcentage ne peut pas dépasser 100%",
        variant: "destructive"
      });
      setActiveTab("details"); // Rediriger vers l'onglet détails
      return false;
    }
    
    if (formData.minPurchaseAmount < 0) {
      toast({
        title: "Erreur",
        description: "Le montant minimum d'achat ne peut pas être négatif",
        variant: "destructive"
      });
      setActiveTab("details"); // Rediriger vers l'onglet détails
      return false;
    }
    
    if (formData.expiryDays <= 0 && formData.expiryHours <= 0) {
      toast({
        title: "Erreur",
        description: "La durée d'expiration doit être supérieure à 0",
        variant: "destructive"
      });
      setActiveTab("details"); // Rediriger vers l'onglet détails
      return false;
    }
    
    // Avertir si pas de description mais ne pas bloquer
    if (!formData.description.trim()) {
      console.log("Aucune description fournie pour la promotion");
    }
    
    return true;
  };
  
  const handleSave = () => {
    console.log('🔄 Tentative de sauvegarde de la promotion:', formData);
    
    // Créer les données finales avec valeurs par défaut si nécessaire
    const finalFormData = {
      ...formData,
      code: formData.code.trim() || `PROMO${Date.now().toString().slice(-6)}`,
      description: formData.description.trim() || `Réduction de ${formData.discount}${formData.discountType === 'percentage' ? '%' : ' FCFA'}`,
      discount: Math.max(formData.discount, 1), // Au minimum 1
      expiryDays: Math.max(formData.expiryDays, 1), // Au minimum 1 jour
    };
    
    console.log('📋 Données finales de la promotion:', finalFormData);
    
    if (validateForm()) {
      console.log('✅ Validation réussie, sauvegarde en cours...');
      onSaveCallback(finalFormData);
      
      toast({
        title: "Succès",
        description: `Promotion "${finalFormData.code}" créée avec succès`,
        variant: "default"
      });
    } else {
      console.log('❌ Échec de la validation');
    }
  };
  
  const formattedExpiryDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + (formData.expiryDays || 1));
    date.setHours(date.getHours() + (formData.expiryHours || 0));
    return date.toLocaleString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return {
    formData,
    activeTab,
    setActiveTab,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleSave,
    formattedExpiryDate
  };
};
