
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, Package, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Commission } from '@/hooks/influencer/useInfluencerCommissions';

interface CommissionDetailsModalProps {
  commission: Commission | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommissionDetailsModal: React.FC<CommissionDetailsModalProps> = ({ commission, isOpen, onClose }) => {
  if (!commission) return null;

  const getStatusColor = (paid: boolean) => {
    return paid 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const commissionRate = ((commission.amount / commission.productTotal) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-600" />
            Détails de la commission #{commission.id.slice(-8)}
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
                    {new Date(commission.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-center">
                  <Package className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Vente totale</p>
                  <p className="font-bold text-lg">{commission.productTotal.toLocaleString()} FCFA</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Taux commission</p>
                  <p className="font-medium">{commissionRate.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Statut</p>
                  <Badge className={getStatusColor(commission.paid)}>
                    {commission.paid ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Payée
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission gagnée */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-green-800 mb-2 flex items-center justify-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Votre commission
                </h3>
                <p className="text-4xl font-bold text-green-700 mb-2">
                  +{commission.amount.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-green-600">
                  {commissionRate.toFixed(1)}% de {commission.productTotal.toLocaleString()} FCFA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur la commande */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Informations sur la commande
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID de commande</p>
                  <p className="font-medium">{commission.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date de la vente</p>
                  <p className="font-medium">
                    {new Date(commission.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant de la vente</p>
                  <p className="font-medium">{commission.productTotal.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de commission</p>
                  <p className="font-medium">{commissionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut du paiement */}
          <Card className={commission.paid ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                  {commission.paid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Commission payée</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="text-yellow-800">En attente de paiement</span>
                    </>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {commission.paid 
                    ? "Cette commission a été traitée et payée dans votre compte."
                    : "Cette commission sera incluse dans votre prochain paiement mensuel."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommissionDetailsModal;
