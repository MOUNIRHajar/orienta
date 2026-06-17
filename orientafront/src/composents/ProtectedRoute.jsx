// src/composents/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  // Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('token');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const isLoggedIn = token && isAuthenticated === 'true' && user;
  
  console.log('ProtectedRoute - État authentification:', { 
    token: !!token, 
    isAuthenticated, 
    user: !!user, 
    isLoggedIn 
  });
  
  if (!isLoggedIn) {
    return <Navigate to="/connexion" replace />;
  }

  // Si un rôle est requis, vérifier que l'utilisateur a le bon rôle
  if (requiredRole) {
    const hasRequiredRole = user.role === requiredRole || user.role === 'super_admin';
    
    // Si le rôle requis est super_admin, seul un super_admin peut y accéder
    if (requiredRole === 'super_admin' && user.role !== 'super_admin') {
      return <Navigate to="/" replace />;
    }
    
    // Si l'utilisateur n'a pas le rôle requis (et n'est pas super_admin)
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
}