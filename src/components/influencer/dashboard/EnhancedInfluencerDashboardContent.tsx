
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import InfluencerSidebar from './InfluencerSidebar';
import EnhancedOverviewTab from './EnhancedOverviewTab';
import CommissionsTab from './CommissionsTab';
import OrdersTab from './OrdersTab';
import PaymentsTab from './PaymentsTab';
import AnalyticsTab from './AnalyticsTab';
import MarketingTools from './MarketingTools';
import ProductCatalog from './ProductCatalog';
import AffiliationLinksTab from './AffiliationLinksTab';
import AchievementBadges from './AchievementBadges';
import RealTimeCommunicationHub from '../RealTimeCommunicationHub';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { useInfluencerCommission } from '@/hooks/useInfluencerCommission';
import { useToast } from '@/hooks/use-toast';

type ActiveTab = 'overview' | 'commissions' | 'orders' | 'payments' | 'analytics' | 'marketing' | 'catalog' | 'affiliation' | 'communication';

const EnhancedInfluencerDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { toast } = useToast();
  const { currentUserInfluencer } = useInfluencerStore();
  const { monthlyCommissionData, isLoading, getInfluencerStats } = useInfluencerCommission();

  // Calculer les statistiques réelles
  const influencerStats = getInfluencerStats(currentUserInfluencer?.id || '');
  const chartData = monthlyCommissionData.map(item => ({
    month: item.month,
    amount: item.totalCommissions
  }));

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copié !",
        description: `${label} a été copié dans le presse-papiers.`,
      });
    }).catch((err) => {
      console.error('Erreur lors de la copie:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le texte.",
      });
    });
  };

  const influencerName = currentUserInfluencer?.firstName || 'Influenceur';
  const referralCode = currentUserInfluencer?.referralCode || 'INF000';
  const baseReferralLink = `https://cowema.net?ref=${referralCode}`;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AchievementBadges
              totalEarned={influencerStats.totalSalesAmount}
              totalOrders={influencerStats.totalOrders}
              influencerName={influencerName}
            />
            <EnhancedOverviewTab
              chartData={chartData}
              totalEarned={influencerStats.totalSalesAmount}
              totalOrders={influencerStats.totalOrders}
            />
          </div>
        );
      case 'commissions':
        return <CommissionsTab />;
      case 'orders':
        return (
          <OrdersTab
            influencerStats={influencerStats}
          />
        );
      case 'payments':
        return (
          <PaymentsTab
            availableToPayout={influencerStats.totalCommissions || 0}
          />
        );
      case 'analytics':
        return (
          <AnalyticsTab
            influencerStats={influencerStats}
            commissionRate={currentUserInfluencer?.commissionRate || 0}
            totalEarned={influencerStats.totalSalesAmount}
          />
        );
      case 'marketing':
        return (
          <MarketingTools
            influencerName={influencerName}
            referralCode={referralCode}
            baseReferralLink={baseReferralLink}
            copyToClipboard={copyToClipboard}
          />
        );
      case 'catalog':
        return (
          <ProductCatalog
            referralCode={referralCode}
            baseReferralLink={baseReferralLink}
            copyToClipboard={copyToClipboard}
          />
        );
      case 'affiliation':
        return (
          <AffiliationLinksTab
            referralCode={referralCode}
            influencerName={influencerName}
            copyToClipboard={copyToClipboard}
          />
        );
      case 'communication':
        return <RealTimeCommunicationHub />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <InfluencerSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab: string) => setActiveTab(tab as ActiveTab)}
          stats={{
            totalEarned: influencerStats.totalSalesAmount,
            totalOrders: influencerStats.totalOrders,
            availableToPayout: influencerStats.totalCommissions
          }}
        />
        <SidebarInset className="flex-1 overflow-auto">
          <div className="container-cowema space-y-6 p-6">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EnhancedInfluencerDashboardContent;
