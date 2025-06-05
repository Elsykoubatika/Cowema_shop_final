
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Star, 
  Gift, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  UserPlus,
  ClipboardList,
  UsersRound,
  Bot,
  Mail,
  Sun,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';

const NavLinks: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === `/admin${path}` || location.pathname.startsWith(`/admin${path}/`);
  };

  const linkClass = (path: string) => cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100",
    isActive(path) && "bg-gray-100 text-gray-900 font-medium"
  );

  const isAdmin = user?.role === 'admin';
  const isSalesManager = user?.role === 'sales_manager' || isAdmin;
  const isTeamLead = user?.role === 'team_lead' || isSalesManager;

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link to="/admin" className={linkClass('')}>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>

      {/* Section Commandes */}
      <div className="mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Commandes
        </div>
        <Link to="/admin/orders" className={linkClass('/orders')}>
          <ShoppingCart className="h-4 w-4" />
          Toutes les commandes
        </Link>
        {(isTeamLead || user?.role === 'seller') && (
          <Link to="/admin/my-orders" className={linkClass('/my-orders')}>
            <ClipboardList className="h-4 w-4" />
            Mes commandes
          </Link>
        )}
        {isSalesManager && (
          <Link to="/admin/unassigned-orders" className={linkClass('/unassigned-orders')}>
            <ClipboardList className="h-4 w-4" />
            Non assignées
          </Link>
        )}
      </div>

      {/* Section Clients */}
      <div className="mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Clients
        </div>
        <Link to="/admin/customers" className={linkClass('/customers')}>
          <Users className="h-4 w-4" />
          Tous les clients
        </Link>
        {(isTeamLead || user?.role === 'seller') && (
          <Link to="/admin/my-customers" className={linkClass('/my-customers')}>
            <UsersRound className="h-4 w-4" />
            Mes clients
          </Link>
        )}
      </div>

      {/* Section Produits */}
      <div className="mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Produits
        </div>
        <Link to="/admin/products" className={linkClass('/products')}>
          <Package className="h-4 w-4" />
          Produits
        </Link>
        <Link to="/admin/reviews" className={linkClass('/reviews')}>
          <Star className="h-4 w-4" />
          Avis clients
        </Link>
      </div>

      {/* Section Marketing */}
      <div className="mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Marketing
        </div>
        <Link to="/admin/promotions" className={linkClass('/promotions')}>
          <Gift className="h-4 w-4" />
          Promotions
        </Link>
        <Link to="/admin/messaging" className={linkClass('/messaging')}>
          <MessageSquare className="h-4 w-4" />
          Campagnes
        </Link>
        {isSalesManager && (
          <Link to="/admin/ai-sales" className={linkClass('/ai-sales')}>
            <Bot className="h-4 w-4" />
            IA Commerciale
          </Link>
        )}
        <Link to="/admin/influencers" className={linkClass('/influencers')}>
          <UserPlus className="h-4 w-4" />
          Influenceurs
        </Link>
      </div>

      {/* Section Analytics */}
      <div className="mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Analytics
        </div>
        <Link to="/admin/analytics-dashboard" className={linkClass('/analytics-dashboard')}>
          <TrendingUp className="h-4 w-4" />
          Dashboard Analytics
        </Link>
        <Link to="/admin/analytics" className={linkClass('/analytics')}>
          <BarChart3 className="h-4 w-4" />
          Trafic
        </Link>
        <Link to="/admin/traffic-analytics" className={linkClass('/traffic-analytics')}>
          <BarChart3 className="h-4 w-4" />
          Analytics Avancées
        </Link>
      </div>

      {/* Section Contenu */}
      <div className="mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Contenu
        </div>
        <Link to="/admin/blog" className={linkClass('/blog')}>
          <FileText className="h-4 w-4" />
          Blog
        </Link>
        <Link to="/admin/solar-installations" className={linkClass('/solar-installations')}>
          <Sun className="h-4 w-4" />
          Installations Solaires
        </Link>
      </div>

      {/* Section Administration */}
      {isAdmin && (
        <div className="mt-4">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Administration
          </div>
          <Link to="/admin/users" className={linkClass('/users')}>
            <Users className="h-4 w-4" />
            Utilisateurs
          </Link>
          <Link to="/admin/messages" className={linkClass('/messages')}>
            <Mail className="h-4 w-4" />
            Modèles de messages
          </Link>
          <Link to="/admin/settings" className={linkClass('/settings')}>
            <Settings className="h-4 w-4" />
            Paramètres
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavLinks;
