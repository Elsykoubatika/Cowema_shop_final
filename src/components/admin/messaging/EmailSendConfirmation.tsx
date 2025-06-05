
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import { MessageSend } from '@/types/messageCampaigns';
import { Mail, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

interface EmailSendConfirmationProps {
  campaignId: string;
  sends: MessageSend[];
  onUpdate: () => void;
}

export const EmailSendConfirmation: React.FC<EmailSendConfirmationProps> = ({
  campaignId,
  sends,
  onUpdate
}) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const pendingSends = sends.filter(send => send.status === 'pending');
  const sentSends = sends.filter(send => send.status === 'sent');
  const failedSends = sends.filter(send => send.status === 'failed');

  const handleSendAll = async () => {
    if (pendingSends.length === 0) {
      toast({
        title: "Aucun email à envoyer",
        description: "Tous les emails ont déjà été envoyés.",
        variant: "default"
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await emailService.sendCampaignEmails(campaignId, pendingSends);
      
      toast({
        title: "Envoi terminé",
        description: `${result.success} emails envoyés avec succès, ${result.failed} échecs.`,
        variant: result.failed === 0 ? "default" : "destructive"
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi des emails.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSingle = async (send: MessageSend) => {
    try {
      const success = await emailService.sendEmail({
        campaignId,
        sendId: send.id,
        to: send.recipient_phone,
        subject: `Message de COWEMA`,
        content: send.message_content,
        recipientName: send.recipient_name
      });

      if (success) {
        toast({
          title: "Email envoyé",
          description: `Email envoyé à ${send.recipient_name || send.recipient_phone}`,
        });
      } else {
        toast({
          title: "Échec d'envoi",
          description: `Impossible d'envoyer l'email à ${send.recipient_name || send.recipient_phone}`,
          variant: "destructive"
        });
      }

      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi de l'email.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-500" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{pendingSends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Envoyés</p>
                <p className="text-2xl font-bold">{sentSends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-red-500" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Échecs</p>
                <p className="text-2xl font-bold">{failedSends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="text-blue-500" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{sends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={handleSendAll}
          disabled={isSending || pendingSends.length === 0}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          {isSending ? 'Envoi en cours...' : `Envoyer tous les emails (${pendingSends.length})`}
        </Button>
      </div>

      {/* Liste des emails */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des envois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sends.map((send) => (
              <div
                key={send.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {send.recipient_name || 'Client'}
                    </span>
                    <Badge variant="outline">
                      {send.recipient_phone}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {send.message_content}
                  </p>
                  {send.failed_reason && (
                    <p className="text-sm text-red-600">
                      Erreur: {send.failed_reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {send.status === 'pending' && (
                    <>
                      <Badge variant="secondary">
                        <Clock size={12} className="mr-1" />
                        En attente
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendSingle(send)}
                      >
                        <Send size={14} />
                      </Button>
                    </>
                  )}
                  
                  {send.status === 'sent' && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle size={12} className="mr-1" />
                      Envoyé
                    </Badge>
                  )}
                  
                  {send.status === 'failed' && (
                    <Badge variant="destructive">
                      <XCircle size={12} className="mr-1" />
                      Échec
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
