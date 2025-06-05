
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Crown, TrendingUp } from 'lucide-react';
import { useUnifiedLoyaltySystem } from '@/hooks/useUnifiedLoyaltySystem';

const UserStatsCard: React.FC = () => {
  const { stats, isLoading } = useUnifiedLoyaltySystem();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star size={18} />
            Ma progression
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Crown size={18} />
          Ma progression Ya Ba Boss
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-3 ${stats.currentLevel.color} ${stats.currentLevel.textColor}`}>
            {stats.currentLevel.name}
          </div>
          <p className="text-3xl font-bold text-primary mb-1">{stats.loyaltyPoints}</p>
          <p className="text-sm text-gray-600">points Ya Ba Boss</p>
        </div>

        {stats.nextLevelInfo.pointsNeeded > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vers {stats.nextLevelInfo.nextLevel}</span>
              <span className="font-medium">{Math.round(stats.nextLevelInfo.progress)}%</span>
            </div>
            <Progress value={stats.nextLevelInfo.progress} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              Plus que <span className="font-medium text-primary">{stats.nextLevelInfo.pointsNeeded} points</span>
            </p>
          </div>
        )}

        {stats.currentLevel.discount > 0 && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-1">
              <TrendingUp size={14} />
              <span className="text-sm font-medium">Avantage actuel</span>
            </div>
            <p className="text-green-700 text-sm">
              {(stats.currentLevel.discount * 100).toFixed(0)}% de remise sur vos commandes
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500">Commandes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{stats.totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500">FCFA dépensés</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
