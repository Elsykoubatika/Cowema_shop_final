
import React from 'react';
import Header from '../Header';

interface LoadingStateProps {
  totalCartItems: number;
  onCartClick: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  totalCartItems, 
  onCartClick 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={totalCartItems} onCartClick={onCartClick} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
