
import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useUnifiedCart } from '../../cart/components/CartProvider';
import WhatsAppOrderFormWrapper from '../WhatsAppOrderFormWrapper';
import OptimizedDirectOrderForm from '../forms/OptimizedDirectOrderForm';

const CartOrderButton: React.FC = () => {
  const { items, totalItems, clearCart } = useUnifiedCart();
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [orderType, setOrderType] = useState<'whatsapp' | 'direct' | null>(null);

  const handleOrderClick = () => {
    if (items.length === 0) return;
    setShowOrderOptions(true);
  };

  const handleOrderTypeSelect = (type: 'whatsapp' | 'direct') => {
    setOrderType(type);
    setShowOrderOptions(false);
  };

  const handleOrderComplete = (orderId: string) => {
    console.log('Order completed:', orderId);
    setOrderType(null);
    // Optionally clear cart after successful order
  };

  const closeOrderForms = () => {
    setOrderType(null);
  };

  // Convertir les items du panier au format attendu
  const cartOrderItems = items.map(item => ({
    id: item.id,
    title: item.title || item.name,
    price: item.price,
    promoPrice: item.promoPrice || null,
    quantity: item.quantity,
    image: item.image,
    category: item.category,
    videoUrl: undefined
  }));

  return (
    <>
      <Button 
        className="w-full" 
        size="lg"
        onClick={handleOrderClick}
        disabled={items.length === 0}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Commander ({totalItems} articles)
      </Button>

      {/* Options de commande */}
      <Dialog open={showOrderOptions} onOpenChange={setShowOrderOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Choisissez votre méthode de commande
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-4">
            <Button
              variant="outline"
              className="w-full h-16 flex flex-col space-y-2"
              onClick={() => handleOrderTypeSelect('whatsapp')}
            >
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Commander via WhatsApp</div>
                <div className="text-sm text-gray-500">Rapide et simple</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex flex-col space-y-2"
              onClick={() => handleOrderTypeSelect('direct')}
            >
              <CreditCard className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Commande directe</div>
                <div className="text-sm text-gray-500">Avec informations complètes</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Order Form */}
      <WhatsAppOrderFormWrapper
        isOpen={orderType === 'whatsapp'}
        onClose={closeOrderForms}
        product={null}
        cartItems={cartOrderItems}
      />

      {/* Direct Order Form */}
      <OptimizedDirectOrderForm
        isOpen={orderType === 'direct'}
        onClose={closeOrderForms}
        items={cartOrderItems}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
};

export default CartOrderButton;
