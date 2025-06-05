
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, TrendingUp } from 'lucide-react';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import { useUnifiedLoyaltySystem } from '@/hooks/useUnifiedLoyaltySystem';

const PendingRewardsCard: React.FC = () => {
  const { userOrders } = useSupabaseOrders();
  const { calculatePointsForAmount } = useUnifiedLoyaltySystem();
  
  // Filtrer les commandes non livrées
  const pendingOrders = userOrders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  );
  
  // Calculer les points potentiels
  const [pendingPoints, setPendingPoints] = React.useState<number>(0);
  const pendingAmount = pendingOrders.reduce((sum, order) => sum + order.total_amount, 0);
  
  React.useEffect(() => {
    const calculatePending = async () => {
      if (calculatePointsForAmount && pendingAmount > 0) {
        const points = await calculatePointsForAmount(pendingAmount);
        setPendingPoints(points);
      } else {
        setPendingPoints(0);
      }
    };
    calculatePending();
  }, [pendingAmount, calculatePointsForAmount]);

  if (pendingOrders.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de commandes en attente
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Clock size={18} className="text-orange-600" />
          Points en attente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-orange-800">{pendingPoints}</p>
            <p className="text-sm text-orange-600">points à gagner</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Sur {pendingOrders.length} commande{pendingOrders.length !== 1 ? 's' : ''}</p>
            <p className="text-sm font-medium text-gray-800">{pendingAmount.toLocaleString()} FCFA</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-orange-700">Commandes en cours :</span>
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              {pendingOrders.length}
            </Badge>
          </div>
          
          {pendingOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between text-xs bg-white/60 p-2 rounded">
              <div>
                <span className="font-medium">#{order.id.slice(0, 8)}</span>
                <Badge 
                  variant="outline" 
                  className="ml-2 text-xs"
                  style={{
                    backgroundColor: 
                      order.status === 'pending' ? '#fef3c7' :
                      order.status === 'confirmed' ? '#dbeafe' :
                      order.status === 'shipped' ? '#e0e7ff' : '#f3f4f6',
                    color:
                      order.status === 'pending' ? '#d97706' :
                      order.status === 'confirmed' ? '#2563eb' :
                      order.status === 'shipped' ? '#7c3aed' : '#6b7280',
                    borderColor:
                      order.status === 'pending' ? '#fcd34d' :
                      order.status === 'confirmed' ? '#93c5fd' :
                      order.status === 'shipped' ? '#c4b5fd' : '#d1d5db'
                  }}
                >
                  {order.status === 'pending' ? 'En attente' :
                   order.status === 'confirmed' ? 'Confirmée' :
                   order.status === 'shipped' ? 'Expédiée' : order.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.total_amount.toLocaleString()} FCFA</p>
              </div>
            </div>
          ))}
          
          {pendingOrders.length > 3 && (
            <p className="text-xs text-orange-600 text-center">
              et {pendingOrders.length - 3} autre{pendingOrders.length - 3 !== 1 ? 's' : ''} commande{pendingOrders.length - 3 !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="bg-white/80 p-3 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">Motivation</span>
          </div>
          <p className="text-xs text-gray-700">
            Une fois vos commandes livrées, vous gagnerez <span className="font-bold text-orange-700">{pendingPoints} points</span> supplémentaires ! 
            {pendingPoints >= 50 && (
              <span className="text-green-600"> Cela vous rapprochera significativement du niveau supérieur !</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingRewardsCard;
