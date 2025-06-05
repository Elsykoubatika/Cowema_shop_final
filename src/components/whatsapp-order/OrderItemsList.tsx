
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
}

interface OrderItemsListProps {
  items: CartItem[];
  onQuantityChange: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  onQuantityChange,
  onRemoveItem
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucun article dans votre commande
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="flex-1">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600">
              {(item.promoPrice || item.price).toLocaleString()} FCFA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onQuantityChange(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onQuantityChange(item.id, 1)}
            >
              <Plus size={16} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;
