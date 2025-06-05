
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import OrderInfoCard from '@/components/admin/orders/details/OrderInfoCard';
import CustomerInfoCard from '@/components/admin/orders/details/CustomerInfoCard';
import OrderItemsList from '@/components/admin/orders/details/OrderItemsList';
import OrderStatusBadge from '@/components/admin/orders/details/OrderStatusBadge';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAllOrders } = useOrderManagement();

  const order = getAllOrders().find(o => o.id === id);

  console.log('📊 OrderDetails - Order found:', order ? {
    id: order.id.substring(0, 8),
    itemsCount: order.order_items?.length || 0,
    items: order.order_items?.map(item => ({
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      price: item.price_at_time
    })) || []
  } : 'Order not found');

  if (!order) {
    return (
      <AdminPageLayout>
        <div className="container mx-auto p-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Commande non trouvée</h2>
            <Button onClick={() => navigate('/admin/orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Button>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  const orderItems = order.order_items || [];
  const totalQuantity = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = orderItems.reduce((sum, item) => {
    const price = item.promo_price || item.price_at_time || 0;
    return sum + (price * (item.quantity || 0));
  }, 0);

  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title={`Commande #${order.id.substring(0, 8)}`}
        icon={<Package className="h-6 w-6" />}
        description="Détails complets de la commande"
      />

      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/orders')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux commandes
          </Button>
          
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderInfoCard order={order} totalQuantity={totalQuantity} />
          <CustomerInfoCard order={order} />
        </div>

        <OrderItemsList 
          orderItems={orderItems} 
          totalQuantity={totalQuantity} 
          subtotal={subtotal} 
          order={order} 
        />
      </div>
    </AdminPageLayout>
  );
};

export default OrderDetails;
