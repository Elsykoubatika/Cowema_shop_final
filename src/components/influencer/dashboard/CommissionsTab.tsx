
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { useInfluencerCommissions } from '@/hooks/influencer/useInfluencerCommissions';
import CommissionsStatsCards from './components/CommissionsStatsCards';
import CommissionsEmptyState from './components/CommissionsEmptyState';
import CommissionsHistoryCard from './components/CommissionsHistoryCard';

const CommissionsTab: React.FC = () => {
  const { stats, isLoading, error, commissions } = useInfluencerCommissions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                💚 Chargement de vos commissions 💚
              </h3>
              <p className="text-gray-600">Calcul de vos gains et performances...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h3 className="text-xl font-bold text-red-800">Erreur de chargement</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasCommissions = commissions.length > 0;

  return (
    <div className="space-y-6">
      {hasCommissions ? (
        <>
          <CommissionsStatsCards stats={stats} />
          <CommissionsHistoryCard commissions={commissions} />
        </>
      ) : (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-0">
            <CommissionsEmptyState />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommissionsTab;
