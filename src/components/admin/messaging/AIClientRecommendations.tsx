
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Users, TrendingUp, Clock } from 'lucide-react';

interface RecommendedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  lastOrderDays: number;
  totalSpent: number;
  orderCount: number;
}

interface AIClientRecommendationsProps {
  onClientsSelect: (clientIds: string[]) => void;
  selectedClients: string[];
}

export const AIClientRecommendations: React.FC<AIClientRecommendationsProps> = ({
  onClientsSelect,
  selectedClients
}) => {
  const [recommendationType, setRecommendationType] = useState<'reactivation' | 'upsell' | 'retention'>('reactivation');

  // Données simulées de recommandations IA
  const recommendations = {
    reactivation: [
      {
        id: '1',
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        phone: '+242 06 123 4567',
        city: 'Brazzaville',
        reason: 'Pas de commande depuis 45 jours, client VIP',
        priority: 'high' as const,
        lastOrderDays: 45,
        totalSpent: 125000,
        orderCount: 8
      },
      {
        id: '2',
        name: 'Jean Mbemba',
        email: 'jean.mbemba@email.com',
        phone: '+242 06 987 6543',
        city: 'Pointe-Noire',
        reason: 'Client régulier inactif depuis 30 jours',
        priority: 'medium' as const,
        lastOrderDays: 30,
        totalSpent: 75000,
        orderCount: 5
      }
    ],
    upsell: [
      {
        id: '3',
        name: 'Alice Kongo',
        email: 'alice.kongo@email.com',
        phone: '+242 06 456 7890',
        city: 'Brazzaville',
        reason: 'Achète souvent des générateurs, pourrait être intéressée par des accessoires',
        priority: 'high' as const,
        lastOrderDays: 5,
        totalSpent: 200000,
        orderCount: 12
      }
    ],
    retention: [
      {
        id: '4',
        name: 'Paul Nsele',
        email: 'paul.nsele@email.com',
        phone: '+242 06 321 0987',
        city: 'Dolisie',
        reason: 'Premier achat récent, important de maintenir l\'engagement',
        priority: 'medium' as const,
        lastOrderDays: 3,
        totalSpent: 45000,
        orderCount: 1
      }
    ]
  };

  const currentRecommendations = recommendations[recommendationType];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClientToggle = (clientId: string) => {
    const newSelection = selectedClients.includes(clientId)
      ? selectedClients.filter(id => id !== clientId)
      : [...selectedClients, clientId];
    onClientsSelect(newSelection);
  };

  const handleSelectAll = () => {
    const allCurrentIds = currentRecommendations.map(client => client.id);
    const areAllSelected = allCurrentIds.every(id => selectedClients.includes(id));
    
    if (areAllSelected) {
      onClientsSelect(selectedClients.filter(id => !allCurrentIds.includes(id)));
    } else {
      const newSelection = [...new Set([...selectedClients, ...allCurrentIds])];
      onClientsSelect(newSelection);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain size={16} className="text-purple-600" />
          Recommandations IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type de recommandation */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={recommendationType === 'reactivation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRecommendationType('reactivation')}
          >
            <Clock size={14} className="mr-1" />
            Réactivation
          </Button>
          <Button
            variant={recommendationType === 'upsell' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRecommendationType('upsell')}
          >
            <TrendingUp size={14} className="mr-1" />
            Vente additionnelle
          </Button>
          <Button
            variant={recommendationType === 'retention' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRecommendationType('retention')}
          >
            <Users size={14} className="mr-1" />
            Fidélisation
          </Button>
        </div>

        {/* Actions groupées */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {currentRecommendations.length} clients recommandés
          </span>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {currentRecommendations.every(client => selectedClients.includes(client.id))
              ? 'Désélectionner tout'
              : 'Sélectionner tout'}
          </Button>
        </div>

        {/* Liste des clients recommandés */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {currentRecommendations.map((client) => (
            <div
              key={client.id}
              className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Checkbox
                checked={selectedClients.includes(client.id)}
                onCheckedChange={() => handleClientToggle(client.id)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{client.name}</span>
                  <Badge className={`text-xs ${getPriorityColor(client.priority)}`}>
                    {client.priority === 'high' ? 'Élevée' : 
                     client.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{client.reason}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>📍 {client.city}</span>
                  <span>💰 {client.totalSpent.toLocaleString()} FCFA</span>
                  <span>📦 {client.orderCount} commandes</span>
                  <span>⏱️ {client.lastOrderDays}j</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
