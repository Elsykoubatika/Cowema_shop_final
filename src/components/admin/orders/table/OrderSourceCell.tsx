
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateOrderPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';

interface OrderSourceCellProps {
  order: any;
}

const OrderSourceCell: React.FC<OrderSourceCellProps> = ({ order }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Déterminer la source de la commande
  const isWhatsAppOrder = order.customer_info?.phone?.includes('whatsapp') || 
    order.customer_info?.isWhatsApp || 
    order.notes?.toLowerCase().includes('whatsapp');
  
  const source = isWhatsAppOrder ? 'whatsapp' : 'directe';
  
  // Générer le message WhatsApp pour cette commande
  const generateWhatsAppMessage = () => {
    const customerName = `${order.customer_info?.firstName || ''} ${order.customer_info?.lastName || ''}`.trim() || 'Client';
    const orderItems = order.order_items || [];
    const total = order.total_amount || 0;
    
    let message = `🛒 *Nouvelle commande COWEMA*\n\n`;
    message += `👤 *Client:* ${customerName}\n`;
    message += `📞 *Téléphone:* ${order.customer_info?.phone || 'Non spécifié'}\n`;
    message += `📍 *Adresse:* ${order.delivery_address?.address || order.customer_info?.address || 'Non spécifiée'}\n`;
    message += `🏙️ *Ville:* ${order.delivery_address?.city || order.customer_info?.city || 'Non spécifiée'}\n\n`;
    
    message += `📦 *Articles commandés:*\n`;
    orderItems.forEach((item: any, index: number) => {
      const price = item.promo_price || item.price_at_time || 0;
      const quantity = item.quantity || 1;
      message += `${index + 1}. ${item.title || 'Produit'} x${quantity} - ${(price * quantity).toLocaleString()} FCFA\n`;
    });
    
    if (order.delivery_fee) {
      message += `\n🚚 *Frais de livraison:* ${order.delivery_fee.toLocaleString()} FCFA`;
    }
    
    message += `\n💰 *Total:* ${total.toLocaleString()} FCFA\n\n`;
    message += `📋 *N° Commande:* #${order.id.substring(0, 8)}\n`;
    message += `📅 *Date:* ${new Date(order.created_at).toLocaleDateString('fr-FR')}\n\n`;
    message += `Merci pour votre confiance ! 🙏`;
    
    return message;
  };

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
        appliedPromo: null
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
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
      toast.error('Erreur lors de la génération du reçu');
    }
  };

  const renderDialogContent = () => {
    if (isWhatsAppOrder) {
      const whatsappMessage = generateWhatsAppMessage();
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Message WhatsApp généré pour cette commande:
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm font-mono text-green-800">
              {whatsappMessage}
            </pre>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(whatsappMessage);
                toast.success('Message copié dans le presse-papiers');
              }}
              size="sm"
            >
              Copier le message
            </Button>
            <Button
              onClick={() => {
                const phone = order.customer_info?.phone?.replace(/\D/g, '');
                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
              }}
              size="sm"
              variant="outline"
            >
              Envoyer sur WhatsApp
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Commande directe - Vous pouvez télécharger le reçu non payé:
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Reçu de commande</div>
                <div className="text-sm text-gray-600">
                  Commande #{order.id.substring(0, 8)} - {order.total_amount?.toLocaleString()} FCFA
                </div>
              </div>
              <Button onClick={handleDownloadReceipt} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2">
            {isWhatsAppOrder ? (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3 text-green-600" />
                <Badge className="bg-green-100 text-green-800 border-green-200 px-1 py-0 text-xs">
                  WhatsApp
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-1 py-0 text-xs">
                  Directe
                </Badge>
              </div>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isWhatsAppOrder ? (
                <>
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Message WhatsApp - Commande #{order.id.substring(0, 8)}
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 text-blue-600" />
                  Reçu - Commande #{order.id.substring(0, 8)}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderSourceCell;
