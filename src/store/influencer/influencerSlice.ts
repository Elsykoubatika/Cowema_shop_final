
import { StateCreator } from 'zustand';
import { InfluencerState } from '../../types/influencer';

// Create default influencer data for testing
const createDefaultInfluencers = () => {
  return [
    {
      id: "inf-1",
      applicationId: "app-1",
      userId: "influencer-id-1",
      firstName: "Marie",
      lastName: "Dupont",
      email: "influencer1@example.com",
      phone: "123-456-7895",
      city: "Brazzaville",
      yearsOfExperience: 3,
      socialNetworks: {
        instagram: "@mariedupont",
        tiktok: "@mariedupont",
        facebook: "Marie Dupont"
      },
      referralCode: "MARIE2024",
      referralLink: "https://cowema.com/?ref=MARIE2024",
      commissionRate: 15,
      commissions: [
        {
          id: "com-1",
          orderId: "ord-1",
          amount: 5000,
          productTotal: 33333,
          commissionRate: 15,
          date: "2024-01-15T10:00:00.000Z",
          paid: false
        },
        {
          id: "com-2",
          orderId: "ord-2",
          amount: 3000,
          productTotal: 20000,
          commissionRate: 15,
          date: "2024-02-10T15:30:00.000Z",
          paid: true
        }
      ],
      totalEarned: 8000,
      totalPaid: 3000,
      createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "inf-2",
      applicationId: "app-2",
      userId: "influencer-id-2",
      firstName: "Ahmed",
      lastName: "Kone",
      email: "influencer2@example.com",
      phone: "123-456-7896",
      city: "Pointe-Noire",
      yearsOfExperience: 2,
      socialNetworks: {
        instagram: "@ahmedkone",
        youtube: "Ahmed Kone Channel"
      },
      referralCode: "AHMED2024",
      referralLink: "https://cowema.com/?ref=AHMED2024",
      commissionRate: 12,
      commissions: [
        {
          id: "com-3",
          orderId: "ord-3",
          amount: 7500,
          productTotal: 62500,
          commissionRate: 12,
          date: "2024-02-20T12:00:00.000Z",
          paid: false
        }
      ],
      totalEarned: 7500,
      totalPaid: 0,
      createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "inf-3",
      applicationId: "app-3",
      userId: "influencer-id-3",
      firstName: "Fatima",
      lastName: "Toure",
      email: "influencer3@example.com",
      phone: "123-456-7897",
      city: "Dolisie",
      yearsOfExperience: 5,
      socialNetworks: {
        instagram: "@fatimatoure",
        tiktok: "@fatimatoure",
        facebook: "Fatima Toure"
      },
      referralCode: "FATIMA2024",
      referralLink: "https://cowema.com/?ref=FATIMA2024",
      commissionRate: 18,
      commissions: [
        {
          id: "com-4",
          orderId: "ord-4",
          amount: 12000,
          productTotal: 66667,
          commissionRate: 18,
          date: "2024-03-01T09:15:00.000Z",
          paid: false
        },
        {
          id: "com-5",
          orderId: "ord-5",
          amount: 6000,
          productTotal: 33333,
          commissionRate: 18,
          date: "2024-03-15T14:20:00.000Z",
          paid: true
        }
      ],
      totalEarned: 18000,
      totalPaid: 6000,
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ];
};

// Slice pour gérer les fonctionnalités des influenceurs
export const createInfluencerSlice: StateCreator<
  InfluencerState,
  [],
  [],
  Pick<InfluencerState, 'getInfluencerByCode' | 'getInfluencerByLink' | 'addCommission' | 'markCommissionAsPaid' | 'updateInfluencerCommissionRate'>
> = (set, get) => ({
  getInfluencerByCode: (code) => {
    return get().influencers.find(inf => inf.referralCode === code) || null;
  },
  
  getInfluencerByLink: (link) => {
    return get().influencers.find(inf => inf.referralLink === link) || null;
  },
  
  addCommission: (influencerId, commissionData) => set((state) => {
    const influencerIndex = state.influencers.findIndex(inf => inf.id === influencerId);
    
    if (influencerIndex === -1) return state;
    
    const newCommission = {
      ...commissionData,
      id: `com-${Date.now()}`,
      date: new Date().toISOString(),
      paid: false
    };
    
    const updatedInfluencers = [...state.influencers];
    const influencer = updatedInfluencers[influencerIndex];
    
    updatedInfluencers[influencerIndex] = {
      ...influencer,
      commissions: [...influencer.commissions, newCommission],
      totalEarned: influencer.totalEarned + newCommission.amount
    };
    
    // Mettre à jour l'influenceur actuel si nécessaire
    const updatedCurrentInfluencer = 
      state.currentUserInfluencer?.id === influencerId 
        ? updatedInfluencers[influencerIndex]
        : state.currentUserInfluencer;
    
    return {
      influencers: updatedInfluencers,
      currentUserInfluencer: updatedCurrentInfluencer
    };
  }),
  
  markCommissionAsPaid: (influencerId, commissionId) => set((state) => {
    const influencerIndex = state.influencers.findIndex(inf => inf.id === influencerId);
    
    if (influencerIndex === -1) return state;
    
    const updatedInfluencers = [...state.influencers];
    const influencer = updatedInfluencers[influencerIndex];
    
    const commissionIndex = influencer.commissions.findIndex(com => com.id === commissionId);
    
    if (commissionIndex === -1) return state;
    
    const commission = influencer.commissions[commissionIndex];
    
    const updatedCommissions = [...influencer.commissions];
    updatedCommissions[commissionIndex] = {...commission, paid: true};
    
    updatedInfluencers[influencerIndex] = {
      ...influencer,
      commissions: updatedCommissions,
      totalPaid: influencer.totalPaid + commission.amount
    };
    
    // Mettre à jour l'influenceur actuel si nécessaire
    const updatedCurrentInfluencer = 
      state.currentUserInfluencer?.id === influencerId 
        ? updatedInfluencers[influencerIndex]
        : state.currentUserInfluencer;
    
    return {
      influencers: updatedInfluencers,
      currentUserInfluencer: updatedCurrentInfluencer
    };
  }),

  updateInfluencerCommissionRate: (influencerId, rate) => set((state) => {
    const updatedInfluencers = state.influencers.map(inf => 
      inf.id === influencerId 
        ? {...inf, commissionRate: rate} 
        : inf
    );
    
    // Mettre à jour l'influenceur actuel si nécessaire
    const updatedCurrentInfluencer = 
      state.currentUserInfluencer?.id === influencerId 
        ? {...state.currentUserInfluencer, commissionRate: rate}
        : state.currentUserInfluencer;
    
    return {
      influencers: updatedInfluencers,
      currentUserInfluencer: updatedCurrentInfluencer
    };
  })
});

// Export the default influencers for use in the store
export { createDefaultInfluencers };
