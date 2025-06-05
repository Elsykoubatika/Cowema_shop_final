
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Link, 
  ExternalLink, 
  QrCode,
  Share2,
  Sparkles,
  Star,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  Video
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  generateReferralLink, 
  generatePersonalizedReferralLink, 
  generateShortInfluencerLink,
  generateCustomTrackingLink 
} from '@/utils/influencerUtils';

interface EnhancedLinkGeneratorProps {
  referralCode: string;
  influencerName: string;
  copyToClipboard: (text: string, label: string) => void;
}

const EnhancedLinkGenerator: React.FC<EnhancedLinkGeneratorProps> = ({
  referralCode,
  influencerName,
  copyToClipboard
}) => {
  const [customParams, setCustomParams] = useState({
    campaign: '',
    source: '',
    medium: '',
    content: ''
  });
  const [customMessage, setCustomMessage] = useState('');

  const baseLink = generateReferralLink(referralCode);
  const personalizedLink = generatePersonalizedReferralLink(referralCode, influencerName);
  const shortLink = generateShortInfluencerLink(referralCode, influencerName.split(' ')[0]);

  const generateCustomLink = () => {
    return generateCustomTrackingLink(referralCode, {
      campaign: customParams.campaign || 'custom',
      source: customParams.source || 'manual',
      medium: customParams.medium || 'link',
      content: customParams.content
    });
  };

  const socialPlatforms = [
    {
      name: 'Instagram Stories',
      icon: Instagram,
      color: 'from-purple-500 to-pink-500',
      params: { source: 'instagram', medium: 'story', campaign: 'ig_story' },
      message: '🔥 Découvrez cette offre incroyable ! Swipe up pour en profiter 👆'
    },
    {
      name: 'Facebook Post',
      icon: Facebook,
      color: 'from-blue-500 to-blue-600',
      params: { source: 'facebook', medium: 'post', campaign: 'fb_post' },
      message: '👋 Mes amis ! Je viens de découvrir quelque chose de génial que je dois absolument partager avec vous !'
    },
    {
      name: 'WhatsApp Status',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      params: { source: 'whatsapp', medium: 'status', campaign: 'wa_status' },
      message: '💚 Salut la famille ! Regardez ce que j\'ai trouvé pour vous...'
    },
    {
      name: 'TikTok Bio',
      icon: Video,
      color: 'from-black to-gray-800',
      params: { source: 'tiktok', medium: 'bio', campaign: 'tiktok_bio' },
      message: '🎵 Link in bio pour les bonnes affaires ! #shopping #deals'
    }
  ];

  const LinkCard = ({ 
    title, 
    description, 
    link, 
    icon: Icon, 
    variant = 'default',
    featured = false 
  }: {
    title: string;
    description: string;
    link: string;
    icon: any;
    variant?: 'default' | 'success' | 'premium';
    featured?: boolean;
  }) => (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      variant === 'success' ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' :
      variant === 'premium' ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' :
      'border-gray-200 hover:border-gray-300'
    }`}>
      {featured && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Recommandé
          </Badge>
        </div>
      )}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              variant === 'success' ? 'bg-green-100' :
              variant === 'premium' ? 'bg-purple-100' :
              'bg-gray-100'
            }`}>
              <Icon className={`h-5 w-5 ${
                variant === 'success' ? 'text-green-600' :
                variant === 'premium' ? 'text-purple-600' :
                'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input 
              value={link} 
              readOnly 
              className="text-xs font-mono bg-muted/50"
            />
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard(link, title)}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🔗 Générateur de Liens Avancé
        </h2>
        <p className="text-muted-foreground">
          Créez des liens optimisés pour maximiser vos conversions
        </p>
      </div>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Liens Rapides</TabsTrigger>
          <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
          <TabsTrigger value="custom">Personnalisé</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid gap-4">
            <LinkCard
              title="Lien Standard"
              description="Parfait pour un usage général"
              link={baseLink}
              icon={Globe}
            />
            
            <LinkCard
              title="Lien Personnalisé"
              description="Avec votre nom pour un meilleur tracking"
              link={personalizedLink}
              icon={Star}
              variant="success"
              featured
            />
            
            <LinkCard
              title="Lien Court Premium"
              description="Idéal pour les stories et bio"
              link={shortLink}
              icon={Sparkles}
              variant="premium"
            />
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              <strong>Conseil :</strong> Utilisez le lien personnalisé pour un meilleur taux de conversion et un tracking plus précis.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid gap-4">
            {socialPlatforms.map((platform, index) => {
              const platformLink = generateCustomTrackingLink(referralCode, platform.params);
              const fullMessage = `${platform.message}\n\n👉 ${platformLink}\n\n#${referralCode}`;
              
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                          <platform.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{platform.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Optimisé pour {platform.name.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Message + Lien :</Label>
                        <Textarea
                          value={fullMessage}
                          readOnly
                          rows={3}
                          className="text-xs bg-muted/50"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => copyToClipboard(fullMessage, `Message ${platform.name}`)}
                          className="w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier le message complet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Créateur de Liens Personnalisés
              </CardTitle>
              <CardDescription>
                Ajoutez des paramètres de tracking pour analyser vos performances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign">Campagne</Label>
                  <Input
                    id="campaign"
                    placeholder="ex: promo_noel"
                    value={customParams.campaign}
                    onChange={(e) => setCustomParams(prev => ({ ...prev, campaign: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="ex: instagram"
                    value={customParams.source}
                    onChange={(e) => setCustomParams(prev => ({ ...prev, source: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="medium">Médium</Label>
                  <Input
                    id="medium"
                    placeholder="ex: story, post"
                    value={customParams.medium}
                    onChange={(e) => setCustomParams(prev => ({ ...prev, medium: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Input
                    id="content"
                    placeholder="ex: button_cta"
                    value={customParams.content}
                    onChange={(e) => setCustomParams(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="custom-message">Message personnalisé</Label>
                <Textarea
                  id="custom-message"
                  placeholder="Rédigez votre message promotionnel..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="pt-4 border-t space-y-3">
                <Label>Lien généré :</Label>
                <div className="flex gap-2">
                  <Input
                    value={generateCustomLink()}
                    readOnly
                    className="font-mono text-xs bg-muted"
                  />
                  <Button 
                    onClick={() => copyToClipboard(generateCustomLink(), 'Lien personnalisé')}
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                {customMessage && (
                  <Button 
                    onClick={() => copyToClipboard(
                      `${customMessage}\n\n👉 ${generateCustomLink()}\n\n#${referralCode}`,
                      'Message complet'
                    )}
                    className="w-full"
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copier le message complet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedLinkGenerator;
