
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { useToast } from '@/hooks/use-toast';

export interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  payment_method: string;
  payment_details: any;
  requested_at: string;
  processed_at?: string;
  admin_notes?: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  payment_date: string;
  payout_request_id?: string;
}

export const useInfluencerPayoutRequests = () => {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUserInfluencer } = useInfluencerStore();
  const { toast } = useToast();

  const fetchPayoutRequests = async () => {
    if (!currentUserInfluencer?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('influencer_payout_requests')
        .select('*')
        .eq('influencer_id', currentUserInfluencer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests: PayoutRequest[] = data?.map(request => ({
        id: request.id,
        amount: request.amount,
        status: request.status as 'pending' | 'approved' | 'paid' | 'rejected',
        payment_method: request.payment_method,
        payment_details: request.payment_details,
        requested_at: request.requested_at,
        processed_at: request.processed_at,
        admin_notes: request.admin_notes
      })) || [];

      setPayoutRequests(formattedRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des demandes de paiement');
    }
  };

  const fetchPaymentHistory = async () => {
    if (!currentUserInfluencer?.id) return;

    try {
      const { data, error } = await supabase
        .from('influencer_payments')
        .select('*')
        .eq('influencer_id', currentUserInfluencer.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      const formattedPayments: PaymentHistory[] = data?.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        payment_method: payment.payment_method,
        payment_reference: payment.payment_reference,
        payment_date: payment.payment_date,
        payout_request_id: payment.payout_request_id
      })) || [];

      setPaymentHistory(formattedPayments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'historique des paiements');
    } finally {
      setIsLoading(false);
    }
  };

  const createPayoutRequest = async (amount: number, paymentMethod: string, paymentDetails: any) => {
    if (!currentUserInfluencer?.id) return false;

    try {
      const { error } = await supabase
        .from('influencer_payout_requests')
        .insert({
          influencer_id: currentUserInfluencer.id,
          amount,
          payment_method: paymentMethod,
          payment_details: paymentDetails
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de paiement a été soumise avec succès.",
      });

      await fetchPayoutRequests();
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la demande de paiement.",
      });
      return false;
    }
  };

  useEffect(() => {
    if (currentUserInfluencer?.id) {
      fetchPayoutRequests();
      fetchPaymentHistory();
    }
  }, [currentUserInfluencer?.id]);

  const stats = useMemo(() => {
    const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingRequests = payoutRequests.filter(req => req.status === 'pending').length;
    const lastPayment = paymentHistory[0];

    return {
      totalPaid,
      pendingRequests,
      lastPayment,
      totalRequests: payoutRequests.length
    };
  }, [payoutRequests, paymentHistory]);

  return {
    payoutRequests,
    paymentHistory,
    stats,
    isLoading,
    error,
    createPayoutRequest,
    refetch: () => {
      fetchPayoutRequests();
      fetchPaymentHistory();
    }
  };
};
