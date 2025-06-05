
import React from 'react';
import ClientSpaceOptimized from '@/components/client-space/ClientSpaceOptimized';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ClientSpace = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ClientSpaceOptimized />
      </main>
      <Footer />
    </div>
  );
};

export default ClientSpace;
