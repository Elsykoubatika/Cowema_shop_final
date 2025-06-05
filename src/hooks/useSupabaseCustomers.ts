
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  city: string;
  address?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string;
  primaryVendor?: string;
  preferredCategories?: Record<string, number>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const useSupabaseCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    try {
      console.log('🔄 Récupération des clients...');
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crm_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching customers:', error);
        toast.error('Erreur lors du chargement des clients');
        return;
      }

      console.log('📊 Données brutes récupérées:', data?.length || 0, 'clients');

      const formattedCustomers: Customer[] = (data || []).map(customer => ({
        id: customer.id,
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        email: customer.email,
        phone: customer.phone || '',
        city: customer.city || '',
        address: customer.address,
        totalSpent: Number(customer.total_spent) || 0,
        orderCount: customer.order_count || 0,
        lastOrderDate: customer.last_order_date,
        primaryVendor: customer.primary_vendor,
        preferredCategories: customer.preferred_categories as Record<string, number> || {},
        notes: customer.notes,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      }));

      console.log('✅ Clients formatés:', formattedCustomers.length);
      console.log('📋 Premier client exemple:', formattedCustomers[0]);
      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('❌ Error in fetchCustomers:', error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add new customer
  const addCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orderCount'>): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('crm_customers')
        .insert({
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          city: customerData.city,
          address: customerData.address,
          primary_vendor: customerData.primaryVendor,
          preferred_categories: customerData.preferredCategories || {},
          notes: customerData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        toast.error('Erreur lors de l\'ajout du client');
        return null;
      }

      const newCustomer: Customer = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        totalSpent: 0,
        orderCount: 0,
        primaryVendor: data.primary_vendor,
        preferredCategories: data.preferred_categories as Record<string, number> || {},
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setCustomers(prev => [newCustomer, ...prev]);
      toast.success('Client ajouté avec succès');
      return newCustomer;
    } catch (error) {
      console.error('Error in addCustomer:', error);
      toast.error('Erreur lors de l\'ajout du client');
      return null;
    }
  }, []);

  // Update customer
  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_customers')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email: updates.email,
          phone: updates.phone,
          city: updates.city,
          address: updates.address,
          total_spent: updates.totalSpent,
          order_count: updates.orderCount,
          last_order_date: updates.lastOrderDate,
          primary_vendor: updates.primaryVendor,
          preferred_categories: updates.preferredCategories,
          notes: updates.notes
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating customer:', error);
        toast.error('Erreur lors de la mise à jour du client');
        return false;
      }

      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      ));

      toast.success('Client mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      toast.error('Erreur lors de la mise à jour du client');
      return false;
    }
  }, []);

  // Delete customer
  const deleteCustomer = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        toast.error('Erreur lors de la suppression du client');
        return false;
      }

      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast.success('Client supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      toast.error('Erreur lors de la suppression du client');
      return false;
    }
  }, []);

  // Get customers by city
  const getCustomersByCity = useCallback((city: string): Customer[] => {
    return customers.filter(customer => 
      customer.city.toLowerCase() === city.toLowerCase()
    );
  }, [customers]);

  // Get customers by vendor
  const getCustomersByVendor = useCallback((vendorId: string): Customer[] => {
    return customers.filter(customer => customer.primaryVendor === vendorId);
  }, [customers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomersByCity,
    getCustomersByVendor,
    refetch: fetchCustomers
  };
};
