
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, Package } from 'lucide-react';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
}

interface OrderItemsDisplayProps {
  items: OrderItem[];
  onQuantityChange: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const OrderItemsDisplay: React.FC<OrderItemsDisplayProps> = ({
  items,
  onQuantityChange,
  onRemoveItem
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucun article dans votre commande</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image du produit */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-16 sm:h-16 mx-auto sm:mx-0 rounded-lg overflow-hidden bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center text-gray-400 hidden">
                  <Package className="h-8 w-8" />
                </div>
              </div>
            </div>

            {/* Informations du produit */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                  {item.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {item.category}
                    </span>
                  )}
                  
                  {/* Prix */}
                  <div className="flex items-center gap-2 mt-2">
                    {item.promoPrice !== null && item.promoPrice < item.price ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          {item.promoPrice.toLocaleString()} FCFA
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {item.price.toLocaleString()} FCFA
                        </span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          -{Math.round(((item.price - item.promoPrice) / item.price) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {item.price.toLocaleString()} FCFA
                      </span>
                    )}
                  </div>
                </div>

                {/* Contrôles de quantité et suppression */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {/* Contrôles de quantité */}
                  <div className="flex items-center bg-gray-50 rounded-lg border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0 hover:bg-gray-200 disabled:opacity-50"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuantityChange(item.id, 1)}
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Bouton de suppression */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sous-total par article */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">
                  Sous-total ({item.quantity} {item.quantity > 1 ? 'articles' : 'article'})
                </span>
                <span className="font-semibold text-gray-900">
                  {((item.promoPrice !== null ? item.promoPrice : item.price) * item.quantity).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsDisplay;
