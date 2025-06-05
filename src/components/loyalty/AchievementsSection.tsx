
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Crown, Star, Zap, Sparkles } from 'lucide-react';
import { useUnifiedLoyaltySystem } from '@/hooks/useUnifiedLoyaltySystem';

const AchievementsSection: React.FC = () => {
  const { stats, isLoading } = useUnifiedLoyaltySystem();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown': return Crown;
      case 'star': return Star;
      case 'zap': return Zap;
      case 'sparkles': return Sparkles;
      case 'award': return Award;
      default: return Award;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={18} />
            Accomplissements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const nextAchievement = stats.achievements.find(a => !a.unlocked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award size={18} />
          Accomplissements
          <Badge variant="secondary" className="ml-auto">
            {unlockedAchievements.length}/{stats.achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Accomplissements débloqués */}
        {unlockedAchievements.slice(0, 3).map((achievement) => {
          const IconComponent = getIcon(achievement.icon);
          return (
            <div 
              key={achievement.id}
              className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="p-1.5 bg-green-600 rounded-full text-white">
                <IconComponent size={14} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800 text-sm">{achievement.title}</p>
                <p className="text-green-600 text-xs">{achievement.description}</p>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                +{achievement.points}
              </Badge>
            </div>
          );
        })}

        {/* Prochain accomplissement */}
        {nextAchievement && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-1.5 bg-gray-400 rounded-full text-white">
              {React.createElement(getIcon(nextAchievement.icon), { size: 14 })}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-700 text-sm">{nextAchievement.title}</p>
              <p className="text-gray-500 text-xs">{nextAchievement.description}</p>
            </div>
            <Badge variant="outline" className="text-gray-600 text-xs">
              +{nextAchievement.points}
            </Badge>
          </div>
        )}

        {unlockedAchievements.length > 3 && (
          <p className="text-xs text-gray-500 text-center pt-2">
            et {unlockedAchievements.length - 3} autre{unlockedAchievements.length - 3 !== 1 ? 's' : ''} accomplissement{unlockedAchievements.length - 3 !== 1 ? 's' : ''}
          </p>
        )}

        {unlockedAchievements.length === 0 && (
          <div className="text-center py-4">
            <Award size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">Aucun accomplissement pour le moment</p>
            <p className="text-gray-500 text-xs">Continuez à utiliser Ya Ba Boss pour débloquer des récompenses !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
