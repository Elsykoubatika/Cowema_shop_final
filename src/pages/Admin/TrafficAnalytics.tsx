
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrafficAnalytics: React.FC = () => {
  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title="Analyse du Trafic"
        icon={<BarChart3 className="h-6 w-6" />}
        description="Surveillez les visiteurs, leurs actions et analysez leurs comportements"
      />
      <div className="container-cowema p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Visiteurs aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-green-600 mt-1">+12% vs hier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pages vues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-green-600 mt-1">+8% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taux de conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-orange-600 mt-1">-0.1% vs période précédente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Temps moyen / visite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4m 35s</div>
              <p className="text-xs text-blue-600 mt-1">+15s vs période précédente</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Données de trafic en temps réel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Les données de tracking comportemental et d'analyse de trafic apparaîtront ici 
              une fois que les visiteurs commenceront à naviguer sur le site.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default TrafficAnalytics;
