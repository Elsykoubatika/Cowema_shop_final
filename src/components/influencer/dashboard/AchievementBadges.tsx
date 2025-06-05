
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Gift, Crown, Award, Medal } from 'lucide-react';

interface AchievementBadgesProps {
  totalEarned: number;
  totalOrders: number;
  influencerName: string;
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  totalEarned,
  totalOrders,
  influencerName
}) => {
  const achievements = [
    {
      id: 'first_sale',
      title: 'Premier Succès',
      description: 'Première vente générée',
      icon: Star,
      unlocked: totalOrders > 0,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      id: 'five_sales',
      title: 'Lancé !',
      description: '5 ventes générées',
      icon: Zap,
      unlocked: totalOrders >= 5,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      id: 'ten_sales',
      title: 'En Route !',
      description: '10 ventes générées',
      icon: Target,
      unlocked: totalOrders >= 10,
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'first_payout',
      title: 'Premier Gain',
      description: '10 000 FCFA gagnés',
      icon: Gift,
      unlocked: totalEarned >= 10000,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'influencer_pro',
      title: 'Influenceur Pro',
      description: '25 ventes générées',
      icon: Award,
      unlocked: totalOrders >= 25,
      color: 'from-indigo-400 to-purple-400',
      bgColor: 'from-indigo-50 to-purple-50'
    },
    {
      id: 'top_performer',
      title: 'Top Performer',
      description: '50 000 FCFA gagnés',
      icon: Medal,
      unlocked: totalEarned >= 50000,
      color: 'from-pink-400 to-red-400',
      bgColor: 'from-pink-50 to-red-50'
    },
    {
      id: 'sales_master',
      title: 'Maître des Ventes',
      description: '50 ventes générées',
      icon: Trophy,
      unlocked: totalOrders >= 50,
      color: 'from-amber-400 to-orange-400',
      bgColor: 'from-amber-50 to-orange-50'
    },
    {
      id: 'influence_king',
      title: 'Roi de l\'Influence',
      description: '100 000 FCFA gagnés',
      icon: Crown,
      unlocked: totalEarned >= 100000,
      color: 'from-violet-400 to-purple-400',
      bgColor: 'from-violet-50 to-purple-50'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <Card className="mb-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Vos Accomplissements
          <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {unlockedCount}/{achievements.length}
          </Badge>
        </CardTitle>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Progression: {progress.toFixed(0)}% • Continuez comme ça {influencerName} ! 🎉
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105
                  ${achievement.unlocked 
                    ? `bg-gradient-to-br ${achievement.bgColor} border-transparent shadow-md` 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                  }
                `}
              >
                {achievement.unlocked && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`
                    mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${achievement.unlocked 
                      ? `bg-gradient-to-r ${achievement.color}` 
                      : 'bg-gray-300'
                    }
                  `}>
                    <IconComponent className={`h-6 w-6 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  
                  <h4 className={`font-semibold text-sm mb-1 ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                  
                  <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked && (
                    <Badge variant="outline" className="mt-2 text-xs bg-white/50">
                      Débloqué ✨
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
