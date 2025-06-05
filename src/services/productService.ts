import { Product } from '../types/product';
import { convertToUnifiedProduct } from '../types/unified';

class ProductService {
  private products: Product[] = [];

  async getAllProducts(): Promise<Product[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.products.map(convertToUnifiedProduct));
      }, 100);
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = this.products.find(p => String(p.id) === String(id));
        resolve(product ? convertToUnifiedProduct(product) : null);
      }, 100);
    });
  }

  async fetchProductById(id: string): Promise<Product | null> {
    return this.getProductById(id);
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...productData,
          id: String(Date.now()),
        };
        this.products.push(newProduct);
        resolve(convertToUnifiedProduct(newProduct));
      }, 100);
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => String(p.id) === String(id));
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updates };
          resolve(convertToUnifiedProduct(this.products[index]));
        } else {
          resolve(null);
        }
      }, 100);
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => String(p.id) === String(id));
        if (index !== -1) {
          this.products.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = this.products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredProducts.map(convertToUnifiedProduct));
      }, 100);
    });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = this.products.filter(product =>
          product.category?.toLowerCase() === category.toLowerCase()
        );
        resolve(filteredProducts.map(convertToUnifiedProduct));
      }, 100);
    });
  }
}

export const productService = new ProductService();

// Export the fetchProductById function for direct use
export const fetchProductById = (id: string) => productService.fetchProductById(id);
