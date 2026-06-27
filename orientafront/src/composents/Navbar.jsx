// src/composents/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/annuaire', label: 'Annuaire' },
    { path: '/questionnaire', label: 'IA' },
    { path: '/blog', label: 'Blog' },
  ];

  // Vérifier l'état de connexion
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (token && localStorage.getItem('isAuthenticated') === 'true') {
        setIsAuthenticated(true);
        setUserName(user.first_name || user.name || 'Utilisateur');
      } else {
        setIsAuthenticated(false);
        setUserName('');
      }
    };

    checkAuth();

    // Écouter les changements de chemin
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    
    // Écouter les changements dans localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const isConnexionActive = currentPath === '/connexion';
  const isProfileActive = currentPath === '/profile';

  // Composant SVG pour l'icône du menu
  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  // Composant SVG pour l'icône du profil
  const ProfileIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg"></div>
              <span className="font-semibold text-xl text-blue-900">OrientaMaroc</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Espace utilisateur - Desktop (sans bouton déconnexion) */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2 ${
                  isProfileActive
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700'
                }`}
              >
                <ProfileIcon />
                <span>Mon Profil</span>
              </Link>
            ) : (
              <Link
                to="/connexion"
                className={`px-6 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  isConnexionActive
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer">
                <button className="text-gray-600 hover:text-blue-700">
                  <MenuIcon />
                </button>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 transition-colors ${
                      isActive(item.path)
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Espace utilisateur - Mobile (sans bouton déconnexion) */}
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200">
                      👋 Bonjour, {userName}
                    </div>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 transition-colors ${
                        isProfileActive
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ProfileIcon />
                        <span>Mon Profil</span>
                      </div>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/connexion"
                    className={`block px-4 py-2 transition-colors ${
                      isConnexionActive
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}