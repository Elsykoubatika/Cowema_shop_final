
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-purple-100 text-purple-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};

export const calculateOrderMetrics = (orderItems: any[]) => {
  const totalItems = orderItems.length;
  const totalQuantity = orderItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalDiscount = orderItems.reduce((sum: number, item: any) => {
    if (item.promo_price && item.price_at_time) {
      return sum + ((item.price_at_time - item.promo_price) * item.quantity);
    }
    return sum;
  }, 0);

  return { totalItems, totalQuantity, totalDiscount };
};
