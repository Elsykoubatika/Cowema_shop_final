
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, Star, Zap, Percent } from 'lucide-react';
import { ProductCache } from '@/types/productCache';

interface CatalogStatsProps {
  products: ProductCache[];
}

const CatalogStats: React.FC<CatalogStatsProps> = ({ products }) => {
  const totalProducts = products.length;
  const yaBaBossCount = products.filter(p => p.isYaBaBoss).length;
  const flashOffersCount = products.filter(p => p.isFlashOffer).length;
  const promoCount = products.filter(p => p.promoPrice && p.promoPrice < p.price).length;
  const lowStockCount = products.filter(p => p.stock <= 5 && p.stock > 0).length;

  const stats = [
    {
      label: 'Produits totaux',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      label: 'YaBaBoss',
      value: yaBaBossCount,
      icon: Star,
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      iconColor: 'text-yellow-500'
    },
    {
      label: 'Offres Flash',
      value: flashOffersCount,
      icon: Zap,
      color: 'bg-red-50 text-red-600 border-red-200',
      iconColor: 'text-red-500'
    },
    {
      label: 'En promotion',
      value: promoCount,
      icon: Percent,
      color: 'bg-green-50 text-green-600 border-green-200',
      iconColor: 'text-green-500'
    },
    {
      label: 'Stock limité',
      value: lowStockCount,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`border ${stat.color}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs font-medium">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CatalogStats;
