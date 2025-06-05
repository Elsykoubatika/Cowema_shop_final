
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../hooks/useAuthStore';
import RegisterPage from '../components/auth/RegisterPage';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If already authenticated, redirect to account
    if (isAuthenticated) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container-cowema">
          <RegisterPage />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
