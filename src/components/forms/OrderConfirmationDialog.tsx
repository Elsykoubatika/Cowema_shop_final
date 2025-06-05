
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Receipt } from 'lucide-react';
import { OrderFormItem, OrderFormCustomer } from '@/types/orderForm';

interface OrderConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customer: OrderFormCustomer;
  items: OrderFormItem[];
  subtotal: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  appliedPromo?: { code: string; discount: number } | null;
  onDownloadPDF: () => void;
}

const OrderConfirmationDialog: React.FC<OrderConfirmationDialogProps> = ({
  isOpen,
  onClose,
  orderId,
  customer,
  items,
  subtotal,
  promoDiscount,
  deliveryFee,
  total,
  appliedPromo,
  onDownloadPDF
}) => {
  console.log('OrderConfirmationDialog render:', {
    isOpen,
    orderId,
    customerName: customer?.firstName,
    itemsCount: items?.length,
    total
  });

  // Objet par défaut avec toutes les propriétés requises
  const defaultCustomer: OrderFormCustomer = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    neighborhood: '',
    notes: ''
  };

  // Sécurité pour éviter les erreurs si les données sont manquantes
  const safeCustomer = customer ? { ...defaultCustomer, ...customer } : defaultCustomer;
  const safeItems = items || [];
  const displayOrderId = orderId || 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <DialogTitle className="text-xl font-semibold text-green-800">
                Commande confirmée !
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Commande #{displayOrderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status de paiement */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Receipt className="h-5 w-5" />
              <span className="font-medium">Statut: Commande non payée</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              💰 Le paiement se fera à la livraison en espèces
            </p>
          </div>

          {/* Informations client */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Informations de livraison</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nom:</span> {safeCustomer.firstName} {safeCustomer.lastName}</p>
              <p><span className="font-medium">Téléphone:</span> {safeCustomer.phone}</p>
              {safeCustomer.email && (
                <p><span className="font-medium">Email:</span> {safeCustomer.email}</p>
              )}
              <p><span className="font-medium">Adresse:</span> {safeCustomer.address}</p>
              <p><span className="font-medium">Ville:</span> {safeCustomer.city} - {safeCustomer.neighborhood}</p>
              {safeCustomer.notes && (
                <p><span className="font-medium">Notes:</span> {safeCustomer.notes}</p>
              )}
            </div>
          </div>

          {/* Articles commandés */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Articles commandés ({safeItems.length})</h4>
            <div className="space-y-2">
              {safeItems.map((item, index) => {
                const effectivePrice = item.promoPrice || item.price || 0;
                const itemTotal = effectivePrice * (item.quantity || 1);
                return (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title || 'Article'}</p>
                      <p className="text-xs text-gray-500">
                        {effectivePrice.toLocaleString()} FCFA × {item.quantity || 1}
                      </p>
                    </div>
                    <span className="font-medium">{itemTotal.toLocaleString()} FCFA</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Récapitulatif des coûts */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Récapitulatif</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{(subtotal || 0).toLocaleString()} FCFA</span>
              </div>
              {(promoDiscount || 0) > 0 && appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction ({appliedPromo.code}):</span>
                  <span>-{promoDiscount.toLocaleString()} FCFA</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frais de livraison:</span>
                <span>{(deliveryFee || 0) === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString()} FCFA`}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-lg">
                <span>Total à payer:</span>
                <span className="text-red-600">{(total || 0).toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">📞 Prochaines étapes</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Notre équipe vous contactera pour confirmer la livraison</li>
              <li>• Préparez le montant exact: {(total || 0).toLocaleString()} FCFA</li>
              <li>• Vous recevrez votre commande sous 24-48h</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onDownloadPDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le reçu PDF
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationDialog;
