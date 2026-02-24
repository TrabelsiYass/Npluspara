import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../Client';

const BlogPostDetail = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate(); // Pour le bouton retour
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(data);
      window.scrollTo(0, 0);
    };
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-center py-5">Chargement...</div>;

  return (
    <div className="container py-5">
      {/* navigate(-1) simule le bouton retour du navigateur */}
      <button className="btn btn-link text-success mb-4" onClick={() => navigate(-1)}>
        ← Retour aux articles
      </button>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <img src={post.image_url} className="w-100 rounded-4 mb-4" alt={post.title} />
          <h1 className="display-5 fw-bold">{post.title}</h1>
          <p className="text-muted">Par {post.author} • {new Date(post.created_at).toLocaleDateString()}</p>
          <hr />
          <div className="main-text fs-5" style={{ whiteSpace: 'pre-line' }}>
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;