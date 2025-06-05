
import { StateCreator } from 'zustand';
import { InfluencerState, InfluencerStatus } from '../../types/influencer';
import { generateReferralCode, generateReferralLink } from '../../utils/influencerUtils';

// Slice pour gérer les candidatures d'influenceurs
export const createApplicationSlice: StateCreator<
  InfluencerState,
  [],
  [],
  Pick<InfluencerState, 'submitApplication' | 'approveApplication' | 'rejectApplication'>
> = (set, get) => ({
  submitApplication: (applicationData) => set((state) => {
    const newApplication = {
      ...applicationData,
      id: `app-${Date.now()}`,
      status: 'pending' as InfluencerStatus,
      submittedAt: new Date().toISOString(),
    };
    
    return {
      applications: [...state.applications, newApplication],
      currentUserApplication: applicationData.userId ? newApplication : state.currentUserApplication
    };
  }),
  
  approveApplication: (id, adminId, commissionRate) => set((state) => {
    const application = state.applications.find(app => app.id === id);
    
    if (!application) return state;
    
    const updatedApplications = state.applications.map(app => 
      app.id === id 
        ? { ...app, status: 'approved' as InfluencerStatus, reviewedAt: new Date().toISOString(), reviewedBy: adminId } 
        : app
    );
    
    const referralCode = generateReferralCode();
    
    const newInfluencer = {
      id: `inf-${Date.now()}`,
      applicationId: application.id,
      userId: application.userId,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      city: application.city,
      yearsOfExperience: application.yearsOfExperience,
      socialNetworks: application.socialNetworks,
      referralCode: referralCode,
      referralLink: generateReferralLink(referralCode),
      commissionRate: commissionRate,
      commissions: [],
      totalEarned: 0,
      totalPaid: 0,
      createdAt: new Date().toISOString()
    };
    
    // Mettre à jour l'influenceur actuel si l'utilisateur est connecté
    const updatedCurrentInfluencer = 
      application.userId && state.currentUserApplication?.id === id 
        ? newInfluencer 
        : state.currentUserInfluencer;
    
    return {
      applications: updatedApplications,
      influencers: [...state.influencers, newInfluencer],
      currentUserApplication: state.currentUserApplication?.id === id 
        ? { ...state.currentUserApplication, status: 'approved' as InfluencerStatus } 
        : state.currentUserApplication,
      currentUserInfluencer: updatedCurrentInfluencer
    };
  }),
  
  rejectApplication: (id, adminId) => set((state) => ({
    applications: state.applications.map(app => 
      app.id === id 
        ? { ...app, status: 'rejected' as InfluencerStatus, reviewedAt: new Date().toISOString(), reviewedBy: adminId } 
        : app
    ),
    currentUserApplication: state.currentUserApplication?.id === id 
      ? { ...state.currentUserApplication, status: 'rejected' as InfluencerStatus } 
      : state.currentUserApplication
  })),
});
