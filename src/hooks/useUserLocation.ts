
import { useState, useEffect } from 'react';

interface UserLocation {
  city?: string;
  country?: string;
  isLoading: boolean;
  error?: string;
}

export const useUserLocation = (): UserLocation => {
  const [location, setLocation] = useState<UserLocation>({
    isLoading: true
  });

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // D'abord essayer de récupérer depuis le localStorage (choix utilisateur)
        const savedCity = localStorage.getItem('userCity');
        if (savedCity) {
          setLocation({
            city: savedCity,
            country: 'Congo',
            isLoading: false
          });
          return;
        }

        // Ensuite essayer la géolocalisation IP (service gratuit)
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const detectedCity = data.city || data.region || 'Congo';
          
          setLocation({
            city: detectedCity,
            country: data.country_name || 'Congo',
            isLoading: false
          });
          
          // Sauvegarder pour les prochaines visites
          localStorage.setItem('userCity', detectedCity);
        } else {
          throw new Error('Géolocalisation IP échouée');
        }
      } catch (error) {
        console.log('Géolocalisation échouée, utilisation valeur par défaut');
        setLocation({
          city: 'Kinshasa',
          country: 'Congo',
          isLoading: false,
          error: 'Impossible de détecter la localisation'
        });
      }
    };

    getUserLocation();
  }, []);

  return location;
};
