// src/composents/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, Share2, ExternalLink, GraduationCap, MapPin, Building2, 
  Award, Star, TrendingUp, User, Mail, Phone, Calendar, Trash2, LogOut,
  Settings, Moon, Sun, Bell, Edit2, Home, FileText, Users, HelpCircle
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [user, setUser] = useState(null);
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    niveauEtude: '',
    dateNaissance: '',
    ville: '',
    adresse: '',
    bio: '',
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'saved' | 'settings'
  const [darkMode, setDarkMode] = useState(false);

  // Récupérer les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/connexion');
          return;
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        
        setFormData({
          firstName: userData.first_name || userData.firstName || '',
          lastName: userData.last_name || userData.lastName || '',
          email: userData.email || '',
          telephone: userData.telephone || '',
          niveauEtude: userData.niveau_etude || userData.niveauEtude || '',
          dateNaissance: userData.date_naissance || userData.dateNaissance || '',
          ville: userData.ville || '',
          adresse: userData.adresse || '',
          bio: userData.bio || '',
          photo: null
        });

        loadSavedRecommendations(userData);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const loadSavedRecommendations = (userData) => {
    try {
      const storageKey = `saved_recos_${userData.id || 'user'}`;
      const saved = localStorage.getItem(storageKey);
      
      let recommendations = [];
      
      if (saved) {
        recommendations = JSON.parse(saved);
      } else if (userData.saved_recommendations) {
        recommendations = userData.saved_recommendations;
      }

      setSavedRecommendations(recommendations);
    } catch (error) {
      console.error('Erreur chargement recommandations:', error);
    }
  };

  const handleLogout = () => {
   
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      navigate('/connexion');
        window.location.reload();
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette recommandation ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const storageKey = `saved_recos_${userData.id || 'user'}`;
      const updated = savedRecommendations.filter(r => r.id !== recommendationId);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      setSavedRecommendations(updated);

      await fetch('http://localhost:8000/api/sauvegarder-recommandation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          etudiant_id: userData.id,
          recommendation_id: recommendationId,
          action: 'unsave'
        })
      });

      setSuccessMessage('Recommandation supprimée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Erreur suppression:', error);
      setApiError('Erreur lors de la suppression');
    }
  };

  // Composant de carte pour les recommandations sauvegardées
  const SavedRecommendationCard = ({ recommendation }) => {
    const getScoreColor = (score) => {
      if (score >= 80) return 'from-emerald-400 to-emerald-600';
      if (score >= 60) return 'from-blue-400 to-blue-600';
      return 'from-yellow-400 to-yellow-600';
    };

    const getDomainEmoji = (domaine) => {
      const emojis = {
        'Sciences et Ingénierie': '⚙️',
        'Commerce et Gestion': '📊',
        'Médecine et Santé': '⚕️',
        'Arts et Lettres': '🎨'
      };
      return emojis[domaine] || '🎓';
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className={`bg-gradient-to-r ${getScoreColor(recommendation.score)} p-5 relative`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getDomainEmoji(recommendation.domaine)}</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  {recommendation.domaine}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {recommendation.nom}
              </h3>
              <p className="text-white/80 text-sm">
                {recommendation.nomComplet || recommendation.description}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1">
                <div className="text-2xl font-bold text-white">{recommendation.score}%</div>
                <div className="text-white/80 text-xs">Match</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-gray-600 text-sm mb-3">
            {recommendation.description}
          </p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <MapPin size={14} className="mx-auto text-blue-500" />
              <span className="text-xs text-gray-500 block">Ville</span>
              <span className="text-sm font-semibold text-gray-700">{recommendation.ville}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <Building2 size={14} className="mx-auto text-blue-500" />
              <span className="text-xs text-gray-500 block">Type</span>
              <span className="text-sm font-semibold text-gray-700">{recommendation.type}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <Award size={14} className="mx-auto text-blue-500" />
              <span className="text-xs text-gray-500 block">Classement</span>
              <span className="text-sm font-semibold text-gray-700">{recommendation.classement || 'Top'}</span>
            </div>
          </div>

          {recommendation.filieres && recommendation.filieres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {recommendation.filieres.map((filiere, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {filiere}
                </span>
              ))}
            </div>
          )}

          {recommendation.savedAt && (
            <p className="text-xs text-gray-400 mb-3">
              Sauvegardé le {new Date(recommendation.savedAt).toLocaleDateString('fr-FR')}
            </p>
          )}

          <div className="flex gap-2">
            {recommendation.siteWeb && recommendation.siteWeb !== '#' && (
              <a 
                href={recommendation.siteWeb} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
              >
                <ExternalLink size={14} />
                Voir le site
              </a>
            )}
            <button
              onClick={() => handleDeleteRecommendation(recommendation.id)}
              className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName) newErrors.lastName = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (formData.telephone && !/^[0-9]{10}$/.test(formData.telephone)) {
      newErrors.telephone = "Numéro de téléphone invalide (10 chiffres)";
    }
    if (!formData.niveauEtude) newErrors.niveauEtude = "Veuillez sélectionner votre niveau d'étude";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setSaving(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.firstName);
      formDataToSend.append('last_name', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telephone', formData.telephone || '');
      formDataToSend.append('niveau_etude', formData.niveauEtude);
      formDataToSend.append('date_naissance', formData.dateNaissance || '');
      formDataToSend.append('ville', formData.ville || '');
      formDataToSend.append('adresse', formData.adresse || '');
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('profil_complete', '1');
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await axios.put(`${API_URL}/user/profile`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profil mis à jour:', response.data);

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      setSaving(false);

      setTimeout(() => {
        navigate('/questionnaire');
      }, 2000);

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      if (error.response) {
        if (error.response.data.errors) {
          const formattedErrors = {};
          Object.keys(error.response.data.errors).forEach(key => {
            if (key === 'first_name') {
              formattedErrors.firstName = error.response.data.errors.first_name[0];
            } else if (key === 'last_name') {
              formattedErrors.lastName = error.response.data.errors.last_name[0];
            } else if (key === 'email') {
              formattedErrors.email = error.response.data.errors.email[0];
            } else if (key === 'telephone') {
              formattedErrors.telephone = error.response.data.errors.telephone[0];
            } else if (key === 'niveau_etude') {
              formattedErrors.niveauEtude = error.response.data.errors.niveau_etude[0];
            }
          });
          setErrors(formattedErrors);
        } else {
          setApiError(error.response.data.message || "Erreur lors de la mise à jour du profil");
        }
      } else {
        setApiError("Erreur de connexion au serveur");
      }
      setSaving(false);
    }
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h2>
            <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre profil.</p>
            <button
              onClick={() => navigate('/connexion')}
              className="py-3 px-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Style comme l'image */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Photo de profil */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-blue-100">
                    {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-3">
                  {user?.first_name || 'Utilisateur'} {user?.last_name || ''}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email || 'email@exemple.com'}</p>
              </div>

              {/* Menu de navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User size={20} />
                  <span>Profile details</span>
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'saved'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark size={20} />
                  <span>Mes sauvegardes</span>
                  {savedRecommendations.length > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {savedRecommendations.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut size={20} />
                  <span>Log out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-3">
            {/* Messages de notification */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm text-center">{successMessage}</p>
              </div>
            )}

            {apiError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{apiError}</p>
              </div>
            )}

            {/* Onglet Profile Details */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Carte d'informations */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Full Name</label>
                      <p className="text-gray-800 font-medium mt-1">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Email Address</label>
                      <p className="text-gray-800 font-medium mt-1">{formData.email}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Phone Number</label>
                      <p className="text-gray-800 font-medium mt-1">{formData.telephone || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Niveau d'étude</label>
                      <p className="text-gray-800 font-medium mt-1">{formData.niveauEtude || 'Non renseigné'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Ville</label>
                      <p className="text-gray-800 font-medium mt-1">{formData.ville || 'Non renseigné'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Date de naissance</label>
                      <p className="text-gray-800 font-medium mt-1">
                        {formData.dateNaissance ? new Date(formData.dateNaissance).toLocaleDateString('fr-FR') : 'Non renseigné'}
                      </p>
                    </div>
                  </div>
                </div>

                {formData.bio && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Bio</label>
                    <p className="text-gray-800 mt-1">{formData.bio}</p>
                  </div>
                )}

                {/* Formulaire d'édition */}
                {isEditing && (
                  <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Modifier mes informations</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400 ${
                            errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400 ${
                            errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400 ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400 ${
                            errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'étude *</label>
                        <select
                          name="niveauEtude"
                          value={formData.niveauEtude}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400 ${
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <input
                          type="text"
                          name="ville"
                          value={formData.ville}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                        <input
                          type="date"
                          name="dateNaissance"
                          value={formData.dateNaissance}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                          placeholder="Parlez-nous de vous..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({});
                          if (user) {
                            setFormData({
                              firstName: user.first_name || user.firstName || '',
                              lastName: user.last_name || user.lastName || '',
                              email: user.email || '',
                              telephone: user.telephone || '',
                              niveauEtude: user.niveau_etude || user.niveauEtude || '',
                              dateNaissance: user.date_naissance || user.dateNaissance || '',
                              ville: user.ville || '',
                              adresse: user.adresse || '',
                              bio: user.bio || '',
                              photo: null
                            });
                          }
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Onglet Mes sauvegardes */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Bookmark size={24} className="text-blue-500" />
                      Mes recommandations sauvegardées
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {savedRecommendations.length} recommandation{savedRecommendations.length > 1 ? 's' : ''} sauvegardée{savedRecommendations.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  {savedRecommendations.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Voulez-vous vraiment supprimer toutes les recommandations ?')) {
                          setSavedRecommendations([]);
                          const userData = JSON.parse(localStorage.getItem('user') || '{}');
                          localStorage.removeItem(`saved_recos_${userData.id || 'user'}`);
                          setSuccessMessage('Toutes les recommandations ont été supprimées');
                          setTimeout(() => setSuccessMessage(''), 3000);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Tout supprimer
                    </button>
                  )}
                </div>

                {savedRecommendations.length === 0 ? (
                  <div className="text-center py-16">
                    <Bookmark size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Aucune recommandation sauvegardée
                    </h3>
                    <p className="text-gray-400">
                      Commencez le questionnaire d'orientation et sauvegardez les écoles qui vous intéressent !
                    </p>
                    <button
                      onClick={() => navigate('/questionnaire')}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Aller au questionnaire →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedRecommendations.map((rec) => (
                        <SavedRecommendationCard key={rec.id} recommendation={rec} />
                      ))}
                    </div>

                    {/* Statistiques des sauvegardes */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" />
                        Statistiques de vos sauvegardes
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-blue-600">
                            {savedRecommendations.filter(r => r.score >= 80).length}
                          </span>
                          <span className="text-sm text-gray-600">Correspondance élevée</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-emerald-600">
                            {new Set(savedRecommendations.map(r => r.domaine)).size}
                          </span>
                          <span className="text-sm text-gray-600">Domaines différents</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-purple-600">
                            {new Set(savedRecommendations.map(r => r.ville)).size}
                          </span>
                          <span className="text-sm text-gray-600">Villes différentes</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Onglet Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
                
                <div className="space-y-6">
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={20} className="text-gray-700" /> : <Sun size={20} className="text-yellow-500" />}
                      <div>
                        <p className="font-medium text-gray-800">Dark mode</p>
                        <p className="text-sm text-gray-500">Activer le mode sombre</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-gray-800' : 'bg-blue-500'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">Notifications</p>
                        <p className="text-sm text-gray-500">Recevoir des alertes par email</p>
                      </div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-emerald-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full" />
                    </button>
                  </div>

                  {/* Langue */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌐</span>
                      <div>
                        <p className="font-medium text-gray-800">Langue</p>
                        <p className="text-sm text-gray-500">Français</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm text-blue-500 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      Changer
                    </button>
                  </div>

                  {/* Déconnexion */}
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <LogOut size={20} className="text-red-500" />
                      <div>
                        <p className="font-medium text-red-700">Déconnexion</p>
                        <p className="text-sm text-red-500">Se déconnecter de votre compte</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}