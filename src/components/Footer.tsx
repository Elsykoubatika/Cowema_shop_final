
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cowema-dark text-white mt-16">
      <div className="container-cowema py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">COWEMA</h3>
            <p className="text-gray-300 mb-4">
              Votre marketplace africaine pour des achats en ligne sécurisés et des livraisons rapides dans toute l'Afrique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"></path>
                </svg>
              </a>
              <a href="#" className="bg-gray-700 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.947 8.305a6.53 6.53 0 0 0-.419-1.396 6.34 6.34 0 0 0-2.072-2.072 6.582 6.582 0 0 0-1.396-.419c-.515-.076-1.02-.076-1.535-.076H8.475c-.515 0-1.02 0-1.535.076-.477.038-.953.19-1.396.419-.599.303-1.168.872-2.072 2.072-.229.443-.381.919-.419 1.396-.076.515-.076 1.02-.076 1.535v7.059c0 .515 0 1.02.076 1.535.038.477.19.953.419 1.396.905 1.168 1.475 1.738 2.072 2.072.443.229.919.381 1.396.419.515.076 1.02.076 1.535.076h7.059c.515 0 1.02 0 1.535-.076a6.5 6.5 0 0 0 1.396-.419c1.168-.905 1.738-1.475 2.072-2.072.229-.443.381-.919.419-1.396.076-.515.076-1.02.076-1.535V9.84c0-.515 0-1.02-.076-1.535ZM12 15.945a3.945 3.945 0 1 1 0-7.89 3.945 3.945 0 0 1 0 7.89Zm4.095-7.305a.921.921 0 1 1 0-1.842.921.921 0 0 1 0 1.842Z"></path>
                </svg>
              </a>
              <a href="#" className="bg-gray-700 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.162 5.656a8.383 8.383 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.211 4.211 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.19 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.497 8.497 0 0 0 2.087-2.165z"></path>
                </svg>
              </a>
              <a href="#" className="bg-gray-700 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                  <path d="M5.339 22.337l.003-.006.004-.008c.032-.06.097-.184.19-.367.173-.334.434-.84.757-1.477A9.843 9.843 0 0112 22c5.522 0 10-4.477 10-10S17.522 2 12 2 2 6.477 2 12a9.96 9.96 0 001.976 5.946l-.255 1.594c-.066.41-.047.802.091 1.153.138.35.364.655.649.87a1.9 1.9 0 001.098.331c.16.001.32-.014.478-.044l2.303-.37z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/ya-ba-boss" className="hover:text-primary transition-colors">YA BA BOSS</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Tous les produits</Link></li>
              <li><Link to="/influencer" className="hover:text-primary transition-colors">Programme Influenceur</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Opportunités</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/influencer" className="hover:text-primary transition-colors">Devenir Influenceur</Link></li>
              <li><Link to="/influencer/login" className="hover:text-primary transition-colors">Espace Influenceur</Link></li>
              <li><Link to="/category/smartphones" className="hover:text-primary transition-colors">Smartphones</Link></li>
              <li><Link to="/category/ordinateurs" className="hover:text-primary transition-colors">Ordinateurs</Link></li>
              <li><Link to="/category/audio" className="hover:text-primary transition-colors">Audio</Link></li>
              <li><Link to="/category/tv" className="hover:text-primary transition-colors">TV</Link></li>
              <li><Link to="/category/electromenager" className="hover:text-primary transition-colors">Électroménager</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>3 Rue Mantsanga Kinsoundi, Brazzaville, Rep du Congo</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+242 068196522</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>info@coema.org</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Lun-Sam: 8h-18h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Cowema. Tous droits réservés.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link to="/terms" className="hover:text-primary transition-colors">Conditions d'utilisation</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
