
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCampaign } from '@/types/messageCampaigns';
import { CampaignCard } from './CampaignCard';
import { MessageSquare } from 'lucide-react';

interface CampaignListProps {
  campaigns: MessageCampaign[];
  isLoading: boolean;
  onViewCampaign: (campaign: MessageCampaign) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  onViewCampaign
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement des campagnes...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">
            Aucune campagne ne correspond aux filtres sélectionnés
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onViewDetails={onViewCampaign}
        />
      ))}
    </div>
  );
};
