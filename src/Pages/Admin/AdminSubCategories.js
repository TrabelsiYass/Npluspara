import { useEffect, useState } from 'react';
import { supabase } from '../../Client';

const AdminSubCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [name, setName] = useState('');
    const [selectedParent, setSelectedParent] = useState('');

    const fetchData = async () => {
        const { data: catData } = await supabase.from('categories').select('*').order('name');
        setCategories(catData || []);

        const { data: subData } = await supabase
            .from('sub_categories')
            .select(`
                id,
                name,
                categories ( name )
            `)
            .order('id', { ascending: false });
        setSubCategories(subData || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- FONCTION DE SUPPRESSION ---
    const handleDelete = async (id) => {
    if (!window.confirm("Es-tu sûr ?")) return;

    // On utilise count: 'exact' pour savoir si quelque chose a été supprimé
    const { error, count } = await supabase
        .from('sub_categories')
        .delete({ count: 'exact' }) 
        .eq('id', id);

    if (error) {
        alert("Erreur : " + error.message);
    } else if (count === 0) {
        // C'est ici que vous verrez si le RLS bloque
        alert("Aucune ligne supprimée. Vérifiez vos permissions RLS sur Supabase !");
    } else {
        alert("Supprimé avec succès !");
        // Mise à jour de l'état local
        setSubCategories(prev => prev.filter(item => item.id !== id));
    }
};

    const handleAddSub = async (e) => {
        e.preventDefault();
        if (!selectedParent) return alert("Choisis une catégorie parente !");

        const { error } = await supabase
            .from('sub_categories')
            .insert([{ 
                name: name, 
                category_id: selectedParent 
            }]);

        if (!error) {
            setName('');
            fetchData();
        } else {
            alert(error.message);
        }
    };

    return (
        <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-success">Ajouter une Sous-Catégorie</h2>
            
            <form onSubmit={handleAddSub} className="row g-3 mb-5 shadow-sm p-3 bg-light rounded">
                <div className="col-md-4">
                    <label className="form-label fw-bold">Catégorie Parente</label>
                    <select 
                        className="form-select" 
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        required
                    >
                        <option value="">-- Choisir --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="col-md-6">
                    <label className="form-label fw-bold">Nom de la Sous-Catégorie</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Nettoyants, Shampooings..." 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-success w-100">Enregistrer</button>
                </div>
            </form>

            <h4>Hiérarchie Actuelle</h4>
            <table className="table table-striped mt-3 border">
                <thead className="table-dark">
                    <tr>
                        <th>Sous-Catégorie</th>
                        <th>Parent (Lien)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subCategories.map(sub => (
                        <tr key={sub.id}>
                            <td className="fw-bold">{sub.name}</td>
                            <td><span className="badge bg-info text-dark">{sub.categories?.name}</span></td>
                            <td>
                                {/* --- AJOUT DU ONCLICK ICI --- */}
                                <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(sub.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSubCategories;