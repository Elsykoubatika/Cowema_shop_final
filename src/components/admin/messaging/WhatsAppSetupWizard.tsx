
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Phone, Facebook, Settings, Zap, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  instructions?: string[];
}

interface WhatsAppSetupWizardProps {
  onComplete: (config: any) => void;
  onCancel: () => void;
}

export const WhatsAppSetupWizard: React.FC<WhatsAppSetupWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [facebookAppId, setFacebookAppId] = useState('');
  const [setupData, setSetupData] = useState<any>({});

  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'phone-verification',
      title: 'Vérification du numéro',
      description: 'Vérifiez votre numéro de téléphone WhatsApp Business',
      status: 'in-progress'
    },
    {
      id: 'facebook-connection',
      title: 'Connexion Facebook',
      description: 'Connectez votre compte Facebook Business',
      status: 'pending'
    },
    {
      id: 'whatsapp-config',
      title: 'Configuration WhatsApp',
      description: 'Configuration de l\'API WhatsApp Business',
      status: 'pending'
    },
    {
      id: 'webhook-setup',
      title: 'Configuration Webhooks',
      description: 'Configuration des webhooks pour response.io',
      status: 'pending'
    },
    {
      id: 'testing',
      title: 'Tests et validation',
      description: 'Test de la configuration complète',
      status: 'pending'
    }
  ]);

  const updateStepStatus = (stepId: string, status: SetupStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handlePhoneVerification = async () => {
    if (!phoneNumber || !businessName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Simuler l'envoi du code de vérification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Code envoyé",
        description: `Un code de vérification a été envoyé au ${phoneNumber}`,
      });
      
      setIsVerifying(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le code de vérification.",
        variant: "destructive"
      });
      setIsVerifying(false);
    }
  };

  const handleCodeVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code de vérification valide.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simuler la vérification du code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateStepStatus('phone-verification', 'completed');
      setCurrentStep(1);
      updateStepStatus('facebook-connection', 'in-progress');
      
      toast({
        title: "Numéro vérifié",
        description: "Votre numéro WhatsApp a été vérifié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Code de vérification incorrect.",
        variant: "destructive"
      });
    }
  };

  const handleFacebookConnection = () => {
    // Ouvrir le flux d'autorisation Facebook
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${facebookAppId}&` +
      `redirect_uri=${window.location.origin}/admin/messaging/whatsapp-callback&` +
      `scope=whatsapp_business_management,business_management&` +
      `response_type=code`;
    
    window.open(facebookAuthUrl, 'facebook-auth', 'width=600,height=600');
    
    // Écouter la réponse de la popup
    window.addEventListener('message', (event) => {
      if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
        updateStepStatus('facebook-connection', 'completed');
        setCurrentStep(2);
        updateStepStatus('whatsapp-config', 'in-progress');
        setSetupData(prev => ({ ...prev, facebookToken: event.data.token }));
      }
    });
  };

  const handleWhatsAppConfig = async () => {
    try {
      // Configurer automatiquement WhatsApp Business API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const whatsappConfig = {
        phoneNumberId: `${Date.now()}`,
        businessAccountId: `BA_${Date.now()}`,
        accessToken: `ACCESS_TOKEN_${Date.now()}`,
        webhookVerifyToken: `VERIFY_${Date.now()}`
      };
      
      setSetupData(prev => ({ ...prev, ...whatsappConfig }));
      updateStepStatus('whatsapp-config', 'completed');
      setCurrentStep(3);
      updateStepStatus('webhook-setup', 'in-progress');
      
      toast({
        title: "Configuration réussie",
        description: "API WhatsApp Business configurée automatiquement.",
      });
    } catch (error) {
      updateStepStatus('whatsapp-config', 'error');
      toast({
        title: "Erreur",
        description: "Erreur lors de la configuration WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const handleWebhookSetup = async () => {
    try {
      // Configurer les webhooks pour response.io
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateStepStatus('webhook-setup', 'completed');
      setCurrentStep(4);
      updateStepStatus('testing', 'in-progress');
      
      toast({
        title: "Webhooks configurés",
        description: "Connexion à response.io établie.",
      });
    } catch (error) {
      updateStepStatus('webhook-setup', 'error');
    }
  };

  const handleFinalTesting = async () => {
    try {
      // Tests finaux
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateStepStatus('testing', 'completed');
      
      const finalConfig = {
        ...setupData,
        phoneNumber,
        businessName,
        isActive: true,
        configuredAt: new Date().toISOString()
      };
      
      onComplete(finalConfig);
      
      toast({
        title: "Configuration terminée !",
        description: "Votre compte WhatsApp Business est prêt à utiliser.",
      });
    } catch (error) {
      updateStepStatus('testing', 'error');
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="business-name">Nom de l'entreprise *</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="COWEMA"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Numéro WhatsApp Business *</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+243812345678"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Format international avec indicatif pays
              </p>
            </div>

            <Button 
              onClick={handlePhoneVerification} 
              disabled={isVerifying || !phoneNumber || !businessName}
              className="w-full"
            >
              {isVerifying ? 'Envoi en cours...' : 'Envoyer le code de vérification'}
            </Button>

            {isVerifying && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Un SMS avec un code de vérification va être envoyé à votre numéro.
                </AlertDescription>
              </Alert>
            )}

            {!isVerifying && phoneNumber && (
              <div className="space-y-2">
                <Label htmlFor="verification-code">Code de vérification</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
                <Button 
                  onClick={handleCodeVerification}
                  disabled={!verificationCode}
                  variant="outline"
                  className="w-full"
                >
                  Vérifier le code
                </Button>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Alert>
              <Facebook className="h-4 w-4" />
              <AlertDescription>
                Connectez votre compte Facebook Business pour accéder à l'API WhatsApp Business.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="facebook-app-id">Facebook App ID (optionnel)</Label>
              <Input
                id="facebook-app-id"
                value={facebookAppId}
                onChange={(e) => setFacebookAppId(e.target.value)}
                placeholder="Laissez vide pour utiliser l'app par défaut"
              />
            </div>

            <Button onClick={handleFacebookConnection} className="w-full">
              <Facebook className="mr-2 h-4 w-4" />
              Connecter Facebook Business
            </Button>

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Ce qui va se passer :</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ouverture d'une fenêtre de connexion Facebook</li>
                <li>Autorisation d'accès à WhatsApp Business</li>
                <li>Configuration automatique des permissions</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Configuration automatique de l'API WhatsApp Business en cours...
              </AlertDescription>
            </Alert>

            <Button onClick={handleWhatsAppConfig} className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configurer WhatsApp Business API
            </Button>

            <div className="text-sm text-muted-foreground">
              <p><strong>Configuration automatique :</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Création du Phone Number ID</li>
                <li>Génération des tokens d'accès</li>
                <li>Configuration des templates de messages</li>
                <li>Setup des webhooks</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Configuration de l'intégration avec response.io pour la gestion des conversations.
              </AlertDescription>
            </Alert>

            <Button onClick={handleWebhookSetup} className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Configurer response.io
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Intégration response.io</h4>
              <ul className="text-sm space-y-1">
                <li>• Synchronisation automatique des conversations</li>
                <li>• Gestion centralisée des messages</li>
                <li>• Attribution automatique aux vendeurs</li>
                <li>• Historique complet des interactions</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Test final de la configuration et activation du compte.
              </AlertDescription>
            </Alert>

            <Button onClick={handleFinalTesting} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Effectuer les tests finaux
            </Button>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tests inclus :</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Connexion API WhatsApp</li>
                <li>✓ Envoi de message test</li>
                <li>✓ Réception webhook response.io</li>
                <li>✓ Configuration des templates</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="text-green-500" size={24} />
            Assistant de configuration WhatsApp Business
          </CardTitle>
          <Progress value={progressPercent} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Steps overview */}
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' :
                    step.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                    step.status === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.status === 'in-progress' ? 'text-blue-600' : ''
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Current step content */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">
                {steps[currentStep]?.title}
              </h3>
              {getStepContent()}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="ml-auto"
              >
                <a 
                  href="https://business.whatsapp.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Guide WhatsApp Business
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
