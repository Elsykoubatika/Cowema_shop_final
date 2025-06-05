
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import OverviewTab from '@/components/admin/promotions/tabs/OverviewTab';
import MetricsTab from '@/components/admin/promotions/tabs/MetricsTab';
import RecommendationsTab from '@/components/admin/promotions/tabs/RecommendationsTab';
import PromotionsDashboard from '@/components/admin/promotions/dashboard/PromotionsDashboard';
import { usePromotionsManager } from '@/hooks/admin/usePromotionsManager';
import { usePromotionMetrics } from '@/hooks/admin/usePromotionMetrics';
import { Percent } from 'lucide-react';

const PromotionsManager: React.FC = () => {
  // Use the existing hook that manages all promotion state
  const {
    promotions,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPromo,
    formData,
    handleOpenDialog,
    handleDialogClose,
    handleSavePromotion,
    handleDeleteClick,
    confirmDelete,
    setAsActive,
    updateFormData,
  } = usePromotionsManager();

  const { 
    metrics, 
    isLoading: metricsLoading, 
    error: metricsError,
    exportMetricsToCSV,
    exportPromotionsToCSV
  } = usePromotionMetrics();

  // Calculate real-time metrics based on actual data
  const activePromotions = promotions.filter(p => 
    p.isActive && new Date(p.expiryDate) > new Date()
  );
  
  const expiredPromotions = promotions.filter(p => 
    new Date(p.expiryDate) <= new Date()
  ).length;
  
  // Calculer la remise moyenne plus précisément
  const avgDiscount = promotions.length > 0 
    ? promotions.reduce((sum, promo) => {
        if (promo.discountType === 'percentage') {
          return sum + promo.discount;
        }
        // Pour les remises fixes, on estime par rapport à un panier moyen de 50000 FCFA
        return sum + (promo.discount / 50000) * 100;
      }, 0) / promotions.length
    : 0;

  // Calculer le taux de conversion moyen basé sur les vraies métriques
  const avgConversionRate = metrics && Object.keys(metrics).length > 0
    ? Object.values(metrics).reduce((sum, metric) => sum + metric.conversionRate, 0) / Object.values(metrics).length
    : 0; // 0% si pas de données réelles

  // Generate top performing promotions from real metrics only
  const topPerformingPromos = metrics 
    ? Object.entries(metrics)
        .map(([id, metric]) => {
          const promo = promotions.find(p => p.id === id);
          return { 
            id, 
            promo, 
            ...metric 
          };
        })
        .filter(item => item.usageCount > 0 || item.conversionRate > 0) // Filtrer seulement les vraies données
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, 5)
    : [];

  const handleExportMetrics = () => {
    exportMetricsToCSV();
  };

  const handleExportPromotions = () => {
    exportPromotionsToCSV();
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title="Gestion des promotions avancées" 
        icon={<Percent className="h-6 w-6" />}
        description="Gérez les promotions avec ciblage géographique, limites d'usage et combinaisons"
      />

      <div className="container py-6">
        {/* Dashboard cards with real data */}
        <PromotionsDashboard 
          activePromotions={activePromotions}
          totalPromotions={promotions.length}
          expiredPromotions={expiredPromotions}
          avgDiscount={avgDiscount}
          conversionRate={avgConversionRate > 0 ? `${avgConversionRate.toFixed(1)}%` : "0%"}
          isLoading={metricsLoading}
        />
        
        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              promotions={promotions}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              currentPromo={currentPromo}
              formData={formData}
              onOpenDialog={handleOpenDialog}
              onDialogClose={handleDialogClose}
              onSavePromotion={handleSavePromotion}
              onConfirmDelete={confirmDelete}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteClick}
              onActivate={setAsActive}
              onUpdateFormData={updateFormData}
            />
          </TabsContent>
          
          <TabsContent value="metrics">
            <MetricsTab 
              isLoading={metricsLoading}
              error={metricsError}
              metrics={metrics || {}}
              promotions={promotions}
              topPerformingPromos={topPerformingPromos}
              onExportMetrics={handleExportMetrics}
              onExportPromotions={handleExportPromotions}
            />
          </TabsContent>
          
          <TabsContent value="recommendations">
            <RecommendationsTab 
              onOpenDialog={() => handleOpenDialog()} 
              promotions={promotions}
              metrics={metrics || {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default PromotionsManager;
