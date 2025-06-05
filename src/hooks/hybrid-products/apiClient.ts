
import { ApiFilters, CowemaApiResponse } from './types';

export const buildQueryString = (apiFilters: ApiFilters): string => {
  const params = new URLSearchParams();
  
  if (apiFilters.search) params.append('search', apiFilters.search);
  if (apiFilters.category) params.append('category', apiFilters.category.toString());
  if (apiFilters.city) params.append('city', apiFilters.city.toString());
  if (apiFilters.sort) params.append('sort', apiFilters.sort);
  if (apiFilters.direction) params.append('direction', apiFilters.direction);
  if (apiFilters.page) params.append('page', apiFilters.page.toString());
  if (apiFilters.per_page) params.append('per_page', apiFilters.per_page.toString());
  
  return params.toString();
};

export const fetchFromCowemaAPI = async (apiFilters: ApiFilters = {}): Promise<CowemaApiResponse> => {
  const queryString = buildQueryString(apiFilters);
  const url = `https://eu.cowema.org/api/public/products${queryString ? `?${queryString}` : ''}`;
  
  console.log('🌐 API Call:', {
    url,
    filters: apiFilters,
    timestamp: new Date().toISOString(),
    per_page: apiFilters.per_page || 'default'
  });

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    console.error('❌ API Error:', {
      status: response.status,
      statusText: response.statusText,
      url
    });
    throw new Error(`API responded with status ${response.status}`);
  }

  const data: CowemaApiResponse = await response.json();
  
  console.log('✅ API Response:', {
    totalProducts: data.data?.length || 0,
    currentPage: data.current_page,
    totalPages: data.last_page,
    totalAvailable: data.total,
    per_page: data.per_page || 'unknown',
    hasData: !!data.data,
    loadingProgress: data.total > 0 ? `${((data.current_page || 1) / (data.last_page || 1) * 100).toFixed(1)}%` : '0%',
    timestamp: new Date().toISOString()
  });
  
  return data;
};

// Function to fetch available categories
export const fetchCategoriesFromAPI = async (): Promise<any[]> => {
  try {
    const response = await fetch('https://eu.cowema.org/api/public/categories', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Categories API responded with status ${response.status}`);
    }

    const categories = await response.json();
    
    console.log('📂 Categories API:', {
      categoriesCount: categories.length,
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        products_count: cat.products_count
      })),
      timestamp: new Date().toISOString()
    });

    return categories;
  } catch (error) {
    console.error('❌ Categories fetch error:', error);
    return [];
  }
};

// Export alias for backward compatibility
export const fetchProductsFromAPI = fetchFromCowemaAPI;
