
import { create } from 'zustand';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string;
  primaryVendor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  preferredCategories?: Record<string, number>;
  ordersByVendor?: Record<string, {
    totalSpent: number;
    orderCount: number;
  }>;
}

interface CustomerStoreState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addNoteToCustomer: (id: string, note: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomersByVendor: (vendorId: string) => Customer[];
  getAllCustomers: () => Customer[];
}

export const useCustomerStore = create<CustomerStoreState>((set, get) => ({
  customers: [],
  
  addCustomer: (customerData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: crypto.randomUUID(),
      totalSpent: customerData.totalSpent || 0,
      orderCount: customerData.orderCount || 0,
      preferredCategories: customerData.preferredCategories || {},
      ordersByVendor: customerData.ordersByVendor || {},
      createdAt: customerData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    
    set((state) => ({
      customers: [...state.customers, newCustomer]
    }));
  },
  
  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map(customer =>
        customer.id === id
          ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
          : customer
      )
    }));
  },

  addNoteToCustomer: (id, note) => {
    set((state) => ({
      customers: state.customers.map(customer =>
        customer.id === id
          ? { 
              ...customer, 
              notes: customer.notes ? `${customer.notes}\n${note}` : note,
              updatedAt: new Date().toISOString() 
            }
          : customer
      )
    }));
  },
  
  getCustomerById: (id) => {
    return get().customers.find(customer => customer.id === id);
  },
  
  getCustomersByVendor: (vendorId) => {
    return get().customers.filter(customer => customer.primaryVendor === vendorId);
  },
  
  getAllCustomers: () => {
    return get().customers;
  }
}));
