
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Crown, Award, Gem, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import { useUnifiedLoyaltySystem } from '../../hooks/useUnifiedLoyaltySystem';

const MembershipLevels = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUnifiedAuth();
  const { stats, loyaltyLevels, isLoading } = useUnifiedLoyaltySystem();

  const getLevelIcon = (levelName: string) => {
    switch (levelName) {
      case 'Bronze': return <Award className="h-8 w-8" />;
      case 'Argent': return <Shield className="h-8 w-8" />;
      case 'Or': return <Star className="h-8 w-8" fill="currentColor" />;
      case 'Platine': return <Crown className="h-8 w-8" />;
      case 'Diamant': return <Gem className="h-8 w-8" />;
      default: return <Award className="h-8 w-8" />;
    }
  };

  const getLevelColor = (levelName: string) => {
    switch (levelName) {
      case 'Bronze': return 'from-amber-600 to-amber-700';
      case 'Argent': return 'from-gray-400 to-gray-500';
      case 'Or': return 'from-yellow-500 to-yellow-600';
      case 'Platine': return 'from-blue-500 to-blue-600';
      case 'Diamant': return 'from-purple-500 to-purple-600';
      default: return 'from-amber-600 to-amber-700';
    }
  };

  const getBenefits = (level: any) => {
    const benefits = [
      'Accès aux produits exclusifs',
      'Support client prioritaire'
    ];

    if (level.discount > 0) {
      benefits.unshift(`${(level.discount * 100).toFixed(0)}% de remise sur tous les achats`);
    }

    if (level.name === 'Argent' || level.minPoints >= 500) {
      benefits.push('Livraison prioritaire');
    }

    if (level.name === 'Or' || level.minPoints >= 1500) {
      benefits.push('Accès aux ventes privées');
    }

    if (level.name === 'Platine' || level.minPoints >= 3000) {
      benefits.push('Gestionnaire de compte dédié');
    }

    if (level.name === 'Diamant' || level.minPoints >= 5000) {
      benefits.push('Cadeaux exclusifs et invitations VIP');
    }

    return benefits;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container-cowema">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-gray-600">Chargement des niveaux de fidélité...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-cowema">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Niveaux de Fidélité Ya Ba Boss</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plus vous achetez, plus vous montez de niveau et plus vous bénéficiez d'avantages exclusifs. 
            Gagnez 1 point pour chaque {stats?.pointsPerFcfa || 1000} FCFA dépensés.
          </p>
          {isAuthenticated && stats?.currentLevel && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg inline-block">
              <p className="text-sm text-gray-700">
                Votre niveau actuel : <span className="font-bold text-primary">{stats.currentLevel.name}</span> 
                {' '}({stats.loyaltyPoints} points)
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {loyaltyLevels.map((level, index) => {
            const isCurrentLevel = isAuthenticated && stats?.currentLevel && level.name === stats.currentLevel.name;
            const isAchieved = isAuthenticated && stats && stats.loyaltyPoints >= level.minPoints;
            
            return (
              <Card 
                key={level.name}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isCurrentLevel ? 'ring-2 ring-primary ring-offset-2' : ''
                } ${isAchieved ? 'opacity-100' : 'opacity-75'}`}
              >
                {isCurrentLevel && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg">
                    Actuel
                  </div>
                )}
                
                <CardHeader className={`text-center text-white bg-gradient-to-br ${getLevelColor(level.name)}`}>
                  <div className="flex justify-center mb-2">
                    {getLevelIcon(level.name)}
                  </div>
                  <CardTitle className="text-xl">{level.name}</CardTitle>
                  <p className="text-sm opacity-90">
                    {level.minPoints === 0 ? '0' : level.minPoints.toLocaleString()}+ points
                  </p>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    {level.discount > 0 ? (
                      <Badge variant="default" className="text-lg px-3 py-1 bg-green-100 text-green-800">
                        {(level.discount * 100).toFixed(0)}% de remise
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        Pas de remise
                      </Badge>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {getBenefits(level).slice(0, 4).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Star size={12} className="text-yellow-500 mt-1 flex-shrink-0" fill="currentColor" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {!isAuthenticated && (
                    <Button 
                      onClick={() => navigate('/register')}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Rejoindre
                    </Button>
                  )}

                  {isAuthenticated && !isAchieved && stats && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {(level.minPoints - stats.loyaltyPoints).toLocaleString()} points requis
                      </p>
                    </div>
                  )}

                  {isAuthenticated && isAchieved && !isCurrentLevel && (
                    <div className="text-center">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Débloqué
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate(isAuthenticated ? '/account?tab=loyalty' : '/register')}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700"
          >
            {isAuthenticated ? 'Voir mes avantages' : 'Rejoindre Ya Ba Boss'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MembershipLevels;
