
export interface SellerData {
  id: string;
  name: string;
  city: string;
  totalSales: number;
  ordersCount: number;
  conversionRate: number;
  avgOrderValue: number;
  trend: number;
  status: 'active' | 'inactive';
}

export interface PerformanceBadge {
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  label: string;
  color: string;
}
