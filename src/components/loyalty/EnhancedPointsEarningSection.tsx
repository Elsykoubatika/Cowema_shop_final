
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Star, 
  Users,
  Target,
  Sparkles,
  Crown
} from 'lucide-react';
import { useUnifiedLoyaltySystem } from '@/hooks/useUnifiedLoyaltySystem';

const EnhancedPointsEarningSection: React.FC = () => {
  const { stats } = useUnifiedLoyaltySystem();

  const benefits = [
    {
      icon: ShoppingBag,
      title: "Effectuer des achats",
      description: `1 point pour chaque ${stats?.pointsPerFcfa || 1000} FCFA dépensés (commandes livrées uniquement)`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      points: `1 point/${stats?.pointsPerFcfa || 1000} FCFA`,
      source: "purchase"
    },
    {
      icon: Star,
      title: "Laisser des avis",
      description: "Partagez votre expérience produit et gagnez des points",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
      points: "+20 points",
      source: "review"
    },
    {
      icon: Users,
      title: "Parrainer des amis",
      description: "Invitez vos proches à rejoindre Ya Ba Boss",
      color: "bg-green-50 text-green-600 border-green-200",
      points: "+10 points",
      source: "referral"
    },
    {
      icon: Target,
      title: "Missions spéciales",
      description: "Participez aux défis configurés par nos équipes",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      points: "Points variables",
      source: "mission"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={20} />
          Comment gagner des points Ya Ba Boss
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${benefit.color}`}
            >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <benefit.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">{benefit.title}</p>
                <p className="text-sm opacity-80 mb-2">{benefit.description}</p>
                <span className="text-xs font-medium bg-white px-2 py-1 rounded">
                  {benefit.points}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Note importante sur les points */}
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Crown size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Système de points dynamique :</p>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Achats :</strong> Les points ne sont crédités qu'une fois vos commandes livrées</li>
                <li>• <strong>Avis :</strong> 20 points automatiquement attribués pour chaque avis publié</li>
                <li>• <strong>Parrainage :</strong> 10 points quand votre ami s'inscrit avec votre code</li>
                <li>• <strong>Missions :</strong> Points variables selon les défis configurés par l'équipe</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPointsEarningSection;
