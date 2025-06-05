
import { StateCreator } from 'zustand';
import { InfluencerState } from '../../types/influencer';

// Slice pour gérer l'influenceur actuel
export const createUserSlice: StateCreator<
  InfluencerState,
  [],
  [],
  Pick<InfluencerState, 'setCurrentUserApplication' | 'setCurrentUserInfluencer'>
> = (set, get) => ({
  setCurrentUserApplication: (userId) => set((state) => {
    const application = state.applications.find(app => app.userId === userId);
    return { currentUserApplication: application || null };
  }),
  
  setCurrentUserInfluencer: (userId) => {
    // Si userId est en fait un objet influenceur, l'utiliser directement
    if (typeof userId === 'object' && userId !== null) {
      set({ currentUserInfluencer: userId });
      return;
    }
    
    // Sinon, chercher par userId
    set((state) => {
      const influencer = state.influencers.find(inf => inf.userId === userId);
      return { currentUserInfluencer: influencer || null };
    });
  }
});
