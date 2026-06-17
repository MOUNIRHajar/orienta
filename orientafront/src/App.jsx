// App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './composents/Navbar';
import HeroSection from './composents/HeroSection';
import SchoolsSection from './composents/SchoolsSection';
import QuestionnaireSection from './composents/QuestionnaireSection';
import ConnexionPage from './composents/ConnexionPage';
import BlogPage from './composents/BlogPage';
import ProtectedRoute from './composents/ProtectedRoute';
import ProfilePage from './composents/ProfilePage';
import NotFoundPage from './composents/NotFoundPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/annuaire" element={<SchoolsSection />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/blog" element={<BlogPage />} />
        
        {/* Route du profil (accessible uniquement si connecté) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Route du questionnaire (protégée) */}
        <Route 
          path="/questionnaire" 
          element={
            <ProtectedRoute>
              <QuestionnaireSection />
            </ProtectedRoute>
          } 
        />
        
        {/* Route 404 - Page non trouvée (optionnel) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;