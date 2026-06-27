// src/components/BlogDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Récupération de l'article par slug
      const response = await fetch(`http://localhost:8000/api/blogs/${slug}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article non trouvé');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Article récupéré:', data);

      // ✅ Transformer les données
      const formattedArticle = {
        id: data.id,
        title: data.title || 'Titre non disponible',
        excerpt: data.excerpt || data.content?.substring(0, 200) || '',
        content: data.content || '',
        slug: data.slug,
        status: data.status || 'published',
        created_at: data.created_at,
        updated_at: data.updated_at,
        image: data.image || getCategoryIcon(data.category),
        category: data.category || getCategoryFromContent(data.title, data.content),
        author: data.author || 'OrientaMaroc',
        readTime: calculateReadTime(data.content || ''),
        tags: data.tags || [],
        views: data.views || 0,
        likes: data.likes || 0,
      };

      setArticle(formattedArticle);

      // ✅ Récupérer les articles similaires
      await fetchRelatedArticles(formattedArticle.category, formattedArticle.id);

    } catch (error) {
      console.error('❌ Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Récupération des articles similaires
  const fetchRelatedArticles = async (category, currentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/blogs?page=1`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data && Array.isArray(data.data)) {
          // Filtrer les articles similaires (même catégorie, différent ID)
          const related = data.data
            .filter(item => item.id !== currentId && item.category === category)
            .slice(0, 3);
          
          setRelatedArticles(related);
        }
      }
    } catch (error) {
      console.warn('Impossible de charger les articles similaires:', error);
    }
  };

  // ✅ Fonctions utilitaires
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

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const calculateReadTime = (text) => {
    if (!text) return '1 min';
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${Math.max(1, minutes)} min`;
  };

  const getCategoryFromContent = (title, content) => {
    const text = (title || '') + ' ' + (content || '');
    if (text.toLowerCase().includes('orientation') || text.includes('choisir') || text.includes('filière')) return 'orientation';
    if (text.includes('carrière') || text.includes('métier') || text.includes('emploi')) return 'carriere';
    if (text.includes('ia') || text.includes('intelligence') || text.includes('artificielle')) return 'ia';
    if (text.includes('école') || text.includes('ingénieur') || text.includes('université')) return 'ecoles';
    if (text.includes('bourse') || text.includes('financement')) return 'bourses';
    if (text.includes('étranger') || text.includes('international')) return 'etranger';
    return 'orientation';
  };

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

  const getCategoryColor = (category) => {
    const colors = {
      'orientation': 'from-blue-500 to-blue-600',
      'carriere': 'from-emerald-500 to-emerald-600',
      'ia': 'from-purple-500 to-purple-600',
      'ecoles': 'from-amber-500 to-amber-600',
      'bourses': 'from-green-500 to-green-600',
      'etranger': 'from-cyan-500 to-cyan-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors.default;
  };

  const getCategoryLabel = (categoryId) => {
    const labels = {
      'orientation': 'Orientation',
      'carriere': 'Carrière',
      'ia': 'Intelligence Artificielle',
      'ecoles': 'Écoles',
      'bourses': 'Bourses',
      'etranger': 'Étranger'
    };
    return labels[categoryId] || categoryId;
  };

  // ✅ Gestion du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  // ✅ Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error === 'Article non trouvé' ? 'Article introuvable' : 'Erreur'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error === 'Article non trouvé' 
              ? 'L\'article que vous recherchez n\'existe pas ou a été supprimé.'
              : error}
          </p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Si pas d'article
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article non disponible</h2>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
          >
            ← Voir tous les articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ✅ Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <span>›</span>
          <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium truncate">{article.title}</span>
        </nav>

        {/* ✅ Article principal */}
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Bannière / Image de couverture */}
          <div className={`h-64 md:h-80 bg-gradient-to-r ${getCategoryColor(article.category)} flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-center">
              <div className="text-8xl md:text-9xl mb-4">{article.image || getCategoryIcon(article.category)}</div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 md:p-10">
            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="inline-flex items-center gap-1">
                📅 {formatDate(article.created_at)}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                ⏱️ {article.readTime} de lecture
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                👁️ {article.views || 0} vues
              </span>
            </div>

            {/* Catégorie */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getCategoryColor(article.category)}`}>
                {getCategoryLabel(article.category)}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>

            {/* Auteur */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{article.author}</p>
                <p className="text-sm text-gray-500">
                  Publié le {formatDate(article.created_at)} à {formatTime(article.created_at)}
                </p>
              </div>
            </div>

            {/* Résumé */}
            {article.excerpt && (
              <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-blue-800 font-medium">{article.excerpt}</p>
              </div>
            )}

            {/* Contenu principal */}
            <div 
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">🏷️ Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <span>❤️</span>
                <span>{article.likes || 0}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <span>🔗</span>
                <span>Partager</span>
              </button>
              <Link
                to="/blog"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
              >
                <span>←</span>
                <span>Retour</span>
              </Link>
            </div>
          </div>
        </article>

        {/* ✅ Articles similaires */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📖 Articles similaires
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  <div className={`h-24 bg-gradient-to-r ${getCategoryColor(related.category)} flex items-center justify-center`}>
                    <span className="text-3xl">{related.image || getCategoryIcon(related.category)}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(related.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Bouton retour en haut */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
        >
          ↑
        </button>
      </div>
    </div>
  );
}