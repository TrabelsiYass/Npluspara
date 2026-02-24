import { useEffect, useState } from 'react';
import { MdAddCircle, MdDelete } from "react-icons/md";
import { supabase } from '../../Client';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Récupérer les catégories existantes
    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('id', { ascending: true });
        
        if (!error) setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. Ajouter une nouvelle catégorie
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Génération du slug (ex: "Soins Bébé" -> "soins-bebe")
        const slug = name.toLowerCase()
                         .trim()
                         .replace(/[^\w\s-]/g, '')
                         .replace(/[\s_-]+/g, '-')
                         .replace(/^-+|-+$/g, '');

        const { error } = await supabase
            .from('categories')
            .insert([{ name: name, slug: slug }]);

        if (error) {
            alert("Erreur: " + error.message);
        } else {
            setName('');
            fetchCategories(); // Rafraîchir la liste
        }
        setLoading(false);
    };

    // 3. Supprimer une catégorie
    const handleDelete = async (id) => {
        if(window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (!error) fetchCategories();
        }
    };

    return (
        <div className="admin-card p-4 shadow-sm bg-white rounded">
            <h2 className="mb-4 d-flex align-items-center gap-2">
                <MdAddCircle className="text-success" /> Gestion des Catégories Parentes
            </h2>

            {/* Formulaire d'ajout */}
            <form onSubmit={handleAddCategory} className="row g-3 mb-5 p-3 border rounded bg-light">
                <div className="col-md-8">
                    <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        placeholder="Nom de la catégorie (ex: Maman & Bébé)" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <button 
                        type="submit" 
                        className="btn btn-success btn-lg w-100" 
                        disabled={loading}
                    >
                        {loading ? 'Envoi...' : 'Ajouter la Catégorie'}
                    </button>
                </div>
            </form>

            {/* Liste des catégories */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Slug (URL)</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td className="fw-bold">{cat.name}</td>
                                <td className="text-muted">/{cat.slug}</td>
                                <td className="text-center">
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;