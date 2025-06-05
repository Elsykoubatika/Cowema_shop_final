
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ProgressiveSyncManager } from './progressive-sync.ts';
import { SyncResult } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting progressive product synchronization...');

    const syncManager = new ProgressiveSyncManager();
    
    // Start progressive sync
    const result = await syncManager.syncProgressively((pageInfo) => {
      console.log(`Page ${pageInfo.page}/${pageInfo.totalPages} completed - ${pageInfo.products} products processed`);
    });

    const syncResult: SyncResult = {
      success: true,
      message: 'Progressive product synchronization completed successfully',
      stats: {
        total_fetched: result.totalFetched,
        processed: result.totalProcessed,
        errors: result.totalErrors,
        pages_fetched: result.pagesFetched,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Progressive synchronization result:', syncResult);

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Progressive synchronization error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
