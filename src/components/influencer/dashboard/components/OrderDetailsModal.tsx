
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, User, MapPin, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { Order } from '@/hooks/influencer/useInfluencerOrders';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const commission = Math.round(order.total_amount * 0.05);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            Détails de la commande #{order.id.slice(-8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Calendar className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="font-bold text-lg">{order.total_amount.toLocaleString()} FCFA</p>
                </div>
                <div className="text-center">
                  <Package className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Articles</p>
                  <p className="font-medium">{order.order_items.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Statut</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status === 'delivered' ? 'Livrée' : 
                     order.status === 'shipped' ? 'Expédiée' :
                     order.status === 'processing' ? 'En cours' : 'En attente'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          {order.customer_info && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Informations client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">{order.customer_info.firstName} {order.customer_info.lastName}</p>
                  </div>
                  {order.customer_info.phone && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Téléphone
                      </p>
                      <p className="font-medium">{order.customer_info.phone}</p>
                    </div>
                  )}
                  {order.customer_info.email && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </p>
                      <p className="font-medium">{order.customer_info.email}</p>
                    </div>
                  )}
                  {order.delivery_address && (
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Adresse de livraison
                      </p>
                      <p className="font-medium">
                        {order.delivery_address.address}, {order.delivery_address.city}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Articles commandés */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Articles commandés
              </h3>
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={item.id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(item.promo_price || item.price_at_time).toLocaleString()} FCFA
                      </p>
                      {item.promo_price && item.promo_price < item.price_at_time && (
                        <p className="text-xs text-gray-500 line-through">
                          {item.price_at_time.toLocaleString()} FCFA
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commission */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-green-800 mb-2">💰 Votre commission</h3>
                <p className="text-3xl font-bold text-green-700">
                  +{commission.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-green-600 mt-1">
                  (5% de {order.total_amount.toLocaleString()} FCFA)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">Notes</h3>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
