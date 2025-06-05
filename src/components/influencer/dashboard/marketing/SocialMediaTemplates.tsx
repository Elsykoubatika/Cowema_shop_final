
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Instagram, MessageCircle, Video, Share } from 'lucide-react';

interface SocialMediaTemplatesProps {
  influencerName: string;
  referralCode: string;
  copyToClipboard: (text: string, label: string) => void;
}

const SocialMediaTemplates: React.FC<SocialMediaTemplatesProps> = ({
  influencerName,
  referralCode,
  copyToClipboard
}) => {
  const templates = [
    {
      platform: 'Instagram',
      icon: Instagram,
      type: 'Story',
      content: `🔥 Découverte incroyable ! 

Je viens de tomber sur cette boutique en ligne avec des produits de qualité à prix exceptionnels ! 

✨ Livraison rapide
🛍️ Large choix
💰 Prix imbattables

Utilisez mon code : ${referralCode}

#shopping #bonplan #qualité #cowema`,
      cta: 'Swipe up pour découvrir !'
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      type: 'Post',
      content: `Hey les amis ! 👋

J'ai une super découverte à partager avec vous ! Cette boutique en ligne propose des produits incroyables avec un rapport qualité-prix exceptionnel ! 

Ce que j'adore :
✅ Livraison ultra rapide 
✅ Service client au top
✅ Prix défiant toute concurrence
✅ Qualité garantie

En plus, avec mon code partenaire ${referralCode}, vous bénéficiez d'une expérience shopping optimale !

Dites-moi en commentaire si vous testez ! 💬

#partenariat #shopping #qualité #bonplan #cowema`,
      cta: 'Lien en bio !'
    },
    {
      platform: 'TikTok',
      icon: Video,
      type: 'Vidéo',
      content: `POV: Tu découvres THE boutique en ligne du moment 🔥

Salut tout le monde ! Alors j'ai découvert cette boutique et c'est une DINGUERIE ! 

Pourquoi je recommande :
- Livraison super rapide ⚡
- Prix incroyables 💰
- Qualité au rendez-vous ✨
- Service client réactif 📞

Code : ${referralCode}

Lien en bio ! Go tester et dis-moi ce que tu en penses ! 

#fyp #shopping #bonplan #qualité #cowema #pourtoi`,
      cta: 'Lien en bio, go tester !'
    },
    {
      platform: 'Facebook',
      icon: Share,
      type: 'Publication',
      content: `Salut tout le monde ! 

Je tenais à vous parler d'une boutique en ligne que j'ai découverte récemment et qui m'a vraiment impressionnée ! 

🛍️ Large gamme de produits de qualité
📦 Livraison rapide et soignée  
💰 Prix très compétitifs
🤝 Service client professionnel

En tant que partenaire, je peux vous garantir le sérieux de cette boutique. Si vous cherchez des produits de qualité à prix juste, je vous la recommande vraiment !

Mon code partenaire : ${referralCode}

N'hésitez pas si vous avez des questions ! 😊

#shopping #qualité #recommandation #cowema`,
      cta: 'Découvrez la boutique'
    },
    {
      platform: 'WhatsApp',
      icon: MessageCircle,
      type: 'Status/Message',
      content: `🔥 DÉCOUVERTE SHOPPING ! 

Salut ! Je voulais te partager cette super boutique en ligne que j'ai testée ! 

✨ Qualité top
🚀 Livraison express  
💯 Prix imbattables

Code : ${referralCode}

Tu vas adorer ! 😍`,
      cta: 'Clique sur le lien !'
    }
  ];

  const quickCaptions = [
    "Mes derniers coups de cœur shopping ! 😍",
    "La qualité à petit prix, ça existe ! ✨",
    "Ma nouvelle adresse shopping préférée 🛍️",
    "Découverte du jour : cette boutique incroyable ! 🔥",
    "Shopping réussi avec cette pépite ! 💎",
    "Mes bonnes adresses du moment ! 📍"
  ];

  const hashtags = [
    "#shopping #bonplan #qualité",
    "#cowema #découverte #recommandation", 
    "#lifestyle #shopping #qualité",
    "#bonplan #shoppingaddict #qualité",
    "#découverte #shopping #lifestyle",
    "#qualité #rapport #bonplan"
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Modèles de Publications</CardTitle>
            <CardDescription>
              Copiez et personnalisez ces modèles pour vos différentes plateformes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {templates.map((template, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <template.icon className="h-4 w-4" />
                      <span className="font-medium">{template.platform}</span>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(template.content, `Modèle ${template.platform}`)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copier
                    </Button>
                  </div>
                  
                  <Textarea 
                    value={template.content}
                    readOnly
                    className="min-h-[120px] text-sm"
                  />
                  
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    <strong>Call-to-action suggéré :</strong> {template.cta}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Légendes Rapides</CardTitle>
              <CardDescription>
                Phrases d'accroche prêtes à utiliser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickCaptions.map((caption, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{caption}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(caption, "Légende")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hashtags Populaires</CardTitle>
              <CardDescription>
                Groupes de hashtags optimisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hashtags.map((hashtagGroup, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{hashtagGroup}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(hashtagGroup, "Hashtags")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaTemplates;
