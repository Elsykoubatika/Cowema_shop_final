
import { Shield, Star, Users, TrendingUp, User } from 'lucide-react';

export const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'sales_manager': return Shield;
    case 'team_lead': return Users;
    case 'seller': return TrendingUp;
    case 'influencer': return Star;
    default: return User;
  }
};

export const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrateur';
    case 'sales_manager': return 'Responsable Vente';
    case 'team_lead': return 'Chef d\'équipe';
    case 'seller': return 'Vendeur';
    case 'influencer': return 'Influenceur';
    default: return 'Client';
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800 border-red-200';
    case 'sales_manager': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'team_lead': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'seller': return 'bg-green-100 text-green-800 border-green-200';
    case 'influencer': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
