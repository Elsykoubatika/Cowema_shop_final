
import { supabase } from '@/integrations/supabase/client';
import { MessageCampaign, MessageSend, CreateCampaignData } from '@/types/messageCampaigns';
import { validateCampaignChannel, validateCampaignStatus, validateSendStatus, ensureArray } from '@/utils/messageCampaignValidation';

export const campaignService = {
  async createCampaign(campaignData: CreateCampaignData, userId: string) {
    // Créer la campagne
    const { data: campaign, error: campaignError } = await supabase
      .from('message_campaigns')
      .insert({
        title: campaignData.title,
        content: campaignData.content,
        channel: campaignData.channel,
        created_by: userId,
        status: 'sending',
        total_recipients: campaignData.recipients.length,
        segments: campaignData.segments,
        attachments: campaignData.attachments
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // Créer les envois individuels
    const messageSends = campaignData.recipients.map(recipient => ({
      campaign_id: campaign.id,
      recipient_phone: recipient.phone,
      recipient_name: recipient.name,
      message_content: campaignData.content,
      status: 'pending' as const
    }));

    const { error: sendsError } = await supabase
      .from('message_sends')
      .insert(messageSends);

    if (sendsError) throw sendsError;

    return campaign;
  },

  async getCampaigns() {
    const { data, error } = await supabase
      .from('message_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform and validate the data
    const validatedCampaigns: MessageCampaign[] = (data || []).map(campaign => ({
      ...campaign,
      channel: validateCampaignChannel(campaign.channel),
      status: validateCampaignStatus(campaign.status),
      segments: ensureArray(campaign.segments),
      attachments: ensureArray(campaign.attachments)
    }));

    return validatedCampaigns;
  },

  async getCampaignSends(campaignId: string) {
    const { data, error } = await supabase
      .from('message_sends')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform and validate the data
    const validatedSends: MessageSend[] = (data || []).map(send => ({
      ...send,
      status: validateSendStatus(send.status)
    }));

    return validatedSends;
  },

  async updateCampaignStatus(campaignId: string, status: MessageCampaign['status']) {
    const { error } = await supabase
      .from('message_campaigns')
      .update({ 
        status,
        ...(status === 'completed' && { completed_at: new Date().toISOString() })
      })
      .eq('id', campaignId);

    if (error) throw error;
    return true;
  }
};
