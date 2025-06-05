
import { supabase } from '@/integrations/supabase/client';

export const createInfluencerProfile = async (userId: string) => {
  try {
    console.log('🌟 Creating influencer profile for user:', userId);
    
    // Generate a unique referral code
    const referralCode = `INF${Date.now().toString().slice(-6)}`;
    
    const { error } = await supabase
      .from('influencer_profiles')
      .insert({
        user_id: userId,
        referral_code: referralCode,
        status: 'approved', // Auto-approuver pour les utilisateurs avec le rôle influencer
        commission_rate: 5.0,
        total_sales: 0,
        total_earnings: 0,
        follower_count: 0,
        engagement_rate: 0,
        social_networks: {},
        niche: [],
        motivation: 'Profil créé automatiquement pour utilisateur approuvé'
      });

    if (error) {
      console.error('❌ Error creating influencer profile:', error);
      throw error;
    }

    console.log('✅ Influencer profile created with referral code:', referralCode);
    return { referralCode };
  } catch (error) {
    console.error('❌ Failed to create influencer profile:', error);
    throw error;
  }
};

export const ensureInfluencerProfile = async (userId: string) => {
  try {
    // Check if influencer profile already exists
    const { data: existingProfile } = await supabase
      .from('influencer_profiles')
      .select('id, referral_code')
      .eq('user_id', userId)
      .single();

    if (!existingProfile) {
      console.log('🔧 No influencer profile found, creating one...');
      await createInfluencerProfile(userId);
    } else {
      console.log('✅ Influencer profile already exists:', existingProfile.referral_code);
    }
  } catch (error) {
    console.error('❌ Error ensuring influencer profile:', error);
    throw error;
  }
};
