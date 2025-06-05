
import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface AdminPageLayoutProps {
  children: React.ReactNode;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  children
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPageLayout;
