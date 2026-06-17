// src/composents/NavbarSelector.jsx
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import NavbarAdmin from './NavbarAdmin';

export default function NavbarSelector() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'student';
    setIsAdmin(role === 'admin' || role === 'super_admin');
    setLoading(false);
  }, []);

  // Écouter les changements d'authentification
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role || 'student';
      setIsAdmin(role === 'admin' || role === 'super_admin');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </nav>
    );
  }

  return isAdmin ? <NavbarAdmin /> : <Navbar />;
}