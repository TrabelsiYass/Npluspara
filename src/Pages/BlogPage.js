import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../Client';
import { motion } from 'framer-motion';
import { HiOutlineArrowNarrowRight, HiOutlineClock, HiOutlineMail } from "react-icons/hi";
import './Blog.css';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  const categories = ['Tous', 'Soin Visage', 'Solaire', 'Cheveux', 'Bébé', 'Nutrition'];

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
      setFilteredPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === 'Tous') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(p => p.category === cat));
    }
  };

  if (loading) return <div className="text-center py-5">Chargement de votre magazine...</div>;

  const featuredPost = posts[0];

  return (
    <div className="blog-list-page">
      {/* Editorial Header */}
      <section className="blog-header">
        <div className="container text-center">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="editorial-label"
          >
            N PLUS PARA • 
          </motion.span>
          <h1 className="blog-main-title">Le Mag Bien-être</h1>
          <div className="title-divider"></div>
          <p className="blog-description">
            Décryptage des actifs, rituels de soins et conseils de pharmaciens pour sublimer votre capital santé.
          </p>
        </div>
      </section>

      {/* Featured Highlight */}
      {activeCategory === 'Tous' && featuredPost && (
        <section className="container mb-5">
          <Link to={`/blog/${featuredPost.id}`} className="featured-wrapper">
            <div className="row g-0 align-items-stretch">
              <div className="col-lg-8">
                <div className="featured-image-box">
                  <img src={featuredPost.image_url} alt={featuredPost.title} />
                  <div className="featured-overlay-tag">À la une</div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="featured-text-box">
                  <span className="post-cat-tag">{featuredPost.category}</span>
                  <h2 className="display-6 fw-bold mb-3">{featuredPost.title}</h2>
                  <p className="featured-excerpt">{featuredPost.excerpt}</p>
                  <div className="mt-auto pt-4 border-top">
                    <span className="read-more-link">Continuer la lecture <HiOutlineArrowNarrowRight /></span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Filter Bar */}
      <div className="container mb-5">
        <div className="filter-nav">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`nav-filter-item ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <div className="container pb-5">
        <div className="row g-5">
          {filteredPosts.slice(activeCategory === 'Tous' ? 1 : 0).map((post) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-md-6 col-lg-4" 
              key={post.id}
            >
              <Link to={`/blog/${post.id}`} className="article-card">
                <div className="article-img-wrap">
                  <img src={post.image_url} alt={post.title} />
                  <div className="category-pill">{post.category}</div>
                </div>
                <div className="article-info">
                  <div className="article-meta">
                     <span><HiOutlineClock /> 4 min de lecture</span>
                     <span>•</span>
                     <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h3 className="article-title">{post.title}</h3>
                  <p className="article-summary">{post.excerpt}</p>
                  <div className="article-footer">
                    <span>Découvrir l'article</span>
                    <HiOutlineArrowNarrowRight />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="newsletter-section my-5">
        <div className="container">
          <div className="newsletter-box text-center">
            <HiOutlineMail className="newsletter-icon" />
            <h2>Restez informée</h2>
            <p>Recevez nos derniers conseils santé et offres exclusives directement dans votre boîte mail.</p>
            <div className="newsletter-form mt-4">
              <input type="email" placeholder="Votre adresse email..." />
              <button>S'abonner</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;