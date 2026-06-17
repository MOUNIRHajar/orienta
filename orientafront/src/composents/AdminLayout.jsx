// src/composents/AdminLayout.jsx
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/connexion');
  };

  const menuItems = [
    { path: '/admin', label: 'Tableau de bord', icon: '📊' },
    { path: '/admin/users', label: 'Gestion des utilisateurs', icon: '👥' },
    { path: '/admin/students', label: 'Étudiants', icon: '🎓' },
    { path: '/admin/schools', label: 'Annuaire des écoles', icon: '🏫' },
    { path: '/admin/profile', label: 'Mon Profil', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:block bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed h-full z-50 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-blue-700">
            <div className="flex items-center justify-between">
              <Link to="/admin" className={`flex items-center space-x-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-blue-900 font-bold text-xl">O</span>
                </div>
                {isSidebarOpen && (
                  <div>
                    <span className="font-bold text-lg">Admin</span>
                    <span className="text-xs block text-blue-300">Panel</span>
                  </div>
                )}
              </Link>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-1 rounded-lg hover:bg-blue-700 transition-colors ${!isSidebarOpen && 'hidden'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-700 shadow-lg transform scale-105'
                    : 'hover:bg-blue-700/50 hover:transform hover:scale-105'
                } ${!isSidebarOpen && 'justify-center'}`}
              >
                <span className="text-2xl">{item.icon}</span>
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600/20 transition-colors w-full ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <span className="text-2xl">🚪</span>
              {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
            </button>
            {isSidebarOpen && (
              <div className="mt-4 p-3 bg-blue-700/30 rounded-lg">
                <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-blue-300">
                  {user.role === 'super_admin' ? '⭐ Super Admin' : '🛡️ Admin'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* Bouton menu mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-gray-600 hover:text-blue-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="hidden sm:inline text-sm text-gray-600">
                  👋 {user.first_name || 'Admin'}
                </span>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user.first_name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl">
              <div className="p-4 border-b border-blue-700">
                <div className="flex items-center justify-between">
                  <Link to="/admin" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-blue-900 font-bold text-xl">O</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg">Admin</span>
                      <span className="text-xs block text-blue-300">Panel</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-700 shadow-lg'
                        : 'hover:bg-blue-700/50'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600/20 transition-colors w-full"
                >
                  <span className="text-2xl">🚪</span>
                  <span className="font-medium">Déconnexion</span>
                </button>
                <div className="mt-4 p-3 bg-blue-700/30 rounded-lg">
                  <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-blue-300">
                    {user.role === 'super_admin' ? '⭐ Super Admin' : '🛡️ Admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}