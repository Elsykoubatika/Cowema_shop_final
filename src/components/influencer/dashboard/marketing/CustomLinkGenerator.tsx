
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Link, 
  ExternalLink, 
  Info,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomLinkGeneratorProps {
  baseLink: string;
  referralCode: string;
  copyToClipboard: (text: string, label: string) => void;
}

const CustomLinkGenerator: React.FC<CustomLinkGeneratorProps> = ({
  baseLink,
  referralCode,
  copyToClipboard
}) => {
  const [campaign, setCampaign] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [content, setContent] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const generateCustomLink = () => {
    const url = new URL(baseLink);
    url.searchParams.set('ref', referralCode);
    
    if (campaign) url.searchParams.set('utm_campaign', campaign);
    if (source) url.searchParams.set('utm_source', source);
    if (medium) url.searchParams.set('utm_medium', medium);
    if (content) url.searchParams.set('utm_content', content);
    
    return url.toString();
  };

  const generateMessage = () => {
    const link = generateCustomLink();
    
    if (customMessage) {
      return `${customMessage}\n\n👉 ${link}\n\n#${referralCode}`;
    }
    
    return `🔥 Découvrez les meilleures offres avec mon code partenaire ${referralCode} !\n\n✨ Bénéficiez de mon accompagnement personnalisé et de conseils d'expert.\n\n👉 ${link}\n\n#Shopping #BonsPlans #${referralCode}`;
  };

  const handleCopyLink = () => {
    const link = generateCustomLink();
    copyToClipboard(link, 'Lien personnalisé');
  };

  const handleCopyMessage = () => {
    const message = generateMessage();
    copyToClipboard(message, 'Message de promotion');
  };

  const presetCampaigns = [
    { name: 'Instagram Story', source: 'instagram', medium: 'story', campaign: 'story_promo' },
    { name: 'Facebook Post', source: 'facebook', medium: 'social', campaign: 'fb_post' },
    { name: 'WhatsApp Status', source: 'whatsapp', medium: 'status', campaign: 'wa_status' },
    { name: 'TikTok Bio', source: 'tiktok', medium: 'bio', campaign: 'tiktok_bio' },
    { name: 'YouTube Description', source: 'youtube', medium: 'description', campaign: 'yt_desc' }
  ];

  const handlePresetClick = (preset: any) => {
    setSource(preset.source);
    setMedium(preset.medium);
    setCampaign(preset.campaign);
  };

  return (
    <div className="space-y-6">
      {/* Instructions et conseils */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Comment utiliser vos liens personnalisés :</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Créez des liens spécifiques pour chaque plateforme ou campagne</li>
            <li>• Suivez les performances de chaque source de trafic</li>
            <li>• Utilisez des messages accrocheurs pour attirer l'attention</li>
            <li>• Partagez régulièrement sur vos réseaux sociaux</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Générateur de liens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Générateur de Liens
            </CardTitle>
            <CardDescription>
              Créez des liens personnalisés pour suivre vos performances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Presets rapides */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Configurations rapides :</Label>
              <div className="flex flex-wrap gap-2">
                {presetCampaigns.map((preset) => (
                  <Badge
                    key={preset.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="ex: instagram"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  placeholder="ex: story, post"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="campaign">Campagne</Label>
              <Input
                id="campaign"
                placeholder="ex: promo_janvier"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Contenu (optionnel)</Label>
              <Input
                id="content"
                placeholder="ex: bouton_cta"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t">
              <Label className="text-sm font-medium mb-2 block">Lien généré :</Label>
              <div className="flex gap-2">
                <Input
                  value={generateCustomLink()}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <Button onClick={handleCopyLink} size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Générateur de messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Créateur de Messages
            </CardTitle>
            <CardDescription>
              Rédigez des messages attractifs pour vos promotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="custom-message">Message personnalisé (optionnel)</Label>
              <Textarea
                id="custom-message"
                placeholder="Écrivez votre message promotionnel..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Laissez vide pour utiliser un message par défaut
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Aperçu du message :</Label>
              <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                {generateMessage()}
              </div>
            </div>

            <Button onClick={handleCopyMessage} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copier le message complet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conseils de performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Conseils pour maximiser vos conversions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📱 Sur les réseaux sociaux :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Utilisez des émojis pour attirer l'attention</li>
                <li>• Postez aux heures de forte affluence</li>
                <li>• Ajoutez des hashtags pertinents</li>
                <li>• Interagissez avec vos abonnés</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💡 Bonnes pratiques :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Soyez authentique dans vos recommandations</li>
                <li>• Partagez votre expérience personnelle</li>
                <li>• Créez un sentiment d'urgence</li>
                <li>• Proposez de l'aide personnalisée</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomLinkGenerator;
