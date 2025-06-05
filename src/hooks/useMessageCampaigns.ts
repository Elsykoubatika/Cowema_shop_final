
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/hooks/useAuthStore';
import { MessageCampaign, MessageSend, CreateCampaignData } from '@/types/messageCampaigns';
import { campaignService } from '@/services/messageCampaignService';
import { messageSendService } from '@/services/messageSendService';

export const useMessageCampaigns = () => {
  const [campaigns, setCampaigns] = useState<MessageCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const createCampaign = async (campaignData: CreateCampaignData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une campagne.",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsLoading(true);

      const campaign = await campaignService.createCampaign(campaignData, user.id);

      toast({
        title: "Campagne créée",
        description: `Campagne "${campaignData.title}" créée avec ${campaignData.recipients.length} destinataires.`
      });

      return campaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la campagne.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmMessageSent = async (sendId: string, whatsappMessageId?: string) => {
    try {
      await messageSendService.confirmMessageSent(sendId, whatsappMessageId);

      toast({
        title: "Envoi confirmé",
        description: "Le message a été marqué comme envoyé.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Error confirming message sent:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation d'envoi.",
        variant: "destructive"
      });
      return false;
    }
  };

  const markMessageFailed = async (sendId: string, reason: string) => {
    try {
      await messageSendService.markMessageFailed(sendId, reason);
      return true;
    } catch (error) {
      console.error('Error marking message as failed:', error);
      return false;
    }
  };

  const getCampaigns = async () => {
    try {
      setIsLoading(true);
      const validatedCampaigns = await campaignService.getCampaigns();
      setCampaigns(validatedCampaigns);
      return validatedCampaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des campagnes.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaignSends = async (campaignId: string) => {
    try {
      return await campaignService.getCampaignSends(campaignId);
    } catch (error) {
      console.error('Error fetching campaign sends:', error);
      return [];
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: MessageCampaign['status']) => {
    try {
      return await campaignService.updateCampaignStatus(campaignId, status);
    } catch (error) {
      console.error('Error updating campaign status:', error);
      return false;
    }
  };

  return {
    campaigns,
    isLoading,
    createCampaign,
    confirmMessageSent,
    markMessageFailed,
    getCampaigns,
    getCampaignSends,
    updateCampaignStatus
  };
};

// Re-export types for backward compatibility
export type { MessageCampaign, MessageSend, CreateCampaignData };
