
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnifiedCart } from '../cart/components/CartProvider';

// Import sub-components
import Logo from './header/Logo';
import NavMenu from './header/NavMenu';
import SearchBar from './header/SearchBar';
import AuthLinks from './header/AuthLinks';
import CartButton from './header/CartButton';
import PWAInstallButton from './pwa/PWAInstallButton';

interface HeaderProps {
  cartItemsCount?: number; // Deprecated - now uses internal hook
  onCartClick?: () => void;
  city?: string;
}

const Header: React.FC<HeaderProps> = ({ onCartClick = () => {}, city }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCartVisibility } = useUnifiedCart();
  
  // Fonction pour ouvrir le panier en utilisant le contexte unifié
  const handleCartClick = () => {
    console.log('Header: Opening cart via unified context');
    toggleCartVisibility();
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-cowema">
      <div className="container-cowema py-3">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex ml-6">
            <NavMenu />
          </div>
          
          <div className="hidden md:flex items-center flex-grow mx-4 max-w-xl relative">
            <SearchBar />
          </div>
          
          <div className="flex items-center gap-4">
            <PWAInstallButton />
            <CartButton onCartClick={handleCartClick} />
            
            <div className="hidden md:flex items-center gap-3">
              <AuthLinks />
            </div>
            
            <button 
              className="block md:hidden p-1 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <SearchBar />
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 py-2 border-t">
            <nav className="flex flex-col space-y-3 mb-4">
              <Link to="/ya-ba-boss" className="py-2 font-bold text-yellow-700 bg-yellow-50 px-3 rounded hover:bg-yellow-100 transition-colors">
                YA BA BOSS
              </Link>
              <Link to="/solaire" className="py-2 font-bold text-orange-700 bg-orange-50 px-3 rounded hover:bg-orange-100 transition-colors">
                Solaire
              </Link>
              <Link to="/calcul-solaire" className="py-2 font-bold text-green-700 bg-green-50 px-3 rounded hover:bg-green-100 transition-colors">
                Calcul solaire
              </Link>
            </nav>
            
            <div className="flex flex-col space-y-3">
              <AuthLinks />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
