
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, Palette } from 'lucide-react';

interface EmailTemplate {
  name: string;
  subject: string;
  content: string;
  style: 'modern' | 'classic' | 'minimal' | 'colorful';
}

interface EmailTemplateBuilderProps {
  onTemplateSelect: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
}

export const EmailTemplateBuilder: React.FC<EmailTemplateBuilderProps> = ({
  onTemplateSelect,
  onPreview
}) => {
  const [template, setTemplate] = useState<EmailTemplate>({
    name: '',
    subject: '',
    content: '',
    style: 'modern'
  });

  const predefinedTemplates = [
    {
      name: 'Bienvenue client',
      subject: 'Bienvenue chez COWEMA, {{nom}} !',
      content: `<h2 style="color: #2563eb;">Bienvenue {{nom}} !</h2>
<p>Nous sommes ravis de vous compter parmi nos clients.</p>
<p>Voici ce que vous pouvez faire maintenant :</p>
<ul>
  <li>Explorer notre catalogue de produits</li>
  <li>Bénéficier de remises exclusives</li>
  <li>Contacter notre équipe pour toute question</li>
</ul>
<p style="margin-top: 20px;">
  <a href="{{lien}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Découvrir nos produits</a>
</p>`,
      style: 'modern' as const
    },
    {
      name: 'Promotion spéciale',
      subject: '🎉 Offre spéciale {{remise}}% pour vous {{nom}} !',
      content: `<div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px;">
  <h1>🎉 OFFRE SPÉCIALE 🎉</h1>
  <h2>{{remise}}% de réduction</h2>
  <p style="font-size: 18px;">Bonjour {{nom}},</p>
  <p>Profitez de notre promotion exceptionnelle !</p>
</div>
<div style="padding: 20px;">
  <h3>{{produit}}</h3>
  <p><strong>Prix normal :</strong> <span style="text-decoration: line-through;">{{prix}} FCFA</span></p>
  <p><strong>Prix promotionnel :</strong> <span style="color: #dc2626; font-size: 24px; font-weight: bold;">{{prix_reduit}} FCFA</span></p>
  <p style="margin-top: 30px;">
    <a href="{{lien}}" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">PROFITER DE L'OFFRE</a>
  </p>
</div>`,
      style: 'colorful' as const
    },
    {
      name: 'Commande confirmée',
      subject: 'Votre commande #{{numero}} est confirmée',
      content: `<h2 style="color: #059669;">Commande confirmée ✅</h2>
<p>Bonjour {{nom}},</p>
<p>Nous avons bien reçu votre commande et elle est en cours de préparation.</p>
<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>Détails de la commande</h3>
  <p><strong>Numéro :</strong> #{{numero}}</p>
  <p><strong>Produit :</strong> {{produit}}</p>
  <p><strong>Total :</strong> {{prix}} FCFA</p>
  <p><strong>Date de livraison estimée :</strong> {{date_livraison}}</p>
</div>
<p>Vous recevrez un SMS de confirmation lorsque votre commande sera expédiée.</p>`,
      style: 'minimal' as const
    }
  ];

  const styleOptions = [
    { value: 'modern', label: 'Moderne', description: 'Design épuré et contemporain' },
    { value: 'classic', label: 'Classique', description: 'Style traditionnel et professionnel' },
    { value: 'minimal', label: 'Minimal', description: 'Design simple et clair' },
    { value: 'colorful', label: 'Coloré', description: 'Vibrant et accrocheur' }
  ];

  const getStyleCSS = (style: string) => {
    const styles = {
      modern: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#ffffff',
        color: '#374151',
        borderRadius: '8px',
        padding: '24px'
      },
      classic: {
        fontFamily: 'Georgia, serif',
        backgroundColor: '#fefefe',
        color: '#1f2937',
        border: '2px solid #e5e7eb',
        padding: '32px'
      },
      minimal: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        color: '#111827',
        padding: '16px'
      },
      colorful: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '24px'
      }
    };
    return styles[style as keyof typeof styles] || styles.modern;
  };

  const handlePredefinedSelect = (predefined: typeof predefinedTemplates[0]) => {
    setTemplate(predefined);
  };

  const handleUseTemplate = () => {
    onTemplateSelect(template);
  };

  const handlePreview = () => {
    onPreview(template);
  };

  return (
    <div className="space-y-6">
      {/* Modèles prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Modèles prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {predefinedTemplates.map((predefined, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handlePredefinedSelect(predefined)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{predefined.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {styleOptions.find(s => s.value === predefined.style)?.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {predefined.subject}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Constructeur de template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Créer un template personnalisé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nom du template</Label>
              <Input
                id="template-name"
                value={template.name}
                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mon template email"
              />
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={template.style}
                onValueChange={(value: 'modern' | 'classic' | 'minimal' | 'colorful') =>
                  setTemplate(prev => ({ ...prev, style: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-subject">Sujet de l'email</Label>
            <Input
              id="template-subject"
              value={template.subject}
              onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Sujet de votre email avec {{variables}}"
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu de l'email</Label>
            <RichTextEditor
              value={template.content}
              onChange={(content) => setTemplate(prev => ({ ...prev, content }))}
              placeholder="Rédigez le contenu de votre email avec mise en forme..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!template.content}
            >
              <Eye size={16} />
              Aperçu
            </Button>
            
            <Button
              onClick={handleUseTemplate}
              className="flex items-center gap-2"
              disabled={!template.content}
            >
              <Save size={16} />
              Utiliser ce template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
