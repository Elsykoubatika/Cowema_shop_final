
import React, { useEffect, useState } from 'react';
import { useMessageCampaigns } from '@/hooks/useMessageCampaigns';
import { MessageCampaign, MessageSend } from '@/types/messageCampaigns';
import { CampaignFilters } from './CampaignFilters';
import { CampaignList } from './CampaignList';
import { CampaignDetails } from './CampaignDetails';

export const EnhancedMessageHistory: React.FC = () => {
  const { campaigns, getCampaigns, getCampaignSends, isLoading } = useMessageCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<MessageCampaign | null>(null);
  const [campaignSends, setCampaignSends] = useState<MessageSend[]>([]);

  useEffect(() => {
    getCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const handleViewCampaign = async (campaign: MessageCampaign) => {
    setSelectedCampaign(campaign);
    const sends = await getCampaignSends(campaign.id);
    setCampaignSends(sends);
  };

  const updateCampaignSends = async () => {
    if (selectedCampaign) {
      const sends = await getCampaignSends(selectedCampaign.id);
      setCampaignSends(sends);
    }
  };

  const handleBack = () => {
    setSelectedCampaign(null);
    setCampaignSends([]);
  };

  if (selectedCampaign) {
    return (
      <CampaignDetails
        campaign={selectedCampaign}
        campaignSends={campaignSends}
        onBack={handleBack}
        onUpdate={updateCampaignSends}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CampaignFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        channelFilter={channelFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onChannelChange={setChannelFilter}
      />

      <CampaignList
        campaigns={filteredCampaigns}
        isLoading={isLoading}
        onViewCampaign={handleViewCampaign}
      />
    </div>
  );
};
