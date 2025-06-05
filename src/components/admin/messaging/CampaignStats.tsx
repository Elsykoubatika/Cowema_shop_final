
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCampaign } from '@/types/messageCampaigns';

interface CampaignStatsProps {
  campaign: MessageCampaign;
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({ campaign }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {campaign.channel === 'email' ? '📧' : '💬'}
          {campaign.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <p className="font-medium">{campaign.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Canal</p>
            <p className="font-medium">{campaign.channel}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Destinataires</p>
            <p className="font-medium">{campaign.total_recipients}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Envoyés</p>
            <p className="font-medium text-green-600">{campaign.sent_count}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Contenu du message</p>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">{campaign.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
