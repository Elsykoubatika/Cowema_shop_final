
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";

interface CitySelectorProps {
  selectedCity: string;
  handleCityChange: (value: string) => void;
  cities: string[];
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  handleCityChange,
  cities = [], // Default to empty array to prevent undefined error
}) => {
  return (
    <div className="w-40">
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Ville" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les villes</SelectItem>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
