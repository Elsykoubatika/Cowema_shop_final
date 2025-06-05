
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  Target,
  Percent,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Promotion } from '@/hooks/usePromotionStore';

interface PromotionsListProps {
  promotions: Promotion[];
  onEdit: (promo: Promotion) => void;
  onDelete: (id: string) => void;
  onActivate: (promo: Promotion) => void;
}

const PromotionsList: React.FC<PromotionsListProps> = ({
  promotions,
  onEdit,
  onDelete,
  onActivate
}) => {
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Expirée';
    } else if (diffDays === 0) {
      return 'Expire aujourd\'hui';
    } else if (diffDays === 1) {
      return 'Expire demain';
    } else {
      return `Expire dans ${diffDays} jours`;
    }
  };

  const getTargetLabel = (target: string) => {
    switch (target) {
      case 'ya-ba-boss':
        return 'Produits YA BA BOSS uniquement';
      case 'all':
        return 'Tous les produits';
      default:
        return target;
    }
  };

  if (promotions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune promotion</h3>
          <p className="text-muted-foreground text-center">
            Vous n'avez pas encore créé de promotions. Créez votre première promotion pour commencer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {promotions.map((promo) => (
        <Card key={promo.id} className={`${!promo.isActive ? 'opacity-60' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {promo.isActive ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <h3 className="text-lg font-semibold">
                      Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-primary">{promo.code}</span>
                    </h3>
                  </div>
                  
                  <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {promo.discount}
                    {promo.discountType === 'percentage' ? '%' : ' FCFA'}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-3">{promo.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Ciblage:</span>
                    <span>{getTargetLabel(promo.target)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Validité:</span>
                    <span className={
                      formatExpiryDate(promo.expiryDate).includes('Expir') && 
                      !formatExpiryDate(promo.expiryDate).includes('dans') 
                        ? 'text-red-500' 
                        : 'text-green-600'
                    }>
                      {formatExpiryDate(promo.expiryDate)}
                    </span>
                  </div>

                  {promo.minPurchaseAmount > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Min:</span>
                      <span>{promo.minPurchaseAmount} FCFA</span>
                    </div>
                  )}
                </div>

                {/* Informations avancées */}
                {(promo.targetCities?.length || promo.targetCategories?.length || promo.usageType !== 'unlimited') && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {promo.targetCities?.length && (
                        <Badge variant="outline" className="text-blue-600">
                          Villes: {promo.targetCities.join(', ')}
                        </Badge>
                      )}
                      {promo.targetCategories?.length && (
                        <Badge variant="outline" className="text-purple-600">
                          Catégories: {promo.targetCategories.join(', ')}
                        </Badge>
                      )}
                      {promo.usageType !== 'unlimited' && (
                        <Badge variant="outline" className="text-orange-600">
                          {promo.usageType === 'single_use' ? 'Usage unique' : 
                           promo.usageType === 'limited' ? `Max ${promo.maxUsesPerUser || 1} par utilisateur` : 
                           promo.usageType}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {promo.isActive ? 'Visible' : 'Masqué'}
                  </span>
                  <Switch
                    checked={promo.isActive}
                    onCheckedChange={() => onActivate(promo)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(promo)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(promo.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PromotionsList;
