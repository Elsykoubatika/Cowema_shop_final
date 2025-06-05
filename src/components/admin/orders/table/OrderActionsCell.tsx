
import React from 'react';
import { MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OrderActionsCellProps {
  order: any;
  onView: (orderId: string) => void;
  onContactWhatsApp: (order: any) => void;
}

const OrderActionsCell: React.FC<OrderActionsCellProps> = ({
  order,
  onView,
  onContactWhatsApp
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/admin/orders/${order.id}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
        className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300"
        title="Voir les détails de la commande"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onContactWhatsApp(order)}
        className="text-green-600 hover:text-green-700 hover:border-green-300"
        title="Contacter via WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderActionsCell;
