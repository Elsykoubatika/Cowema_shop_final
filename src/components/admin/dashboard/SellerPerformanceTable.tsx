
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamSummaryCards from './seller-performance/TeamSummaryCards';
import SellerRow from './seller-performance/SellerRow';
import CityPerformanceCard from './seller-performance/CityPerformanceCard';
import { mockSellersData } from './seller-performance/mockData';

const SellerPerformanceTable: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <TeamSummaryCards sellersData={mockSellersData} />

      {/* Sellers Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par vendeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSellersData.map((seller) => (
              <SellerRow key={seller.id} seller={seller} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* City Performance Summary */}
      <CityPerformanceCard sellersData={mockSellersData} />
    </div>
  );
};

export default SellerPerformanceTable;
