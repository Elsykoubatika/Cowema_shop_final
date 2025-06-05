export type UserRole = 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer';

export interface Address {
  id: string;
  street: string;
  city: string;
  postalCode?: string;
  zipCode?: string;
  state?: string;
  country?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string | number;
  title: string;
  price: number;
  promoPrice?: number | null;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  date?: string;
  products?: any[];
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // Make email required to match Customer interface
  phone: string;
  city: string;
  address?: string;
  totalSpent?: number;
  orderCount?: number;
  lastOrderDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  primaryVendor?: string;
  lastActivity?: string;
  // Computed properties for compatibility
  first_name?: string;
  last_name?: string;
  total_spent?: number;
  order_count?: number;
  created_at?: string;
  primary_vendor?: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender: 'male' | 'female';
  role: UserRole;
  city?: string;
  loyaltyPoints: number;
  addresses: Address[];
  orders: Order[];
  customers?: Customer[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateUserRole: (role: UserRole, city?: string) => void;
  checkAuthStatus: () => boolean;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addLoyaltyPoints: (points: number) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export interface RegisterData {
  nom: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female';
  role?: UserRole;
  autoLogin?: boolean;
}
