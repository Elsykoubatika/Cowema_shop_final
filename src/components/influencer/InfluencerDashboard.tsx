
import React from 'react';
import { useInfluencerAuth } from '@/hooks/useInfluencerAuth';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { Loader2 } from 'lucide-react';
import InfluencerDashboardContent from './dashboard/InfluencerDashboardContent';

const InfluencerDashboard: React.FC = () => {
  const { isAuthorized, redirectToLoginIfUnauthorized, isLoading } = useInfluencerAuth();
  const { currentUserInfluencer } = useInfluencerStore();

  console.log('🎯 InfluencerDashboard render:', {
    isAuthorized,
    isLoading,
    currentUserInfluencer: currentUserInfluencer?.firstName
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement de votre espace influenceur...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    redirectToLoginIfUnauthorized();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  return <InfluencerDashboardContent />;
};

export default InfluencerDashboard;
