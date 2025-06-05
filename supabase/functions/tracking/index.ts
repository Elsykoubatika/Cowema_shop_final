
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const trackingData = await req.json();
      
      console.log('Received tracking data:', {
        sessionId: trackingData.sessionId,
        eventsCount: trackingData.events?.length || 0
      });

      // Insérer les données dans la table behavioral_tracking
      const { data, error } = await supabase
        .from('behavioral_tracking')
        .insert([{
          session_id: trackingData.sessionId,
          device_id: trackingData.deviceId,
          user_agent: trackingData.userAgent,
          screen_resolution: trackingData.screenResolution,
          language: trackingData.language,
          timezone: trackingData.timezone,
          events: trackingData.events || [],
          url: trackingData.url,
          referrer: trackingData.referrer
        }]);

      if (error) {
        console.error('Error inserting tracking data:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save tracking data' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Successfully saved tracking data');
      return new Response(
        JSON.stringify({ success: true }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Tracking endpoint error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
