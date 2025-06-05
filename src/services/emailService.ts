
import { supabase } from '@/integrations/supabase/client';

export interface SendEmailRequest {
  campaignId: string;
  sendId: string;
  to: string;
  subject: string;
  content: string;
  recipientName?: string;
}

export const emailService = {
  async sendEmail(request: SendEmailRequest): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: request
      });

      if (error) {
        console.error('Erreur lors de l\'envoi d\'email:', error);
        return false;
      }

      console.log('Email envoyé avec succès:', data);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'appel à la fonction d\'envoi:', error);
      return false;
    }
  },

  async sendCampaignEmails(campaignId: string, sends: any[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const send of sends) {
      const emailSent = await this.sendEmail({
        campaignId,
        sendId: send.id,
        to: send.recipient_phone, // Utilisé comme email
        subject: `Message de COWEMA`,
        content: send.message_content,
        recipientName: send.recipient_name
      });

      if (emailSent) {
        success++;
      } else {
        failed++;
      }

      // Petite pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { success, failed };
  }
};
