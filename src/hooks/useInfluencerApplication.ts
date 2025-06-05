
import { useState } from 'react';
import { useUnifiedAuth } from './useUnifiedAuth';
import { useSupabaseInfluencers } from './useSupabaseInfluencers';
import { toast } from 'sonner';

export interface InfluencerApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  socialNetworks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    other?: string;
  };
  followerCount: number;
  niche: string[];
  motivation: string;
}

export const useInfluencerApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUnifiedAuth();
  const { createInfluencerProfile } = useSupabaseInfluencers();

  const submitApplication = async (applicationData: InfluencerApplicationData) => {
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      console.log('🌟 Submitting influencer application:', applicationData);
      
      // Validation basique
      if (!applicationData.firstName || !applicationData.email || !applicationData.phone) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return false;
      }

      if (applicationData.followerCount < 100) {
        toast.error('Un minimum de 100 abonnés est requis');
        return false;
      }

      // Créer le profil influenceur
      const result = await createInfluencerProfile({
        userId: user?.id || '',
        socialNetworks: applicationData.socialNetworks,
        followerCount: applicationData.followerCount,
        engagementRate: 0, // Sera calculé plus tard
        niche: applicationData.niche,
        motivation: applicationData.motivation
      });

      if (result) {
        toast.success('Candidature soumise avec succès! Nous examinerons votre demande prochainement.');
        return true;
      } else {
        toast.error('Erreur lors de la soumission de votre candidature');
        return false;
      }
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      toast.error('Une erreur est survenue lors de la soumission');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplication,
    isSubmitting
  };
};
