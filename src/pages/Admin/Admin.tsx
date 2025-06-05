
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

// Composant simplifié - la vérification des rôles est gérée par ProtectedRoute
const Admin: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
