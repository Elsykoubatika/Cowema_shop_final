
export interface PromotionMetric {
  id?: string;
  code?: string;
  views: number;
  usageCount: number;
  conversionRate: number; // en pourcentage
  totalRevenue: number;
  avgOrderValue: number;
  // Add missing properties referenced in the components
  timesViewed: number;
  timesCopied: number;
  timesApplied: number;
  usageLimit: number | null;
  usageLimitReached: boolean;
  revenueGenerated: number;
}

// Add the alias for backward compatibility
export type PromoMetrics = PromotionMetric;

export type DateRangeOption = '7days' | '30days' | '90days' | 'all';

export interface MetricsHookReturn {
  metrics: Record<string, PromotionMetric>;
  isLoading: boolean;
  error: string | null;
  trackPromotionEvent?: (promoId: string, eventType: string) => void;
  exportMetricsToCSV: () => void;
  exportPromotionsToCSV: () => void;
  importPromotionsFromCSV?: (file: File) => Promise<void>;
  generatePromotionCodes?: (count: number, options: any) => string[];
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
}
