
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InfluencerProfile {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  socialNetworks: Record<string, any>;
  followerCount: number;
  engagementRate: number;
  niche: string[];
  motivation?: string;
  commissionRate: number;
  totalEarnings: number;
  totalSales: number;
  referralCode?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerCommission {
  id: string;
  influencerId: string;
  orderId: string;
  commissionAmount: number;
  commissionRate: number;
  orderTotal: number;
  status: string;
  paidAt?: string;
  createdAt: string;
}

export const useSupabaseInfluencers = () => {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [commissions, setCommissions] = useState<InfluencerCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all influencers
  const fetchInfluencers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching influencers...');
      
      // Simplifier la requête pour éviter les problèmes de relation
      const { data, error } = await supabase
        .from('influencer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching influencers:', error);
        toast.error('Erreur lors du chargement des influenceurs: ' + error.message);
        return;
      }

      console.log('Raw influencer data:', data);

      const formattedInfluencers: InfluencerProfile[] = data?.map(influencer => ({
        id: influencer.id,
        userId: influencer.user_id,
        status: influencer.status,
        socialNetworks: influencer.social_networks as Record<string, any> || {},
        followerCount: influencer.follower_count || 0,
        engagementRate: Number(influencer.engagement_rate) || 0,
        niche: influencer.niche || [],
        motivation: influencer.motivation,
        commissionRate: Number(influencer.commission_rate) || 5,
        totalEarnings: Number(influencer.total_earnings) || 0,
        totalSales: influencer.total_sales || 0,
        referralCode: influencer.referral_code,
        approvedAt: influencer.approved_at,
        approvedBy: influencer.approved_by,
        createdAt: influencer.created_at,
        updatedAt: influencer.updated_at
      })) || [];

      console.log('Formatted influencers:', formattedInfluencers);
      setInfluencers(formattedInfluencers);
    } catch (error) {
      console.error('Error in fetchInfluencers:', error);
      toast.error('Erreur lors du chargement des influenceurs: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create influencer profile
  const createInfluencerProfile = useCallback(async (data: {
    userId: string;
    socialNetworks: Record<string, any>;
    followerCount: number;
    engagementRate: number;
    niche: string[];
    motivation?: string;
  }): Promise<InfluencerProfile | null> => {
    try {
      const referralCode = `INF${Date.now().toString().slice(-6)}`;
      
      const { data: result, error } = await supabase
        .from('influencer_profiles')
        .insert({
          user_id: data.userId,
          social_networks: data.socialNetworks,
          follower_count: data.followerCount,
          engagement_rate: data.engagementRate,
          niche: data.niche,
          motivation: data.motivation,
          referral_code: referralCode
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating influencer profile:', error);
        toast.error('Erreur lors de la création du profil influenceur');
        return null;
      }

      const newInfluencer: InfluencerProfile = {
        id: result.id,
        userId: result.user_id,
        status: result.status,
        socialNetworks: result.social_networks as Record<string, any> || {},
        followerCount: result.follower_count || 0,
        engagementRate: Number(result.engagement_rate) || 0,
        niche: result.niche || [],
        motivation: result.motivation,
        commissionRate: Number(result.commission_rate) || 5,
        totalEarnings: Number(result.total_earnings) || 0,
        totalSales: result.total_sales || 0,
        referralCode: result.referral_code,
        approvedAt: result.approved_at,
        approvedBy: result.approved_by,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };

      setInfluencers(prev => [newInfluencer, ...prev]);
      toast.success('Demande d\'influenceur soumise avec succès');
      return newInfluencer;
    } catch (error) {
      console.error('Error in createInfluencerProfile:', error);
      toast.error('Erreur lors de la création du profil influenceur');
      return null;
    }
  }, []);

  // Update influencer status
  const updateInfluencerStatus = useCallback(async (
    influencerId: string, 
    status: InfluencerProfile['status'],
    approvedBy?: string
  ): Promise<boolean> => {
    try {
      const updateData: any = { status };
      if (status === 'approved' && approvedBy) {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = approvedBy;
      }

      const { error } = await supabase
        .from('influencer_profiles')
        .update(updateData)
        .eq('id', influencerId);

      if (error) {
        console.error('Error updating influencer status:', error);
        toast.error('Erreur lors de la mise à jour du statut');
        return false;
      }

      setInfluencers(prev => prev.map(influencer => 
        influencer.id === influencerId 
          ? { 
              ...influencer, 
              status, 
              ...(status === 'approved' && approvedBy ? {
                approvedAt: new Date().toISOString(),
                approvedBy
              } : {})
            }
          : influencer
      ));

      toast.success('Statut mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error in updateInfluencerStatus:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      return false;
    }
  }, []);

  // Fetch commissions
  const fetchCommissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('influencer_commissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching commissions:', error);
        return;
      }

      const formattedCommissions: InfluencerCommission[] = data?.map(commission => ({
        id: commission.id,
        influencerId: commission.influencer_id,
        orderId: commission.order_id,
        commissionAmount: Number(commission.commission_amount),
        commissionRate: Number(commission.commission_rate),
        orderTotal: Number(commission.order_total),
        status: commission.status,
        paidAt: commission.paid_at,
        createdAt: commission.created_at
      })) || [];

      setCommissions(formattedCommissions);
    } catch (error) {
      console.error('Error in fetchCommissions:', error);
    }
  }, []);

  useEffect(() => {
    fetchInfluencers();
    fetchCommissions();
  }, [fetchInfluencers, fetchCommissions]);

  return {
    influencers,
    commissions,
    isLoading,
    createInfluencerProfile,
    updateInfluencerStatus,
    refetch: () => {
      fetchInfluencers();
      fetchCommissions();
    }
  };
};
