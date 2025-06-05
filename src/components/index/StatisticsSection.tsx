
import React, { useState, useEffect } from 'react';

const StatisticsSection: React.FC = () => {
  const [stats, setStats] = useState({
    articlesSold: 1800,
    clientsServed: 800,
    citiesCovered: 5,
    satisfactionRate: 95,
    yaBaBossMembers: 115
  });

  useEffect(() => {
    // Get stored statistics from localStorage
    const storedStats = localStorage.getItem('cowema-statistics');
    const storedLastUpdate = localStorage.getItem('cowema-statistics-last-update');
    const now = new Date().getTime();
    
    // If we have stored stats, use them
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
    
    // Check if 24 hours have passed since the last update
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    const shouldUpdate = !storedLastUpdate || (now - parseInt(storedLastUpdate, 10)) >= twentyFourHoursInMs;
    
    if (shouldUpdate) {
      // Generate random percentage between 10% and 20%
      const getRandomPercentage = () => Math.random() * 10 + 10; // 10-20%
      
      // Apply random percentage increases to stats
      const updatedStats = {
        articlesSold: Math.round(stats.articlesSold * (1 + getRandomPercentage() / 100)),
        clientsServed: Math.round(stats.clientsServed * (1 + getRandomPercentage() / 100)),
        citiesCovered: Math.round(stats.citiesCovered * (1 + getRandomPercentage() / 100)),
        satisfactionRate: Math.min(99, Math.round(stats.satisfactionRate * (1 + getRandomPercentage() / 200))),
        yaBaBossMembers: Math.round(stats.yaBaBossMembers * (1 + getRandomPercentage() / 100))
      };
      
      // Save the updated stats and timestamp
      setStats(updatedStats);
      localStorage.setItem('cowema-statistics', JSON.stringify(updatedStats));
      localStorage.setItem('cowema-statistics-last-update', now.toString());
    }
  }, []);
  
  return (
    <section className="py-4 bg-white">
      <div className="container-cowema">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="p-2 bg-green-50 border border-green-100 rounded-lg">
            <div className="text-xl font-bold text-green-600 mb-0.5">+{stats.articlesSold}</div>
            <div className="text-xs text-gray-500">Articles vendus</div>
          </div>
          
          <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="text-xl font-bold text-blue-600 mb-0.5">+{stats.clientsServed}</div>
            <div className="text-xs text-gray-500">Clients servis</div>
          </div>
          
          <div className="p-2 bg-purple-50 border border-purple-100 rounded-lg">
            <div className="text-xl font-bold text-purple-600 mb-0.5">+{stats.citiesCovered}</div>
            <div className="text-xs text-gray-500">Villes couvertes</div>
          </div>
          
          <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="text-xl font-bold text-amber-600 mb-0.5">{stats.satisfactionRate}%</div>
            <div className="text-xs text-gray-500">Taux de satisfaction</div>
          </div>
          
          <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="text-xl font-bold text-yellow-600 mb-0.5">+{stats.yaBaBossMembers}</div>
            <div className="text-xs text-gray-500">Membres YA BA BOSS</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
