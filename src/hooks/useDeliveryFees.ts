
import { create } from 'zustand';
import { CONGO_GEOGRAPHY, Ville, Arrondissement, getDeliveryFee as getDeliveryFeeFromData } from '@/data/congoGeography';

export interface Neighborhood {
  name: string;
  fee: number;
}

export interface City {
  name: string;
  neighborhoods: Neighborhood[];
}

export interface NeighborhoodFee {
  name: string;
  fee: number;
}

export interface CityDeliveryFees {
  name: string;
  neighborhoods: NeighborhoodFee[];
}

interface DeliveryFeesState {
  cities: City[];
}

interface DeliveryFeesActions {
  getDeliveryFee: (city: string, arrondissement: string) => number;
  addCity: (city: City) => void;
  removeCity: (cityName: string) => void;
  addNeighborhood: (cityName: string, neighborhood: Neighborhood) => void;
  updateNeighborhood: (cityName: string, arrondissementName: string, fee: number) => void;
  removeNeighborhood: (cityName: string, arrondissementName: string) => void;
}

// Convertir les données Congo en format compatible avec le hook existant
const convertCongoDataToCities = (): City[] => {
  return CONGO_GEOGRAPHY.map(ville => ({
    name: ville.name,
    neighborhoods: ville.arrondissements.map(arr => ({
      name: arr.name,
      fee: arr.deliveryFee
    }))
  }));
};

export const useDeliveryFees = create<DeliveryFeesState & DeliveryFeesActions>()((set, get) => ({
  cities: convertCongoDataToCities(),
  
  getDeliveryFee: (city: string, arrondissement: string) => {
    return getDeliveryFeeFromData(city, arrondissement);
  },

  addCity: (city: City) => {
    set(state => ({
      cities: [...state.cities, city]
    }));
  },

  removeCity: (cityName: string) => {
    set(state => ({
      cities: state.cities.filter(c => c.name !== cityName)
    }));
  },

  addNeighborhood: (cityName: string, neighborhood: Neighborhood) => {
    set(state => ({
      cities: state.cities.map(city => 
        city.name === cityName 
          ? { ...city, neighborhoods: [...city.neighborhoods, neighborhood] }
          : city
      )
    }));
  },

  updateNeighborhood: (cityName: string, arrondissementName: string, fee: number) => {
    set(state => ({
      cities: state.cities.map(city => 
        city.name === cityName 
          ? {
              ...city,
              neighborhoods: city.neighborhoods.map(n => 
                n.name === arrondissementName ? { ...n, fee } : n
              )
            }
          : city
      )
    }));
  },

  removeNeighborhood: (cityName: string, arrondissementName: string) => {
    set(state => ({
      cities: state.cities.map(city => 
        city.name === cityName 
          ? {
              ...city,
              neighborhoods: city.neighborhoods.filter(n => n.name !== arrondissementName)
            }
          : city
      )
    }));
  }
}));
