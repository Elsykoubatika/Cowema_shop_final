
import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useGlobalLoading = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: 'Chargement...',
  setLoading: (loading, message = 'Chargement...') => 
    set({ isLoading: loading, loadingMessage: message })
}));
