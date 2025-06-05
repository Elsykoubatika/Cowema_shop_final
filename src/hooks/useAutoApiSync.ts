
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useAutoApiSync = () => {
  const [isLoading, setIsLoading] = useState(false);

  const syncApiData = async (): Promise<SyncResult> => {
    try {
      setIsLoading(true);
      console.log('Triggering product synchronization...');

      const { data, error } = await supabase.functions.invoke('sync-products', {
        body: {}
      });

      if (error) {
        console.error('Sync function error:', error);
        throw new Error(error.message || 'Erreur lors de la synchronisation');
      }

      console.log('Sync completed successfully:', data);
      
      if (data.stats) {
        console.log(`Synchronized ${data.stats.total_fetched} products across ${data.stats.pages_fetched} pages`);
        toast.success(`${data.stats.total_fetched} produits synchronisés avec succès!`);
      }

      return data;
    } catch (error) {
      console.error('Sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur de synchronisation: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    syncApiData,
    isLoading
  };
};
