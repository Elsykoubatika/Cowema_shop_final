
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import InfluencerSidebar from './InfluencerSidebar';
import OverviewTab from './OverviewTab';
import CommissionsTab from './CommissionsTab';
import OrdersTab from './OrdersTab';
import PaymentsTab from './PaymentsTab';
import AnalyticsTab from './AnalyticsTab';
import MarketingTools from './MarketingTools';
import ProductCatalog from './ProductCatalog';
import AffiliationLinksTab from './AffiliationLinksTab';
import RealTimeCommunicationHub from '../RealTimeCommunicationHub';
import { useInfluencerDashboard } from './useInfluencerDashboard';
import { useToast } from '@/hooks/use-toast';

type ActiveTab = 'overview' | 'commissions' | 'orders' | 'payments' | 'analytics' | 'marketing' | 'catalog' | 'affiliation' | 'communication';

const InfluencerDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { toast } = useToast();
  
  const {
    currentUserInfluencer,
    data,
    isLoading
  } = useInfluencerDashboard();

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
          <OverviewTab
            chartData={data?.chartData || []}
          />
        );
      case 'commissions':
        return <CommissionsTab />;
      case 'orders':
        return <OrdersTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'analytics':
        return <AnalyticsTab />;
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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <InfluencerSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab: string) => setActiveTab(tab as ActiveTab)}
          stats={{
            totalEarned: data?.totalEarned || 0,
            totalOrders: data?.totalOrders || 0,
            availableToPayout: data?.availableToPayout || 0
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

export default InfluencerDashboardContent;
