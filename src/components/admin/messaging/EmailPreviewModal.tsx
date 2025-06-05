
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EmailTemplate {
  name: string;
  subject: string;
  content: string;
  style: 'modern' | 'classic' | 'minimal' | 'colorful';
}

interface EmailPreviewModalProps {
  template: EmailTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  template,
  isOpen,
  onClose
}) => {
  // Simuler le remplacement des variables
  const replaceVariables = (content: string) => {
    const sampleData = {
      '{{nom}}': 'Marie Dupont',
      '{{email}}': 'marie.dupont@email.com',
      '{{entreprise}}': 'Entreprise ABC',
      '{{produit}}': 'Générateur Solaire 1000W',
      '{{prix}}': '350 000',
      '{{prix_reduit}}': '280 000',
      '{{remise}}': '20',
      '{{lien}}': 'https://cowema.com/product/123',
      '{{date}}': new Date().toLocaleDateString('fr-FR'),
      '{{date_livraison}}': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      '{{numero}}': 'CMD-2024-001'
    };

    return Object.entries(sampleData).reduce((text, [variable, value]) => {
      return text.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
    }, content);
  };

  const getStyleCSS = (style: string) => {
    const styles = {
      modern: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#ffffff',
        color: '#374151',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #e5e7eb'
      },
      classic: {
        fontFamily: 'Georgia, serif',
        backgroundColor: '#fefefe',
        color: '#1f2937',
        border: '2px solid #d1d5db',
        padding: '32px',
        borderRadius: '4px'
      },
      minimal: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        color: '#111827',
        padding: '16px',
        border: '1px solid #f3f4f6'
      },
      colorful: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #d1d5db'
      }
    };
    return styles[style as keyof typeof styles] || styles.modern;
  };

  const previewSubject = replaceVariables(template.subject);
  const previewContent = replaceVariables(template.content);
  const styleCSS = getStyleCSS(template.style);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Aperçu du template email
            <Badge variant="outline">{template.style}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations du template */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Nom :</span>
                  <span className="ml-2">{template.name || 'Template sans nom'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Style :</span>
                  <span className="ml-2 capitalize">{template.style}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aperçu de l'email */}
          <div className="border rounded-lg overflow-hidden">
            {/* En-tête email */}
            <div className="bg-gray-50 border-b p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">De :</span>
                  <span className="text-sm">COWEMA &lt;noreply@cowema.com&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">À :</span>
                  <span className="text-sm">marie.dupont@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Sujet :</span>
                  <span className="text-sm font-medium">{previewSubject}</span>
                </div>
              </div>
            </div>

            {/* Contenu email */}
            <div className="p-6" style={{ backgroundColor: '#f8f9fa' }}>
              <div
                style={styleCSS}
                dangerouslySetInnerHTML={{ __html: previewContent }}
                className="email-content"
              />
            </div>

            {/* Pied de page */}
            <div className="bg-gray-50 border-t p-4 text-center text-xs text-muted-foreground">
              <p>Cet email a été envoyé par COWEMA</p>
              <p className="mt-1">
                Si vous ne souhaitez plus recevoir nos emails, 
                <a href="#" className="text-blue-600 hover:underline ml-1">cliquez ici</a>
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
            <strong>Note :</strong> Cet aperçu utilise des données d'exemple. 
            Les vraies valeurs seront automatiquement remplacées lors de l'envoi selon chaque client.
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .email-content h1 {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 1rem;
            }
            .email-content h2 {
              font-size: 1.25rem;
              font-weight: bold;
              margin-bottom: 0.75rem;
            }
            .email-content h3 {
              font-size: 1.125rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            .email-content p {
              margin-bottom: 0.75rem;
              line-height: 1.6;
            }
            .email-content ul, .email-content ol {
              margin-bottom: 0.75rem;
              padding-left: 1.5rem;
            }
            .email-content li {
              margin-bottom: 0.25rem;
            }
            .email-content blockquote {
              border-left: 4px solid #e5e7eb;
              padding-left: 1rem;
              margin: 1rem 0;
              font-style: italic;
              background-color: #f9fafb;
              padding: 1rem;
              border-radius: 0.25rem;
            }
            .email-content a {
              color: #2563eb;
              text-decoration: underline;
            }
          `
        }} />
      </DialogContent>
    </Dialog>
  );
};
