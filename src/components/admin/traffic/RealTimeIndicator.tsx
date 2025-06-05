
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const RealTimeIndicator: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [currentVisitors, setCurrentVisitors] = useState(0);

  useEffect(() => {
    // Simulate real-time visitor count updates
    const interval = setInterval(() => {
      setCurrentVisitors(prev => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
        return Math.max(0, prev + change);
      });
    }, 3000);

    // Initialize with a random number
    setCurrentVisitors(Math.floor(Math.random() * 25) + 5);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3">
      <Badge variant={isLive ? "default" : "secondary"} className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span>En direct</span>
      </Badge>
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Activity size={14} />
        <span>{currentVisitors} visiteurs actifs</span>
      </div>
    </div>
  );
};

export default RealTimeIndicator;
