
import React from 'react';
import { MapPin, Package, TrendingUp, FileText } from 'lucide-react';

interface ProductDetailsProps {
  city: string;
  location: string;
  stock: number;
  sold: number;
  description: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ city, location, stock, sold, description }) => {
  return (
    <div className="space-y-6">
      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-full">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Ville</p>
            <p className="text-sm text-gray-600">{city || location || 'Non spécifié'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <div className="p-2 bg-green-100 rounded-full">
            <Package className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Stock disponible</p>
            {stock > 0 && stock <= 5 ? (
              <p className="text-sm text-amber-600 font-medium">Plus que {stock} en stock!</p>
            ) : (
              <p className="text-sm text-gray-600">{stock}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <div className="p-2 bg-purple-100 rounded-full">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Déjà vendus</p>
            <p className="text-sm text-gray-600">{sold || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Description Section */}
      {description && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
