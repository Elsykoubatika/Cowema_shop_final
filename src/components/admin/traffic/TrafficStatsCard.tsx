
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TrafficStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const TrafficStatsCard: React.FC<TrafficStatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-3xl font-bold">{value}</div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className={`${color}`}>
              {icon}
            </div>
            {change !== undefined && (
              <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficStatsCard;
