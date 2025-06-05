
import React, { useState } from 'react';
import { Star, MoreVertical, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerReviewProps {
  quote: string;
  author: string;
  location: string;
  rating: number;
  className?: string;
  date?: string;
}

const CustomerReviewCard: React.FC<CustomerReviewProps> = ({ 
  quote, 
  author, 
  location, 
  rating,
  className = "",
  date
}) => {
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpfulClick = () => {
    setIsHelpful(prev => !prev);
  };

  return (
    <div className={`bg-white p-5 rounded-lg shadow-sm border border-gray-50 ${className}`}>
      {/* Author and rating area */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
            {author.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <div className="font-medium">{author}</div>
            {location && <div className="text-xs text-gray-500">{location}</div>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex text-green-600">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < rating ? "currentColor" : "none"} 
                stroke={i < rating ? "currentColor" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-700">{rating.toFixed(1)}</span>
          
          <button className="text-gray-400 hover:text-gray-600 ml-2">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Date */}
      {date && <div className="text-xs text-gray-500 mb-2">{date}</div>}
      
      {/* Review content */}
      <p className="text-gray-700 mb-3">{quote}</p>
      
      {/* Helpful buttons */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-500">Ce contenu vous a-t-il été utile ?</span>
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs py-0 px-3 h-7 ${isHelpful ? 'bg-gray-100' : ''}`}
          onClick={handleHelpfulClick}
        >
          <ThumbsUp size={14} className={isHelpful ? 'text-green-600' : ''} />
          <span className="ml-1">Oui</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs py-0 px-3 h-7"
        >
          Non
        </Button>
      </div>
    </div>
  );
};

export default CustomerReviewCard;
