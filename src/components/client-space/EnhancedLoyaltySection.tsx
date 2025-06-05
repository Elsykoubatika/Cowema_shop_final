
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Gift, 
  Target, 
  Users, 
  Trophy, 
  Clock, 
  TrendingUp,
  Sparkles,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { useUnifiedLoyaltySystem } from '@/hooks/useUnifiedLoyaltySystem';
import ReferralSection from './ReferralSection';
import PointsEarningSection from './PointsEarningSection';

const EnhancedLoyaltySection: React.FC = () => {
  const { user } = useUnifiedAuth();
  const { missions, completeMission, isLoading } = useLoyaltyPoints();
  const { stats } = useUnifiedLoyaltySystem();
  const [completingMission, setCompletingMission] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCompleteMission = async (missionId: string) => {
    setCompletingMission(missionId);
    await completeMission(missionId);
    setCompletingMission(null);
  };

  const activeMissions = missions.filter(m => !m.completed);
  const completedMissions = missions.filter(m => m.completed);

  // Calcul du pourcentage de progression pour l'effet visuel
  const progressPercent = stats?.progressPercentage || 0;

  return (
    <div className="space-y-8">
      {/* En-tête hero avec gradient et animation */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-10"></div>
        <Card className="border-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white relative">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Sparkles size={32} className="text-yellow-300" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Programme Ya Ba Boss</h1>
                    <p className="text-white/90 text-lg">Votre passeport vers des avantages exclusifs</p>
                  </div>
                </div>
                <p className="text-white/80 max-w-md">
                  Gagnez des points à chaque achat, montez de niveau et débloquez des récompenses incroyables !
                </p>
              </div>
              
              {/* Points actuels avec animation */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star size={28} className="text-yellow-300" fill="currentColor" />
                    <span className="text-4xl font-bold">{user?.loyaltyPoints || 0}</span>
                  </div>
                  <p className="text-white/90 font-medium">Points Ya Ba Boss</p>
                  
                  {stats && stats.nextLevelInfo.pointsNeeded > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-white/80">
                        <span>{stats.currentLevel.name}</span>
                        <span>{stats.nextLevelInfo.nextLevel}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 bg-white/20" />
                      <p className="text-xs text-white/70">
                        Plus que {stats.nextLevelInfo.pointsNeeded} points pour le niveau suivant
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation améliorée avec des onglets plus visuels */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <TrendingUp size={18} />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger 
            value="missions" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Target size={18} />
            Missions
            {activeMissions.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeMissions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="referral" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Users size={18} />
            Parrainage
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble - Nouveau contenu */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <PointsEarningSection />
          
          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Target size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Missions disponibles</h3>
                    <p className="text-sm text-gray-600">
                      {activeMissions.length} mission{activeMissions.length !== 1 ? 's' : ''} à compléter
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("missions")}
                    className="shrink-0"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Parrainer des amis</h3>
                    <p className="text-sm text-gray-600">
                      Gagnez 10 points par parrainage
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("referral")}
                    className="shrink-0"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Missions avec interface améliorée */}
        <TabsContent value="missions" className="space-y-6 mt-6">
          {/* Missions actives */}
          {activeMissions.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target size={20} className="text-primary" />
                  </div>
                  Missions disponibles
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {activeMissions.length} active{activeMissions.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="group p-5 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:from-primary/5 hover:to-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                              <Gift size={18} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{mission.title}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed">{mission.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 ml-11">
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              <Star size={12} className="mr-1" fill="currentColor" />
                              +{mission.points_reward} points
                            </Badge>
                            {mission.end_date && (
                              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                <Clock size={12} className="mr-1" />
                                Expire le {new Date(mission.end_date).toLocaleDateString('fr-FR')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleCompleteMission(mission.id)}
                          disabled={completingMission === mission.id}
                          className="ml-6 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          {completingMission === mission.id ? (
                            <>
                              <div className="animate-spin mr-2">
                                <Zap size={14} />
                              </div>
                              Validation...
                            </>
                          ) : (
                            <>
                              <Award size={14} className="mr-2" />
                              Valider
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missions complétées */}
          {completedMissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Trophy size={20} className="text-green-600" />
                  </div>
                  Missions accomplies
                  <Badge className="bg-green-100 text-green-800">
                    {completedMissions.length} complétée{completedMissions.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                          <Trophy size={16} className="text-green-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{mission.title}</h3>
                          <p className="text-sm text-gray-600">{mission.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        <Star size={12} className="mr-1" fill="currentColor" />
                        +{mission.points_reward} points
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* État vide */}
          {activeMissions.length === 0 && completedMissions.length === 0 && (
            <Card className="border-dashed border-gray-300">
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <Target size={40} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune mission disponible
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      De nouvelles missions seront bientôt disponibles ! En attendant, continuez à accumuler des points avec vos achats.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("overview")}
                    className="mt-4"
                  >
                    Voir comment gagner des points
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="referral" className="mt-6">
          <ReferralSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedLoyaltySection;
