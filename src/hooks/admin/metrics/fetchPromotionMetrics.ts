
import { PromotionMetric } from './types';

// Cette fonction récupère les vraies métriques des promotions depuis la base de données
export const fetchPromotionMetrics = async (
  promotionIds: string[],
  dateRange: string
): Promise<Record<string, PromotionMetric>> => {
  // Pour le moment, retourner des métriques vides car il n'y a pas encore de ventes
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: Record<string, PromotionMetric> = {};
      
      promotionIds.forEach(id => {
        // Données réelles : pas de ventes = pas de métriques
        result[id] = {
          views: 0, // Aucune vue enregistrée
          usageCount: 0, // Aucune utilisation
          conversionRate: 0, // Pas de conversion sans utilisation
          totalRevenue: 0, // Pas de revenus générés
          avgOrderValue: 0, // Pas de commande moyenne
          timesViewed: 0,
          timesCopied: 0,
          timesApplied: 0,
          usageLimit: null,
          usageLimitReached: false,
          revenueGenerated: 0
        };
      });
      
      resolve(result);
    }, 300); // Délai réduit pour des données réelles
  });
};
