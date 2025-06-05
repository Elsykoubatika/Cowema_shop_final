
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/ae0eae09-dd45-4b0a-9155-f712a36dc362.png" 
        alt="Logo Cowema" 
        className="h-10 mr-2"
      />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-primary tracking-wide">COWEMA</span>
        <span className="text-xs text-cowema-lightText -mt-1">N°1 de la vente en ligne au Congo!</span>
      </div>
    </Link>
  );
};

export default Logo;
