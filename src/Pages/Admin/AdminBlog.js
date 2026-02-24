import { useEffect, useState } from 'react';
import { MdAdd, MdArticle, MdClose, MdDelete, MdEdit, MdSave } from "react-icons/md";
import { supabase } from '../../Client';

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category: '', author: '', image_url: ''
    });

    const fetchPosts = async () => {
        const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        setPosts(data || []);
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await supabase.from('posts').update(form).eq('id', editId);
                setEditId(null);
            } else {
                await supabase.from('posts').insert([form]);
            }
            setForm({ title: '', excerpt: '', content: '', category: '', author: '', image_url: '' });
            fetchPosts();
            alert("Article enregistré !");
        } catch (err) { alert(err.message); }
        finally { setLoading(false); }
    };

    const handleEdit = (post) => {
        setEditId(post.id);
        setForm({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            author: post.author,
            image_url: post.image_url
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet article ?")) {
            await supabase.from('posts').delete().eq('id', id);
            fetchPosts();
        }
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 fw-bold text-dark d-flex align-items-center gap-2">
                <MdArticle className="text-success" /> Gestion du Magasin / Blog
            </h2>

            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4 mb-5 bg-light">
                <div className="row g-3">
                    <div className="col-md-8">
                        <label className="form-label fw-bold">Titre de l'article</label>
                        <input type="text" className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Catégorie</label>
                        <input type="text" className="form-control" placeholder="ex: Santé, Beauté..." value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-bold">Résumé (Excerpt)</label>
                        <textarea className="form-control" rows="2" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}></textarea>
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-bold">Contenu de l'article</label>
                        <textarea className="form-control" rows="8" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required></textarea>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Auteur</label>
                        <input type="text" className="form-control" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">URL de l'image</label>
                        <input type="text" className="form-control" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                    </div>
                    <div className="col-12 text-end">
                        {editId && <button type="button" className="btn btn-secondary me-2" onClick={() => {setEditId(null); setForm({title:'', excerpt:'', content:'', category:'', author:'', image_url:''})}}><MdClose /> Annuler</button>}
                        <button type="submit" className="btn btn-success px-5" disabled={loading}>
                            {loading ? 'Envoi...' : editId ? <><MdSave /> Modifier</> : <><MdAdd /> Publier</>}
                        </button>
                    </div>
                </div>
            </form>

            {/* LISTE DES ARTICLES */}
            <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Catégorie</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td><img src={post.image_url} width="60" height="40" className="rounded object-fit-cover" alt="" /></td>
                                <td className="fw-bold">{post.title}</td>
                                <td>{post.author}</td>
                                <td><span className="badge bg-light text-dark border">{post.category}</span></td>
                                <td className="text-center">
                                    <button onClick={() => handleEdit(post)} className="btn btn-sm btn-outline-primary me-2"><MdEdit /></button>
                                    <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-outline-danger"><MdDelete /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlog;