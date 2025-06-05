import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarCollapse,
  SidebarCollapseItem
} from '@/components/ui/sidebar';
import AdminLogo from './navigation/AdminLogo';
import { useAuthStore } from '@/hooks/useAuthStore';
import { 
  Home,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  MessageSquare,
  Star,
  UserCheck,
  Gift,
  Megaphone,
  Brain,
  Settings,
  UserPlus,
  Mail,
  ClipboardList,
  User,
  Users2,
  TrendingUp
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  // Helper function to check if path is active
  const isPathActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // Helper function to render menu item
  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild>
        <Link
          to={item.href}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            isPathActive(item.href, item.exact)
              ? "bg-primary text-primary-foreground"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  // Helper function to check if user can access feature
  const canAccess = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <AdminLogo />
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 1. Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin"
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isPathActive('/admin', true)
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 2. Commandes */}
              {canAccess(['admin', 'sales_manager', 'team_lead', 'seller']) && (
                <SidebarCollapse
                  title="Commandes"
                  icon={<ShoppingCart className="h-4 w-4" />}
                >
                  <SidebarCollapseItem>
                    <SidebarMenu>
                      {renderMenuItem({
                        icon: ShoppingCart,
                        label: 'Toutes les commandes',
                        href: '/admin/orders'
                      })}
                      {renderMenuItem({
                        icon: ClipboardList,
                        label: 'Non assignées',
                        href: '/admin/unassigned-orders'
                      })}
                      {renderMenuItem({
                        icon: User,
                        label: 'Mes commandes',
                        href: '/admin/my-orders'
                      })}
                    </SidebarMenu>
                  </SidebarCollapseItem>
                </SidebarCollapse>
              )}

              {/* 3. Clients */}
              {canAccess(['admin', 'sales_manager', 'team_lead', 'seller']) && (
                <SidebarCollapse
                  title="Clients"
                  icon={<Users className="h-4 w-4" />}
                >
                  <SidebarCollapseItem>
                    <SidebarMenu>
                      {canAccess(['admin', 'sales_manager', 'team_lead']) && renderMenuItem({
                        icon: Users2,
                        label: 'Tous les clients',
                        href: '/admin/customers'
                      })}
                      {renderMenuItem({
                        icon: Users,
                        label: 'Mes clients',
                        href: '/admin/my-customers'
                      })}
                    </SidebarMenu>
                  </SidebarCollapseItem>
                </SidebarCollapse>
              )}

              {/* 4. Analytics & AI */}
              {canAccess(['admin', 'sales_manager', 'team_lead', 'seller']) && (
                <SidebarCollapse
                  title="Analytics & AI"
                  icon={<TrendingUp className="h-4 w-4" />}
                >
                  <SidebarCollapseItem>
                    <SidebarMenu>
                      {renderMenuItem({
                        icon: BarChart3,
                        label: 'Analytics Standard',
                        href: '/admin/analytics'
                      })}
                      {renderMenuItem({
                        icon: Settings,
                        label: 'Analytics Personnalisés',
                        href: '/admin/analytics-customizable'
                      })}
                      {renderMenuItem({
                        icon: TrendingUp,
                        label: 'Analyse Trafic',
                        href: '/admin/traffic-analytics'
                      })}
                      {renderMenuItem({
                        icon: Brain,
                        label: 'Vente AI',
                        href: '/admin/ai-sales'
                      })}
                    </SidebarMenu>
                  </SidebarCollapseItem>
                </SidebarCollapse>
              )}

              {/* 5. Produits & Badge */}
              {canAccess(['admin', 'sales_manager', 'team_lead', 'seller']) && (
                <SidebarCollapse
                  title="Produits & Badge"
                  icon={<Package className="h-4 w-4" />}
                >
                  <SidebarCollapseItem>
                    <SidebarMenu>
                      {renderMenuItem({
                        icon: Package,
                        label: 'Produits',
                        href: '/admin/products'
                      })}
                      {canAccess(['admin', 'sales_manager']) && renderMenuItem({
                        icon: Star,
                        label: 'YaBaBosser',
                        href: '/admin/yababosser'
                      })}
                    </SidebarMenu>
                  </SidebarCollapseItem>
                </SidebarCollapse>
              )}

              {/* 6. Messages */}
              {canAccess(['admin', 'sales_manager', 'team_lead', 'seller']) && (
                <SidebarCollapse
                  title="Messages"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  <SidebarCollapseItem>
                    <SidebarMenu>
                      {renderMenuItem({
                        icon: Mail,
                        label: 'Messagerie',
                        href: '/admin/messaging'
                      })}
                      {renderMenuItem({
                        icon: MessageSquare,
                        label: 'Modèles',
                        href: '/admin/messages'
                      })}
                    </SidebarMenu>
                  </SidebarCollapseItem>
                </SidebarCollapse>
              )}

              {/* 7. Manager */}
              {canAccess(['admin', 'sales_manager', 'team_lead']) && (
                <SidebarCollapse
                  title="Manager"
                  icon={<UserCheck className="h-4 w-4" />}
                >
                  <SidebarCollapseItem>
                    <SidebarMenu>
                      {canAccess(['admin', 'sales_manager', 'team_lead']) && renderMenuItem({
                        icon: Gift,
                        label: 'Promotions',
                        href: '/admin/promotions'
                      })}
                      {canAccess(['admin', 'sales_manager']) && renderMenuItem({
                        icon: Star,
                        label: 'Avis',
                        href: '/admin/reviews'
                      })}
                      {canAccess(['admin', 'sales_manager']) && renderMenuItem({
                        icon: UserCheck,
                        label: 'Influenceurs',
                        href: '/admin/influencers'
                      })}
                      {canAccess(['admin']) && renderMenuItem({
                        icon: UserPlus,
                        label: 'Utilisateurs',
                        href: '/admin/users'
                      })}
                    </SidebarMenu>
                  </SidebarCollapseItem>
                </SidebarCollapse>
              )}

              {/* 8. Paramètres */}
              {canAccess(['admin']) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/settings"
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                        isPathActive('/admin/settings')
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t px-6 py-4">
        <p className="text-xs text-gray-500">
          Admin Panel v2.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
