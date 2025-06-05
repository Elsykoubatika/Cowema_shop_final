
export interface MessageCampaign {
  id: string;
  title: string;
  content: string;
  channel: 'email' | 'whatsapp';
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  segments: any[];
  attachments: any[];
  scheduled_at?: string;
  completed_at?: string;
}

export interface MessageSend {
  id: string;
  campaign_id: string;
  recipient_phone: string;
  recipient_name?: string;
  message_content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failed_reason?: string;
  whatsapp_message_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignData {
  title: string;
  content: string;
  channel: 'email' | 'whatsapp';
  segments: any[];
  attachments: any[];
  recipients: Array<{ phone: string; name?: string }>;
}
