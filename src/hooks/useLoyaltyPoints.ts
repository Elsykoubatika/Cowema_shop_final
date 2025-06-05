
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';
import { useToast } from '@/hooks/use-toast';

export interface LoyaltyMission {
  id: string;
  title: string;
  description: string;
  points_reward: number;
  mission_type: string;
  requirements: any;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  max_completions_per_user: number;
  completed?: boolean;
  completions_count?: number;
}

export interface LoyaltyReferral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'expired';
  points_earned: number;
  created_at: string;
  completed_at?: string;
}

export const useLoyaltyPoints = () => {
  const { user } = useUnifiedAuth();
  const { toast } = useToast();
  const [missions, setMissions] = useState<LoyaltyMission[]>([]);
  const [referrals, setReferrals] = useState<LoyaltyReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les missions disponibles
  const fetchMissions = async () => {
    if (!user?.id) return;

    try {
      const { data: missionsData, error: missionsError } = await supabase
        .from('loyalty_missions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (missionsError) throw missionsError;

      // Récupérer les complétions de l'utilisateur
      const { data: completionsData, error: completionsError } = await supabase
        .from('loyalty_mission_completions')
        .select('mission_id, points_earned')
        .eq('user_id', user.id);

      if (completionsError) throw completionsError;

      const completionsMap = new Map(
        completionsData?.map(c => [c.mission_id, c]) || []
      );

      const missionsWithStatus = (missionsData || []).map(mission => ({
        ...mission,
        completed: completionsMap.has(mission.id),
        completions_count: completionsMap.has(mission.id) ? 1 : 0
      }));

      setMissions(missionsWithStatus);
    } catch (error) {
      console.error('Erreur lors du chargement des missions:', error);
    }
  };

  // Récupérer les parrainages de l'utilisateur
  const fetchReferrals = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformer les données avec un cast de type sécurisé
      const typedReferrals: LoyaltyReferral[] = (data || []).map(item => ({
        ...item,
        status: (item.status as 'pending' | 'completed' | 'expired') || 'pending'
      }));
      
      setReferrals(typedReferrals);
    } catch (error) {
      console.error('Erreur lors du chargement des parrainages:', error);
    }
  };

  // Compléter une mission
  const completeMission = async (missionId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('complete_mission', {
        mission_id: missionId,
        user_id: user.id
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Mission accomplie !",
          description: "Vous avez gagné des points Ya Ba Boss !",
        });
        await fetchMissions();
        return true;
      } else {
        toast({
          title: "Mission déjà accomplie",
          description: "Vous avez déjà complété cette mission.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la complétion de mission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de compléter la mission",
        variant: "destructive"
      });
      return false;
    }
  };

  // Créer un code de parrainage
  const createReferralCode = async (): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      // Générer un code unique basé sur l'ID utilisateur
      const referralCode = `YBB${user.id.slice(0, 8).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('loyalty_referrals')
        .insert({
          referrer_id: user.id,
          referred_id: user.id, // Temporaire, sera mis à jour lors de l'utilisation
          referral_code: referralCode,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReferrals();
      return referralCode;
    } catch (error) {
      console.error('Erreur lors de la création du code de parrainage:', error);
      return null;
    }
  };

  // Utiliser un code de parrainage
  const useReferralCode = async (referralCode: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // Trouver le parrainage avec ce code
      const { data: referralData, error: findError } = await supabase
        .from('loyalty_referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('status', 'pending')
        .single();

      if (findError || !referralData) {
        toast({
          title: "Code invalide",
          description: "Ce code de parrainage n'existe pas ou a déjà été utilisé.",
          variant: "destructive"
        });
        return false;
      }

      if (referralData.referrer_id === user.id) {
        toast({
          title: "Code invalide",
          description: "Vous ne pouvez pas utiliser votre propre code de parrainage.",
          variant: "destructive"
        });
        return false;
      }

      // Mettre à jour le parrainage avec l'ID du parrainé
      const { error: updateError } = await supabase
        .from('loyalty_referrals')
        .update({ referred_id: user.id })
        .eq('id', referralData.id);

      if (updateError) throw updateError;

      // Compléter le parrainage
      const { data: completeData, error: completeError } = await supabase.rpc('complete_referral', {
        referral_id: referralData.id
      });

      if (completeError) throw completeError;

      if (completeData) {
        toast({
          title: "Parrainage réussi !",
          description: "Le parrain a gagné 10 points Ya Ba Boss grâce à vous !",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de l\'utilisation du code de parrainage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'utiliser ce code de parrainage",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      Promise.all([fetchMissions(), fetchReferrals()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user?.id]);

  return {
    missions,
    referrals,
    isLoading,
    completeMission,
    createReferralCode,
    useReferralCode,
    refetch: () => Promise.all([fetchMissions(), fetchReferrals()])
  };
};
