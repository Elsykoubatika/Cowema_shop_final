
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Users, 
  Star, 
  Gift, 
  Crown,
  TrendingUp,
  ChevronRight 
} from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useUnifiedLoyaltySystem } from '@/hooks/useUnifiedLoyaltySystem';
import { useNavigate } from 'react-router-dom';

const PointsEarningSection: React.FC = () => {
  const { user } = useUnifiedAuth();
  const { stats, isLoading } = useUnifiedLoyaltySystem();
  const navigate = useNavigate();

  const earningMethods = [
    {
      icon: ShoppingCart,
      title: "Effectuer des achats",
      description: `1 point pour chaque ${stats?.pointsPerFcfa || 1000} FCFA dépensés`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      points: `1 pt/${stats?.pointsPerFcfa || 1000} FCFA`,
      action: () => navigate('/'),
      actionText: "Voir les produits"
    },
    {
      icon: Users,
      title: "Parrainer des amis",
      description: "Invitez vos proches à rejoindre Ya Ba Boss",
      color: "bg-green-50 text-green-600 border-green-200",
      points: "+10 points",
      action: () => {}, // Déjà dans la même page
      actionText: "Voir section parrainage"
    },
    {
      icon: Star,
      title: "Laisser des avis",
      description: "Partagez votre expérience sur nos produits",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
      points: "+20 points",
      action: () => navigate('/account?tab=orders'),
      actionText: "Mes commandes"
    },
    {
      icon: Gift,
      title: "Offres spéciales admin",
      description: "Missions spéciales créées par notre équipe",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      points: "Variable",
      action: () => {}, // Déjà dans la section missions
      actionText: "Voir missions"
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Comment gagner des points Ya Ba Boss
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <TrendingUp size={20} />
          Comment gagner des points Ya Ba Boss
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Niveau et progression actuels */}
        {stats && (
          <div className="bg-gradient-to-r from-primary/5 to-purple/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-primary" />
                <span className="font-medium">Niveau actuel</span>
              </div>
              <Badge className={`${stats.currentLevel.color} ${stats.currentLevel.textColor}`}>
                {stats.currentLevel.name}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Points actuels</span>
                <span className="font-bold text-primary">{stats.loyaltyPoints} points</span>
              </div>
              
              {stats.nextLevelInfo.pointsNeeded > 0 && (
                <>
                  <Progress value={stats.nextLevelInfo.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{stats.currentLevel.name}</span>
                    <span>{stats.nextLevelInfo.nextLevel}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary">
                      Plus que <span className="text-lg">{stats.nextLevelInfo.pointsNeeded}</span> points pour le niveau {stats.nextLevelInfo.nextLevel}!
                    </p>
                    {stats.currentLevel.discount < 0.2 && (
                      <p className="text-xs text-gray-600 mt-1">
                        Atteignez le niveau suivant pour plus d'avantages et de réductions!
                      </p>
                    )}
                  </div>
                </>
              )}
              
              {stats.nextLevelInfo.pointsNeeded === 0 && (
                <div className="text-center py-2">
                  <p className="text-sm font-medium text-green-600">
                    🎉 Félicitations! Vous avez atteint le niveau maximum!
                  </p>
                  <p className="text-xs text-gray-600">
                    Profitez de {(stats.currentLevel.discount * 100).toFixed(0)}% de remise sur tous vos achats
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Moyens de gagner des points */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Moyens de gagner des points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earningMethods.map((method, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${method.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <method.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{method.title}</h4>
                    <p className="text-sm opacity-80 mb-2">{method.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {method.points}
                      </Badge>
                      {method.actionText !== "Voir section parrainage" && method.actionText !== "Voir missions" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={method.action}
                          className="text-xs h-6 px-2"
                        >
                          {method.actionText}
                          <ChevronRight size={12} className="ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message motivationnel */}
        {stats && stats.nextLevelInfo.pointsNeeded > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Conseil Ya Ba Boss</span>
            </div>
            <p className="text-sm text-yellow-700">
              {stats.nextLevelInfo.pointsNeeded <= 10 
                ? "Vous êtes si proche! Quelques achats ou un parrainage et vous montez de niveau!"
                : stats.nextLevelInfo.pointsNeeded <= 50
                ? "Parrainez un ami (+10 pts) et effectuez quelques achats pour monter de niveau rapidement!"
                : "Invitez vos amis et continuez vos achats pour débloquer plus d'avantages!"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsEarningSection;
