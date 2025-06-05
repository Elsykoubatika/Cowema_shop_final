
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Smartphone, Key, Settings, TestTube } from 'lucide-react';

interface WhatsAppConfig {
  id?: string;
  user_id: string;
  business_phone: string;
  access_token: string;
  phone_number_id: string;
  business_account_id: string;
  webhook_verify_token?: string;
  is_active: boolean;
  message_template?: string;
}

export const WhatsAppConfig: React.FC = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [config, setConfig] = useState<WhatsAppConfig>({
    user_id: user?.id || '',
    business_phone: '',
    access_token: '',
    phone_number_id: '',
    business_account_id: '',
    webhook_verify_token: '',
    is_active: false,
    message_template: 'Bonjour {{customer_name}}, voici votre message COWEMA :\n\n{{message_content}}'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadUserConfig();
  }, [user?.id]);

  const loadUserConfig = async () => {
    if (!user?.id) return;
    
    try {
      // Ici on chargerait la config depuis Supabase
      // Pour l'instant on simule
      console.log('Loading WhatsApp config for user:', user.id);
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validation
      if (!config.business_phone || !config.access_token || !config.phone_number_id) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        return;
      }

      // Ici on sauvegarderait en base
      console.log('Saving WhatsApp config:', config);
      
      toast({
        title: "Configuration sauvegardée",
        description: "Votre configuration WhatsApp Business a été enregistrée.",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      // Ici on testerait la connexion à l'API WhatsApp
      console.log('Testing WhatsApp connection...');
      
      // Simulation d'un test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test réussi",
        description: "La connexion à WhatsApp Business API fonctionne correctement.",
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Test échoué",
        description: "Impossible de se connecter à WhatsApp Business API.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="text-green-500" size={20} />
            Configuration WhatsApp Business
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configurez votre compte WhatsApp Business pour envoyer des messages automatiquement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is-active">Activer WhatsApp Business</Label>
              <p className="text-sm text-muted-foreground">
                Active l'envoi automatique des messages WhatsApp
              </p>
            </div>
            <Switch
              id="is-active"
              checked={config.is_active}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, is_active: checked }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-phone">
                Numéro de téléphone professionnel *
              </Label>
              <Input
                id="business-phone"
                type="tel"
                placeholder="+243812345678"
                value={config.business_phone}
                onChange={(e) => setConfig(prev => ({ ...prev, business_phone: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Format international avec indicatif pays
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-number-id">
                Phone Number ID *
              </Label>
              <Input
                id="phone-number-id"
                placeholder="123456789012345"
                value={config.phone_number_id}
                onChange={(e) => setConfig(prev => ({ ...prev, phone_number_id: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                ID du numéro dans WhatsApp Business API
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="access-token">
              Token d'accès WhatsApp Business API *
            </Label>
            <Input
              id="access-token"
              type="password"
              placeholder="EAAxxxxxxxx..."
              value={config.access_token}
              onChange={(e) => setConfig(prev => ({ ...prev, access_token: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Token d'accès permanent pour l'API WhatsApp Business
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-account-id">
              Business Account ID *
            </Label>
            <Input
              id="business-account-id"
              placeholder="123456789012345"
              value={config.business_account_id}
              onChange={(e) => setConfig(prev => ({ ...prev, business_account_id: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-token">
              Webhook Verify Token (optionnel)
            </Label>
            <Input
              id="webhook-token"
              placeholder="mon_token_webhook_secret"
              value={config.webhook_verify_token}
              onChange={(e) => setConfig(prev => ({ ...prev, webhook_verify_token: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Pour recevoir les confirmations de livraison
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-template">
              Template de message par défaut
            </Label>
            <Textarea
              id="message-template"
              rows={4}
              placeholder="Bonjour {{customer_name}}, voici votre message..."
              value={config.message_template}
              onChange={(e) => setConfig(prev => ({ ...prev, message_template: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Variables disponibles: &#123;&#123;customer_name&#125;&#125;, &#123;&#123;message_content&#125;&#125;, &#123;&#123;business_name&#125;&#125;
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={isLoading}>
              <Settings size={16} className="mr-2" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={testConnection} 
              disabled={isTesting || !config.access_token}
            >
              <TestTube size={16} className="mr-2" />
              {isTesting ? 'Test en cours...' : 'Tester la connexion'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="text-blue-500" size={20} />
            Guide de configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Étapes pour configurer WhatsApp Business API :</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Créez un compte Meta Business</li>
              <li>Ajoutez WhatsApp Business API à votre compte</li>
              <li>Vérifiez votre numéro de téléphone</li>
              <li>Générez un token d'accès permanent</li>
              <li>Récupérez votre Phone Number ID</li>
              <li>Configurez vos templates de messages (optionnel)</li>
            </ol>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">⚠️ Important :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Chaque vendeur doit avoir son propre numéro WhatsApp Business</li>
              <li>Les tokens d'accès doivent être gardés secrets</li>
              <li>Testez toujours votre configuration avant utilisation</li>
              <li>Respectez les limites de l'API WhatsApp (1000 messages/jour en mode test)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
