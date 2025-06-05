
import React, { useState, useEffect } from 'react';
import { useDeliveryFees } from '@/hooks/useDeliveryFees';

export interface DeliveryFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  neighborhood: string;
  address: string;
  notes: string;
  deliveryFee?: number;
}

export const useDeliveryForm = () => {
  const { cities, getDeliveryFee } = useDeliveryFees();
  const [formData, setFormData] = useState<DeliveryFormData>({
    name: '',
    phone: '',
    email: '',
    city: '',
    neighborhood: '',
    address: '',
    notes: ''
  });
  
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  
  // Update neighborhoods when city changes
  useEffect(() => {
    if (formData.city && cities.length > 0) {
      const selectedCity = cities.find(city => city.name === formData.city);
      if (selectedCity) {
        setNeighborhoods(selectedCity.neighborhoods.map(n => n.name));
        
        // Select first neighborhood by default if needed
        if (selectedCity.neighborhoods.length > 0 && (!formData.neighborhood || !selectedCity.neighborhoods.some(n => n.name === formData.neighborhood))) {
          setFormData(prev => ({ 
            ...prev, 
            neighborhood: selectedCity.neighborhoods[0].name 
          }));
        }
      } else {
        setNeighborhoods([]);
      }
    } else {
      setNeighborhoods([]);
    }
  }, [formData.city, cities]);
  
  // Update delivery fee when city or neighborhood changes
  useEffect(() => {
    if (formData.city && formData.neighborhood) {
      const fee = getDeliveryFee(formData.city, formData.neighborhood);
      setDeliveryFee(fee);
    }
  }, [formData.city, formData.neighborhood, getDeliveryFee]);
  
  // Initialize the city when component mounts
  useEffect(() => {
    if (cities.length > 0 && !formData.city) {
      // Default to first city (typically Brazzaville)
      setFormData(prev => ({ 
        ...prev, 
        city: cities[0]?.name || '',
        neighborhood: cities[0]?.neighborhoods[0]?.name || ''
      }));
    }
  }, [cities]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    setFormData,
    neighborhoods,
    deliveryFee,
    handleChange,
    cities
  };
};
