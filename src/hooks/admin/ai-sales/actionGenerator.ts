
import { AISalesAction, AICustomerScore } from './types';

export const determineOptimalAction = (customer: AICustomerScore, products: any[]) => {
  const { last_activity_days, order_frequency, total_spent, trend, engagement_score } = customer;

  let actionType: AISalesAction['action_type'];
  let reasoning = '';
  let expectedRevenue = 0;
  let confidence = 0;

  // Algorithme de décision amélioré
  if (last_activity_days > 120 && total_spent > 0) {
    actionType = 'reactivation';
    reasoning = `Client inactif depuis ${last_activity_days} jours avec historique d'achat (${total_spent.toLocaleString()} FCFA). Tendance: ${trend}. Score d'engagement: ${engagement_score}/100.`;
    expectedRevenue = total_spent * 0.25;
    confidence = Math.min(0.8, engagement_score / 100 + 0.2);
  } else if (order_frequency >= 5 && total_spent >= 50000 && trend === 'increasing') {
    actionType = 'upsell';
    reasoning = `Client VIP très actif (${order_frequency} commandes, ${total_spent.toLocaleString()} FCFA) avec tendance croissante. Opportunité d'upsell élevée.`;
    expectedRevenue = total_spent * 0.4;
    confidence = 0.85;
  } else if (order_frequency >= 3 && customer.preferred_categories.length > 0) {
    actionType = 'cross_sell';
    reasoning = `Client régulier avec préférences définies: ${customer.preferred_categories.join(', ')}. Excellent potentiel de vente croisée.`;
    expectedRevenue = total_spent * 0.3;
    confidence = 0.7;
  } else if (last_activity_days <= 30 && order_frequency <= 2) {
    actionType = 'retention';
    reasoning = `Client récent à fidéliser. Activité récente (${last_activity_days} jours) mais faible fréquence. Critique pour la rétention.`;
    expectedRevenue = 25000;
    confidence = 0.6;
  } else if (trend === 'decreasing' && total_spent >= 30000) {
    actionType = 'loyalty';
    reasoning = `Client de valeur avec tendance décroissante. Actions de fidélisation nécessaires pour maintenir l'engagement.`;
    expectedRevenue = total_spent * 0.2;
    confidence = 0.5;
  } else {
    actionType = 'new_product';
    reasoning = `Profil standard. Présentation de nouveautés pour stimuler l'intérêt. Score: ${engagement_score}/100.`;
    expectedRevenue = 15000;
    confidence = 0.4;
  }

  // Sélectionner des produits optimaux
  const recommendedProducts = selectOptimalProducts(customer, products, actionType)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.promo_price || p.price,
      image: p.images?.[0] || '',
      reason: getProductRecommendationReason(p, actionType, customer),
      conversion_probability: calculateProductConversionProbability(p, customer)
    }));

  return {
    type: actionType,
    products: recommendedProducts,
    expectedRevenue,
    confidence,
    reasoning
  };
};

export const selectOptimalProducts = (customer: AICustomerScore, products: any[], actionType: string) => {
  // Filtrer et scorer les produits selon le profil client
  return products
    .filter(p => {
      // Filtrer selon les catégories préférées si disponibles
      if (customer.preferred_categories.length > 0) {
        return customer.preferred_categories.includes(p.category || '');
      }
      return true;
    })
    .map(p => ({
      ...p,
      relevanceScore: calculateProductRelevance(p, customer, actionType)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
};

export const calculateProductRelevance = (product: any, customer: AICustomerScore, actionType: string): number => {
  let score = 0;

  // Score basé sur le prix et le budget du client
  const avgOrderValue = customer.total_spent / Math.max(1, customer.order_frequency);
  const priceScore = Math.max(0, 100 - Math.abs(product.price - avgOrderValue) / avgOrderValue * 100);
  score += priceScore * 0.3;

  // Score basé sur la catégorie préférée
  if (customer.preferred_categories.includes(product.category || '')) {
    score += 40;
  }

  // Score basé sur le type d'action
  if (actionType === 'upsell' && product.price > avgOrderValue) score += 30;
  if (actionType === 'cross_sell' && product.category !== customer.preferred_categories[0]) score += 25;
  if (actionType === 'reactivation' && product.is_flash_offer) score += 35;

  return Math.min(100, score);
};

export const getProductRecommendationReason = (product: any, actionType: string, customer: AICustomerScore): string => {
  switch (actionType) {
    case 'reactivation':
      return `Offre spéciale pour votre retour chez nous`;
    case 'upsell':
      return `Upgrade premium recommandé selon votre profil`;
    case 'cross_sell':
      return `Complément idéal à vos achats précédents`;
    case 'retention':
      return `Offre de fidélité exclusive`;
    case 'loyalty':
      return `Remerciement pour votre fidélité`;
    default:
      return `Nouveauté tendance sélectionnée pour vous`;
  }
};

export const calculateProductConversionProbability = (product: any, customer: AICustomerScore): number => {
  const baseProb = customer.purchase_probability;
  const priceMatch = product.price <= (customer.total_spent / Math.max(1, customer.order_frequency)) * 1.2 ? 0.2 : -0.1;
  const categoryMatch = customer.preferred_categories.includes(product.category || '') ? 0.15 : 0;
  
  return Math.min(1, Math.max(0, baseProb + priceMatch + categoryMatch));
};

export const calculateOptimalSendTime = (customer: AICustomerScore): string => {
  // Logique pour déterminer le meilleur moment d'envoi
  const now = new Date();
  const baseHour = customer.engagement_score >= 70 ? 10 : 14; // Matin pour VIP, après-midi pour autres
  
  const optimalTime = new Date(now);
  optimalTime.setHours(baseHour, 0, 0, 0);
  
  // Si c'est déjà passé aujourd'hui, programmer pour demain
  if (optimalTime <= now) {
    optimalTime.setDate(optimalTime.getDate() + 1);
  }
  
  return optimalTime.toISOString();
};
