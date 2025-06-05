
import React from 'react';
import { Package } from 'lucide-react';

interface OrderItemCellProps {
  orderItems: any[];
}

const OrderItemCell: React.FC<OrderItemCellProps> = ({ orderItems }) => {
  const firstItem = orderItems[0];
  const totalItems = orderItems.length;

  console.log('🖼️ OrderItemCell rendering:', {
    totalItems,
    firstItem: firstItem ? {
      title: firstItem.title,
      hasImage: !!firstItem.image,
      image: firstItem.image,
      quantity: firstItem.quantity,
      price: firstItem.price_at_time
    } : null
  });

  if (!firstItem) {
    return (
      <div className="text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <p>Aucun article trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 max-w-xs">
      {firstItem.image ? (
        <img
          src={firstItem.image}
          alt={firstItem.title}
          className="w-12 h-12 object-cover rounded border"
          onError={(e) => {
            console.log('❌ Erreur chargement image:', firstItem.image);
            e.currentTarget.style.display = 'none';
            // Afficher l'icône de remplacement
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const placeholder = document.createElement('div');
              placeholder.className = 'w-12 h-12 bg-gray-200 rounded border flex items-center justify-center';
              placeholder.innerHTML = '<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
              parent.insertBefore(placeholder, e.currentTarget);
            }
          }}
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
          <Package className="h-6 w-6 text-gray-400" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate" title={firstItem.title}>
          {firstItem.title || 'Produit sans nom'}
        </p>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Qté: {firstItem.quantity}</div>
          <div className="font-medium">
            {firstItem.promo_price && firstItem.promo_price !== firstItem.price_at_time ? (
              <>
                <span className="line-through text-gray-400">
                  {Number(firstItem.price_at_time)?.toLocaleString() || '0'} FCFA
                </span>
                <span className="ml-1 text-green-600">
                  {Number(firstItem.promo_price).toLocaleString()} FCFA
                </span>
              </>
            ) : (
              <span>{Number(firstItem.price_at_time)?.toLocaleString() || '0'} FCFA</span>
            )}
          </div>
        </div>
        {totalItems > 1 && (
          <p className="text-xs text-blue-600 mt-1">
            +{totalItems - 1} autre{totalItems > 2 ? 's' : ''} article{totalItems > 2 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderItemCell;
