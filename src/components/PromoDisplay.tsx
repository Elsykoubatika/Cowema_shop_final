
import React, { useState, useEffect } from 'react';
import { useActivePromotion, usePromotionStore } from '../hooks/usePromotionStore';
import CountdownTimer from './CountdownTimer';
import { AlertCircle, Clock, Copy, Check, Gift } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import '../components/ui/animations.css';

interface PromoDisplayProps {
  variant?: 'default' | 'compact' | 'badge';
  className?: string;
  showDescription?: boolean;
  productsType?: 'all' | 'ya-ba-boss';
}

const PromoDisplay: React.FC<PromoDisplayProps> = ({
  variant = 'default',
  className = '',
  showDescription = true,
  productsType = 'all'
}) => {
  const activePromotion = useActivePromotion();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  // Animation effect
  useEffect(() => {
    // Initial highlight on mount
    setIsHighlighted(true);
    
    // Track view event if promotion is shown
    if (activePromotion) {
      // Dans un environnement réel, vous appelleriez une API pour enregistrer la vue
      console.log(`Promotion viewed: ${activePromotion.code}`);
    }
    
    const initialTimeout = setTimeout(() => {
      setIsHighlighted(false);
    }, 1000);
    
    // Set up interval to highlight periodically
    const interval = setInterval(() => {
      setIsHighlighted(true);
      
      setTimeout(() => {
        setIsHighlighted(false);
      }, 1000);
    }, 10000); // Highlight every 10 seconds
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [activePromotion]);
  
  // Only show promotions that match the product type or are for all products
  if (!activePromotion || (activePromotion.target !== 'all' && activePromotion.target !== productsType)) {
    return null;
  }
  
  const handleCopyCode = () => {
    if (activePromotion) {
      navigator.clipboard.writeText(activePromotion.code)
        .then(() => {
          setCopied(true);
          toast({
            title: "Code copié!",
            description: `Le code "${activePromotion.code}" a été copié dans le presse-papiers.`,
            duration: 2000,
          });
          
          // Track copy event
          console.log(`Promotion code copied: ${activePromotion.code}`);
          
          // Reset the copied state after 2 seconds
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Erreur lors de la copie:', err);
          toast({
            title: "Erreur",
            description: "Impossible de copier le code",
            variant: "destructive",
          });
        });
    }
  };
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className} ${isHighlighted ? 'animate-pulse' : ''}`}>
        <span className="font-medium flex items-center gap-1">
          <Clock size={14} className="text-red-500 animate-pulse" />
          <span>Offre expire dans</span>
          <CountdownTimer 
            expiryDate={activePromotion.expiryDate} 
            variant="compact"
            className="font-bold"
          />
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleCopyCode}
          className={`font-medium ml-2 py-0 h-auto flex items-center gap-1 hover:bg-primary/10 transition-all ${copied ? 'bg-green-50' : isHighlighted ? 'bg-amber-50' : ''}`}
        >
          Code: <span className="text-primary font-mono font-bold">{activePromotion.code}</span> 
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-amber-500" />}
        </Button>
        <span className="font-medium text-red-600">
          (-{activePromotion.discount}%)
        </span>
      </div>
    );
  }
  
  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2 ${className} ${isHighlighted ? 'animate-pulse' : ''}`}>
        <span className="text-xs font-medium flex items-center gap-1">
          <Clock size={12} className="text-red-500 animate-pulse" />
          <span>Expire dans</span>
          <CountdownTimer 
            expiryDate={activePromotion.expiryDate} 
            variant="compact"
            className="font-bold"
          />
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleCopyCode}
          className={`text-xs font-medium py-0 h-auto flex items-center gap-1 hover:bg-primary/10 transition-all ${copied ? 'bg-green-50' : isHighlighted ? 'bg-amber-50' : ''}`}
        >
          {activePromotion.code}
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-amber-500" />}
        </Button>
        <span className="text-xs font-medium">
          (-{activePromotion.discount}%)
        </span>
      </div>
    );
  }
  
  // Default variant
  return (
    <Alert className={`${className} ${isHighlighted ? 'animate-pulse border-yellow-300 bg-yellow-50' : 'border-l-4 border-primary'} transition-all duration-300`}>
      <AlertTitle className="flex items-center gap-2">
        <Gift className={`h-5 w-5 text-primary ${isHighlighted ? 'animate-bounce' : ''}`} />
        <span className="flex items-center gap-1 font-bold text-lg">
          <span>Offre spéciale! Expire dans</span>
          <CountdownTimer 
            expiryDate={activePromotion.expiryDate} 
            variant="compact" 
            className="font-bold text-red-600"
          />
        </span>
      </AlertTitle>
      <AlertDescription className="flex flex-col mt-2">
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className="font-bold text-gray-700">Code promo:</span>
          <Button 
            variant="outline" 
            onClick={handleCopyCode}
            className={`bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded font-mono border-primary/20 font-bold flex items-center gap-2 h-auto transition-all ${copied ? 'bg-green-100' : isHighlighted ? 'pulse-animation bg-amber-100' : ''}`}
          >
            {activePromotion.code}
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-amber-500" />}
          </Button>
          <span className="text-green-600 font-medium text-lg">
            {activePromotion.discount}% de réduction
          </span>
        </div>
        {showDescription && activePromotion.description && (
          <p className="text-sm mt-2 text-gray-600">{activePromotion.description}</p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default PromoDisplay;
