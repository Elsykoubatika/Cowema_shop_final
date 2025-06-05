
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Package, CheckCircle, Clock, Eye } from 'lucide-react';
import { Commission } from '@/hooks/influencer/useInfluencerCommissions';
import CommissionDetailsModal from './CommissionDetailsModal';

interface CommissionsHistoryCardProps {
  commissions: Commission[];
}

const CommissionsHistoryCard: React.FC<CommissionsHistoryCardProps> = ({ commissions }) => {
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);

  const getStatusColor = (paid: boolean) => {
    return paid 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusIcon = (paid: boolean) => {
    return paid ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
  };

  const getStatusText = (paid: boolean) => {
    return paid ? 'Payée' : 'En attente';
  };

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Historique des commissions
          </CardTitle>
          <CardDescription className="text-gray-600">
            Vos {commissions.length} dernières commissions générées
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {commissions.slice(0, 15).map((commission, index) => (
              <div
                key={commission.id || index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Commission - Commande {commission.orderId?.slice(-8) || `CMD-${index + 1}`}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(commission.date || Date.now()).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>Vente: {commission.productTotal.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      +{commission.amount.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500">
                      Commission ({((commission.amount / commission.productTotal) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      className={`${getStatusColor(commission.paid)} flex items-center gap-1 px-3 py-1`}
                    >
                      {getStatusIcon(commission.paid)}
                      <span className="text-xs font-medium">
                        {getStatusText(commission.paid)}
                      </span>
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCommission(commission)}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {commissions.length > 15 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Et {commissions.length - 15} autres commissions...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CommissionDetailsModal
        commission={selectedCommission}
        isOpen={!!selectedCommission}
        onClose={() => setSelectedCommission(null)}
      />
    </>
  );
};

export default CommissionsHistoryCard;
