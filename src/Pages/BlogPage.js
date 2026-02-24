import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../Client';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="blog-list-page py-5">
      <div className="container">
        <h1 className="text-center fw-bold mb-5">Le Mag Bien-être</h1>
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              {/* Utilisation de Link pour changer l'URL */}
              <Link to={`/blog/${post.id}`} className="text-decoration-none text-dark">
                <div className="blog-card h-100 shadow-sm">
                  <div className="card-img-wrapper">
                    <img src={post.image_url} alt={post.title} className="w-100" style={{height: '220px', objectFit: 'cover'}} />
                    <span className="badge bg-success ">{post.category}</span>
                  </div>
                  <div className="card-content p-4">
                    <h3>{post.title}</h3>
                    <p className="text-muted small">{post.excerpt}</p>
                    <span className="btn-read text-success fw-bold">Lire l'article →</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;