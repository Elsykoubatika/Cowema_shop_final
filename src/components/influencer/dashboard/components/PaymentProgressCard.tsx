
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, Clock, Plus } from 'lucide-react';
import { PaymentInfo } from '@/hooks/influencer/useInfluencerPayments';
import { useInfluencerPayoutRequests } from '@/hooks/influencer/useInfluencerPayoutRequests';
import PayoutRequestModal from './PayoutRequestModal';

interface PaymentProgressCardProps {
  paymentInfo: PaymentInfo;
}

const PaymentProgressCard: React.FC<PaymentProgressCardProps> = ({ paymentInfo }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { createPayoutRequest, stats } = useInfluencerPayoutRequests();
  const { availableToPayout, minPayoutAmount, canRequestPayout, progressPercentage } = paymentInfo;

  return (
    <>
      <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-emerald-900">💰 Solde disponible</h3>
                <Badge variant={canRequestPayout ? "default" : "secondary"} className="animate-pulse">
                  {canRequestPayout ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Éligible
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      En cours
                    </div>
                  )}
                </Badge>
                {stats.pendingRequests > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {stats.pendingRequests} demande(s) en attente
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-emerald-700">
                  {availableToPayout.toLocaleString()}
                </span>
                <span className="text-emerald-600 font-medium">FCFA</span>
                {canRequestPayout && (
                  <Button
                    onClick={() => setShowRequestModal(true)}
                    size="sm"
                    className="ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Demander
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-700">Progression vers le paiement minimum</span>
                  <span className="font-medium text-emerald-800">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>0 FCFA</span>
                  <span>{minPayoutAmount.toLocaleString()} FCFA minimum</span>
                </div>
              </div>
            </div>
          </div>
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

export default PaymentProgressCard;
