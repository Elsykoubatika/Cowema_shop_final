
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { Target, Award, Clock, CheckCircle, Loader2 } from 'lucide-react';

const MissionsSection: React.FC = () => {
  const { missions, isLoading, completeMission } = useLoyaltyPoints();

  const handleCompleteMission = async (missionId: string) => {
    await completeMission(missionId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Missions spéciales
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Chargement des missions...</span>
        </CardContent>
      </Card>
    );
  }

  if (missions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Missions spéciales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Aucune mission disponible pour le moment</p>
            <p className="text-sm text-gray-500 mt-2">
              Revenez bientôt pour découvrir de nouvelles missions !
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={20} />
          Missions spéciales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`border rounded-lg p-4 transition-all ${
              mission.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-primary/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{mission.title}</h4>
                  {mission.completed && (
                    <CheckCircle size={16} className="text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
                
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Award size={12} className="mr-1" />
                    {mission.points_reward} points
                  </Badge>
                  
                  {mission.mission_type === 'limited_time' && mission.end_date && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      <Clock size={12} className="mr-1" />
                      Limitée dans le temps
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                {mission.completed ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle size={14} className="mr-1" />
                    Terminée
                  </Badge>
                ) : (
                  <Button
                    onClick={() => handleCompleteMission(mission.id)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Compléter
                  </Button>
                )}
              </div>
            </div>
            
            {mission.end_date && !mission.completed && (
              <div className="text-xs text-gray-500 mt-2">
                <Clock size={12} className="inline mr-1" />
                Expire le {new Date(mission.end_date).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
          <div className="flex items-start gap-2">
            <Target size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">À propos des missions</p>
              <p className="text-blue-700">
                Les missions spéciales sont configurées par nos administrateurs et vous permettent 
                de gagner des points bonus en accomplissant des tâches particulières.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionsSection;
