
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ProductCache } from './types.ts';

export class DatabaseService {
  private supabase: any;

  constructor() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async upsertProducts(products: ProductCache[]): Promise<{ processed: number; errors: number }> {
    console.log('Upserting products to cache...');
    
    let processedCount = 0;
    let errorCount = 0;

    try {
      const { error } = await this.supabase
        .from('products_cache')
        .upsert(products, {
          onConflict: 'external_api_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Upsert error:', error);
        errorCount = products.length;
      } else {
        processedCount = products.length;
        console.log(`Successfully processed ${products.length} products`);
      }
    } catch (error) {
      console.error('Processing error:', error);
      errorCount = products.length;
    }

    return { processed: processedCount, errors: errorCount };
  }
}
