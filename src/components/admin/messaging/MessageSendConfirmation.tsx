import React from 'react';
import { MessageSend } from '@/types/messageCampaigns';
import { EmailSendConfirmation } from './EmailSendConfirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MessageSendConfirmationProps {
  campaignId: string;
  sends: MessageSend[];
  onUpdate: () => void;
}

export const MessageSendConfirmation: React.FC<MessageSendConfirmationProps> = ({
  campaignId,
  sends,
  onUpdate
}) => {
  // Déterminer le type de campagne basé sur les envois
  const isEmailCampaign = sends.length > 0 && sends[0].recipient_phone?.includes('@');

  if (isEmailCampaign) {
    return (
      <EmailSendConfirmation
        campaignId={campaignId}
        sends={sends}
        onUpdate={onUpdate}
      />
    );
  }

  // Fallback vers l'ancien composant pour WhatsApp
  return (
    <div className="space-y-6">
      {/* WhatsApp confirmation logic */}
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Fonctionnalité WhatsApp en cours de développement
        </p>
      </div>
    </div>
  );
};
