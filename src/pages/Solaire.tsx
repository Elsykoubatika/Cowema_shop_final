
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SolaireBanner from '@/components/solaire/SolaireBanner';
import SolarProductsWithDemo from '@/components/solaire/SolarProductsWithDemo';
import AllSolarProducts from '@/components/solaire/AllSolarProducts';
import { useHybridProducts } from '@/hooks/useHybridProducts';

const Solaire: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Filtrer uniquement les produits solaires
  const { products, isLoading, error } = useHybridProducts({
    search: 'solaire',
    per_page: 100
  });

  const solarProducts = products.filter(product => 
    product.category?.toLowerCase().includes('solaire') ||
    product.name?.toLowerCase().includes('solaire') ||
    product.description?.toLowerCase().includes('solaire') ||
    product.keywords?.some(keyword => keyword.toLowerCase().includes('solaire'))
  );

  console.log('🌞 Solar products loaded:', solarProducts.length);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Énergie Solaire - Panneaux, Générateurs & Accessoires | Cowema</title>
        <meta name="description" content="Découvrez notre gamme complète de produits solaires : panneaux photovoltaïques, générateurs solaires, batteries et accessoires. Solutions écologiques et économiques." />
        <meta name="keywords" content="énergie solaire, panneaux solaires, générateurs solaires, batteries solaires, photovoltaïque, Congo, Brazzaville" />
      </Helmet>

      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow">
        {/* Banner intelligent avec promotions en priorité */}
        <SolaireBanner products={solarProducts} isLoading={isLoading} />
        
        {/* Section produits avec démos vidéo */}
        <SolarProductsWithDemo products={solarProducts.slice(0, 6)} />
        
        {/* Tous nos articles solaires */}
        <AllSolarProducts products={solarProducts} isLoading={isLoading} error={error} />
      </main>

      <Footer />
    </div>
  );
};

export default Solaire;
