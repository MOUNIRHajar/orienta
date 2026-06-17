// src/composents/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [user, setUser] = useState(null);
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
        
        // Remplir le formulaire avec les données existantes
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
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

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
      
      // Créer un FormData pour gérer l'upload de photo
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

      // Mettre à jour les données dans localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      setSaving(false);

      // Rediriger vers le questionnaire après quelques secondes
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
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 px-4 relative overflow-hidden">
      {/* Animations background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mon Profil
          </h1>
          <p className="text-gray-500">
            {isEditing ? 'Modifiez vos informations personnelles' : 'Consultez et gérez vos informations'}
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

          {/* Photo de profil */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {isEditing ? 'Cliquez sur la caméra pour modifier la photo' : ''}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                    errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                    errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  } ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Jean"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                } ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="jean.dupont@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                disabled={!isEditing}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                } ${!isEditing ? 'bg-gray-50' : ''}`}
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
                disabled={!isEditing}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  errors.niveauEtude ? 'border-red-500 bg-red-50' : 'border-gray-200'
                } ${!isEditing ? 'bg-gray-50' : ''}`}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  !isEditing ? 'bg-gray-50' : 'border-gray-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  !isEditing ? 'bg-gray-50' : 'border-gray-200'
                }`}
                placeholder="Votre ville"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  !isEditing ? 'bg-gray-50' : 'border-gray-200'
                }`}
                placeholder="Votre adresse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / Présentation
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  !isEditing ? 'bg-gray-50' : 'border-gray-200'
                }`}
                placeholder="Parlez-nous de vous..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Modifier le profil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enregistrement...</span>
                      </div>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                      setApiError('');
                      // Réinitialiser les données
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
                    className="flex-1 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/questionnaire')}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              Accéder au questionnaire
            </button>
          </form>
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