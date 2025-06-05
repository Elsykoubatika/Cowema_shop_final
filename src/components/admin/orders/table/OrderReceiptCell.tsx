
import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateOrderPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';

interface OrderReceiptCellProps {
  order: any;
}

const OrderReceiptCell: React.FC<OrderReceiptCellProps> = ({ order }) => {
  const handleDownloadReceipt = async () => {
    try {
      // Préparer les données pour le PDF
      const orderData = {
        orderId: order.id,
        customer: {
          firstName: order.customer_info?.firstName || '',
          lastName: order.customer_info?.lastName || '',
          phone: order.customer_info?.phone || '',
          email: order.customer_info?.email || '',
          address: order.delivery_address?.address || order.customer_info?.address || '',
          city: order.delivery_address?.city || order.customer_info?.city || '',
          neighborhood: order.delivery_address?.neighborhood || '',
          notes: order.delivery_address?.notes || ''
        },
        items: (order.order_items || []).map((item: any) => ({
          title: item.title || 'Produit sans nom',
          price: Number(item.price_at_time) || 0,
          promoPrice: item.promo_price ? Number(item.promo_price) : null,
          quantity: Number(item.quantity) || 1
        })),
        subtotal: (order.order_items || []).reduce((sum: number, item: any) => {
          const price = item.promo_price || item.price_at_time || 0;
          const quantity = item.quantity || 1;
          return sum + (Number(price) * Number(quantity));
        }, 0),
        promoDiscount: (order.order_items || []).reduce((sum: number, item: any) => {
          if (item.promo_price && item.price_at_time && item.promo_price !== item.price_at_time) {
            const discount = (Number(item.price_at_time) - Number(item.promo_price)) * Number(item.quantity || 1);
            return sum + discount;
          }
          return sum;
        }, 0),
        deliveryFee: Number(order.delivery_fee) || 0,
        total: Number(order.total_amount) || 0,
        appliedPromo: null // À implémenter si nécessaire
      };

      // Générer le PDF
      const pdfBlob = await generateOrderPDF(orderData);
      
      // Créer le lien de téléchargement
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recu-commande-${order.id.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Reçu téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
      toast.error('Erreur lors de la génération du reçu');
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadReceipt}
        className="h-8 px-2"
        title="Télécharger le reçu PDF"
      >
        <FileText className="h-3 w-3 mr-1" />
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default OrderReceiptCell;
