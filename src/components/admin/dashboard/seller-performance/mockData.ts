
import { SellerData } from './types';

export const mockSellersData: SellerData[] = [
  {
    id: '1',
    name: 'Marie Kouakou',
    city: 'Brazzaville',
    totalSales: 2450000,
    ordersCount: 156,
    conversionRate: 4.2,
    avgOrderValue: 15705,
    trend: 12.5,
    status: 'active'
  },
  {
    id: '2',
    name: 'Jean Moukala',
    city: 'Pointe-Noire',
    totalSales: 1890000,
    ordersCount: 134,
    conversionRate: 3.8,
    avgOrderValue: 14104,
    trend: -2.1,
    status: 'active'
  },
  {
    id: '3',
    name: 'Grace Nzaba',
    city: 'Dolisie',
    totalSales: 1230000,
    ordersCount: 89,
    conversionRate: 5.1,
    avgOrderValue: 13820,
    trend: 8.7,
    status: 'active'
  },
  {
    id: '4',
    name: 'Patrick Massamba',
    city: 'Brazzaville',
    totalSales: 980000,
    ordersCount: 67,
    conversionRate: 2.9,
    avgOrderValue: 14627,
    trend: 15.3,
    status: 'inactive'
  }
];
