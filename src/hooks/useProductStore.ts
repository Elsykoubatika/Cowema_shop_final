
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getYaBaBossProducts: () => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product]
        }));
      },
      
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map(product => 
            product.id === id 
              ? { ...product, ...updates }
              : product
          )
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        }));
      },
      
      getProductById: (id) => {
        return get().products.find(product => product.id === id);
      },
      
      getYaBaBossProducts: () => {
        return get().products.filter(product => product.isYaBaBoss);
      }
    }),
    {
      name: 'cowema-product-store'
    }
  )
);
