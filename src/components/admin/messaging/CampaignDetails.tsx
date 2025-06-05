
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCampaign, MessageSend } from '@/types/messageCampaigns';
import { CampaignStats } from './CampaignStats';
import { MessageSendConfirmation } from './MessageSendConfirmation';

interface CampaignDetailsProps {
  campaign: MessageCampaign;
  campaignSends: MessageSend[];
  onBack: () => void;
  onUpdate: () => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  campaignSends,
  onBack,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Détails de la campagne</h3>
          <p className="text-muted-foreground">{campaign.title}</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Retour à l'historique
        </Button>
      </div>

      <CampaignStats campaign={campaign} />

      <MessageSendConfirmation
        campaignId={campaign.id}
        sends={campaignSends}
        onUpdate={onUpdate}
      />
    </div>
  );
};
