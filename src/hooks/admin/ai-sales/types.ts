
export interface AICustomerScore {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  engagement_score: number;
  purchase_probability: number;
  last_activity_days: number;
  total_spent: number;
  order_frequency: number;
  preferred_categories: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
  next_contact_date?: string;
  score_factors?: {
    recency: 'high' | 'medium' | 'low';
    frequency: 'high' | 'medium' | 'low';
    monetary: 'high' | 'medium' | 'low';
    consistency: 'high' | 'medium' | 'low';
    engagement: 'high' | 'medium' | 'low';
  };
}

export interface AISalesAction {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  action_type: 'reactivation' | 'upsell' | 'cross_sell' | 'new_product' | 'loyalty' | 'retention';
  priority_score: number;
  recommended_products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    reason: string;
    conversion_probability: number;
  }>;
  message_template: string;
  status: 'pending' | 'executed' | 'declined' | 'expired';
  expected_revenue: number;
  confidence_level: number;
  ai_reasoning: string;
  week_number: number;
  year: number;
  created_at: string;
  optimal_send_time?: string;
  success_probability: number;
}

export interface AIAnalytics {
  total_customers: number;
  active_customers: number;
  dormant_customers: number;
  high_value_customers: number;
  conversion_rates: {
    reactivation: number;
    upsell: number;
    cross_sell: number;
    retention: number;
  };
  revenue_trends: Array<{
    date: string;
    value: number;
    prediction?: number;
  }>;
  customer_segments: {
    vip: number;
    regular: number;
    new: number;
    at_risk: number;
  };
  performance_metrics: {
    avg_engagement_score: number;
    total_actions_generated: number;
    actions_executed: number;
    success_rate: number;
    revenue_generated: number;
  };
}
