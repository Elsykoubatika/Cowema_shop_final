
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { useInfluencerPayments } from '@/hooks/influencer/useInfluencerPayments';
import PaymentProgressCard from './components/PaymentProgressCard';
import PaymentInfoCard from './components/PaymentInfoCard';
import PaymentHistoryCard from './components/PaymentHistoryCard';

interface PaymentsTabProps {
  availableToPayout?: number;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ availableToPayout }) => {
  const { paymentInfo, isLoading, error } = useInfluencerPayments();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                💰 Chargement de vos paiements 💰
              </h3>
              <p className="text-gray-600">Calcul de vos gains disponibles...</p>
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

  return (
    <div className="space-y-6">
      <PaymentProgressCard paymentInfo={paymentInfo} />
      <PaymentInfoCard />
      <PaymentHistoryCard 
        availableToPayout={paymentInfo.availableToPayout}
        canRequestPayout={paymentInfo.canRequestPayout}
        minPayoutAmount={paymentInfo.minPayoutAmount}
      />
    </div>
  );
};

export default PaymentsTab;
