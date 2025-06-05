
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar, Download } from 'lucide-react';

interface MetricsHeaderProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  onExport: () => void;
}

const MetricsHeader: React.FC<MetricsHeaderProps> = ({ dateRange, onDateRangeChange, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="90days">90 derniers jours</SelectItem>
            <SelectItem value="all">Tout le temps</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>
    </div>
  );
};

export default MetricsHeader;
