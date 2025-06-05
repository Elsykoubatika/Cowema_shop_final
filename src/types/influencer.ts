
export type InfluencerStatus = 'pending' | 'approved' | 'rejected';

export interface Commission {
  id: string;
  orderId: string;
  amount: number;
  productTotal: number;
  commissionRate: number;
  date: string;
  paid: boolean;
}

export interface InfluencerApplication {
  id: string;
  userId: string | null; // Si l'utilisateur est connecté
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  yearsOfExperience?: number;
  socialNetworks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    other?: string;
  };
  followersCount: number;
  niche: string;
  motivation: string;
  status: InfluencerStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Influencer {
  id: string;
  applicationId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  yearsOfExperience?: number;
  socialNetworks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    other?: string;
  };
  referralCode: string;
  referralLink: string;
  commissionRate: number; // pourcentage
  commissions: Commission[];
  totalEarned: number;
  totalPaid: number;
  createdAt: string;
}

export interface InfluencerState {
  applications: InfluencerApplication[];
  influencers: Influencer[];
  currentUserApplication: InfluencerApplication | null;
  currentUserInfluencer: Influencer | null;
  
  // Actions pour les candidatures
  submitApplication: (application: Omit<InfluencerApplication, 'id' | 'status' | 'submittedAt'>) => void;
  approveApplication: (id: string, adminId: string, commissionRate: number) => void;
  rejectApplication: (id: string, adminId: string) => void;
  
  // Actions pour les influenceurs
  getInfluencerByCode: (code: string) => Influencer | null;
  getInfluencerByLink: (link: string) => Influencer | null;
  addCommission: (influencerId: string, commission: Omit<Commission, 'id' | 'date' | 'paid'>) => void;
  markCommissionAsPaid: (influencerId: string, commissionId: string) => void;
  
  // Actions pour l'utilisateur actuel - signatures mises à jour
  setCurrentUserApplication: (userId: string) => void;
  setCurrentUserInfluencer: (userId: string | Influencer) => void;
  
  // Méthodes admin
  updateInfluencerCommissionRate: (influencerId: string, rate: number) => void;
}
