// src/composents/QuestionnaireSection.jsx
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Bookmark, Share2, ExternalLink, GraduationCap, MapPin, Building2, Award, Star, TrendingUp, User } from 'lucide-react';

export default function QuestionnaireSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [niveau, setNiveau] = useState('');
  const [notesLycee, setNotesLycee] = useState({
    maths: '', francais: '', anglais: '', physique: '', svt: '', histoire: '', philosophie: ''
  });
  const [infoBac, setInfoBac] = useState({
    ecole: '', filiere: '', moyenne: '', annee: ''
  });
  const [showNiveauForm, setShowNiveauForm] = useState(false);
  const [niveauValide, setNiveauValide] = useState(false);
  const [resultat, setResultat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Récupérer l'utilisateur connecté depuis localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData && Object.keys(userData).length > 0) {
          setCurrentUser(userData);
          console.log('👤 Utilisateur connecté:', userData);
          
          // Si l'utilisateur a déjà un niveau d'étude, le définir
          if (userData.niveau_etude || userData.niveauEtude) {
            const niveauValue = userData.niveau_etude || userData.niveauEtude;
            const niveauMap = {
              'bac': 'Lycée',
              'bac+1': 'Bac+1/2',
              'bac+2': 'Bac+1/2',
              'bac+3': 'Bac+3',
              'bac+4': 'Bac+4/5',
              'bac+5': 'Bac+4/5'
            };
            setNiveau(niveauMap[niveauValue] || '');
          }
        } else {
          // Rediriger vers la connexion si pas d'utilisateur
          // window.location.href = '/connexion';
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      }
    };
    
    loadUser();
  }, []);

  // ✅ Charger les recommandations sauvegardées pour cet utilisateur
  useEffect(() => {
    if (currentUser) {
      loadSavedRecommendations();
    }
  }, [currentUser]);

  const loadSavedRecommendations = async () => {
    try {
      const storageKey = `saved_recos_${currentUser.id || 'user'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSavedRecommendations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur chargement sauvegardes:', error);
    }
  };

  const questions = [
    {
      id: 0,
      question: "Quel est ton niveau d'études actuel ?",
      options: ['Lycée', 'Bac+1/2', 'Bac+3', 'Bac+4/5'],
    },
    {
      id: 1,
      question: "Quel domaine t'intéresse le plus ?",
      options: ['Sciences et Ingénierie', 'Commerce et Gestion', 'Médecine et Santé', 'Arts et Lettres'],
    },
    {
      id: 2,
      question: 'Quelle ville préfères-tu pour tes études ?',
      options: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Autre'],
    },
    {
      id: 3,
      question: "Quel type d'enseignement préfères-tu ?",
      options: ['Public', 'Privé', 'Pas de préférence'],
    },
  ];

  // Données d'exemple enrichies pour les écoles
  const schoolData = {
    'Sciences et Ingénierie': [
      {
        id: 1,
        nom: "ENSIAS",
        nomComplet: "École Nationale Supérieure d'Informatique et d'Analyse des Systèmes",
        ville: "Rabat",
        type: "Public",
        domaine: "Sciences et Ingénierie",
        description: "Formation d'excellence en génie logiciel, data science et intelligence artificielle",
        score: 87,
        filieres: ["Génie Informatique", "Data Science", "IA"],
        image: "https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=ENSIAS",
        siteWeb: "https://www.ensias.ma",
        tauxAdmission: "15%",
        duree: "5 ans",
        classement: "Top 3 Maroc"
      },
      {
        id: 2,
        nom: "EMI",
        nomComplet: "École Mohammadia d'Ingénieurs",
        ville: "Rabat",
        type: "Public",
        domaine: "Sciences et Ingénierie",
        description: "Formation généraliste en génie civil, mécanique et électrique",
        score: 82,
        filieres: ["Génie Civil", "Génie Mécanique", "Génie Électrique"],
        image: "https://via.placeholder.com/400x200/DC2626/FFFFFF?text=EMI",
        siteWeb: "https://www.emi.ac.ma",
        tauxAdmission: "18%",
        duree: "5 ans",
        classement: "Top 5 Maroc"
      },
      {
        id: 6,
        nom: "INPT",
        nomComplet: "Institut National des Postes et Télécommunications",
        ville: "Rabat",
        type: "Public",
        domaine: "Sciences et Ingénierie",
        description: "Formation en télécommunications, réseaux et systèmes embarqués",
        score: 85,
        filieres: ["Télécommunications", "Réseaux", "Systèmes Embarqués"],
        siteWeb: "https://www.inpt.ac.ma",
        tauxAdmission: "12%",
        duree: "5 ans",
        classement: "Top 4 Maroc"
      }
    ],
    'Commerce et Gestion': [
      {
        id: 3,
        nom: "ENCG",
        nomComplet: "École Nationale de Commerce et de Gestion",
        ville: "Casablanca",
        type: "Public",
        domaine: "Commerce et Gestion",
        description: "Formation en management, finance et marketing",
        score: 79,
        filieres: ["Management", "Finance", "Marketing"],
        image: "https://via.placeholder.com/400x200/16A34A/FFFFFF?text=ENCG",
        siteWeb: "https://www.encg.ac.ma",
        tauxAdmission: "20%",
        duree: "5 ans",
        classement: "Top 1 Maroc"
      },
      {
        id: 7,
        nom: "ISCAE",
        nomComplet: "Institut Supérieur de Commerce et d'Administration des Entreprises",
        ville: "Casablanca",
        type: "Privé",
        domaine: "Commerce et Gestion",
        description: "Formation en commerce international, finance et audit",
        score: 76,
        filieres: ["Commerce International", "Finance", "Audit"],
        siteWeb: "https://www.iscae.ma",
        tauxAdmission: "30%",
        duree: "5 ans",
        classement: "Top 2 Maroc"
      }
    ],
    'Médecine et Santé': [
      {
        id: 4,
        nom: "Faculté de Médecine",
        nomComplet: "Faculté de Médecine et de Pharmacie de Casablanca",
        ville: "Casablanca",
        type: "Public",
        domaine: "Médecine et Santé",
        description: "Formation médicale complète avec spécialisations en chirurgie, pédiatrie et cardiologie",
        score: 76,
        filieres: ["Médecine Générale", "Pharmacie", "Dentaire"],
        siteWeb: "https://www.fmpc.ac.ma",
        tauxAdmission: "10%",
        duree: "7 ans",
        classement: "Top 1 Maroc"
      }
    ],
    'Arts et Lettres': [
      {
        id: 5,
        nom: "Institut des Beaux-Arts",
        nomComplet: "Institut Supérieur des Arts et de la Culture",
        ville: "Rabat",
        type: "Public",
        domaine: "Arts et Lettres",
        description: "Formation en arts visuels, design graphique et création multimédia",
        score: 73,
        filieres: ["Arts Plastiques", "Design Graphique", "Cinéma"],
        siteWeb: "https://www.isac.ac.ma",
        tauxAdmission: "25%",
        duree: "3 ans",
        classement: "Top 2 Maroc"
      }
    ]
  };

  // ✅ Fonctions de validation
  const validateLyceeForm = () => {
    const errors = {};
    const fields = ['maths', 'francais', 'anglais', 'physique', 'svt', 'histoire', 'philosophie'];
    
    fields.forEach(field => {
      if (!notesLycee[field] || notesLycee[field] === '') {
        errors[field] = 'Ce champ est obligatoire';
      } else if (parseFloat(notesLycee[field]) < 0 || parseFloat(notesLycee[field]) > 20) {
        errors[field] = 'La note doit être comprise entre 0 et 20';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBacForm = () => {
    const errors = {};
    
    if (!infoBac.ecole || infoBac.ecole.trim() === '') {
      errors.ecole = "Le nom de l'école est obligatoire";
    }
    if (!infoBac.filiere || infoBac.filiere.trim() === '') {
      errors.filiere = 'La filière est obligatoire';
    }
    if (!infoBac.moyenne || infoBac.moyenne === '') {
      errors.moyenne = 'La moyenne est obligatoire';
    } else if (parseFloat(infoBac.moyenne) < 0 || parseFloat(infoBac.moyenne) > 20) {
      errors.moyenne = 'La moyenne doit être comprise entre 0 et 20';
    }
    if (!infoBac.annee || infoBac.annee.trim() === '') {
      errors.annee = "L'année d'obtention est obligatoire";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Gestionnaires de changement
  const handleLyceeChange = useCallback((key, value) => {
    setNotesLycee(prev => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: null }));
    }
  }, [validationErrors]);

  const handleBacChange = useCallback((key, value) => {
    if (key === 'annee') {
      value = value.replace(/[^\d]/g, '').slice(0, 4);
    }
    setInfoBac(prev => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: null }));
    }
  }, [validationErrors]);

  // ✅ Gestionnaires d'événements
  const handleAnswer = (answer) => {
    if (currentStep === 0) {
      setNiveau(answer);
      setAnswers({ ...answers, [currentStep]: answer });
      setShowNiveauForm(true);
      setValidationErrors({});
      return;
    }
    setAnswers({ ...answers, [currentStep]: answer });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNiveauSubmit = () => {
    let isValid = false;
    
    if (niveau === 'Lycée') {
      isValid = validateLyceeForm();
    } else {
      isValid = validateBacForm();
    }
    
    if (isValid) {
      setNiveauValide(true);
      setShowNiveauForm(false);
      setCurrentStep(1);
      setValidationErrors({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else if (currentStep === 1) {
      setCurrentStep(0);
      setNiveauValide(false);
      setShowNiveauForm(false);
      setValidationErrors({});
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResultat([]);
    setNiveau('');
    setNiveauValide(false);
    setShowNiveauForm(false);
    setNotesLycee({ maths: '', francais: '', anglais: '', physique: '', svt: '', histoire: '', philosophie: '' });
    setInfoBac({ ecole: '', filiere: '', moyenne: '', annee: '' });
    setValidationErrors({});
  };

  // ✅ Fonction pour sauvegarder une recommandation avec les infos de l'étudiant
  const handleSaveRecommendation = useCallback(async (recommendation) => {
    if (!currentUser) {
      setNotification({
        type: 'error',
        message: '❌ Veuillez vous connecter pour sauvegarder'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const alreadySaved = savedRecommendations.some(r => r.id === recommendation.id);
      
      let newSaved;
      if (alreadySaved) {
        newSaved = savedRecommendations.filter(r => r.id !== recommendation.id);
        setNotification({
          type: 'info',
          message: `❌ "${recommendation.nom}" retiré de vos favoris`
        });
      } else {
        // ✅ Ajouter toutes les informations de l'étudiant connecté
        const saveData = {
          ...recommendation,
          savedAt: new Date().toISOString(),
          etudiant: {
            id: currentUser.id || 'user',
            nom: currentUser.last_name || currentUser.lastName || 'Non défini',
            prenom: currentUser.first_name || currentUser.firstName || 'Non défini',
            email: currentUser.email || 'Non défini',
            telephone: currentUser.telephone || 'Non défini',
            niveau: currentUser.niveau_etude || currentUser.niveauEtude || niveau,
            ville: currentUser.ville || 'Non défini',
            dateNaissance: currentUser.date_naissance || currentUser.dateNaissance || 'Non défini',
            bio: currentUser.bio || ''
          },
          preferences: {
            domaine: answers[1] || 'Non spécifié',
            villePreference: answers[2] || 'Non spécifié',
            typeEnseignement: answers[3] || 'Non spécifié'
          },
          status: 'Sauvegardé'
        };
        newSaved = [...savedRecommendations, saveData];
        setNotification({
          type: 'success',
          message: `✅ "${recommendation.nom}" sauvegardé dans votre profil !`
        });
      }

      setSavedRecommendations(newSaved);
      
      // ✅ Sauvegarder dans localStorage avec l'ID de l'utilisateur
      const storageKey = `saved_recos_${currentUser.id || 'user'}`;
      localStorage.setItem(storageKey, JSON.stringify(newSaved));

      // ✅ Envoyer au serveur Laravel pour sauvegarde dans le profil
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/sauvegarder-recommandation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            etudiant_id: currentUser.id,
            recommendation: {
              id: recommendation.id,
              nom: recommendation.nom,
              nomComplet: recommendation.nomComplet || recommendation.nom,
              description: recommendation.description,
              domaine: recommendation.domaine,
              ville: recommendation.ville,
              type: recommendation.type,
              score: recommendation.score,
              filieres: recommendation.filieres || [],
              siteWeb: recommendation.siteWeb || '#',
              classement: recommendation.classement || 'Top'
            },
            preferences: {
              domaine: answers[1] || 'Non spécifié',
              villePreference: answers[2] || 'Non spécifié',
              typeEnseignement: answers[3] || 'Non spécifié'
            },
            action: alreadySaved ? 'unsave' : 'save'
          })
        });

        if (response.ok) {
          console.log('✅ Sauvegarde envoyée au serveur avec succès');
          // ✅ Mettre à jour le localStorage de l'utilisateur avec les recommandations
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData) {
            const savedRecos = alreadySaved 
              ? (userData.saved_recommendations || []).filter(r => r.id !== recommendation.id)
              : [...(userData.saved_recommendations || []), recommendation];
            userData.saved_recommendations = savedRecos;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          console.warn('⚠️ Erreur serveur lors de la sauvegarde');
        }
      } catch (serverError) {
        console.warn('⚠️ Erreur serveur (sauvegarde locale conservée):', serverError);
      }

      setTimeout(() => setNotification(null), 3000);

    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setNotification({
        type: 'error',
        message: '❌ Erreur lors de la sauvegarde'
      });
    }
  }, [savedRecommendations, currentUser, niveau, answers]);

  // ✅ Fonction pour partager une recommandation
  const handleShareRecommendation = (recommendation) => {
    const text = `🎓 ${recommendation.nom} - ${recommendation.nomComplet || recommendation.description}
📊 Score: ${recommendation.score}% match
🏙️ Ville: ${recommendation.ville}
📚 Domaine: ${recommendation.domaine}
🔗 ${recommendation.siteWeb || 'Plus d\'infos sur le site'}`;

    if (navigator.share) {
      navigator.share({
        title: `Recommandation: ${recommendation.nom}`,
        text: text,
        url: recommendation.siteWeb || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setNotification({
          type: 'success',
          message: '📋 Informations copiées dans le presse-papier !'
        });
        setTimeout(() => setNotification(null), 3000);
      });
    }
  };

  // ✅ Fonction pour parser les recommandations
  const parseRecommendations = (text) => {
    try {
      if (typeof text === 'object') return text;
      
      if (typeof text === 'string') {
        try {
          const parsed = JSON.parse(text);
          return parsed;
        } catch (e) {
          const lines = text.split('\n').filter(line => line.trim());
          const schoolNames = [];
          let currentSchool = null;
          
          lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.includes('ENSI') || trimmed.includes('EMI') || 
                trimmed.includes('ENCG') || trimmed.includes('Faculté') ||
                trimmed.includes('École') || trimmed.includes('Institut') ||
                trimmed.includes('INPT') || trimmed.includes('ISCAE')) {
              if (currentSchool) schoolNames.push(currentSchool);
              currentSchool = {
                nom: trimmed,
                description: '',
                details: {}
              };
            } else if (currentSchool && trimmed && !trimmed.includes('Match')) {
              if (!currentSchool.description) {
                currentSchool.description = trimmed;
              } else {
                currentSchool.description += ' ' + trimmed;
              }
            }
          });
          if (currentSchool) schoolNames.push(currentSchool);

          return schoolNames.map((school, index) => {
            const domaine = answers[1] || 'Sciences et Ingénierie';
            const domainSchools = schoolData[domaine] || schoolData['Sciences et Ingénierie'];
            const match = domainSchools.find(s => 
              school.nom.includes(s.nom) || s.nom.includes(school.nom)
            );

            return {
              id: index + 1,
              nom: school.nom,
              nomComplet: match?.nomComplet || school.nom,
              description: match?.description || school.description || 'Recommandation personnalisée',
              ville: answers[2] || 'Maroc',
              type: answers[3] || 'Pas de préférence',
              domaine: domaine,
              score: match?.score || Math.floor(Math.random() * 30 + 65),
              filieres: match?.filieres || ['Non spécifié'],
              siteWeb: match?.siteWeb || '#',
              tauxAdmission: match?.tauxAdmission || 'N/A',
              duree: match?.duree || 'N/A',
              classement: match?.classement || 'Top',
              ...match
            };
          });
        }
      }
      return [];
    } catch (error) {
      console.error('Erreur de parsing:', error);
      return [];
    }
  };

  // ✅ Analyse avec l'IA
  const analyserAvecIA = async () => {
    if (!currentUser) {
      setNotification({
        type: 'error',
        message: '❌ Veuillez vous connecter pour obtenir des recommandations'
      });
      setTimeout(() => setNotification(null), 3000);
      window.location.href = '/connexion';
      return;
    }

    setLoading(true);
    setResultat([]);

    const requestData = {
      niveau: niveau,
      answers: answers,
      notesLycee: niveau === 'Lycée' ? notesLycee : null,
      infoBac: niveau !== 'Lycée' ? infoBac : null,
      etudiant: {
        id: currentUser.id || 'user',
        nom: currentUser.last_name || currentUser.lastName || 'Non défini',
        prenom: currentUser.first_name || currentUser.firstName || 'Non défini',
        email: currentUser.email || 'Non défini',
        niveau: currentUser.niveau_etude || currentUser.niveauEtude || niveau,
        ville: currentUser.ville || 'Non défini',
        telephone: currentUser.telephone || 'Non défini'
      }
    };

    try {
      const response = await fetch('http://localhost:8000/api/recommander', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestData),
      });

      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('❌ Erreur de parsing:', parseError);
        data = {
          success: true,
          data: {
            recommendations: [
              "ENSIAS - École Nationale Supérieure d'Informatique",
              "EMI - École Mohammadia d'Ingénieurs",
              "ENCG - École Nationale de Commerce et de Gestion",
              "INPT - Institut National des Postes et Télécommunications",
              "ISCAE - Institut Supérieur de Commerce et d'Administration"
            ]
          }
        };
      }

      let recommendations = [];
      if (data.success && data.data && data.data.recommendations) {
        recommendations = data.data.recommendations;
      } else if (data.recommendations) {
        recommendations = data.recommendations;
      } else if (data.data && typeof data.data === 'string') {
        recommendations = data.data;
      }

      const parsedResult = parseRecommendations(recommendations);
      setResultat(parsedResult);

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      const fallbackData = [
        {
          id: 1,
          nom: "ENSIAS",
          nomComplet: "École Nationale Supérieure d'Informatique et d'Analyse des Systèmes",
          ville: "Rabat",
          type: "Public",
          domaine: "Sciences et Ingénierie",
          description: "Formation d'excellence en génie logiciel, data science et intelligence artificielle",
          score: 87,
          filieres: ["Génie Informatique", "Data Science", "IA"],
          siteWeb: "https://www.ensias.ma",
          tauxAdmission: "15%",
          duree: "5 ans",
          classement: "Top 3 Maroc"
        },
        {
          id: 2,
          nom: "EMI",
          nomComplet: "École Mohammadia d'Ingénieurs",
          ville: "Rabat",
          type: "Public",
          domaine: "Sciences et Ingénierie",
          description: "Formation généraliste en génie civil, mécanique et électrique",
          score: 82,
          filieres: ["Génie Civil", "Génie Mécanique", "Génie Électrique"],
          siteWeb: "https://www.emi.ac.ma",
          tauxAdmission: "18%",
          duree: "5 ans",
          classement: "Top 5 Maroc"
        },
        {
          id: 3,
          nom: "ENCG",
          nomComplet: "École Nationale de Commerce et de Gestion",
          ville: "Casablanca",
          type: "Public",
          domaine: "Commerce et Gestion",
          description: "Formation en management, finance et marketing",
          score: 79,
          filieres: ["Management", "Finance", "Marketing"],
          siteWeb: "https://www.encg.ac.ma",
          tauxAdmission: "20%",
          duree: "5 ans",
          classement: "Top 1 Maroc"
        },
        {
          id: 4,
          nom: "INPT",
          nomComplet: "Institut National des Postes et Télécommunications",
          ville: "Rabat",
          type: "Public",
          domaine: "Sciences et Ingénierie",
          description: "Formation en télécommunications, réseaux et systèmes embarqués",
          score: 85,
          filieres: ["Télécommunications", "Réseaux", "Systèmes Embarqués"],
          siteWeb: "https://www.inpt.ac.ma",
          tauxAdmission: "12%",
          duree: "5 ans",
          classement: "Top 4 Maroc"
        },
        {
          id: 5,
          nom: "ISCAE",
          nomComplet: "Institut Supérieur de Commerce et d'Administration des Entreprises",
          ville: "Casablanca",
          type: "Privé",
          domaine: "Commerce et Gestion",
          description: "Formation en commerce international, finance et audit",
          score: 76,
          filieres: ["Commerce International", "Finance", "Audit"],
          siteWeb: "https://www.iscae.ma",
          tauxAdmission: "30%",
          duree: "5 ans",
          classement: "Top 2 Maroc"
        }
      ];
      setResultat(fallbackData);
    }

    setLoading(false);
  };

  // ✅ Composant de carte créative
  const CreativeCard = ({ recommendation, isSaved }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isSavedState = isSaved || savedRecommendations.some(r => r.id === recommendation.id);

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

    const getTypeColor = (type) => {
      if (type === 'Public') return 'bg-emerald-100 text-emerald-700';
      if (type === 'Privé') return 'bg-blue-100 text-blue-700';
      return 'bg-gray-100 text-gray-700';
    };

    return (
      <div 
        className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
          isSavedState ? 'ring-2 ring-emerald-400 ring-offset-2' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSavedState && (
          <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
            <Bookmark size={14} fill="white" />
            Sauvegardé
          </div>
        )}

        <div className={`bg-gradient-to-r ${getScoreColor(recommendation.score)} p-6 relative min-h-[140px]`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{getDomainEmoji(recommendation.domaine)}</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  {recommendation.domaine}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
                {recommendation.nom}
              </h3>
              <p className="text-white/90 text-sm font-medium">
                {recommendation.nomComplet || recommendation.description}
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="text-3xl font-bold text-white">{recommendation.score}%</div>
                <div className="text-white/80 text-xs">Match</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Description complète */}
          <div className="bg-blue-50/50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {recommendation.description}
            </p>
          </div>

          {/* Détails */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center group-hover:bg-blue-50 transition-colors">
              <MapPin size={18} className="mx-auto text-blue-500 mb-1" />
              <span className="text-xs text-gray-500 block">Ville</span>
              <span className="text-sm font-semibold text-gray-700">{recommendation.ville}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center group-hover:bg-blue-50 transition-colors">
              <Building2 size={18} className="mx-auto text-blue-500 mb-1" />
              <span className="text-xs text-gray-500 block">Type</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full inline-block ${getTypeColor(recommendation.type)}`}>
                {recommendation.type}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center group-hover:bg-blue-50 transition-colors">
              <Award size={18} className="mx-auto text-blue-500 mb-1" />
              <span className="text-xs text-gray-500 block">Classement</span>
              <span className="text-sm font-semibold text-gray-700">{recommendation.classement || 'Top'}</span>
            </div>
          </div>

          {/* Filières */}
          {recommendation.filieres && recommendation.filieres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-gray-500 font-medium mr-1">Filières:</span>
              {recommendation.filieres.map((filiere, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {filiere}
                </span>
              ))}
            </div>
          )}

          {/* Infos supplémentaires */}
          {recommendation.tauxAdmission && recommendation.tauxAdmission !== 'N/A' && (
            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <span>🎯 Taux admission: <strong>{recommendation.tauxAdmission}</strong></span>
              {recommendation.duree && recommendation.duree !== 'N/A' && (
                <span>⏱️ Durée: <strong>{recommendation.duree}</strong></span>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleSaveRecommendation(recommendation)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                isSavedState 
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-2 border-emerald-200' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isSavedState ? (
                <>
                  <Bookmark size={18} fill="currentColor" />
                  Sauvegardé
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  Sauvegarder
                </>
              )}
            </button>
            
            <button 
              onClick={() => handleShareRecommendation(recommendation)}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Share2 size={18} />
            </button>
            
            {recommendation.siteWeb && recommendation.siteWeb !== '#' && (
              <a 
                href={recommendation.siteWeb} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Effet de brillance au survol */}
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}></div>
      </div>
    );
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const isFinished = Object.keys(answers).length === questions.length;

  // ✅ Formulaires
  const FormLycee = useMemo(() => (
    <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl" key="lycee-form">
      <h4 className="font-semibold text-blue-900 mb-4">📝 Entre tes notes (sur 20) :</h4>
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'maths', label: 'Mathématiques' },
          { key: 'francais', label: 'Français' },
          { key: 'anglais', label: 'Anglais' },
          { key: 'physique', label: 'Physique-Chimie' },
          { key: 'svt', label: 'SVT' },
          { key: 'histoire', label: 'Histoire-Géo' },
          { key: 'philosophie', label: 'Philosophie' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm text-gray-600 mb-1 block">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0-20"
              value={notesLycee[key]}
              onChange={(e) => handleLyceeChange(key, e.target.value)}
              className={`w-full p-2 border-2 rounded-lg focus:border-blue-400 outline-none ${
                validationErrors[key] ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              required
            />
            {validationErrors[key] && (
              <p className="text-red-500 text-xs mt-1">{validationErrors[key]}</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleNiveauSubmit}
        className="mt-6 w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
      >
        Continuer →
      </button>
    </div>
  ), [notesLycee, validationErrors, handleLyceeChange]);

  const FormBac = useMemo(() => (
    <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl" key="bac-form">
      <h4 className="font-semibold text-blue-900 mb-4">📝 Infos sur tes études actuelles :</h4>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Nom de l'école / université <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: ENCG Casablanca"
            value={infoBac.ecole}
            onChange={(e) => handleBacChange('ecole', e.target.value)}
            className={`w-full p-2 border-2 rounded-lg focus:border-blue-400 outline-none ${
              validationErrors.ecole ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            required
          />
          {validationErrors.ecole && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.ecole}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Filière actuelle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Génie Informatique"
            value={infoBac.filiere}
            onChange={(e) => handleBacChange('filiere', e.target.value)}
            className={`w-full p-2 border-2 rounded-lg focus:border-blue-400 outline-none ${
              validationErrors.filiere ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            required
          />
          {validationErrors.filiere && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.filiere}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Moyenne générale (sur 20) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ex: 14.5"
            value={infoBac.moyenne}
            onChange={(e) => handleBacChange('moyenne', e.target.value)}
            className={`w-full p-2 border-2 rounded-lg focus:border-blue-400 outline-none ${
              validationErrors.moyenne ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            required
          />
          {validationErrors.moyenne && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.moyenne}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Année d'obtention du diplôme <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ex: 2025"
            value={infoBac.annee}
            onChange={(e) => handleBacChange('annee', e.target.value)}
            className={`w-full p-2 border-2 rounded-lg focus:border-blue-400 outline-none ${
              validationErrors.annee ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            required
          />
          {validationErrors.annee && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.annee}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleNiveauSubmit}
        className="mt-6 w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
      >
        Continuer →
      </button>
    </div>
  ), [infoBac, validationErrors, handleBacChange]);

  // ✅ Affichage du profil utilisateur
  const UserProfileCard = () => {
    if (!currentUser) return null;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {(currentUser.first_name || currentUser.firstName || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">
              {currentUser.first_name || currentUser.firstName} {currentUser.last_name || currentUser.lastName}
            </h4>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User size={14} /> {currentUser.email}
              </span>
              {currentUser.telephone && (
                <span className="flex items-center gap-1">
                  📱 {currentUser.telephone}
                </span>
              )}
              {currentUser.ville && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {currentUser.ville}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/profile'}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white relative">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl animate-slide-in ${
          notification.type === 'success' ? 'bg-emerald-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <GraduationCap size={40} className="text-blue-600" />
            <h2 className="text-4xl font-bold text-blue-900">
              Questionnaire d'Orientation
            </h2>
          </div>
          <p className="text-xl text-gray-600">
            Réponds à quelques questions pour trouver la formation idéale
          </p>
          {currentUser && (
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
              <User size={16} />
              Connecté en tant que {currentUser.first_name || currentUser.firstName} {currentUser.last_name || currentUser.lastName}
            </p>
          )}
        </div>

        {/* Carte de profil utilisateur */}
        {currentUser && <UserProfileCard />}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentStep + 1} sur {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">
              {questions[currentStep].question}
            </h3>
            <div className="space-y-3">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    answers[currentStep] === option
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>

            {showNiveauForm && niveau === 'Lycée' && FormLycee}
            {showNiveauForm && niveau !== 'Lycée' && FormBac}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            {currentStep === questions.length - 1 && answers[currentStep] && (
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Recommencer
              </button>
            )}
          </div>
        </div>

        {isFinished && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">📋 Récapitulatif de tes réponses :</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-500 block text-xs">{q.question}</span>
                    <span className="font-medium text-blue-700">{answers[idx] || 'Non répondu'}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={analyserAvecIA}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyse en cours...
                </span>
              ) : (
                '🎓 Voir mes recommandations IA'
              )}
            </button>
          </div>
        )}

        {/* Affichage des recommandations */}
        {resultat.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Star className="text-yellow-400 fill-current" size={28} />
                  Écoles recommandées pour vous
                </h3>
                <p className="text-gray-500 mt-1">
                  {resultat.length} suggestions basées sur votre profil
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    showSavedOnly 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark size={18} />
                  {showSavedOnly ? 'Voir tout' : 'Voir sauvegardés'}
                  {savedRecommendations.length > 0 && (
                    <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {savedRecommendations.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showSavedOnly ? savedRecommendations : resultat).map((rec) => (
                <CreativeCard 
                  key={rec.id} 
                  recommendation={rec}
                  isSaved={savedRecommendations.some(r => r.id === rec.id)}
                />
              ))}
            </div>

            {/* Statistiques */}
            {!showSavedOnly && (
              <div className="mt-10 bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" />
                  Analyse des correspondances
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
                    <span className="block text-3xl font-bold text-blue-600">
                      {resultat.filter(r => r.score >= 80).length}
                    </span>
                    <span className="text-sm text-gray-600">Correspondance élevée</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 text-center">
                    <span className="block text-3xl font-bold text-emerald-600">
                      {Math.max(...resultat.map(r => r.score))}%
                    </span>
                    <span className="text-sm text-gray-600">Meilleur match</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                    <span className="block text-3xl font-bold text-purple-600">
                      {Math.round(resultat.reduce((acc, r) => acc + r.score, 0) / resultat.length)}%
                    </span>
                    <span className="text-sm text-gray-600">Moyenne des matches</span>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
                    <span className="block text-3xl font-bold text-orange-600">
                      {new Set(resultat.map(r => r.ville)).size}
                    </span>
                    <span className="text-sm text-gray-600">Villes différentes</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      const text = resultat.map(r => 
                        `🎓 ${r.nom} - ${r.nomComplet || r.description}\n🏙️ ${r.ville} | 📊 ${r.score}% match`
                      ).join('\n\n');
                      navigator.clipboard?.writeText(text).then(() => {
                        setNotification({
                          type: 'success',
                          message: '📋 Liste copiée !'
                        });
                        setTimeout(() => setNotification(null), 3000);
                      });
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    📋 Copier la liste
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    🖨️ Imprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}