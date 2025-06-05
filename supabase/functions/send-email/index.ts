
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  campaignId: string;
  sendId: string;
  to: string;
  subject: string;
  content: string;
  recipientName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { campaignId, sendId, to, subject, content, recipientName }: EmailRequest = await req.json();

    console.log(`Sending email for campaign ${campaignId}, send ${sendId} to ${to}`);

    // Créer le contenu HTML de l'email avec une meilleure structure
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 0;
              background-color: #f8f9fa;
            }
            .email-container {
              background-color: #ffffff;
              margin: 20px auto;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px; 
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .content { 
              padding: 30px 20px;
              background-color: #ffffff;
            }
            .content h1 { color: #2563eb; font-size: 24px; margin-bottom: 16px; }
            .content h2 { color: #1e40af; font-size: 20px; margin-bottom: 12px; }
            .content h3 { color: #1e3a8a; font-size: 18px; margin-bottom: 8px; }
            .content p { margin-bottom: 16px; }
            .content ul, .content ol { margin-bottom: 16px; padding-left: 20px; }
            .content li { margin-bottom: 8px; }
            .content blockquote {
              border-left: 4px solid #e5e7eb;
              padding-left: 16px;
              margin: 16px 0;
              font-style: italic;
              background-color: #f9fafb;
              padding: 16px;
              border-radius: 4px;
            }
            .content a {
              color: #2563eb;
              text-decoration: none;
              font-weight: 500;
            }
            .content a:hover {
              text-decoration: underline;
            }
            .btn { 
              display: inline-block; 
              padding: 14px 28px; 
              background-color: #2563eb; 
              color: white !important; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: 600;
              margin: 16px 0;
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #1d4ed8;
            }
            .footer { 
              background-color: #f8f9fa; 
              padding: 20px; 
              text-align: center; 
              font-size: 14px; 
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
            .footer a {
              color: #6b7280;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
            @media (max-width: 600px) {
              .email-container {
                margin: 0;
                border-radius: 0;
              }
              .header, .content, .footer {
                padding-left: 16px;
                padding-right: 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>COWEMA</h1>
            </div>
            <div class="content">
              ${recipientName ? `<p style="font-size: 16px; margin-bottom: 20px;">Bonjour <strong>${recipientName}</strong>,</p>` : '<p style="font-size: 16px; margin-bottom: 20px;">Bonjour,</p>'}
              <div>${content}</div>
            </div>
            <div class="footer">
              <p><strong>COWEMA</strong> - Votre partenaire de confiance</p>
              <p style="margin-top: 12px;">
                Si vous ne souhaitez plus recevoir nos emails, 
                <a href="#" style="color: #6b7280;">cliquez ici pour vous désabonner</a>
              </p>
              <p style="margin-top: 8px; font-size: 12px;">
                © ${new Date().getFullYear()} COWEMA. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const emailResponse = await resend.emails.send({
      from: "COWEMA <noreply@cowema.com>", // Remplacez par votre domaine vérifié
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error("Erreur lors de l'envoi:", emailResponse.error);
      
      // Marquer l'envoi comme échoué
      await supabase
        .from('message_sends')
        .update({
          status: 'failed',
          failed_reason: emailResponse.error.message
        })
        .eq('id', sendId);

      return new Response(
        JSON.stringify({ error: emailResponse.error.message }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email envoyé avec succès:", emailResponse);

    // Marquer l'envoi comme réussi
    await supabase
      .from('message_sends')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', sendId);

    // Mettre à jour les compteurs de la campagne
    await supabase.rpc('increment_campaign_sent_count', { campaign_id: campaignId });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        message: "Email envoyé avec succès" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Erreur dans send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
