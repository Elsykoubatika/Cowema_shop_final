
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WhatsAppConfig } from './WhatsAppConfig';
import { Smartphone, Users, Settings, Plus } from 'lucide-react';

interface UserWhatsAppConfig {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  business_phone: string;
  is_active: boolean;
  last_used?: string;
  total_messages_sent: number;
}

export const WhatsAppConfigList: React.FC = () => {
  const [configs, setConfigs] = useState<UserWhatsAppConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      // Simulation des données
      const mockConfigs: UserWhatsAppConfig[] = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'Jean Dupont',
          user_role: 'seller',
          business_phone: '+243812345678',
          is_active: true,
          last_used: '2024-01-15T10:30:00Z',
          total_messages_sent: 156
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Marie Martin',
          user_role: 'team_lead',
          business_phone: '+243823456789',
          is_active: false,
          total_messages_sent: 89
        }
      ];
      
      setConfigs(mockConfigs);
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'team_lead':
        return 'bg-blue-100 text-blue-800';
      case 'seller':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement des configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Configurations WhatsApp Business</h3>
          <p className="text-muted-foreground">
            Gérez les configurations WhatsApp de tous les utilisateurs
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Nouvelle configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration WhatsApp Business</DialogTitle>
            </DialogHeader>
            <WhatsAppConfig />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <Smartphone className="text-green-600" size={20} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{config.user_name}</h4>
                      <Badge className={getRoleColor(config.user_role)}>
                        {config.user_role}
                      </Badge>
                      <Badge className={getStatusColor(config.is_active)}>
                        {config.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {config.business_phone}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{config.total_messages_sent} messages envoyés</span>
                      {config.last_used && (
                        <span>
                          Dernière utilisation: {new Date(config.last_used).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings size={16} className="mr-2" />
                        Configurer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Configuration WhatsApp - {config.user_name}
                        </DialogTitle>
                      </DialogHeader>
                      <WhatsAppConfig />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {configs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">
              Aucune configuration WhatsApp Business trouvée
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
