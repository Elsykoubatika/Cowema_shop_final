
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';

export interface Commission {
  id: string;
  orderId: string;
  amount: number;
  productTotal: number;
  date: string;
  paid: boolean;
}

export interface CommissionStats {
  totalCommissions: number;
  paidCommissions: number;
  pendingCommissions: number;
  thisMonthCommissions: number;
  lastMonthCommissions: number;
  growthPercentage: number;
}

export const useInfluencerCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUserInfluencer } = useInfluencerStore();

  const fetchCommissions = async () => {
    if (!currentUserInfluencer?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('influencer_commissions')
        .select(`
          *,
          customer_orders!inner(
            id,
            status,
            total_amount,
            created_at
          )
        `)
        .eq('influencer_id', currentUserInfluencer.id)
        .eq('customer_orders.status', 'delivered')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCommissions: Commission[] = data?.map(commission => ({
        id: commission.id,
        orderId: commission.order_id,
        amount: commission.commission_amount,
        productTotal: commission.order_total,
        date: commission.created_at,
        paid: commission.status === 'paid'
      })) || [];

      setCommissions(formattedCommissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [currentUserInfluencer?.id]);

  const stats: CommissionStats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
    const paidCommissions = commissions.filter(c => c.paid).reduce((sum, c) => sum + c.amount, 0);
    const pendingCommissions = totalCommissions - paidCommissions;

    const thisMonthCommissions = commissions
      .filter(c => new Date(c.date) >= thisMonth)
      .reduce((sum, c) => sum + c.amount, 0);

    const lastMonthCommissions = commissions
      .filter(c => {
        const date = new Date(c.date);
        return date >= lastMonth && date <= lastMonthEnd;
      })
      .reduce((sum, c) => sum + c.amount, 0);

    const growthPercentage = lastMonthCommissions > 0 
      ? ((thisMonthCommissions - lastMonthCommissions) / lastMonthCommissions) * 100 
      : 0;

    return {
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      thisMonthCommissions,
      lastMonthCommissions,
      growthPercentage
    };
  }, [commissions]);

  return {
    commissions,
    stats,
    isLoading,
    error,
    refetch: fetchCommissions
  };
};
