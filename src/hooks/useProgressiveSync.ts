
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProgressInfo {
  currentPage: number;
  totalPages: number;
  loadedProducts: number;
  isComplete: boolean;
}

interface SyncResult {
  success: boolean;
  message?: string;
  stats?: {
    total_fetched: number;
    processed: number;
    errors: number;
    pages_fetched: number;
    timestamp: string;
  };
  error?: string;
}

export const useProgressiveSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo>({
    currentPage: 0,
    totalPages: 0,
    loadedProducts: 0,
    isComplete: false
  });

  const startProgressiveSync = useCallback(async (): Promise<SyncResult> => {
    try {
      setIsLoading(true);
      setProgress({
        currentPage: 0,
        totalPages: 0,
        loadedProducts: 0,
        isComplete: false
      });

      console.log('Starting progressive product synchronization...');

      const { data, error } = await supabase.functions.invoke('sync-products', {
        body: {}
      });

      if (error) {
        console.error('Progressive sync function error:', error);
        throw new Error(error.message || 'Erreur lors de la synchronisation progressive');
      }

      console.log('Progressive sync completed:', data);
      
      // Mark as complete
      setProgress(prev => ({
        ...prev,
        isComplete: true
      }));

      if (data.stats) {
        toast.success(`${data.stats.total_fetched} produits synchronisés progressivement avec succès!`);
      }

      return data;
    } catch (error) {
      console.error('Progressive sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur de synchronisation progressive: ${errorMessage}`);
      
      setProgress(prev => ({
        ...prev,
        isComplete: true
      }));
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    startProgressiveSync,
    isLoading,
    progress
  };
};
