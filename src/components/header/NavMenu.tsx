
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavMenu: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-yellow-100 font-bold text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800`}>
            <Link to="/ya-ba-boss">YA BA BOSS</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-orange-100 font-bold text-orange-700 hover:bg-orange-200 hover:text-orange-800`}>
            <Link to="/solaire">Solaire</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-green-100 font-bold text-green-700 hover:bg-green-200 hover:text-green-800`}>
            <Link to="/calcul-solaire">Calcul solaire</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
