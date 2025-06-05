
import React from 'react';
import { Image } from 'lucide-react';

interface OrderItemCardProps {
  item: any;
  index: number;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, index }) => {
  return (
    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-6">
        {/* Image du produit */}
        <div className="flex-shrink-0">
          {item.image ? (
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.title || 'Produit'}
                className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                onError={(e) => {
                  console.log('❌ Erreur image:', item.image);
                  const imgElement = e.currentTarget;
                  imgElement.style.display = 'none';
                  const placeholder = imgElement.nextElementSibling as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
              <div 
                className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Informations du produit */}
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-3 text-gray-900">{item.title || 'Produit sans nom'}</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="block text-sm font-medium text-blue-700 mb-1">Quantité</span>
              <p className="text-xl font-bold text-blue-900">{item.quantity}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="block text-sm font-medium text-green-700 mb-1">Prix unitaire</span>
              <div>
                {item.promo_price && item.promo_price !== item.price_at_time ? (
                  <>
                    <p className="line-through text-gray-400 text-sm">
                      {Number(item.price_at_time)?.toLocaleString() || '0'} FCFA
                    </p>
                    <p className="text-green-600 font-bold text-lg">
                      {Number(item.promo_price).toLocaleString()} FCFA
                    </p>
                  </>
                ) : (
                  <p className="font-bold text-lg text-green-900">
                    {Number(item.price_at_time)?.toLocaleString() || '0'} FCFA
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="block text-sm font-medium text-purple-700 mb-1">Sous-total</span>
              <p className="text-xl font-bold text-purple-900">
                {((Number(item.promo_price) || Number(item.price_at_time)) * Number(item.quantity)).toLocaleString()} FCFA
              </p>
            </div>

            {item.promo_price && item.promo_price !== item.price_at_time && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <span className="block text-sm font-medium text-orange-700 mb-1">Économie</span>
                <p className="text-lg font-bold text-orange-600">
                  -{((Number(item.price_at_time) - Number(item.promo_price)) * Number(item.quantity)).toLocaleString()} FCFA
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
