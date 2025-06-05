
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Settings, Activity, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnalyticsSelector: React.FC = () => {
  const navigate = useNavigate();

  const analyticsOptions = [
    {
      title: 'Analytics Standard',
      description: 'Vue d\'ensemble classique avec métriques de base',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-blue-500',
      features: ['Revenus', 'Commandes', 'Clients', 'Graphiques standards']
    },
    {
      title: 'Analytics Personnalisés',
      description: 'Tableaux de bord configurables et filtres avancés',
      icon: Settings,
      path: '/admin/analytics-customizable',
      color: 'bg-purple-500',
      features: ['Widgets personnalisables', 'Filtres avancés', 'Graphiques configurables', 'Thèmes couleurs']
    },
    {
      title: 'Tracking Comportemental',
      description: 'Analyse détaillée du comportement utilisateur',
      icon: Activity,
      path: '/admin/tracking-analytics',
      color: 'bg-green-500',
      features: ['Événements en temps réel', 'Parcours utilisateur', 'Heatmaps', 'Facebook Pixel']
    },
    {
      title: 'Analytics Trafic',
      description: 'Sources de trafic et données de visiteurs',
      icon: TrendingUp,
      path: '/admin/traffic-analytics',
      color: 'bg-orange-500',
      features: ['Sources de trafic', 'Géolocalisation', 'Appareils', 'Sessions']
    },
    {
      title: 'Analytics Messaging',
      description: 'Performance des campagnes de communication',
      icon: MessageSquare,
      path: '/admin/messaging',
      color: 'bg-indigo-500',
      features: ['Campagnes email', 'WhatsApp', 'Taux d\'ouverture', 'Conversions']
    },
    {
      title: 'Analytics Temps Réel',
      description: 'Données en direct et alertes instantanées',
      icon: Zap,
      path: '/admin/realtime-analytics',
      color: 'bg-red-500',
      features: ['Visiteurs en ligne', 'Ventes en cours', 'Alertes', 'Dashboard live']
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Centre d'Analytics</h1>
        <p className="text-gray-600">Choisissez le type d'analyse qui correspond à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card key={option.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${option.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{option.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Fonctionnalités :</p>
                  <ul className="text-xs space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => navigate(option.path)}
                  className="w-full"
                  variant={option.path.includes('customizable') ? 'default' : 'outline'}
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">💡 Recommandation</h3>
        <p className="text-sm text-gray-700">
          Pour une première utilisation, nous recommandons de commencer par les <strong>Analytics Personnalisés</strong> 
          qui offrent le meilleur équilibre entre simplicité et fonctionnalités avancées.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsSelector;
