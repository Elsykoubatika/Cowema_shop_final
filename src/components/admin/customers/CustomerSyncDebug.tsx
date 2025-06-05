
import React from 'react';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import { useSupabaseCustomers } from '@/hooks/useSupabaseCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerSyncDebug: React.FC = () => {
  const { orders, isLoading: ordersLoading } = useSupabaseOrders();
  const { customers, isLoading: customersLoading } = useSupabaseCustomers();

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800">🔧 Debug - Synchronisation Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Commandes:</strong> {ordersLoading ? 'Chargement...' : `${orders?.length || 0} commandes`}
          </div>
          <div>
            <strong>Clients:</strong> {customersLoading ? 'Chargement...' : `${customers?.length || 0} clients`}
          </div>
          {orders && orders.length > 0 && (
            <div>
              <strong>Exemple de commande:</strong>
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(orders[0]?.customer_info, null, 2)}
              </pre>
            </div>
          )}
          {customers && customers.length > 0 && (
            <div>
              <strong>Exemple de client:</strong>
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                {JSON.stringify({
                  firstName: customers[0]?.firstName,
                  lastName: customers[0]?.lastName,
                  phone: customers[0]?.phone,
                  city: customers[0]?.city
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSyncDebug;
