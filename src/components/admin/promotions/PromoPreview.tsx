
import React, { useState, useEffect } from 'react';
import { Timer, Gift, AlertTriangle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import PromoDisplay from '../../PromoDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePromotionStore } from '../../../hooks/usePromotionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PromoPreview: React.FC = () => {
  const { promotions, activePromotion } = usePromotionStore();
  const [hasActivePromos, setHasActivePromos] = useState(false);
  
  useEffect(() => {
    // Check if there are any active, non-expired promotions
    const now = new Date();
    const active = promotions.some(p => 
      p.isActive && new Date(p.expiryDate) > now
    );
    setHasActivePromos(active);
  }, [promotions]);
  
  return (
    <Card className="mb-8 p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Aperçu des promotions actives
        </h2>
        
        {!hasActivePromos && (
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
            <AlertTriangle size={16} className="mr-1" />
            Aucune promotion active
          </div>
        )}
        
        {activePromotion && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <Info size={16} className="mr-1" />
            Promotion principale active
          </div>
        )}
      </div>
      
      {!hasActivePromos ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Aucune promotion active n'est configurée. Les clients ne verront pas de bannière promotionnelle sur le site.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="default">Vue normale</TabsTrigger>
            <TabsTrigger value="compact">Vue compacte</TabsTrigger>
            <TabsTrigger value="badge">Badge</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="space-y-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2 text-gray-600">Sur la page d'accueil:</h3>
              <PromoDisplay />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2 text-gray-600">Produits standards:</h3>
                <PromoDisplay productsType="all" />
              </div>
              
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2 text-gray-600">Produits YA BA BOSS:</h3>
                <PromoDisplay productsType="ya-ba-boss" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compact">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2 text-gray-600">Sur les fiches produit:</h3>
              <div className="bg-white p-3 border rounded shadow-sm">
                <PromoDisplay variant="compact" showDescription={false} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="badge">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2 text-gray-600">Dans les éléments plus petits:</h3>
              <div className="bg-white p-3 border rounded shadow-sm">
                <PromoDisplay variant="badge" showDescription={false} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <div className="text-sm text-gray-500 mt-4 border-t pt-4">
        <p className="flex items-center">
          <Info size={16} className="mr-2" />
          Les bannières promotionnelles s'afficheront automatiquement sur le site en fonction des paramètres configurés.
        </p>
      </div>
    </Card>
  );
};

export default PromoPreview;
