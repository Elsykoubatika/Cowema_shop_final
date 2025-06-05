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
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminOrders: React.FC = () => {
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

  // Get all accessible orders
  const allOrders = getAllOrders();
  const unassignedOrders = getUnassignedOrders();
  const myOrders = getMyOrders();

  // Calculate stats
  const stats = {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    confirmed: allOrders.filter(o => o.status === 'confirmed').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    totalAmount: allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };

  const additionalStats = {
    unassigned: unassignedOrders.length,
    myOrders: myOrders.length
  };

  // Extract unique cities
  const uniqueCities = [...new Set(allOrders.map(order => 
    order.customer_info?.city || order.delivery_address?.city
  ).filter(Boolean))];

  useEffect(() => {
    refreshOrders();
  }, []);

  useEffect(() => {
    let filtered = [...allOrders];
    
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
  }, [allOrders, searchTerm, statusFilter, cityFilter]);

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
        title="Toutes les Commandes" 
        icon={<ShoppingCart className="h-6 w-6" />}
        description="Vue d'ensemble de toutes les commandes accessibles"
      />

      <div className="container mx-auto p-4 space-y-6">
        <OrdersStats stats={stats} additionalStats={additionalStats} />
        
        <OrdersHeader
          title="Gestion des commandes"
          description="Filtrez et gérez toutes les commandes"
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
            onClick={() => navigate('/admin/unassigned-orders')}
            className="flex items-center gap-2"
          >
            Commandes non assignées ({unassignedOrders.length})
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/my-orders')}
            className="flex items-center gap-2"
          >
            Mes commandes ({myOrders.length})
          </Button>
        </div>

        {/* Orders display */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p>Aucune commande trouvée</p>
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

export default AdminOrders;
