
import { AICustomerScore, AIAnalytics, AISalesAction } from './types';

export const calculateAnalytics = async (
  scores: AICustomerScore[], 
  salesActions: AISalesAction[]
): Promise<AIAnalytics> => {
  const totalCustomers = scores.length;
  const activeCustomers = scores.filter(s => s.last_activity_days <= 90).length;
  const dormantCustomers = scores.filter(s => s.last_activity_days > 90).length;
  const highValueCustomers = scores.filter(s => s.total_spent >= 50000).length;

  // Simuler des taux de conversion (à remplacer par de vraies données)
  const conversionRates = {
    reactivation: 0.25,
    upsell: 0.35,
    cross_sell: 0.20,
    retention: 0.60
  };

  // Générer des tendances de revenus simulées
  const revenueTrends = generateRevenueTrends();

  // Segmentation des clients
  const customerSegments = {
    vip: scores.filter(s => s.total_spent >= 100000 && s.engagement_score >= 70).length,
    regular: scores.filter(s => s.total_spent >= 20000 && s.total_spent < 100000).length,
    new: scores.filter(s => s.order_frequency <= 1).length,
    at_risk: scores.filter(s => s.last_activity_days > 60 && s.total_spent >= 20000).length
  };

  // Métriques de performance
  const avgEngagementScore = scores.reduce((sum, s) => sum + s.engagement_score, 0) / scores.length || 0;
  
  const analytics: AIAnalytics = {
    total_customers: totalCustomers,
    active_customers: activeCustomers,
    dormant_customers: dormantCustomers,
    high_value_customers: highValueCustomers,
    conversion_rates: conversionRates,
    revenue_trends: revenueTrends,
    customer_segments: customerSegments,
    performance_metrics: {
      avg_engagement_score: avgEngagementScore,
      total_actions_generated: salesActions.length,
      actions_executed: salesActions.filter(a => a.status === 'executed').length,
      success_rate: salesActions.length > 0 ? (salesActions.filter(a => a.status === 'executed').length / salesActions.length) * 100 : 0,
      revenue_generated: salesActions.reduce((sum, a) => sum + (a.status === 'executed' ? a.expected_revenue : 0), 0)
    }
  };

  return analytics;
};

export const generateRevenueTrends = () => {
  const trends = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const baseValue = 50000 + Math.random() * 30000;
    const trend = Math.sin(i * 0.2) * 10000; // Tendance sinusoïdale
    
    trends.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, baseValue + trend),
      prediction: i < 7 ? Math.max(0, baseValue + trend + Math.random() * 5000) : undefined
    });
  }
  
  return trends;
};
