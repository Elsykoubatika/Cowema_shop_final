
import { supabase } from '@/integrations/supabase/client';

export const messageSendService = {
  async confirmMessageSent(sendId: string, whatsappMessageId?: string) {
    const { error } = await supabase
      .from('message_sends')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        whatsapp_message_id: whatsappMessageId
      })
      .eq('id', sendId);

    if (error) throw error;
    return true;
  },

  async markMessageFailed(sendId: string, reason: string) {
    const { error } = await supabase
      .from('message_sends')
      .update({
        status: 'failed',
        failed_reason: reason
      })
      .eq('id', sendId);

    if (error) throw error;
    return true;
  }
};
