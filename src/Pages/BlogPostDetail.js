import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../Client';
import { motion, useScroll } from 'framer-motion';
import { HiOutlineArrowNarrowLeft, HiOutlineClock, HiOutlineUserCircle, HiOutlineShare } from "react-icons/hi";
import './Blog.css'; // Using the same CSS file for consistency

const BlogPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(data);
      window.scrollTo(0, 0);
    };
    fetchPost();
  }, [id]);

  if (!post) return (
    <div className="text-center py-5" style={{ color: '#052b19' }}>
      <div className="spinner-border" role="status"></div>
      <p className="mt-3">Préparation de votre lecture...</p>
    </div>
  );

  return (
    <div className="post-detail-page">
      {/* Reading Progress Bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Header Section */}
      <header className="post-hero">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <HiOutlineArrowNarrowLeft /> Retour au Mag
          </button>
          
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <span className="post-category-label">{post.category || 'Bien-être'}</span>
              <h1 className="post-main-title">{post.title}</h1>
              
              <div className="post-meta-detailed">
                <div className="meta-item">
                  <HiOutlineUserCircle /> <span>{post.author || 'Expert N+ Para'}</span>
                </div>
                <div className="meta-divider"></div>
                <div className="meta-item">
                  <HiOutlineClock /> <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="meta-divider"></div>
                <div className="meta-item">
                  <span>5 min de lecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Image */}
      <div className="container">
        <div className="hero-image-wrapper">
          <motion.img 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={post.image_url} 
            alt={post.title} 
            className="full-bleed-img"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          {/* Side Tools (Desktop Only) */}
          <div className="col-lg-1 d-none d-lg-block">
            <div className="sticky-tools">
              <button title="Partager"><HiOutlineShare /></button>
              <div className="tool-line"></div>
            </div>
          </div>

          <div className="col-lg-8">
            <article className="article-body">
              {/* Lead Paragraph / Excerpt */}
              <p className="article-lead">
                {post.excerpt}
              </p>

              {/* Main Text Content */}
              <div className="article-content-text">
                {post.content}
              </div>

              {/* Tag Section */}
              <div className="post-tags mt-5">
                <span className="tag-item">#Santé Naturelle</span>
                <span className="tag-item">#DermoCosmétique</span>
                <span className="tag-item">#ConseilsPharmacie</span>
              </div>
            </article>

            {/* Author Box */}
            <div className="author-card">
               <div className="author-info">
                 <h6>Rédigé par {post.author || 'L\'équipe N+ Para'}</h6>
                 <p>Nos pharmaciens et experts beauté s'engagent à vous fournir des conseils validés scientifiquement pour votre bien-être quotidien.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Footer CTA */}
      <section className="post-bottom-cta">
        <div className="container text-center">
           <h3>Envie d'en savoir plus ?</h3>
           <Link to="/blog" className="cta-outline-btn">Découvrir d'autres articles</Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPostDetail;