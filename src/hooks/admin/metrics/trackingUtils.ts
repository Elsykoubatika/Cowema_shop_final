
import { PromotionMetric } from './types';
import { Dispatch, SetStateAction } from 'react';

// Function to track promotion events
export const trackPromotionEvent = (
  promoId: string, 
  eventType: string, 
  metrics: Record<string, PromotionMetric>
) => {
  // Clone the current metrics
  const updatedMetrics = { ...metrics };
  
  // Ensure this promotion exists in the metrics
  if (!updatedMetrics[promoId]) {
    updatedMetrics[promoId] = {
      views: 0,
      usageCount: 0,
      conversionRate: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      timesViewed: 0,
      timesCopied: 0,
      timesApplied: 0,
      usageLimit: null,
      usageLimitReached: false,
      revenueGenerated: 0
    };
  }
  
  // Update counters based on event type
  switch (eventType) {
    case 'view':
      updatedMetrics[promoId].views++;
      updatedMetrics[promoId].timesViewed++;
      break;
    case 'copy':
      updatedMetrics[promoId].timesCopied++;
      break;
    case 'apply':
      updatedMetrics[promoId].usageCount++;
      updatedMetrics[promoId].timesApplied++;
      
      // Update conversion rate
      if (updatedMetrics[promoId].views > 0) {
        updatedMetrics[promoId].conversionRate = 
          (updatedMetrics[promoId].usageCount / updatedMetrics[promoId].views) * 100;
      }
      
      // Check if usage limit is reached
      const usageLimit = updatedMetrics[promoId].usageLimit;
      if (usageLimit !== null && updatedMetrics[promoId].usageCount >= usageLimit) {
        updatedMetrics[promoId].usageLimitReached = true;
      }
      break;
    case 'purchase':
      // Assume an order amount (e.g., 20000 FCFA)
      const orderAmount = 20000;
      updatedMetrics[promoId].totalRevenue += orderAmount;
      updatedMetrics[promoId].revenueGenerated += orderAmount;
      
      // Recalculate average order value
      if (updatedMetrics[promoId].usageCount > 0) {
        updatedMetrics[promoId].avgOrderValue = 
          updatedMetrics[promoId].totalRevenue / updatedMetrics[promoId].usageCount;
      }
      break;
  }
  
  return updatedMetrics;
};

// Create a tracking function for use in components
export const createTrackingFunction = (
  setMetrics: Dispatch<SetStateAction<Record<string, PromotionMetric>>>
) => {
  return (promoId: string, eventType: string) => {
    setMetrics(prevMetrics => trackPromotionEvent(promoId, eventType, prevMetrics));
  };
};
