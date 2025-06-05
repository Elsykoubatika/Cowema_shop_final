
import React, { useEffect } from 'react';
import { useInfluencerNotifications } from '@/hooks/useInfluencerNotifications';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

import InfluencerStatsCards from './InfluencerStatsCards';
import AffiliateLinks from './AffiliateLinks';
import OverviewTab from './OverviewTab';
import AdvancedCommissionsTab from './AdvancedCommissionsTab';
import OrdersTab from './OrdersTab';
import PaymentsTab from './PaymentsTab';
import AnalyticsTab from './AnalyticsTab';
import MarketingTools from './MarketingTools';
import PerformanceComparison from './PerformanceComparison';
import { useInfluencerDashboard } from './useInfluencerDashboard';
import CommunicationHub from '../CommunicationHub';

const InfluencerDashboard: React.FC = () => {
  const { activeTab, setActiveTab, currentUserInfluencer, data, isLoading } = useInfluencerDashboard();
  const { checkNewCommissions, alertIfCanWithdraw } = useInfluencerNotifications();

  useEffect(() => {
    // Check for new commissions and payment alerts
    if (currentUserInfluencer) {
      checkNewCommissions();
      alertIfCanWithdraw();
    }
  }, [currentUserInfluencer, checkNewCommissions, alertIfCanWithdraw]);

  // Show loading state avec plus de détails
  if (isLoading) {
    return (
      <div className="container-cowema py-12">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord influenceur</h1>
        <div className="flex items-center gap-3 mb-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-gray-600">Initialisation de votre profil influenceur...</p>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Handle missing influencer data
  if (!currentUserInfluencer || !data) {
    return (
      <div className="container-cowema py-12">
        <h1 className="text-3xl font-bold mb-4">Tableau de bord influenceur</h1>
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Votre profil influenceur n'a pas pu être chargé. Cela peut prendre quelques instants lors de votre première connexion. 
            Veuillez actualiser la page ou contacter l'assistance si le problème persiste.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-hover transition-colors"
          >
            Actualiser la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cowema py-12">
      <h1 className="text-3xl font-bold mb-2">Tableau de bord influenceur</h1>
      <p className="text-gray-600 mb-8">
        Bienvenue, {currentUserInfluencer.firstName}. Suivez vos performances et gérez votre programme d'affiliation.
      </p>

      <InfluencerStatsCards 
        totalEarned={data.totalEarned}
        availableToPayout={data.availableToPayout}
        progressPercentage={data.progressPercentage}
        totalOrders={data.totalOrders}
        influencerStats={data.influencerStats}
        referralCode={currentUserInfluencer.referralCode}
        copyToClipboard={data.copyToClipboard}
      />

      <AffiliateLinks 
        referralLink={data.baseReferralLink}
        personalizedLink={data.personalizedLink}
        shortLink={data.shortLink}
        copyToClipboard={data.copyToClipboard}
      />

      <MarketingTools 
        influencerName={`${currentUserInfluencer.firstName} ${currentUserInfluencer.lastName}`}
        referralCode={currentUserInfluencer.referralCode}
        baseReferralLink={data.baseReferralLink}
        copyToClipboard={data.copyToClipboard}
      />

      <div className="mb-8">
        <CommunicationHub />
      </div>

      <div className="mb-8">
        <PerformanceComparison 
          currentUserStats={{
            totalEarned: data.totalEarned,
            totalOrders: data.totalOrders,
            conversionRate: 8.5, // Mock data - would come from real analytics
            avgOrderValue: 35000 // Mock data - would come from real analytics
          }}
        />
      </div>

      <div className="mb-8">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg mb-6" role="tablist">
          {[
            { id: "overview", label: "Aperçu" },
            { id: "commissions", label: "Commissions" },
            { id: "orders", label: "Commandes" },
            { id: "payments", label: "Paiements" },
            { id: "analytics", label: "Analyses" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="min-h-[400px]">
          {activeTab === "overview" && <OverviewTab chartData={data.chartData} />}
          {activeTab === "commissions" && <AdvancedCommissionsTab commissions={currentUserInfluencer.commissions} />}
          {activeTab === "orders" && <OrdersTab influencerStats={data.influencerStats} />}
          {activeTab === "payments" && <PaymentsTab availableToPayout={data.availableToPayout} />}
          {activeTab === "analytics" && (
            <AnalyticsTab 
              influencerStats={data.influencerStats} 
              commissionRate={currentUserInfluencer.commissionRate}
              totalEarned={data.totalEarned}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
