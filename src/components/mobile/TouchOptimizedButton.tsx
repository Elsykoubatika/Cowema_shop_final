
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TouchOptimizedButtonProps extends ButtonProps {
  touchTarget?: 'small' | 'medium' | 'large';
  hapticFeedback?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  className,
  touchTarget = 'large',
  hapticFeedback = true,
  loading = false,
  loadingText = 'Chargement...',
  disabled,
  onClick,
  ...props
}) => {
  const touchSizes = {
    small: 'min-h-[40px] min-w-[40px] px-3 py-2',
    medium: 'min-h-[44px] min-w-[44px] px-4 py-3',
    large: 'min-h-[48px] min-w-[48px] px-6 py-4'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for mobile devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Visual feedback
    e.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.style.transform = '';
      }
    }, 150);
    
    if (onClick && !loading && !disabled) {
      onClick(e);
    }
  };

  return (
    <Button
      className={cn(
        touchSizes[touchTarget],
        'touch-manipulation select-none transition-all duration-200',
        'focus:ring-4 focus:ring-offset-2',
        'active:scale-95 hover:scale-105',
        'shadow-lg hover:shadow-xl',
        'font-semibold text-sm sm:text-base',
        loading && 'opacity-70 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default TouchOptimizedButton;
