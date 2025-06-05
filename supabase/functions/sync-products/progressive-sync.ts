
import { CowemaApiClient } from './api-client.ts';
import { ProductTransformer } from './transformer.ts';
import { DatabaseService } from './database.ts';

export class ProgressiveSyncManager {
  private apiClient: CowemaApiClient;
  private dbService: DatabaseService;

  constructor() {
    this.apiClient = new CowemaApiClient();
    this.dbService = new DatabaseService();
  }

  async syncProgressively(onPageComplete?: (pageInfo: { page: number, totalPages: number, products: number }) => void) {
    console.log('Starting progressive product synchronization...');
    
    let allProducts = [];
    let currentPage = 1;
    let lastPage = 1;
    let totalProcessed = 0;
    let totalErrors = 0;

    try {
      // Fetch first page to get total page count
      console.log('Fetching first page to determine total pages...');
      const firstPageData = await this.apiClient.fetchPage(1);
      
      if (!firstPageData.data || firstPageData.data.length === 0) {
        throw new Error('No products available');
      }

      lastPage = firstPageData.last_page;
      console.log(`Total pages to fetch: ${lastPage}`);

      // Process first page immediately
      const firstPageTransformed = ProductTransformer.transformProducts(firstPageData.data);
      const { processed: firstPageProcessed, errors: firstPageErrors } = await this.dbService.upsertProducts(firstPageTransformed);
      
      allProducts.push(...firstPageData.data);
      totalProcessed += firstPageProcessed;
      totalErrors += firstPageErrors;

      console.log(`Page 1 processed: ${firstPageProcessed} products, ${firstPageErrors} errors`);
      
      if (onPageComplete) {
        onPageComplete({
          page: 1,
          totalPages: lastPage,
          products: firstPageProcessed
        });
      }

      // Process remaining pages progressively
      for (let page = 2; page <= lastPage; page++) {
        try {
          console.log(`Fetching and processing page ${page} of ${lastPage}...`);
          const pageData = await this.apiClient.fetchPage(page);
          
          if (pageData.data && pageData.data.length > 0) {
            const transformedProducts = ProductTransformer.transformProducts(pageData.data);
            const { processed, errors } = await this.dbService.upsertProducts(transformedProducts);
            
            allProducts.push(...pageData.data);
            totalProcessed += processed;
            totalErrors += errors;

            console.log(`Page ${page} processed: ${processed} products, ${errors} errors`);
            
            if (onPageComplete) {
              onPageComplete({
                page: page,
                totalPages: lastPage,
                products: processed
              });
            }
          }

          // Small delay between pages to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
          console.error(`Error processing page ${page}:`, error);
          totalErrors++;
          continue;
        }
      }

      return {
        success: true,
        totalFetched: allProducts.length,
        totalProcessed,
        totalErrors,
        pagesFetched: lastPage
      };

    } catch (error) {
      console.error('Progressive sync error:', error);
      throw error;
    }
  }
}
