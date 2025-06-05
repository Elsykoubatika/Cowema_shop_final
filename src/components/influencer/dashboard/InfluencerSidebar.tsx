import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar 
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Megaphone, 
  Package, 
  MessageSquare,
  Sparkles,
  Crown,
  Star,
  Link
} from 'lucide-react';

interface InfluencerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    totalEarned: number;
    totalOrders: number;
    availableToPayout: number;
  };
}

const InfluencerSidebar: React.FC<InfluencerSidebarProps> = ({
  activeTab,
  setActiveTab,
  stats
}) => {
  const { open } = useSidebar();

  const menuItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: BarChart3,
    },
    {
      id: 'commissions',
      label: 'Commissions',
      icon: DollarSign,
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: ShoppingBag,
    },
    {
      id: 'payments',
      label: 'Paiements',
      icon: CreditCard,
    },
    {
      id: 'analytics',
      label: 'Analyses',
      icon: TrendingUp,
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
    },
    {
      id: 'catalog',
      label: 'Catalogue',
      icon: Package,
    },
    {
      id: 'affiliation',
      label: 'Liens Affiliation',
      icon: Link,
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      badge: 2,
    },
  ];

  return (
    <Sidebar className="bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 border-r-2 border-purple-100">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          {open && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Influenceur COWEMA
              </h2>
              <p className="text-sm text-purple-600 flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Influenceur COWEMA
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* Stats rapides */}
        {open && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
            <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              Vos performances
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Gains totaux</span>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {stats.totalEarned.toLocaleString()} FCFA
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Commandes</span>
                <Badge variant="outline">
                  {stats.totalOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">À retirer</span>
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {stats.availableToPayout.toLocaleString()} FCFA
                </Badge>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id} active={isActive}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                          : "hover:bg-purple-100 text-gray-700 hover:text-purple-700"
                      )}
                    >
                      <IconComponent className={cn(
                        "h-5 w-5",
                        isActive ? "text-white" : "text-purple-500"
                      )} />
                      {open && (
                        <span className="font-medium">{item.label}</span>
                      )}
                      {item.badge && open && (
                        <Badge 
                          variant={isActive ? "secondary" : "outline"} 
                          className={cn(
                            "ml-auto text-xs",
                            isActive ? "bg-white/20 text-white border-white/30" : "bg-purple-100 text-purple-600"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default InfluencerSidebar;
