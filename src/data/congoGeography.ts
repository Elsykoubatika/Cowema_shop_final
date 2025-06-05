
export interface Arrondissement {
  name: string;
  deliveryFee: number;
}

export interface Ville {
  name: string;
  arrondissements: Arrondissement[];
}

export const CONGO_GEOGRAPHY: Ville[] = [
  {
    name: 'Brazzaville',
    arrondissements: [
      { name: '1er Arrondissement (Centre-ville)', deliveryFee: 1500 },
      { name: '2ème Arrondissement (Bacongo)', deliveryFee: 2000 },
      { name: '3ème Arrondissement (Poto-Poto)', deliveryFee: 2000 },
      { name: '4ème Arrondissement (Moungali)', deliveryFee: 2500 },
      { name: '5ème Arrondissement (Ouenzé)', deliveryFee: 3000 },
      { name: '6ème Arrondissement (Talangaï)', deliveryFee: 3500 },
      { name: '7ème Arrondissement (Mfilou)', deliveryFee: 4000 },
      { name: '8ème Arrondissement (Madibou)', deliveryFee: 4000 },
      { name: '9ème Arrondissement (Djiri)', deliveryFee: 4500 }
    ]
  },
  {
    name: 'Pointe-Noire',
    arrondissements: [
      { name: '1er Arrondissement (Centre-ville)', deliveryFee: 1500 },
      { name: '2ème Arrondissement (Lumumba)', deliveryFee: 2000 },
      { name: '3ème Arrondissement (Tie-Tie)', deliveryFee: 2000 },
      { name: '4ème Arrondissement (Mongo-Mpoukou)', deliveryFee: 2500 },
      { name: '5ème Arrondissement (Ngoyo)', deliveryFee: 2500 },
      { name: '6ème Arrondissement (Mpita)', deliveryFee: 3000 },
      { name: '7ème Arrondissement (Vindoulou)', deliveryFee: 3500 }
    ]
  },
  {
    name: 'Dolisie',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 2000 },
      { name: 'Mougoundou-Nord', deliveryFee: 2500 },
      { name: 'Mougoundou-Sud', deliveryFee: 2500 },
      { name: 'Ngot-Lititi', deliveryFee: 3000 }
    ]
  },
  {
    name: 'Nkayi',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 2500 },
      { name: 'Mouyondzi', deliveryFee: 3000 },
      { name: 'Loudima', deliveryFee: 3000 }
    ]
  },
  {
    name: 'Owando',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 3000 },
      { name: 'Mossendjo', deliveryFee: 3500 }
    ]
  },
  {
    name: 'Ouesso',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 4000 },
      { name: 'Sembé', deliveryFee: 4500 }
    ]
  },
  {
    name: 'Impfondo',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 4000 },
      { name: 'Dongou', deliveryFee: 4500 }
    ]
  },
  {
    name: 'Madingou',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 2500 },
      { name: 'Kimongo', deliveryFee: 3000 }
    ]
  },
  {
    name: 'Kinkala',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 2000 },
      { name: 'Mindouli', deliveryFee: 2500 }
    ]
  },
  {
    name: 'Sibiti',
    arrondissements: [
      { name: 'Centre-ville', deliveryFee: 3000 },
      { name: 'Zanaga', deliveryFee: 3500 }
    ]
  }
];

export const getCitiesNames = (): string[] => {
  return CONGO_GEOGRAPHY.map(city => city.name);
};

export const getArrondissementsByCity = (cityName: string): Arrondissement[] => {
  const city = CONGO_GEOGRAPHY.find(c => c.name === cityName);
  return city?.arrondissements || [];
};

export const getDeliveryFee = (cityName: string, arrondissementName: string): number => {
  const city = CONGO_GEOGRAPHY.find(c => c.name === cityName);
  if (!city) return 1500; // Fee par défaut
  
  const arrondissement = city.arrondissements.find(a => a.name === arrondissementName);
  return arrondissement?.deliveryFee || 1500;
};

export const updateDeliveryFee = (cityName: string, arrondissementName: string, newFee: number): Ville[] => {
  return CONGO_GEOGRAPHY.map(city => {
    if (city.name === cityName) {
      return {
        ...city,
        arrondissements: city.arrondissements.map(arr => 
          arr.name === arrondissementName 
            ? { ...arr, deliveryFee: newFee }
            : arr
        )
      };
    }
    return city;
  });
};
