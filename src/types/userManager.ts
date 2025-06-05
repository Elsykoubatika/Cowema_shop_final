
export interface UserProfile {
  id: string;
  nom: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role: 'admin' | 'sales_manager' | 'team_lead' | 'seller' | 'influencer' | 'user';
  gender: 'male' | 'female';
  city?: string;
  loyalty_points?: number;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
}

export interface CreateUserData {
  nom: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'sales_manager' | 'team_lead' | 'seller' | 'influencer' | 'user';
  gender: 'male' | 'female';
  city?: string;
}
