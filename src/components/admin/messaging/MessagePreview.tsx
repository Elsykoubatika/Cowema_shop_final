
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, User } from 'lucide-react';

interface MessageData {
  subject: string;
  content: string;
  channel: 'email' | 'whatsapp';
  segments: string[];
  attachments: File[];
  images: File[];
}

interface MessagePreviewProps {
  messageData: MessageData;
  onClose: () => void;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({
  messageData,
  onClose
}) => {
  // Simuler le remplacement des variables avec des données d'exemple
  const replaceVariables = (content: string) => {
    const sampleData = {
      '{{nom}}': 'Marie Dupont',
      '{{titre}}': 'Générateur Solaire 1000W',
      '{{prix}}': '350 000',
      '{{lien}}': 'https://cowema.com/product/123',
      '{{remise}}': '20',
      '{{ville}}': 'Brazzaville',
      '{{total_commandes}}': '3',
      '{{total_depense}}': '125 000'
    };

    return Object.entries(sampleData).reduce((text, [variable, value]) => {
      return text.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
    }, content);
  };

  const previewContent = replaceVariables(messageData.content);
  const previewSubject = replaceVariables(messageData.subject);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {messageData.channel === 'email' ? (
              <>
                <Mail size={20} className="text-blue-600" />
                Aperçu Email
              </>
            ) : (
              <>
                <MessageCircle size={20} className="text-green-600" />
                Aperçu WhatsApp
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations sur l'envoi */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Informations d'envoi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {messageData.channel === 'email' ? 'Email' : 'WhatsApp'}
                </Badge>
                <Badge variant="secondary">
                  {messageData.segments.length} segment(s) sélectionné(s)
                </Badge>
              </div>
              {messageData.images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  📷 {messageData.images.length} image(s) jointe(s)
                </p>
              )}
              {messageData.attachments.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  📎 {messageData.attachments.length} fichier(s) joint(s)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Aperçu du message */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User size={16} />
                Aperçu pour "Marie Dupont"
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messageData.channel === 'email' ? (
                <div className="space-y-3">
                  {previewSubject && (
                    <div>
                      <p className="text-xs text-muted-foreground">Sujet:</p>
                      <p className="font-medium">{previewSubject}</p>
                    </div>
                  )}
                  <div className="border rounded p-4 bg-white">
                    <div className="whitespace-pre-wrap text-sm">
                      {previewContent}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      V
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="whitespace-pre-wrap text-sm">
                          {previewContent}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Envoyé via WhatsApp Business
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
            <strong>Note:</strong> Cet aperçu utilise des données d'exemple. 
            Les vraies valeurs seront automatiquement remplacées lors de l'envoi selon chaque client.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
