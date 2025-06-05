
import { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  nom: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender: 'male' | 'female';
  role: 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer';
  city?: string;
  loyaltyPoints: number;
  createdAt: string;
}

export interface RegisterData {
  nom: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  gender: 'male' | 'female';
  city?: string;
  password: string;
  role?: 'user' | 'admin' | 'seller' | 'team_lead' | 'sales_manager' | 'influencer';
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  error: string | null;
}
