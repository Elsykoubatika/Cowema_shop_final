
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus } from 'lucide-react';
import { useInfluencerPayoutRequests } from '@/hooks/influencer/useInfluencerPayoutRequests';
import PaymentHistoryList from './PaymentHistoryList';
import PayoutRequestModal from './PayoutRequestModal';
import PaymentEmptyState from './PaymentEmptyState';

interface PaymentHistoryCardProps {
  availableToPayout: number;
  canRequestPayout: boolean;
  minPayoutAmount: number;
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({ 
  availableToPayout, 
  canRequestPayout, 
  minPayoutAmount 
}) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { payoutRequests, paymentHistory, stats, isLoading, createPayoutRequest } = useInfluencerPayoutRequests();

  const hasTransactions = payoutRequests.length > 0 || paymentHistory.length > 0;

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-800">
                  Historique des paiements
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {hasTransactions 
                    ? `${stats.totalRequests} transaction(s) • ${stats.totalPaid.toLocaleString()} FCFA reçus`
                    : 'Tous vos paiements reçus'
                  }
                </CardDescription>
              </div>
            </div>
            
            {canRequestPayout && (
              <Button
                onClick={() => setShowRequestModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Demander un paiement
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : hasTransactions ? (
            <PaymentHistoryList 
              payoutRequests={payoutRequests}
              paymentHistory={paymentHistory}
            />
          ) : (
            <PaymentEmptyState 
              availableToPayout={availableToPayout}
              canRequestPayout={canRequestPayout}
              minPayoutAmount={minPayoutAmount}
            />
          )}
        </CardContent>
      </Card>

      <PayoutRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        availableAmount={availableToPayout}
        minPayoutAmount={minPayoutAmount}
        onSubmit={createPayoutRequest}
      />
    </>
  );
};

export default PaymentHistoryCard;
