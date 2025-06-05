
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentMethod {
  id: string;
  method_name: string;
  provider?: string;
  is_active: boolean;
  config: any;
  fees: any;
  created_at: string;
  updated_at: string;
}

export const usePaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('method_name', { ascending: true });

      if (error) throw error;
      setMethods(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des méthodes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setMethods(prev => prev.map(method => 
        method.id === id ? { ...method, ...updates } : method
      ));

      toast({
        title: "Méthode mise à jour",
        description: "Les modifications ont été enregistrées.",
      });
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la méthode.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  return {
    methods,
    loading,
    error,
    fetchMethods,
    updateMethod
  };
};
