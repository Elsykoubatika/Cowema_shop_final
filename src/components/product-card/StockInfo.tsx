
import React from 'react';
import { AlertCircle, MapPin } from 'lucide-react';

export interface StockInfoProps {
  stock: number;
  location?: string;
  showStockWarning?: boolean;
}

const StockInfo: React.FC<StockInfoProps> = ({ 
  stock, 
  location,
  showStockWarning = true
}) => {
  // Pas de stock
  if (stock === 0) {
    return (
      <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
        <AlertCircle size={14} />
        Rupture de stock
      </div>
    );
  }
  
  // Stock faible (moins de 10 pour être plus visible)
  if (stock <= 10 && showStockWarning) {
    return (
      <div className="mt-1 space-y-1">
        <div className="text-sm text-orange-500 flex items-center gap-1">
          <AlertCircle size={14} />
          Plus que {stock} en stock
        </div>
        {location && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            {location}
          </div>
        )}
      </div>
    );
  }
  
  // Stock normal
  return (
    <div className="mt-1 space-y-1">
      <div className="text-sm text-green-600">
        En stock ({stock} disponibles)
      </div>
      {location && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin size={12} />
          {location}
        </div>
      )}
    </div>
  );
};

export default StockInfo;
