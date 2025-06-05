
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, CreditCard, ArrowLeft, Percent, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedCart } from '../cart/components/CartProvider';
import WhatsAppOrderFormWrapper from '../components/WhatsAppOrderFormWrapper';
import OptimizedDirectOrderForm from '../components/forms/OptimizedDirectOrderForm';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, subtotal, promotionDiscount, totalAmount, applyPromotion, appliedPromotion } = useUnifiedCart();
  const [orderType, setOrderType] = useState<'whatsapp' | 'direct' | null>(null);
  const [promoApplied, setPromoApplied] = useState(false);

  // Apply abandon cart promotion if not already applied
  React.useEffect(() => {
    const applyAbandonPromo = async () => {
      if (!promoApplied && items.length > 0 && !appliedPromotion) {
        try {
          const applied = await applyPromotion('ABANDON10');
          if (applied) {
            setPromoApplied(true);
            toast.success('🎉 Code promo ABANDON10 appliqué ! -10% sur votre commande');
          }
        } catch (error) {
          console.log('Promo ABANDON10 not available');
        }
      }
    };

    applyAbandonPromo();
  }, [items.length, applyPromotion, promoApplied, appliedPromotion]);

  const handleOrderTypeSelect = (type: 'whatsapp' | 'direct') => {
    setOrderType(type);
  };

  const handleOrderComplete = (orderId: string) => {
    console.log('Order completed:', orderId);
    setOrderType(null);
    toast.success('Commande envoyée avec succès !');
    navigate('/');
  };

  const closeOrderForms = () => {
    setOrderType(null);
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  // Convert cart items to order format
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

  // Calculate savings
  const originalTotal = subtotal;
  const savings = promotionDiscount;
  const hasDiscount = savings > 0 && appliedPromotion;

  // Redirect to home if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-4">
              Ajoutez des produits à votre panier pour continuer vos achats.
            </p>
            <Button onClick={handleBackToShopping} className="w-full">
              Continuer mes achats
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToShopping}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Finaliser ma commande</h1>
        </div>

        {/* Promotion Banner */}
        {hasDiscount && (
          <div className="mb-6">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">
                        🎉 Promotion ABANDON10 appliquée !
                      </h3>
                      <p className="text-sm text-green-700">
                        Vous économisez <span className="font-bold">{savings.toLocaleString()} FCFA</span> sur votre commande
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Percent className="h-3 w-3 mr-1" />
                      -10%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Récapitulatif ({totalItems} articles)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-gray-600 text-sm">
                          {item.quantity} × {item.promoPrice || item.price} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span>Sous-total:</span>
                      <span>{originalTotal.toLocaleString()} FCFA</span>
                    </div>
                    
                    {/* Discount */}
                    {hasDiscount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center">
                          <Percent className="h-3 w-3 mr-1" />
                          Promotion ABANDON10:
                        </span>
                        <span>-{savings.toLocaleString()} FCFA</span>
                      </div>
                    )}
                    
                    {/* Total */}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total à payer:</span>
                      <span className="text-primary">{totalAmount.toLocaleString()} FCFA</span>
                    </div>
                    
                    {/* Savings highlight */}
                    {hasDiscount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                        <div className="text-center">
                          <p className="text-green-800 font-medium text-sm">
                            🎉 Vous économisez {savings.toLocaleString()} FCFA !
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Grâce à votre code promo ABANDON10
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Method Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Choisissez votre méthode de commande</CardTitle>
                <p className="text-gray-600">
                  Sélectionnez comment vous souhaitez finaliser votre commande
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp Order */}
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500">
                    <CardContent 
                      className="p-6 text-center"
                      onClick={() => handleOrderTypeSelect('whatsapp')}
                    >
                      <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Commander via WhatsApp
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Rapide et simple. Communiquez directement avec notre équipe.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-green-600">
                          ✓ Contact direct avec un conseiller
                        </div>
                        <div className="flex items-center text-green-600">
                          ✓ Livraison rapide
                        </div>
                        <div className="flex items-center text-green-600">
                          ✓ Paiement à la livraison
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                        onClick={() => handleOrderTypeSelect('whatsapp')}
                      >
                        Choisir WhatsApp
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Direct Order */}
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500">
                    <CardContent 
                      className="p-6 text-center"
                      onClick={() => handleOrderTypeSelect('direct')}
                    >
                      <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Commande directe
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Formulaire complet avec toutes vos informations.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-blue-600">
                          ✓ Informations complètes
                        </div>
                        <div className="flex items-center text-blue-600">
                          ✓ Suivi de commande
                        </div>
                        <div className="flex items-center text-blue-600">
                          ✓ Historique des achats
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleOrderTypeSelect('direct')}
                      >
                        Choisir Direct
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Forms */}
      <WhatsAppOrderFormWrapper
        isOpen={orderType === 'whatsapp'}
        onClose={closeOrderForms}
        product={null}
        cartItems={cartOrderItems}
      />

      <OptimizedDirectOrderForm
        isOpen={orderType === 'direct'}
        onClose={closeOrderForms}
        items={cartOrderItems}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
};

export default Checkout;
