
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiryDate: string;
  variant?: 'default' | 'compact';
  className?: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  expiryDate,
  variant = 'default',
  className = '',
  onComplete
}) => {
  const calculateTimeLeft = () => {
    const difference = new Date(expiryDate).getTime() - new Date().getTime();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      
      // Check if timer has expired
      if (updatedTimeLeft.days === 0 && updatedTimeLeft.hours === 0 && 
          updatedTimeLeft.minutes === 0 && updatedTimeLeft.seconds === 0) {
        setIsExpired(true);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (isExpired) {
    return <span className={className}>Expiré</span>;
  }

  if (variant === 'compact') {
    return (
      <span className={className}>
        {timeLeft.days > 0 && `${timeLeft.days}j `}
        {timeLeft.hours > 0 && `${timeLeft.hours}h `}
        {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
        {timeLeft.seconds}s
      </span>
    );
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {timeLeft.days > 0 && (
        <div className="text-center">
          <span className="font-bold">{timeLeft.days}</span>
          <span className="text-xs block">jours</span>
        </div>
      )}
      <div className="text-center">
        <span className="font-bold">{timeLeft.hours}</span>
        <span className="text-xs block">heures</span>
      </div>
      <div className="text-center">
        <span className="font-bold">{timeLeft.minutes}</span>
        <span className="text-xs block">min</span>
      </div>
      <div className="text-center">
        <span className="font-bold">{timeLeft.seconds}</span>
        <span className="text-xs block">sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
