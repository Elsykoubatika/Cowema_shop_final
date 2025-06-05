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
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UnassignedOrders: React.FC = () => {
  const navigate = useNavigate();
  const { 
    getAllOrders,
    getUnassignedOrders, 
    getMyOrders,
    assignToSelf,
    canAssignOrderToSelf,
    isLoading,
    refreshOrders
  } = useOrderManagement();
  
  const { newOrders, hasNewOrders, clearNewOrders } = useRealtimeOrders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [assigningOrders, setAssigningOrders] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Get orders
  const allOrders = getAllOrders();
  const unassignedOrders = getUnassignedOrders();
  const myOrders = getMyOrders();

  console.log('UnassignedOrders - unassignedOrders:', unassignedOrders.length);

  // Calculate stats specific to unassigned orders
  const stats = {
    total: unassignedOrders.length,
    pending: unassignedOrders.filter(o => o.status === 'pending').length,
    confirmed: unassignedOrders.filter(o => o.status === 'confirmed').length,
    delivered: unassignedOrders.filter(o => o.status === 'delivered').length,
    totalAmount: unassignedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };

  // Extract unique cities from unassigned orders
  const uniqueCities = [...new Set(unassignedOrders.map(order => 
    order.customer_info?.city || order.delivery_address?.city
  ).filter(Boolean))];

  useEffect(() => {
    refreshOrders();
  }, []);

  useEffect(() => {
    let filtered = [...unassignedOrders];
    
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
  }, [unassignedOrders, searchTerm, cityFilter]);

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleAssignToSelf = async (orderId: string) => {
    setAssigningOrders(prev => new Set([...prev, orderId]));
    try {
      const success = await assignToSelf(orderId);
      if (success) {
        await refreshOrders();
      }
    } catch (error) {
      console.error('Error assigning order:', error);
    } finally {
      setAssigningOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
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
        title="Commandes Non Assignées" 
        icon={<ClipboardList className="h-6 w-6" />}
        description="Commandes en attente d'attribution à un vendeur"
      />

      <div className="container mx-auto p-4 space-y-6">
        <OrdersStats stats={stats} />
        
        <OrdersHeader
          title="Commandes à assigner"
          description="Attribuez-vous des commandes pour les traiter"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter="all"
          onStatusFilterChange={() => {}}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          uniqueCities={uniqueCities}
          onRefresh={refreshOrders}
          isLoading={isLoading}
          hasNewOrders={hasNewOrders}
          newOrdersCount={newOrders.length}
          onClearNewOrders={handleClearNewOrders}
          showFilters={false}
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
            <p>Aucune commande non assignée trouvée</p>
          </div>
        ) : viewMode === 'table' ? (
          <OrdersTable
            orders={filteredOrders}
            onView={handleViewOrder}
            onStatusChange={() => {}} // Pas de changement de statut pour les non-assignées
            onContactWhatsApp={handleContactWhatsApp}
            canManage={() => false} // Pas de gestion pour les non-assignées
            isUpdating={null}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleViewOrder}
                onAssignToSelf={handleAssignToSelf}
                onContactWhatsApp={handleContactWhatsApp}
                canAssignToSelf={canAssignOrderToSelf(order)}
                isAssigning={assigningOrders.has(order.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default UnassignedOrders;
