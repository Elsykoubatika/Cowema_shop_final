
import React from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUnifiedCart } from '../cart/components/CartProvider';
import CartOrderButton from './cart/CartOrderButton';

const Cart: React.FC = () => {
  const { 
    items, 
    totalItems, 
    totalAmount, 
    updateQuantity, 
    removeItem, 
    clearCart,
    isCartVisible,
    toggleCartVisibility
  } = useUnifiedCart();

  if (!isCartVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleCartVisibility}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-cart-toggle
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Panier</h2>
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalItems}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleCartVisibility}
            className="hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
              <p className="text-gray-500 mb-4">Ajoutez des produits pour commencer vos achats</p>
              <Button onClick={toggleCartVisibility} variant="outline">
                Continuer les achats
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {/* Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.title || item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {item.promoPrice ? (
                        <>
                          <span className="text-sm font-semibold text-green-600">
                            {item.promoPrice.toLocaleString()} FCFA
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {item.price.toLocaleString()} FCFA
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-green-600">
                          {item.price.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">{totalAmount.toLocaleString()} FCFA</span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <CartOrderButton />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  className="flex-1"
                >
                  Vider le panier
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleCartVisibility}
                  className="flex-1"
                >
                  Continuer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
