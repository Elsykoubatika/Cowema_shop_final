import { useState } from 'react';
import { usePromotionStore, Promotion, PromoTarget, DiscountType, UsageType } from '../usePromotionStore';
import { useToast } from "@/hooks/use-toast";

export const usePromotionsManager = () => {
  const { promotions, addPromotion, updatePromotion, deletePromotion, setActivePromotion } = usePromotionStore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<Promotion | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null);
  
  // Form state étendu pour les nouvelles fonctionnalités
  const [formData, setFormData] = useState({
    code: '',
    discount: 10,
    discountType: 'percentage' as DiscountType,
    minPurchaseAmount: 0,
    expiryDays: 7, // 7 jours par défaut au lieu de 1
    expiryHours: 0,
    isActive: true,
    target: 'all' as PromoTarget,
    description: '',
    
    // Nouvelles propriétés avancées
    usageType: 'unlimited' as UsageType,
    maxUsesPerUser: undefined as number | undefined,
    targetCities: [] as string[],
    targetCategories: [] as string[],
    customerHistoryRequirement: undefined as any,
    isCombinable: false,
    combinationRules: undefined as any
  });
  
  const resetForm = () => {
    console.log('🔄 Réinitialisation du formulaire');
    setFormData({
      code: '',
      discount: 10,
      discountType: 'percentage',
      minPurchaseAmount: 0,
      expiryDays: 7, // 7 jours par défaut
      expiryHours: 0,
      isActive: true,
      target: 'all',
      description: '',
      usageType: 'unlimited',
      maxUsesPerUser: undefined,
      targetCities: [],
      targetCategories: [],
      customerHistoryRequirement: undefined,
      isCombinable: false,
      combinationRules: undefined
    });
    setCurrentPromo(null);
  };
  
  const handleOpenDialog = (promo?: Promotion) => {
    console.log('🔄 Ouverture du dialogue de promotion:', promo ? 'Édition' : 'Création');
    
    if (promo) {
      const expiryDate = new Date(promo.expiryDate);
      const now = new Date();
      const diffMs = Math.max(0, expiryDate.getTime() - now.getTime());
      const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const diffHours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      
      setFormData({
        code: promo.code,
        discount: promo.discount,
        discountType: promo.discountType || 'percentage',
        minPurchaseAmount: promo.minPurchaseAmount || 0,
        expiryDays: diffDays,
        expiryHours: diffHours,
        isActive: promo.isActive,
        target: promo.target,
        description: promo.description,
        usageType: promo.usageType || 'unlimited',
        maxUsesPerUser: promo.maxUsesPerUser,
        targetCities: promo.targetCities || [],
        targetCategories: promo.targetCategories || [],
        customerHistoryRequirement: promo.customerHistoryRequirement,
        isCombinable: promo.isCombinable || false,
        combinationRules: promo.combinationRules
      });
      setCurrentPromo(promo);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    console.log('🔄 Fermeture du dialogue de promotion');
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSavePromotion = () => {
    console.log('💾 Sauvegarde de la promotion:', formData);
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Math.max(formData.expiryDays, 1));
    expiryDate.setHours(expiryDate.getHours() + Math.max(formData.expiryHours, 0));
    
    // Générer un code si vide
    const finalCode = formData.code.trim() || `PROMO${Date.now().toString().slice(-6)}`;
    
    // Correction du mapping des données - s'assurer que target est correctement passé
    const promotionData = {
      code: finalCode.toUpperCase(),
      discount: Math.max(formData.discount, 1),
      discountType: formData.discountType,
      minPurchaseAmount: Math.max(formData.minPurchaseAmount, 0),
      expiryDate: expiryDate.toISOString(),
      isActive: formData.isActive,
      target: formData.target, // S'assurer que le target est bien mappé
      description: formData.description.trim() || `Réduction de ${formData.discount}${formData.discountType === 'percentage' ? '%' : ' FCFA'}`,
      usageType: formData.usageType,
      maxUsesPerUser: formData.maxUsesPerUser,
      targetCities: formData.targetCities.length > 0 ? formData.targetCities : undefined,
      targetCategories: formData.targetCategories.length > 0 ? formData.targetCategories : undefined,
      customerHistoryRequirement: formData.customerHistoryRequirement,
      isCombinable: formData.isCombinable,
      combinationRules: formData.isCombinable ? formData.combinationRules : undefined
    };
    
    console.log('📋 Données finales de la promotion (avec target correct):', promotionData);
    
    try {
      if (currentPromo) {
        updatePromotion(currentPromo.id, promotionData);
        toast({
          title: "Promotion mise à jour",
          description: `La promotion ${finalCode} a été mise à jour avec succès.`
        });
      } else {
        addPromotion(promotionData);
        toast({
          title: "Promotion créée",
          description: `La promotion ${finalCode} a été créée avec succès.`
        });
      }
      
      handleDialogClose();
      console.log('✅ Promotion sauvegardée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteClick = (id: string) => {
    setPromoToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (promoToDelete) {
      deletePromotion(promoToDelete);
      
      toast({
        title: "Promotion supprimée",
        description: "La promotion a été supprimée avec succès."
      });
      
      setIsDeleteDialogOpen(false);
      setPromoToDelete(null);
    }
  };
  
  const setAsActive = (promo: Promotion) => {
    const newActiveState = !promo.isActive;
    
    updatePromotion(promo.id, {
      isActive: newActiveState
    });

    if (newActiveState) {
      setActivePromotion(promo);
      toast({
        title: "Promotion activée",
        description: `La promotion ${promo.code} est maintenant active et affichée sur le site.`
      });
    } else {
      toast({
        title: "Promotion désactivée",
        description: `La promotion ${promo.code} a été désactivée.`
      });
    }
  };

  const updateFormData = (updates: any) => {
    console.log('🔄 Mise à jour des données du formulaire:', updates);
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    promotions,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPromo,
    formData,
    promoToDelete,
    handleOpenDialog,
    handleDialogClose,
    handleSavePromotion,
    handleDeleteClick,
    confirmDelete,
    setAsActive,
    updateFormData
  };
};
