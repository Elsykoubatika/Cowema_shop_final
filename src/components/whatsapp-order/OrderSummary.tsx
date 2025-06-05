
import React from 'react';
import { Trash2, MinusCircle } from 'lucide-react';
import { Product } from '../../data/products';

interface OrderSummaryProps {
  product?: Product | null;
  localCartItems: Array<{ 
    id: string; // Assuré d'être string
    title: string; 
    price: number; 
    promoPrice: number | null; 
    quantity: number; 
    image: string;
    category?: string;
  }>;
  upsellProducts?: Array<{ name: string; isAdded: boolean; price?: number; image?: string; discount?: number }>;
  upsellProduct?: { name: string; isAdded: boolean } | null;
  calculateSubtotal: () => number;
  handleRemoveItem: (id: string) => void;
  handleAdjustQuantity: (id: string, change: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  localCartItems,
  upsellProducts = [],
  upsellProduct,
  calculateSubtotal,
  handleRemoveItem,
  handleAdjustQuantity
}) => {
  return (
    <div className="mb-4 border rounded-md p-3">
      <h3 className="font-medium mb-2">Récapitulatif de votre commande:</h3>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {/* Si le produit principal n'est pas déjà dans le panier */}
        {product && !localCartItems.some(item => String(item.id) === String(product.id)) && (
          <div className="flex justify-between items-center text-sm p-1 border-b">
            <div className="flex items-center gap-2">
              <img src={product.images[0]} alt={product.title || product.name} className="w-10 h-10 object-cover rounded-sm" />
              <span className="font-medium">{product.title || product.name}</span>
            </div>
            <span>{(product.promoPrice || product.price).toLocaleString()} FCFA</span>
          </div>
        )}
        
        {/* Display all cart items with remove buttons */}
        {localCartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm p-1 border-b">
            <div className="flex flex-1 items-center gap-2">
              <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-sm" />
              <div className="flex-1">
                <span className="font-medium">{item.title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <button 
                    type="button" 
                    onClick={() => handleAdjustQuantity(String(item.id), -1)} // S'assurer que l'ID est string
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    disabled={item.quantity <= 1}
                  >
                    <MinusCircle size={16} className={item.quantity <= 1 ? "text-gray-400" : "text-gray-700"} />
                  </button>
                  <span className="font-medium">
                    {item.quantity}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => handleAdjustQuantity(String(item.id), 1)} // S'assurer que l'ID est string
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{((item.promoPrice || item.price) * item.quantity).toLocaleString()} FCFA</div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(String(item.id))} // S'assurer que l'ID est string
                  className="text-red-500 hover:text-red-700 p-1 ml-auto flex"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Display selected upsell products */}
        {upsellProducts && upsellProducts.filter(item => item.isAdded).map((item, index) => (
          <div key={`upsell-${index}`} className="flex justify-between text-sm bg-amber-50 p-1 rounded">
            <span>{item.name}</span>
            <span className="font-medium">
              {item.price && item.discount 
                ? Math.round(item.price * (1 - (item.discount / 100))).toLocaleString()
                : (item.price || 5000).toLocaleString()} FCFA
            </span>
          </div>
        ))}
        
        {/* For backward compatibility */}
        {!upsellProducts.length && upsellProduct && upsellProduct.isAdded && (
          <div className="flex justify-between text-sm bg-amber-50 p-1 rounded">
            <span>{upsellProduct.name}</span>
            <span className="font-medium">5000 FCFA</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-sm pt-2 border-t mt-2">
        <span>Sous-total:</span>
        <span>{calculateSubtotal().toLocaleString()} FCFA</span>
      </div>
    </div>
  );
};

export default OrderSummary;
