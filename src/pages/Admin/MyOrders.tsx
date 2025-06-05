import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import OrdersHeader from '@/components/admin/orders/OrdersHeader';
import OrdersStats from '@/components/admin/orders/OrdersStats';
import OrderCard from '@/components/admin/orders/OrderCard';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { 
    getAllOrders,
    getUnassignedOrders,
    getMyOrders,
    updateStatus,
    canManageOrder,
    isLoading,
    refreshOrders
  } = useOrderManagement();
  
  const { newOrders, hasNewOrders, clearNewOrders } = useRealtimeOrders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Get orders
  const allOrders = getAllOrders();
  const unassignedOrders = getUnassignedOrders();
  const myOrders = getMyOrders();

  console.log('MyOrders - myOrders:', myOrders.length);

  // Calculate stats specific to my orders
  const stats = {
    total: myOrders.length,
    pending: myOrders.filter(o => o.status === 'pending').length,
    confirmed: myOrders.filter(o => o.status === 'confirmed').length,
    delivered: myOrders.filter(o => o.status === 'delivered').length,
    totalAmount: myOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };

  // Extract unique cities from my orders
  const uniqueCities = [...new Set(myOrders.map(order => 
    order.customer_info?.city || order.delivery_address?.city
  ).filter(Boolean))];

  useEffect(() => {
    refreshOrders();
  }, []);

  useEffect(() => {
    let filtered = [...myOrders];
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by city
    if (cityFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderCity = order.customer_info?.city || order.delivery_address?.city;
        return orderCity?.toLowerCase() === cityFilter.toLowerCase();
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const customerName = `${order.customer_info?.firstName || ''} ${order.customer_info?.lastName || ''}`.trim();
        const customerPhone = order.customer_info?.phone || '';
        const customerEmail = order.customer_info?.email || '';
        
        return order.id.toLowerCase().includes(searchLower) ||
               customerName.toLowerCase().includes(searchLower) ||
               customerPhone.toLowerCase().includes(searchLower) ||
               customerEmail.toLowerCase().includes(searchLower);
      });
    }
    
    // Sort by date (most recent first)
    filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setFilteredOrders(filtered);
  }, [myOrders, searchTerm, statusFilter, cityFilter]);

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(orderId);
      await updateStatus(orderId, newStatus);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleContactWhatsApp = (order: any) => {
    const phone = order.customer_info?.phone?.replace(/\D/g, '');
    const customerName = order.customer_info?.firstName || 'Client';
    const message = encodeURIComponent(`Bonjour ${customerName}, concernant votre commande #${order.id.substring(0, 8)}...`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleClearNewOrders = () => {
    clearNewOrders();
    refreshOrders();
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title="Mes Commandes" 
        icon={<User className="h-6 w-6" />}
        description="Commandes qui vous sont assignées"
      />

      <div className="container mx-auto p-4 space-y-6">
        <OrdersStats stats={stats} />
        
        <OrdersHeader
          title="Mes commandes assignées"
          description="Gérez les commandes qui vous sont attribuées"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          uniqueCities={uniqueCities}
          onRefresh={refreshOrders}
          isLoading={isLoading}
          hasNewOrders={hasNewOrders}
          newOrdersCount={newOrders.length}
          onClearNewOrders={handleClearNewOrders}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Quick navigation */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2"
          >
            Toutes les commandes ({allOrders.length})
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/unassigned-orders')}
            className="flex items-center gap-2"
          >
            Commandes non assignées ({unassignedOrders.length})
          </Button>
        </div>

        {/* Orders display */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Chargement de vos commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p>Aucune commande assignée trouvée</p>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/unassigned-orders')}
              className="mt-4"
            >
              Voir les commandes non assignées
            </Button>
          </div>
        ) : viewMode === 'table' ? (
          <OrdersTable
            orders={filteredOrders}
            onView={handleViewOrder}
            onStatusChange={handleStatusChange}
            onContactWhatsApp={handleContactWhatsApp}
            canManage={canManageOrder}
            isUpdating={isUpdating}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleViewOrder}
                onStatusChange={handleStatusChange}
                onContactWhatsApp={handleContactWhatsApp}
                canManage={canManageOrder(order)}
                isAssigning={isUpdating === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default MyOrders;
