
import { useMemo } from 'react';
import { useInfluencerCommissions } from './useInfluencerCommissions';

export interface PaymentInfo {
  availableToPayout: number;
  minPayoutAmount: number;
  canRequestPayout: boolean;
  progressPercentage: number;
  nextPayoutDate: string;
  totalEarningsThisMonth: number;
}

export const useInfluencerPayments = () => {
  const { stats, isLoading, error } = useInfluencerCommissions();
  const minPayoutAmount = 10000; // FCFA

  const paymentInfo: PaymentInfo = useMemo(() => {
    const availableToPayout = stats.pendingCommissions;
    const canRequestPayout = availableToPayout >= minPayoutAmount;
    const progressPercentage = Math.min((availableToPayout / minPayoutAmount) * 100, 100);
    
    // Calculer la prochaine date de paiement (début du mois suivant)
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
    const nextPayoutDate = nextMonth.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      availableToPayout,
      minPayoutAmount,
      canRequestPayout,
      progressPercentage,
      nextPayoutDate,
      totalEarningsThisMonth: stats.thisMonthCommissions
    };
  }, [stats, minPayoutAmount]);

  return {
    paymentInfo,
    isLoading,
    error
  };
};
