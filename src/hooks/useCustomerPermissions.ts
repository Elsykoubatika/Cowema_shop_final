import { useAuthStore } from './useAuthStore';
import { Customer } from './useSupabaseCustomers';

export const useCustomerPermissions = () => {
  const { user } = useAuthStore();

  // Filtrer les clients selon les permissions d'accès
  const filterCustomersByAccess = (customers: Customer[]) => {
    if (!user) return [];

    console.log('🔍 Filtrage des clients pour utilisateur:', user.role, user.city);

    // Admin et sales_manager sans ville voient tous les clients
    if ((user.role === 'admin' || user.role === 'sales_manager') && !user.city) {
      console.log('👑 Admin/sales_manager sans ville - accès à tous les clients:', customers.length);
      return customers;
    }

    // Filtrage par ville pour les utilisateurs avec ville assignée
    const filteredCustomers = customers.filter(customer => {
      // Admin et sales_manager avec ville voient clients de leur ville
      if (user.role === 'admin' || user.role === 'sales_manager') {
        if (!user.city) return true; // Déjà géré ci-dessus
        
        const customerCity = customer.city?.toLowerCase();
        const userCity = user.city.toLowerCase();
        
        if (userCity === 'pointe-noire') {
          return customerCity === 'pointe-noire' || customerCity === 'dolisie';
        } else if (userCity === 'brazzaville') {
          return customerCity !== 'pointe-noire' && customerCity !== 'dolisie';
        } else {
          return customerCity === userCity;
        }
      }

      // Team leads voient clients de leur zone géographique
      if (user.role === 'team_lead') {
        if (!user.city) return true;
        
        const customerCity = customer.city?.toLowerCase();
        const userCity = user.city.toLowerCase();
        
        if (userCity === 'pointe-noire') {
          return customerCity === 'pointe-noire' || customerCity === 'dolisie';
        } else if (userCity === 'brazzaville') {
          return customerCity !== 'pointe-noire' && customerCity !== 'dolisie';
        } else {
          return customerCity === userCity;
        }
      }

      // Sellers voient seulement leurs clients assignés ou de leur ville
      if (user.role === 'seller') {
        const isAssignedToMe = customer.primaryVendor === user.id;
        
        if (isAssignedToMe) return true;
        
        // Aussi les clients de leur ville s'ils n'ont pas de vendeur assigné
        if (!customer.primaryVendor && user.city) {
          const customerCity = customer.city?.toLowerCase();
          const userCity = user.city.toLowerCase();
          return customerCity === userCity;
        }
        
        return false;
      }

      return false;
    });

    console.log('📊 Clients filtrés:', filteredCustomers.length, 'sur', customers.length);
    return filteredCustomers;
  };

  // Obtenir mes clients (ceux qui me sont assignés)
  const getMyCustomers = (customers: Customer[]) => {
    if (!user) return [];
    
    return customers.filter(customer => customer.primaryVendor === user.id);
  };

  // Vérifier si je peux voir les détails d'un client
  const canViewCustomerDetails = (customer: Customer) => {
    if (!user) return false;
    
    // Admin et sales_manager peuvent voir tous les détails
    if (user.role === 'admin' || user.role === 'sales_manager') {
      return true;
    }
    
    // Team leads peuvent voir les détails des clients de leur zone
    if (user.role === 'team_lead') {
      if (!user.city) return true;
      
      const customerCity = customer.city?.toLowerCase();
      const userCity = user.city.toLowerCase();
      
      if (userCity === 'pointe-noire') {
        return customerCity === 'pointe-noire' || customerCity === 'dolisie';
      } else if (userCity === 'brazzaville') {
        return customerCity !== 'pointe-noire' && customerCity !== 'dolisie';
      } else {
        return customerCity === userCity;
      }
    }
    
    // Sellers peuvent voir les détails de leurs clients
    if (user.role === 'seller') {
      return customer.primaryVendor === user.id;
    }
    
    return false;
  };

  // Vérifier si je peux modifier un client
  const canEditCustomer = (customer: Customer) => {
    if (!user) return false;
    
    // Admin peut modifier tous les clients
    if (user.role === 'admin') return true;
    
    // Sales_manager peut modifier les clients de sa zone
    if (user.role === 'sales_manager') {
      return canViewCustomerDetails(customer);
    }
    
    // Team leads peuvent modifier les clients de leur zone
    if (user.role === 'team_lead') {
      return canViewCustomerDetails(customer);
    }
    
    // Sellers peuvent modifier leurs clients assignés
    if (user.role === 'seller') {
      return customer.primaryVendor === user.id;
    }
    
    return false;
  };

  // Vérifier si je peux supprimer un client
  const canDeleteCustomer = (customer: Customer) => {
    // Seuls les admins peuvent supprimer des clients
    return user?.role === 'admin';
  };

  // Vérifier si je peux ajouter des notes à un client
  const canAddNotes = (customer: Customer) => {
    if (!user) return false;
    
    // Admin peut ajouter des notes à tous les clients
    if (user.role === 'admin') return true;
    
    // Sales_manager peut ajouter des notes aux clients de sa zone
    if (user.role === 'sales_manager') {
      return canViewCustomerDetails(customer);
    }
    
    // Team leads peuvent ajouter des notes aux clients de leur zone
    if (user.role === 'team_lead') {
      return canViewCustomerDetails(customer);
    }
    
    // Sellers peuvent ajouter des notes à leurs clients assignés
    if (user.role === 'seller') {
      return customer.primaryVendor === user.id;
    }
    
    return false;
  };

  // Obtenir les statistiques d'un client
  const getCustomerStats = (customer: Customer) => {
    const totalSpent = customer.totalSpent || 0;
    const orderCount = customer.orderCount || 0;
    
    return {
      totalSpent,
      orderCount,
      averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
      isVIP: totalSpent > 50000, // Client VIP si plus de 50k FCFA dépensés
      isActive: customer.lastOrderDate 
        ? (new Date().getTime() - new Date(customer.lastOrderDate).getTime()) < (30 * 24 * 60 * 60 * 1000) 
        : false // Actif si commande dans les 30 derniers jours
    };
  };

  // Vérifier si je peux voir les analytics
  const canViewAnalytics = () => {
    return user?.role === 'admin' || user?.role === 'sales_manager' || user?.role === 'team_lead';
  };

  return {
    filterCustomersByAccess,
    getMyCustomers,
    canViewCustomerDetails,
    canEditCustomer,
    canDeleteCustomer,
    canAddNotes,
    getCustomerStats,
    canViewAnalytics
  };
};
