
import React from 'react';
import { Package, Image } from 'lucide-react';

interface EnhancedOrderItemCellProps {
  orderItems: any[];
}

const EnhancedOrderItemCell: React.FC<EnhancedOrderItemCellProps> = ({ orderItems }) => {
  console.log('🖼️ EnhancedOrderItemCell rendering with items:', orderItems);

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <p>Aucun article trouvé</p>
        </div>
      </div>
    );
  }

  const firstItem = orderItems[0];
  const totalItems = orderItems.length;

  console.log('🔍 First item details:', {
    title: firstItem?.title,
    image: firstItem?.image,
    quantity: firstItem?.quantity,
    price: firstItem?.price_at_time,
    promo_price: firstItem?.promo_price
  });

  return (
    <div className="flex items-start space-x-3 max-w-sm">
      {/* Image du produit */}
      <div className="flex-shrink-0">
        {firstItem?.image ? (
          <div className="relative">
            <img
              src={firstItem.image}
              alt={firstItem.title || 'Produit'}
              className="w-16 h-16 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                console.log('❌ Erreur chargement image:', firstItem.image);
                const imgElement = e.currentTarget;
                imgElement.style.display = 'none';
                const placeholder = imgElement.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            <div 
              className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <Image className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
            <Image className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Informations du produit */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2" title={firstItem?.title}>
          {firstItem?.title || 'Produit sans nom'}
        </h4>
        
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
            Qté: {firstItem?.quantity || 0}
          </span>
          
          <div className="font-medium">
            {firstItem?.promo_price && firstItem.promo_price !== firstItem.price_at_time ? (
              <div className="flex items-center gap-1">
                <span className="line-through text-gray-400 text-xs">
                  {Number(firstItem.price_at_time)?.toLocaleString() || '0'} FCFA
                </span>
                <span className="text-green-600 font-semibold">
                  {Number(firstItem.promo_price).toLocaleString()} FCFA
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-semibold">
                {Number(firstItem?.price_at_time)?.toLocaleString() || '0'} FCFA
              </span>
            )}
          </div>
        </div>
        
        {totalItems > 1 && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
            +{totalItems - 1} autre{totalItems > 2 ? 's' : ''} article{totalItems > 2 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedOrderItemCell;
