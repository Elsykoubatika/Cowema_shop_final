
import React from 'react';
import { Crown } from 'lucide-react';

interface YaBaBossIconProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const YaBaBossIcon: React.FC<YaBaBossIconProps> = ({ 
  size = 16, 
  className = "text-yellow-500", 
  showText = false,
  textClassName = "text-yellow-600 font-bold text-xs"
}) => {
  if (showText) {
    return (
      <span className={`flex items-center gap-1 ${textClassName}`}>
        <div className="relative inline-flex items-center">
          <Crown size={size} className={className} fill="currentColor" />
          <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-current" />
        </div>
        <span>YA BA BOSS</span>
      </span>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <Crown size={size} className={className} fill="currentColor" />
      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-current" />
    </div>
  );
};

export default YaBaBossIcon;
