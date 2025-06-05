
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProductActionsButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

const ProductActionsButton: React.FC<ProductActionsButtonProps> = ({ 
  children, 
  onClick, 
  variant = "default", 
  className = "" 
}) => {
  return (
    <Button 
      className={className}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ProductActionsButton;
