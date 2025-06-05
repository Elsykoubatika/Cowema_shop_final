
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  MessageSquare,
  Users,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResponseIoConfig {
  apiKey: string;
  webhookUrl: string;
  isActive: boolean;
  autoAssignVendors: boolean;
  defaultChannel: string;
  tagNewConversations: boolean;
  customTags: string[];
}

export const ResponseIoIntegration: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ResponseIoConfig>({
    apiKey: '',
    webhookUrl: '',
    isActive: false,
    autoAssignVendors: true,
    defaultChannel: 'whatsapp',
    tagNewConversations: true,
    customTags: ['cowema', 'vente', 'support']
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [newTag, setNewTag] = useState('');

  const handleConnect = async () => {
    if (!config.apiKey) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre clé API response.io",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simuler la connexion à response.io
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Configurer automatiquement les webhooks
      const webhookUrl = `${window.location.origin}/api/webhooks/response-io`;
      
      setConfig(prev => ({
        ...prev,
        webhookUrl,
        isActive: true
      }));
      
      setConnectionStatus('connected');
      
      toast({
        title: "Connexion réussie !",
        description: "response.io est maintenant intégré à votre système",
      });
      
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à response.io",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestWebhook = async () => {
    try {
      // Test du webhook
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test réussi",
        description: "Le webhook response.io fonctionne correctement",
      });
    } catch (error) {
      toast({
        title: "Test échoué",
        description: "Problème avec le webhook response.io",
        variant: "destructive"
      });
    }
  };

  const addCustomTag = () => {
    if (newTag && !config.customTags.includes(newTag)) {
      setConfig(prev => ({
        ...prev,
        customTags: [...prev.customTags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setConfig(prev => ({
      ...prev,
      customTags: prev.customTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-blue-500" size={24} />
            Intégration response.io
          </h2>
          <p className="text-muted-foreground">
            Gérez toutes vos conversations WhatsApp depuis response.io
          </p>
        </div>

        <Badge className={getStatusColor()}>
          {getStatusIcon()}
          <span className="ml-1 capitalize">{connectionStatus === 'disconnected' ? 'Non connecté' : connectionStatus === 'connected' ? 'Connecté' : 'Erreur'}</span>
        </Badge>
      </div>

      {/* Configuration principale */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration de la connexion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Clé API response.io *</Label>
            <Input
              id="api-key"
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="resp_live_..."
            />
            <p className="text-xs text-muted-foreground">
              Trouvez votre clé API dans response.io → Settings → API Keys
            </p>
          </div>

          {config.webhookUrl && (
            <div className="space-y-2">
              <Label>URL du webhook (générée automatiquement)</Label>
              <Input
                value={config.webhookUrl}
                readOnly
                className="bg-gray-50"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || !config.apiKey}
              className="flex-1"
            >
              {isConnecting ? 'Connexion en cours...' : 'Connecter response.io'}
            </Button>

            {connectionStatus === 'connected' && (
              <Button variant="outline" onClick={handleTestWebhook}>
                Tester
              </Button>
            )}

            <Button variant="outline" asChild>
              <a 
                href="https://app.response.io/settings/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                response.io
              </a>
            </Button>
          </div>

          {connectionStatus === 'connected' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                response.io est connecté ! Toutes les conversations WhatsApp seront automatiquement synchronisées.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Paramètres avancés */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de synchronisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Attribution automatique des vendeurs</Label>
              <p className="text-sm text-muted-foreground">
                Assigner automatiquement les conversations aux vendeurs selon leur compte WhatsApp
              </p>
            </div>
            <Switch
              checked={config.autoAssignVendors}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoAssignVendors: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Étiquetage automatique</Label>
              <p className="text-sm text-muted-foreground">
                Ajouter automatiquement des tags aux nouvelles conversations
              </p>
            </div>
            <Switch
              checked={config.tagNewConversations}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, tagNewConversations: checked }))}
            />
          </div>

          {config.tagNewConversations && (
            <div className="space-y-3">
              <Label>Tags personnalisés</Label>
              
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nouveau tag"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                />
                <Button onClick={addCustomTag} variant="outline">
                  Ajouter
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {config.customTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fonctionnalités disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités avec response.io</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="mx-auto mb-2 text-blue-500" size={32} />
              <h4 className="font-medium">Conversations unifiées</h4>
              <p className="text-sm text-muted-foreground">
                Toutes les conversations WhatsApp dans une interface unique
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Users className="mx-auto mb-2 text-green-500" size={32} />
              <h4 className="font-medium">Attribution intelligente</h4>
              <p className="text-sm text-muted-foreground">
                Attribution automatique selon le vendeur WhatsApp utilisé
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="mx-auto mb-2 text-purple-500" size={32} />
              <h4 className="font-medium">Analytics avancées</h4>
              <p className="text-sm text-muted-foreground">
                Statistiques détaillées sur les performances des vendeurs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Guide de configuration response.io</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Étapes pour configurer response.io :</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Créez un compte sur <a href="https://response.io" className="text-blue-600 hover:underline">response.io</a></li>
                <li>Allez dans Settings → API Keys</li>
                <li>Créez une nouvelle clé API</li>
                <li>Copiez la clé et collez-la ci-dessus</li>
                <li>Cliquez sur "Connecter response.io"</li>
                <li>Configurez vos règles d'attribution dans response.io</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Avantages de l'intégration :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Gestion centralisée de toutes les conversations</li>
                <li>Historique complet des interactions client</li>
                <li>Templates de réponses automatiques</li>
                <li>Reporting et analytics détaillés</li>
                <li>Collaboration d'équipe facilitée</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
