import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem, CustomerInfo, OrderStatus, OrderSource } from '../types/order';

// Max number of orders to keep in storage to avoid quota issues
const MAX_STORED_ORDERS = 100;

interface OrderState {
  orders: Order[];
  addOrder: (items: OrderItem[], customer: CustomerInfo, influencerCode?: string) => Order;
  addWhatsAppOrder: (items: OrderItem[], customer: CustomerInfo) => Order;
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  assignOrder: (id: string, assignedTo: string) => void;
  markReminderSent: (id: string) => void;
  getAllOrders: () => Order[];
  getOrdersBySource: (source: OrderSource) => Order[];
  getPendingOrders: () => Order[];
  cleanupOldOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (items, customer, influencerCode) => {
        // First clean up old orders to avoid storage issues
        get().cleanupOldOrders();
        
        const now = new Date().toISOString();
        const source: OrderSource = influencerCode ? 'influencer' : 'direct';
        
        const newOrder: Order = {
          id: uuidv4(),
          items,
          customer: {
            ...customer,
            isWhatsApp: false // Marquer comme commande directe
          },
          totalAmount: items.reduce((sum, item) => {
            const price = item.promoPrice !== null ? item.promoPrice : item.price;
            return sum + (price * item.quantity);
          }, 0),
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          influencerCode,
          reminderSent: false,
          source
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder]
        }));
        
        return newOrder;
      },
      
      addWhatsAppOrder: (items, customer) => {
        // First clean up old orders to avoid storage issues
        get().cleanupOldOrders();
        
        const now = new Date().toISOString();
        
        // Ensure the customer's phone number includes 'whatsapp' to easily identify it
        const whatsappCustomer = {
          ...customer,
          phone: customer.phone.includes('whatsapp') ? customer.phone : `whatsapp:${customer.phone}`,
          isWhatsApp: true // Marquer explicitement comme commande WhatsApp
        };
        
        const newOrder: Order = {
          id: uuidv4(),
          items,
          customer: whatsappCustomer,
          totalAmount: items.reduce((sum, item) => {
            const price = item.promoPrice !== null ? item.promoPrice : item.price;
            return sum + (price * item.quantity);
          }, 0),
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          reminderSent: false,
          source: 'whatsapp'
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder]
        }));
        
        return newOrder;
      },
      
      getOrder: (id) => {
        const { orders } = get();
        return orders.find(order => order.id === id);
      },
      
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id 
              ? { ...order, status, updatedAt: new Date().toISOString() } 
              : order
          )
        }));
      },
      
      assignOrder: (id, assignedTo) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id 
              ? { ...order, assignedTo, updatedAt: new Date().toISOString() } 
              : order
          )
        }));
      },
      
      markReminderSent: (id) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === id 
              ? { ...order, reminderSent: true, updatedAt: new Date().toISOString() } 
              : order
          )
        }));
      },
      
      getAllOrders: () => {
        return get().orders;
      },
      
      getOrdersBySource: (source) => {
        return get().orders.filter(order => {
          if (source === 'whatsapp') {
            return order.source === 'whatsapp' || order.customer.phone.includes('whatsapp');
          }
          return order.source === source;
        });
      },
      
      getPendingOrders: () => {
        return get().orders.filter(order => order.status === 'pending');
      },
      
      cleanupOldOrders: () => {
        set((state) => {
          // Keep only the most recent orders
          if (state.orders.length > MAX_STORED_ORDERS) {
            // Sort by date, most recent first
            const sortedOrders = [...state.orders].sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            
            // Keep only the MAX_STORED_ORDERS most recent
            return { orders: sortedOrders.slice(0, MAX_STORED_ORDERS) };
          }
          return state;
        });
      }
    }),
    {
      name: 'cowema-order-store',
      // Add storage configuration to handle errors
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error retrieving data from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error storing data in localStorage:', error);
            // Try to clear some space by removing this item first
            localStorage.removeItem(name);
            try {
              localStorage.setItem(name, JSON.stringify(value));
            } catch (innerError) {
              console.error('Failed to store data even after cleanup:', innerError);
            }
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing item from localStorage:', error);
          }
        }
      }
    }
  )
);
