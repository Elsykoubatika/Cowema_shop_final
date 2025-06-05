
import { CowemaApiResponse, CowemaProduct } from './types.ts';

export class CowemaApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://eu.cowema.org/api/public';
  }

  async fetchPage(page: number): Promise<CowemaApiResponse> {
    const response = await fetch(`${this.baseUrl}/products?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    return await response.json();
  }

  async fetchAllProducts(): Promise<CowemaProduct[]> {
    console.log('Starting to fetch all products from Cowema API...');
    
    let allProducts: CowemaProduct[] = [];
    let currentPage = 1;
    let lastPage = 1;

    // Fetch first page to get total page count
    console.log('Fetching first page to determine total pages...');
    
    try {
      const firstPageData = await this.fetchPage(1);
      
      if (firstPageData.data && firstPageData.data.length > 0) {
        allProducts.push(...firstPageData.data);
        lastPage = firstPageData.last_page;
        console.log(`Fetched page 1: ${firstPageData.data.length} products`);
        console.log(`Total available: ${firstPageData.total} products across ${lastPage} pages`);
      } else {
        console.log('No products found on page 1');
        throw new Error('No products available');
      }
    } catch (error) {
      console.error('Error fetching first page:', error);
      throw error;
    }

    // Fetch remaining pages
    console.log(`Fetching remaining ${lastPage - 1} pages...`);
    
    for (let page = 2; page <= lastPage; page++) {
      try {
        console.log(`Fetching page ${page} of ${lastPage}...`);
        const pageData = await this.fetchPage(page);
        
        if (!pageData.data || pageData.data.length === 0) {
          console.log(`No products found on page ${page}`);
          continue;
        } else {
          allProducts.push(...pageData.data);
          console.log(`Fetched page ${page}: ${pageData.data.length} products (Total so far: ${allProducts.length})`);
        }
        
        // Add a small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        // Continue with next page instead of stopping
        continue;
      }
    }

    console.log(`Total products fetched from all pages: ${allProducts.length}`);
    return allProducts;
  }
}
