
export const useDeliveryFeesData = () => {
  const deliveryFees = {
    'Brazzaville': {
      'Centre-ville': 1000,
      'Bacongo': 1500,
      'Poto-Poto': 1500,
      'Moungali': 2000,
      'Ouenzé': 2000,
      'Talangaï': 2500,
      'Mfilou': 2500,
      'Madibou': 3000,
      'Djiri': 3000
    },
    'Pointe-Noire': {
      'Centre-ville': 1000,
      'Loandjili': 1500,
      'Tié-Tié': 1500,
      'Lumumba': 2000,
      'Mongo-MPoukou': 2500
    },
    'Dolisie': { 'Centre-ville': 2000, 'Autre': 2500 },
    'Nkayi': { 'Centre-ville': 2000, 'Autre': 2500 },
    'Autre': { 'Autre': 3500 }
  };

  const cities = ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Autre'];
  
  const neighborhoods = {
    'Brazzaville': ['Centre-ville', 'Bacongo', 'Poto-Poto', 'Moungali', 'Ouenzé', 'Talangaï', 'Mfilou', 'Madibou', 'Djiri'],
    'Pointe-Noire': ['Centre-ville', 'Loandjili', 'Tié-Tié', 'Lumumba', 'Mongo-MPoukou'],
    'Dolisie': ['Centre-ville', 'Autre'],
    'Nkayi': ['Centre-ville', 'Autre'],
    'Autre': ['Autre']
  };

  const getDeliveryFee = (city: string, neighborhood: string): number => {
    const cityFees = deliveryFees[city as keyof typeof deliveryFees] || deliveryFees['Autre'];
    return cityFees[neighborhood as keyof typeof cityFees] || cityFees['Autre'] || 3500;
  };

  return {
    deliveryFees,
    cities,
    neighborhoods,
    getDeliveryFee
  };
};
