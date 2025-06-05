
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InfluencerState } from '../types/influencer';
import { createApplicationSlice } from '../store/influencer/applicationSlice';
import { createInfluencerSlice, createDefaultInfluencers } from '../store/influencer/influencerSlice';
import { createUserSlice } from '../store/influencer/userSlice';

// Re-export types from the types file for backwards compatibility
export type { InfluencerStatus, Commission, InfluencerApplication, Influencer } from '../types/influencer';

// Créer le store influenceur en combinant les slices
export const useInfluencerStore = create<InfluencerState>()(
  persist(
    (...a) => ({
      // State initial avec des données par défaut
      applications: [],
      influencers: createDefaultInfluencers(),
      currentUserApplication: null,
      currentUserInfluencer: null,
      
      // Combiner tous les slices
      ...createApplicationSlice(...a),
      ...createInfluencerSlice(...a),
      ...createUserSlice(...a),
    }),
    {
      name: 'cowema-influencer-store'
    }
  )
);
