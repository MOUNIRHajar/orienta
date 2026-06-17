// App.jsx
import { Routes, Route } from 'react-router-dom';
import NavbarSelector from './composents/NavbarSelector';
import HeroSection from './composents/HeroSection';
import SchoolsSection from './composents/SchoolsSection';
import QuestionnaireSection from './composents/QuestionnaireSection';
import ConnexionPage from './composents/ConnexionPage';
import BlogPage from './composents/BlogPage';
import ProtectedRoute from './composents/ProtectedRoute';
import ProfilePage from './composents/ProfilePage';
import NotFoundPage from './composents/NotFoundPage';
import AdminLayout from './composents/AdminLayout';
import AdminDashboard from './composents/AdminDashboard';
// import AdminUsers from './composents/AdminUsers';

function App() {
  return (
    <>
      <NavbarSelector />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/annuaire" element={<SchoolsSection />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/blog" element={<BlogPage />} />
        
        {/* Routes protégées */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><QuestionnaireSection /></ProtectedRoute>} />
        
        {/* Routes Admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          {/* <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<div>Gestion des étudiants (à venir)</div>} />
          <Route path="schools" element={<div>Gestion des écoles (à venir)</div>} /> */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Route 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;