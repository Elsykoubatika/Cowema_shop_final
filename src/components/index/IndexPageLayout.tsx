
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface IndexPageLayoutProps {
  children: React.ReactNode;
  city?: string;
}

const IndexPageLayout: React.FC<IndexPageLayoutProps> = ({ children, city }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header city={city} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default IndexPageLayout;
