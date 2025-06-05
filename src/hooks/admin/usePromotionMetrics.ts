
import { useState, useEffect } from 'react';
import { usePromotionStore } from '../usePromotionStore';
import { fetchPromotionMetrics } from './metrics/fetchPromotionMetrics';
import { 
  exportMetricsToCSV as exportMetricsToCSVUtil,
  exportPromotionsToCSV as exportPromotionsToCSVUtil,
  importPromotionsFromCSV as importPromotionsFromCSVUtil
} from './metrics/csvUtils';
import { generatePromotionCodes as generatePromotionCodesUtil } from './metrics/codeGenerator';
import { createTrackingFunction } from './metrics/trackingUtils';
import { PromotionMetric, DateRangeOption, MetricsHookReturn } from './metrics/types';

// Re-export the main type for backwards compatibility
export type { PromotionMetric } from './metrics/types';

export const usePromotionMetrics = (): MetricsHookReturn => {
  const { promotions } = usePromotionStore();
  const [metrics, setMetrics] = useState<Record<string, PromotionMetric>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('30days');

  // Charger les métriques lors du changement des promotions ou du date range
  useEffect(() => {
    const loadMetrics = async () => {
      if (promotions.length === 0) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const promotionIds = promotions.map(promo => promo.id);
        const metricsData = await fetchPromotionMetrics(promotionIds, dateRange);
        
        // Ajouter les codes réels aux métriques
        const enhancedMetrics = { ...metricsData };
        promotions.forEach(promo => {
          if (enhancedMetrics[promo.id]) {
            enhancedMetrics[promo.id].code = promo.code;
          }
        });
        
        setMetrics(enhancedMetrics);
      } catch (err) {
        console.error('Erreur lors du chargement des métriques:', err);
        setError('Impossible de charger les métriques des promotions');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMetrics();
  }, [promotions, dateRange]);

  // Create the tracking function
  const trackPromotionEvent = createTrackingFunction(setMetrics);

  // Export metrics to CSV
  const exportMetricsToCSV = () => exportMetricsToCSVUtil(metrics, dateRange);

  // Export promotions to CSV
  const exportPromotionsToCSV = () => exportPromotionsToCSVUtil(promotions, metrics);

  // Import promotions from CSV
  const importPromotionsFromCSV = importPromotionsFromCSVUtil;

  // Generate promotion codes
  const generatePromotionCodes = generatePromotionCodesUtil;

  return {
    metrics,
    isLoading,
    error,
    trackPromotionEvent,
    exportMetricsToCSV,
    exportPromotionsToCSV,
    importPromotionsFromCSV,
    generatePromotionCodes,
    dateRange,
    setDateRange
  };
};
