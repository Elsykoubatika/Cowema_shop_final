import { useEffect } from 'react';
import { useSupabaseOrders } from './useSupabaseOrders';
import { useSupabaseCustomers } from './useSupabaseCustomers';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerOrderSync = () => {
  const { orders } = useSupabaseOrders();
  const { refetch: refetchCustomers } = useSupabaseCustomers();

  useEffect(() => {
    const syncCustomerData = async () => {
      if (!orders || orders.length === 0) {
        console.log('⚠️ Aucune commande à synchroniser');
        return;
      }

      console.log('🔄 Synchronisation des données clients avec les commandes...');
      console.log('📊 Nombre de commandes à traiter:', orders.length);

      // Grouper les commandes par numéro de téléphone
      const customerOrderData = new Map();

      orders.forEach(order => {
        const customerInfo = order.customer_info;
        if (!customerInfo?.phone) return;

        const phone = customerInfo.phone;
        const existingData = customerOrderData.get(phone) || {
          firstName: customerInfo.firstName || customerInfo.first_name || '',
          lastName: customerInfo.lastName || customerInfo.last_name || '',
          email: customerInfo.email || '',
          phone: phone,
          city: customerInfo.city || order.delivery_address?.city || '',
          address: customerInfo.address || order.delivery_address?.address || '',
          totalSpent: 0,
          orderCount: 0,
          lastOrderDate: null,
          primaryVendor: null
        };

        existingData.totalSpent += order.total_amount || 0;
        existingData.orderCount += 1;
        
        const orderDate = new Date(order.created_at);
        if (!existingData.lastOrderDate || orderDate > new Date(existingData.lastOrderDate)) {
          existingData.lastOrderDate = order.created_at;
        }

        // Déterminer le vendeur principal (celui qui a le plus de commandes assignées)
        if (order.assigned_to) {
          if (!existingData.vendorOrders) {
            existingData.vendorOrders = {};
          }
          
          if (!existingData.vendorOrders[order.assigned_to]) {
            existingData.vendorOrders[order.assigned_to] = {
              orderCount: 0,
              totalSpent: 0
            };
          }
          
          existingData.vendorOrders[order.assigned_to].orderCount += 1;
          existingData.vendorOrders[order.assigned_to].totalSpent += order.total_amount || 0;
          
          // Mettre à jour le vendeur principal
          let maxOrders = 0;
          let primaryVendor = null;
          
          Object.entries(existingData.vendorOrders).forEach(([vendorId, data]: [string, any]) => {
            if (data.orderCount > maxOrders) {
              maxOrders = data.orderCount;
              primaryVendor = vendorId;
            }
          });
          
          existingData.primaryVendor = primaryVendor;
        }

        customerOrderData.set(phone, existingData);
      });

      console.log(`📊 ${customerOrderData.size} clients uniques trouvés dans les commandes`);

      // Mettre à jour ou créer les clients dans la base de données
      for (const [phone, customerData] of customerOrderData) {
        try {
          // Vérifier si le client existe déjà
          const { data: existingCustomer, error: fetchError } = await supabase
            .from('crm_customers')
            .select('*')
            .eq('phone', phone)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('❌ Erreur lors de la récupération du client:', fetchError);
            continue;
          }

          if (existingCustomer) {
            // Mettre à jour le client existant
            const updateData: any = {
              total_spent: customerData.totalSpent,
              order_count: customerData.orderCount,
              last_order_date: customerData.lastOrderDate,
              updated_at: new Date().toISOString()
            };

            // Mettre à jour le vendeur principal si on en a un
            if (customerData.primaryVendor) {
              updateData.primary_vendor = customerData.primaryVendor;
            }

            // Mettre à jour les informations manquantes
            if (!existingCustomer.first_name && customerData.firstName) {
              updateData.first_name = customerData.firstName;
            }
            if (!existingCustomer.last_name && customerData.lastName) {
              updateData.last_name = customerData.lastName;
            }
            if (!existingCustomer.email && customerData.email) {
              updateData.email = customerData.email;
            }
            if (!existingCustomer.city && customerData.city) {
              updateData.city = customerData.city;
            }
            if (!existingCustomer.address && customerData.address) {
              updateData.address = customerData.address;
            }

            const { error: updateError } = await supabase
              .from('crm_customers')
              .update(updateData)
              .eq('id', existingCustomer.id);

            if (updateError) {
              console.error('❌ Erreur lors de la mise à jour du client:', updateError);
            } else {
              console.log(`✅ Client mis à jour: ${customerData.firstName} ${customerData.lastName} (${customerData.orderCount} commandes, ${customerData.totalSpent} FCFA)`);
            }
          } else {
            // Créer un nouveau client
            const insertData = {
              first_name: customerData.firstName,
              last_name: customerData.lastName,
              email: customerData.email,
              phone: customerData.phone,
              city: customerData.city,
              address: customerData.address,
              total_spent: customerData.totalSpent,
              order_count: customerData.orderCount,
              last_order_date: customerData.lastOrderDate,
              primary_vendor: customerData.primaryVendor
            };

            const { error: insertError } = await supabase
              .from('crm_customers')
              .insert(insertData);

            if (insertError) {
              console.error('❌ Erreur lors de la création du client:', insertError);
            } else {
              console.log(`🆕 Nouveau client créé: ${customerData.firstName} ${customerData.lastName} (${customerData.orderCount} commandes, ${customerData.totalSpent} FCFA)`);
            }
          }
        } catch (error) {
          console.error('❌ Erreur lors de la synchronisation du client:', error);
        }
      }

      console.log('✅ Synchronisation des clients terminée');
      
      // Rafraîchir les données des clients
      refetchCustomers();
    };

    if (orders && orders.length > 0) {
      console.log('🚀 Démarrage de la synchronisation avec', orders.length, 'commandes');
      syncCustomerData();
    }
  }, [orders, refetchCustomers]);

  return null;
};
