
import { AICustomerScore } from './types';

export const calculateAdvancedEngagementScore = async (customer: any): Promise<number> => {
  const now = new Date();
  const lastOrderDate = customer.last_order_date ? new Date(customer.last_order_date) : null;
  const daysSinceLastOrder = lastOrderDate 
    ? Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Facteurs de scoring avancés
  const factors = {
    recency: Math.max(0, 100 - (daysSinceLastOrder * 0.5)), // Diminue avec le temps
    frequency: Math.min(100, (customer.order_count || 0) * 10), // Plus de commandes = meilleur score
    monetary: Math.min(100, (customer.total_spent || 0) / 1000), // Valeur monétaire
    consistency: calculateConsistencyScore(customer), // Régularité des achats
    engagement: calculateEngagementTrend(customer), // Tendance d'engagement
  };

  // Poids adaptatifs basés sur le profil client
  const weights = getAdaptiveWeights(customer);
  
  const score = Object.entries(factors).reduce((total, [key, value]) => {
    return total + (value * weights[key as keyof typeof weights]);
  }, 0) / Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  return Math.min(100, Math.max(0, score));
};

export const calculateConsistencyScore = (customer: any): number => {
  // Simuler un score de consistance basé sur l'historique
  if (!customer.order_count || customer.order_count < 2) return 20;
  
  const avgDaysBetweenOrders = customer.last_activity_days / customer.order_count;
  if (avgDaysBetweenOrders <= 30) return 90;
  if (avgDaysBetweenOrders <= 60) return 70;
  if (avgDaysBetweenOrders <= 90) return 50;
  return 30;
};

export const calculateEngagementTrend = (customer: any): number => {
  // Simuler une tendance d'engagement
  const recentActivity = customer.last_activity_days <= 30;
  const frequentBuyer = (customer.order_count || 0) >= 3;
  const highValue = (customer.total_spent || 0) >= 50000;

  if (recentActivity && frequentBuyer && highValue) return 95;
  if (recentActivity && frequentBuyer) return 80;
  if (recentActivity) return 60;
  if (frequentBuyer) return 70;
  return 40;
};

export const getAdaptiveWeights = (customer: any) => {
  // Poids adaptatifs selon le profil du client
  const isNewCustomer = (customer.order_count || 0) <= 1;
  const isVIP = (customer.total_spent || 0) >= 100000;
  
  if (isNewCustomer) {
    return { recency: 0.4, frequency: 0.1, monetary: 0.2, consistency: 0.1, engagement: 0.2 };
  } else if (isVIP) {
    return { recency: 0.3, frequency: 0.2, monetary: 0.3, consistency: 0.1, engagement: 0.1 };
  } else {
    return { recency: 0.25, frequency: 0.25, monetary: 0.2, consistency: 0.15, engagement: 0.15 };
  }
};

export const calculatePurchaseProbability = (customer: any, engagementScore: number): number => {
  const daysSinceLastOrder = customer.last_order_date 
    ? Math.floor((Date.now() - new Date(customer.last_order_date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  let baseProbability = 0;
  
  // Probabilité basée sur la récence
  if (daysSinceLastOrder <= 7) baseProbability = 0.9;
  else if (daysSinceLastOrder <= 30) baseProbability = 0.7;
  else if (daysSinceLastOrder <= 90) baseProbability = 0.4;
  else if (daysSinceLastOrder <= 180) baseProbability = 0.2;
  else baseProbability = 0.1;

  // Ajustements basés sur l'historique
  const frequencyMultiplier = Math.min(1.5, 1 + ((customer.order_count || 0) * 0.1));
  const valueMultiplier = Math.min(1.3, 1 + ((customer.total_spent || 0) / 100000));
  const engagementMultiplier = engagementScore / 100;

  const finalProbability = baseProbability * frequencyMultiplier * valueMultiplier * engagementMultiplier;
  
  return Math.min(1, Math.max(0, finalProbability));
};

export const determineTrend = (customer: any): 'increasing' | 'decreasing' | 'stable' => {
  const daysSinceLastOrder = customer.last_order_date 
    ? Math.floor((Date.now() - new Date(customer.last_order_date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const orderCount = customer.order_count || 0;

  // Logique simplifiée pour déterminer la tendance
  if (daysSinceLastOrder <= 30 && orderCount >= 3) return 'increasing';
  if (daysSinceLastOrder > 90 || (orderCount >= 2 && daysSinceLastOrder > 60)) return 'decreasing';
  return 'stable';
};

export const calculateOptimalContactDate = (customer: any, engagementScore: number): string => {
  const now = new Date();
  let daysToAdd = 1;

  if (engagementScore >= 80) daysToAdd = 1; // Contact immédiat
  else if (engagementScore >= 60) daysToAdd = 2;
  else if (engagementScore >= 40) daysToAdd = 3;
  else daysToAdd = 7;

  const optimalDate = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  return optimalDate.toISOString();
};
