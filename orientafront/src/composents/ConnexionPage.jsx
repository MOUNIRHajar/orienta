// src/composents/ConnexionPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function ConnexionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    telephone: '',
    niveauEtude: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Récupérer l'URL de redirection
  const from = location.state?.from || '/questionnaire';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
    setSuccessMessage('');
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.lastName) newErrors.lastName = "Le nom est requis";
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6) newErrors.password = "6 caractères minimum";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmez votre mot de passe";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (formData.telephone && !/^[0-9]{10}$/.test(formData.telephone)) {
      newErrors.telephone = "Numéro de téléphone invalide (10 chiffres)";
    }
    if (!formData.niveauEtude) newErrors.niveauEtude = "Veuillez sélectionner votre niveau d'étude";
    return newErrors;
  };

  // Connexion avec API Laravel
  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password
      });
      
      console.log('Réponse login:', response.data);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', 'connected_' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
      } else if (response.data.data && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', 'connected_' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.setItem('user', JSON.stringify({ email: email }));
        localStorage.setItem('token', 'connected_' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur login:', error);
      if (error.response) {
        return { 
          success: false, 
          message: error.response.data.message || 'Email ou mot de passe incorrect' 
        };
      }
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  };

  // Inscription avec API Laravel
  const handleRegister = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: `${userData.firstName} ${userData.lastName}`,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        telephone: userData.telephone,
        niveau_etude: userData.niveauEtude
      });
      
      console.log('Réponse register:', response.data);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', 'connected_' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
      } else if (response.data.data && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', 'connected_' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.setItem('user', JSON.stringify({ 
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`
        }));
        localStorage.setItem('token', 'connected_' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return { success: true, data: response.data, isNewUser: true };
    } catch (error) {
      console.error('Erreur register:', error);
      if (error.response) {
        if (error.response.data.errors) {
          return { 
            success: false, 
            validationErrors: error.response.data.errors,
            message: "Erreur de validation"
          };
        }
        return { 
          success: false, 
          message: error.response.data.message || "Erreur lors de l'inscription" 
        };
      }
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    
    const validationErrors = isLogin ? validateLogin() : validateRegister();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    if (isLogin) {
      const result = await handleLogin(formData.email, formData.password);
      
      if (result.success) {
        setSuccessMessage('Connexion réussie ! Redirection...');
        setTimeout(() => {
          // Récupérer les données de l'utilisateur
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          const userRole = userData.role || 'student';
          
          // Redirection selon le rôle
          if (userRole === 'admin' || userRole === 'super_admin') {
            // Rediriger vers le dashboard admin
            navigate('/admin');
          } else if (userData.profil_complete === 0 || userData.profil_complete === false) {
            // Étudiant avec profil incomplet
            navigate('/profile');
          } else {
            // Étudiant avec profil complet
            window.location.href = from;
          }
        }, 1000);
      } else {
        setApiError(result.message);
        setLoading(false);
      }
    } else {
      const result = await handleRegister(formData);
      
      if (result.success) {
        setSuccessMessage('Inscription réussie ! Redirection vers votre profil...');
        setTimeout(() => {
          // Redirection vers la page de profil après inscription
          navigate('/profile');
        }, 1000);
      } else {
        if (result.validationErrors) {
          const formattedErrors = {};
          Object.keys(result.validationErrors).forEach(key => {
            if (key === 'first_name') {
              formattedErrors.firstName = result.validationErrors.first_name[0];
            } else if (key === 'last_name') {
              formattedErrors.lastName = result.validationErrors.last_name[0];
            } else if (key === 'email') {
              formattedErrors.email = result.validationErrors.email[0];
            } else if (key === 'password') {
              formattedErrors.password = result.validationErrors.password[0];
            } else if (key === 'telephone') {
              formattedErrors.telephone = result.validationErrors.telephone[0];
            } else if (key === 'niveau_etude') {
              formattedErrors.niveauEtude = result.validationErrors.niveau_etude[0];
            }
          });
          setErrors(formattedErrors);
        } else {
          setApiError(result.message);
        }
        setLoading(false);
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 px-4 relative overflow-hidden">
      {/* Animations background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Bienvenue !' : 'Créer un compte'}
          </h1>
          <p className="text-gray-500">
            {isLogin ? 'Connectez-vous pour accéder au questionnaire' : 'Inscrivez-vous pour commencer votre orientation'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">{successMessage}</p>
            </div>
          )}

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            </div>
          )}

          {from !== '/questionnaire' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm text-center">
                🔒 Veuillez vous connecter pour accéder au questionnaire d'orientation
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Dupont"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                        errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Jean"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                      errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0612345678"
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'étude <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="niveauEtude"
                    value={formData.niveauEtude}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                      errors.niveauEtude ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    <option value="bac">Baccalauréat</option>
                    <option value="bac+1">Bac +1</option>
                    <option value="bac+2">Bac +2</option>
                    <option value="bac+3">Bac +3 (Licence)</option>
                    <option value="bac+4">Bac +4 (Master 1)</option>
                    <option value="bac+5">Bac +5 (Master 2)</option>
                    <option value="bac+6">Bac +6 et plus</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.niveauEtude && <p className="text-red-500 text-xs mt-1">{errors.niveauEtude}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="jean.dupont@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Connexion en cours...' : 'Inscription en cours...'}</span>
                </div>
              ) : (
                isLogin ? 'Se connecter' : "S'inscrire"
              )}
            </button>
          </form>

          {/* Lien pour basculer entre Connexion et Inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setApiError('');
                  setSuccessMessage('');
                }}
                className="ml-2 text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}