
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, ShoppingBag, Award } from 'lucide-react';

interface LoyaltySectionProps {
  loyaltyPoints: number;
  userLevel: any;
  nextLevel: any;
}

const LoyaltySection: React.FC<LoyaltySectionProps> = ({ loyaltyPoints, userLevel, nextLevel }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star size={20} />
            Mon niveau Ya Ba Boss
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`inline-flex px-4 py-2 rounded-full text-lg font-medium ${userLevel.color} ${userLevel.textColor} mb-4`}>
              {userLevel.name}
            </div>
            <p className="text-3xl font-bold text-primary mb-2">{loyaltyPoints} points</p>
            <p className="text-gray-600">Vos points de fidélité</p>
          </div>

          {nextLevel.pointsNeeded > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progression vers {nextLevel.nextLevel}</span>
                <span className="font-medium">{Math.round(nextLevel.progress)}%</span>
              </div>
              <Progress value={nextLevel.progress} className="mb-3" />
              <p className="text-sm text-gray-600 text-center">
                Plus que <span className="font-medium text-primary">{nextLevel.pointsNeeded} points</span> pour atteindre le niveau {nextLevel.nextLevel}
              </p>
            </div>
          )}

          {userLevel.discount > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Gift size={20} />
                <span className="font-medium">Votre avantage actuel</span>
              </div>
              <p className="text-green-700">
                Remise de {(userLevel.discount * 100).toFixed(0)}% sur toutes vos commandes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comment gagner des points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <ShoppingBag size={20} className="text-blue-600" />
            <div>
              <p className="font-medium">Effectuer des achats</p>
              <p className="text-sm text-gray-600">1 point pour chaque 1000 FCFA dépensés</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Star size={20} className="text-yellow-600" />
            <div>
              <p className="font-medium">Laisser des avis</p>
              <p className="text-sm text-gray-600">50 points par avis produit</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Gift size={20} className="text-green-600" />
            <div>
              <p className="font-medium">Parrainer des amis</p>
              <p className="text-sm text-gray-600">100 points par ami parrainé</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Award size={20} className="text-purple-600" />
            <div>
              <p className="font-medium">Missions spéciales</p>
              <p className="text-sm text-gray-600">Bonus variables selon les promotions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltySection;
