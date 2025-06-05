
import React from 'react';
import { Gift } from 'lucide-react';

interface UpsellHeaderProps {
  title: string;
}

const UpsellHeader: React.FC<UpsellHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="text-amber-500">
        <Gift size={24} className="animate-pulse" />
      </div>
      <h3 className="font-bold text-lg text-amber-800">{title}</h3>
    </div>
  );
};

export default UpsellHeader;
