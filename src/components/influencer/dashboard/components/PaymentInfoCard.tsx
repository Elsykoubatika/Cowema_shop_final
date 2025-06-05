
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, DollarSign, Calendar, CreditCard, Clock } from 'lucide-react';

const PaymentInfoCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 text-lg mb-2">📋 Comment fonctionnent les paiements ?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span>Minimum : 10 000 FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Paiements mensuels automatiques</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>Virement bancaire ou mobile money</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Traitement sous 3-5 jours ouvrés</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
