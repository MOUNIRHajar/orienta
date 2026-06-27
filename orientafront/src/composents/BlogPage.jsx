// src/components/BlogPage.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Récupération des articles depuis l'API
  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/blogs?page=${currentPage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Données brutes de l\'API:', data);

      // ✅ Vérification que data.data est bien un tableau
      let articlesData = [];
      if (data && data.data && Array.isArray(data.data)) {
        articlesData = data.data;
      } else if (Array.isArray(data)) {
        articlesData = data;
      } else {
        console.warn('⚠️ Structure de données inattendue, utilisation du fallback');
        articlesData = getFallbackArticles();
      }

      // ✅ Transformer les données
      const formattedArticles = articlesData.map(article => ({
        id: article.id,
        title: article.title || 'Titre non disponible',
        excerpt: article.excerpt || article.content?.substring(0, 150) + '...' || 'Pas de résumé disponible',
        content: article.content || '',
        date: formatDate(article.created_at),
        category: article.category || getCategoryFromContent(article.title || '', article.content || ''),
        author: article.author || 'OrientaMaroc',
        readTime: calculateReadTime(article.content || article.excerpt || ''),
        image: article.image || getCategoryIcon(article.category),
        slug: article.slug || `article-${article.id}`,
        status: article.status || 'published',
        created_at: article.created_at || new Date().toISOString(),
      }));

      setArticles(formattedArticles);
      setTotalPages(data.last_page || 1);

    } catch (error) {
      console.error('❌ Erreur lors du chargement des articles:', error);
      setError('Impossible de charger les articles. Veuillez réessayer plus tard.');

      // ✅ Fallback : données statiques en cas d'erreur
      setArticles(getFallbackArticles());
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date inconnue';
    }
  };

  // ✅ Fonction pour calculer le temps de lecture
  const calculateReadTime = (text) => {
    if (!text) return '1 min';
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${Math.max(1, minutes)} min`;
  };

  // ✅ Fonction pour déterminer la catégorie à partir du contenu
  const getCategoryFromContent = (title, content) => {
    const text = (title + ' ' + content).toLowerCase();
    if (text.includes('orientation') || text.includes('choisir') || text.includes('filière') || text.includes('bac')) return 'orientation';
    if (text.includes('carrière') || text.includes('métier') || text.includes('emploi') || text.includes('recrute')) return 'carriere';
    if (text.includes('ia') || text.includes('intelligence') || text.includes('artificielle') || text.includes('robot')) return 'ia';
    if (text.includes('école') || text.includes('ingénieur') || text.includes('université') || text.includes('campus') || text.includes('formation')) return 'ecoles';
    if (text.includes('bourse') || text.includes('financement') || text.includes('aide financière')) return 'bourses';
    if (text.includes('étranger') || text.includes('international') || text.includes('à l\'étranger') || text.includes('abroad')) return 'etranger';
    return 'orientation';
  };

  // ✅ Fonction pour obtenir l'icône de la catégorie
  const getCategoryIcon = (category) => {
    const icons = {
      'orientation': '🎓',
      'carriere': '💼',
      'ia': '🤖',
      'ecoles': '🏫',
      'bourses': '💰',
      'etranger': '🌍',
      'default': '📝'
    };
    return icons[category] || icons.default;
  };

  // ✅ Fonction pour obtenir le libellé d'une catégorie
  const getCategoryLabel = (categoryId) => {
    const labels = {
      'orientation': 'Orientation',
      'carriere': 'Carrière',
      'ia': 'Intelligence Artificielle',
      'ecoles': 'Écoles',
      'bourses': 'Bourses',
      'etranger': 'Étranger'
    };
    return labels[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  // ✅ Données de fallback
  const getFallbackArticles = () => {
    return [
      {
        id: 1,
        title: "Comment choisir sa filière après le bac ?",
        excerpt: "Découvrez les critères essentiels pour faire le bon choix d'orientation et réussir votre parcours académique.",
        date: "12 Juin 2026",
        category: "orientation",
        author: "Dr. Karim Benjelloun",
        readTime: "5 min",
        image: "🎓",
        slug: "comment-choisir-sa-filiere",
        content: "Contenu de l'article...",
        created_at: "2026-06-12",
        status: "published"
      },
      {
        id: 2,
        title: "Les métiers d'avenir au Maroc",
        excerpt: "Explorez les secteurs qui recrutent et les compétences recherchées pour les années à venir.",
        date: "10 Juin 2026",
        category: "carriere",
        author: "Sofia El Alami",
        readTime: "7 min",
        image: "💼",
        slug: "les-metiers-davenir-au-maroc",
        content: "Contenu de l'article...",
        created_at: "2026-06-10",
        status: "published"
      },
      {
        id: 3,
        title: "IA et éducation : révolution dans l'orientation",
        excerpt: "Comment l'intelligence artificielle transforme la façon dont les étudiants choisissent leur parcours.",
        date: "8 Juin 2026",
        category: "ia",
        author: "Youssef Mansouri",
        readTime: "6 min",
        image: "🤖",
        slug: "ia-et-education-revolution",
        content: "Contenu de l'article...",
        created_at: "2026-06-08",
        status: "published"
      },
      {
        id: 4,
        title: "Top 10 des écoles d'ingénieurs au Maroc",
        excerpt: "Classement et présentation des meilleures écoles d'ingénieurs pour former votre avenir.",
        date: "5 Juin 2026",
        category: "ecoles",
        author: "Nadia Tazi",
        readTime: "8 min",
        image: "🏫",
        slug: "top-10-ecoles-ingenieurs-maroc",
        content: "Contenu de l'article...",
        created_at: "2026-06-05",
        status: "published"
      },
      {
        id: 5,
        title: "Bourses d'études : comment les obtenir ?",
        excerpt: "Guide complet pour décrocher une bourse et financer vos études supérieures.",
        date: "3 Juin 2026",
        category: "bourses",
        author: "Mohamed Amine",
        readTime: "4 min",
        image: "💰",
        slug: "bourses-etudes-comment-obtenir",
        content: "Contenu de l'article...",
        created_at: "2026-06-03",
        status: "published"
      },
      {
        id: 6,
        title: "Étudier à l'étranger : opportunités et démarches",
        excerpt: "Tout ce qu'il faut savoir pour préparer votre départ et réussir vos études à l'international.",
        date: "1 Juin 2026",
        category: "etranger",
        author: "Leila Benali",
        readTime: "10 min",
        image: "🌍",
        slug: "etudier-a-l-etranger-opportunites",
        content: "Contenu de l'article...",
        created_at: "2026-06-01",
        status: "published"
      }
    ];
  };

  // ✅ Construction des catégories dynamiques (avec sécurité)
  const getCategories = () => {
    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return [{ id: 'all', label: 'Tous' }];
    }

    const categorySet = new Set(articles.map(article => article.category).filter(cat => cat));
    const categoryList = [
      { id: 'all', label: 'Tous' },
      ...Array.from(categorySet).map(cat => ({
        id: cat,
        label: getCategoryLabel(cat)
      }))
    ];
    return categoryList;
  };

  // ✅ Filtrage sécurisé des articles
  const filteredArticles = (() => {
    if (!articles || !Array.isArray(articles)) return [];
    if (selectedCategory === 'all') return articles;
    return articles.filter(article => article.category === selectedCategory);
  })();

  // ✅ Gestion du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  // ✅ Gestion des erreurs
  if (error && (!articles || articles.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchArticles()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const categories = getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-2xl">📝</span>
            <span className="text-sm font-semibold text-blue-800">
              Blog & Actualités • {articles.length} articles
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Conseils et actualités
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos articles pour mieux vous orienter et réussir votre parcours
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full transition-all transform hover:scale-105 ${selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun article dans cette catégorie
            </h3>
            <p className="text-gray-500">
              Revenez plus tard pour découvrir de nouveaux articles.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-6xl">
                    {article.image || getCategoryIcon(article.category)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime} de lecture</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Par {article.author}</span>
                    <Link
                      to={`/blog/${article.slug}`}  // Utilise le slug
                      className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      Lire plus
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Précédent
            </button>
            <span className="text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ne manquez aucun conseil !
          </h2>
          <p className="text-blue-100 mb-6">
            Inscrivez-vous à notre newsletter pour recevoir les derniers articles
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}