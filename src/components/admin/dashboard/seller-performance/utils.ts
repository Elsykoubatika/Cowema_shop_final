
import { PerformanceBadge } from './types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getPerformanceBadge = (trend: number): PerformanceBadge => {
  if (trend > 10) return { variant: 'default' as const, label: 'Excellent', color: 'bg-green-100 text-green-800' };
  if (trend > 5) return { variant: 'secondary' as const, label: 'Bon', color: 'bg-blue-100 text-blue-800' };
  if (trend > 0) return { variant: 'outline' as const, label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' };
  return { variant: 'destructive' as const, label: 'Faible', color: 'bg-red-100 text-red-800' };
};
