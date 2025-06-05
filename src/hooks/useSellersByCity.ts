
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from './useUnifiedAuth';

interface Seller {
  id: string;
  nom: string;
  city: string;
  role: string;
}

export const useSellersByCity = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUnifiedAuth();

  const fetchSellersByCity = async (city: string) => {
    if (!user || !['admin', 'sales_manager', 'team_lead'].includes(user.role)) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nom, city, role')
        .in('role', ['seller', 'team_lead'])
        .eq('city', city);

      if (error) {
        console.error('Error fetching sellers:', error);
        setSellers([]);
      } else {
        setSellers(data || []);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    sellers,
    loading,
    fetchSellersByCity
  };
};
