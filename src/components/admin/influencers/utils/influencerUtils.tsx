
import React from 'react';
import { Instagram, Youtube, Facebook, Music, Share2 } from 'lucide-react';
import { InfluencerProfile } from '@/hooks/useSupabaseInfluencers';

export const getSocialIcon = (network: string) => {
  switch (network) {
    case 'instagram':
      return <Instagram className="h-4 w-4 text-pink-500" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 text-red-600" />;
    case 'facebook':
      return <Facebook className="h-4 w-4 text-blue-600" />;
    case 'tiktok':
      return <Music className="h-4 w-4" />;
    default:
      return <Share2 className="h-4 w-4 text-gray-400" />;
  }
};

export const getMainSocialNetwork = (influencer: InfluencerProfile): string => {
  const networks = influencer.socialNetworks || {};
  
  if (networks.instagram) return 'instagram';
  if (networks.tiktok) return 'tiktok';
  if (networks.youtube) return 'youtube';
  if (networks.facebook) return 'facebook';
  
  return 'other';
};

export const calculateSocialStats = (
  approvedInfluencers: InfluencerProfile[],
  pendingApplications: InfluencerProfile[]
) => {
  const allInfluencers = [...approvedInfluencers, ...pendingApplications];
  
  const networks = {
    instagram: 0,
    tiktok: 0,
    youtube: 0,
    facebook: 0,
    other: 0
  };

  let totalFollowers = 0;

  allInfluencers.forEach(influencer => {
    const mainNetwork = getMainSocialNetwork(influencer);
    if (mainNetwork in networks) {
      networks[mainNetwork as keyof typeof networks]++;
    } else {
      networks.other++;
    }
    
    totalFollowers += influencer.followerCount || 0;
  });

  return {
    networks,
    totalFollowers,
    totalInfluencers: allInfluencers.length
  };
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Date invalide';
  }
};
