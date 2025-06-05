
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle, CreditCard, Building, Smartphone } from 'lucide-react';
import { PayoutRequest, PaymentHistory } from '@/hooks/influencer/useInfluencerPayoutRequests';

interface PaymentHistoryListProps {
  payoutRequests: PayoutRequest[];
  paymentHistory: PaymentHistory[];
}

const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({ 
  payoutRequests, 
  paymentHistory 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'approved':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className="h-4 w-4" />;
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'cash':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Virement bancaire';
      case 'mobile_money':
        return 'Mobile Money';
      case 'cash':
        return 'Espèces';
      default:
        return method;
    }
  };

  // Combiner les demandes de paiement et l'historique des paiements
  const allTransactions = [
    ...paymentHistory.map(payment => ({
      id: payment.id,
      type: 'payment' as const,
      amount: payment.amount,
      date: payment.payment_date,
      status: 'paid',
      payment_method: payment.payment_method,
      reference: payment.payment_reference
    })),
    ...payoutRequests.map(request => ({
      id: request.id,
      type: 'request' as const,
      amount: request.amount,
      date: request.requested_at,
      status: request.status,
      payment_method: request.payment_method,
      admin_notes: request.admin_notes
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">Aucune transaction pour le moment</p>
        <p className="text-sm text-gray-500 mt-1">
          Vos demandes de paiement et paiements reçus apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {allTransactions.map((transaction) => (
        <Card key={transaction.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getPaymentMethodIcon(transaction.payment_method)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'payment' ? 'Paiement reçu' : 'Demande de paiement'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getPaymentMethodText(transaction.payment_method)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  {transaction.amount.toLocaleString()} FCFA
                </p>
                <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1 px-2 py-1 mt-1`}>
                  {getStatusIcon(transaction.status)}
                  <span className="text-xs font-medium">
                    {getStatusText(transaction.status)}
                  </span>
                </Badge>
                {transaction.type === 'payment' && transaction.reference && (
                  <p className="text-xs text-gray-500 mt-1">
                    Réf: {transaction.reference}
                  </p>
                )}
              </div>
            </div>
            
            {transaction.type === 'request' && transaction.admin_notes && (
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Note admin:</strong> {transaction.admin_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentHistoryList;
