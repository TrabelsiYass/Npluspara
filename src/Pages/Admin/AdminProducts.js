import { useEffect, useState } from 'react';
import {
    MdAddCircleOutline,
    MdDelete,
    MdEdit,
    MdImage,
    MdLink,
    MdSearch
} from 'react-icons/md';
import { supabase } from '../../Client';

const ProductManager = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // États pour le filtrage
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [filterSub, setFilterSub] = useState('');

    // État du formulaire - Utilise 'name' et 'image_url' (identique à ta DB)
    const [formData, setFormData] = useState({
        name: '', 
        brand: '', 
        description: '', 
        new_price: '', 
        old_price: '', 
        stock: '', 
        cat_id: '', 
        sous_cat_id: '', 
        image_url: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, [filterCat, filterSub, searchTerm]);

    const fetchInitialData = async () => {
        const { data: catData } = await supabase.from('categories').select('*');
        setCategories(catData || []);

        let query = supabase.from('products').select('*');
        if (filterCat) query = query.eq('cat_id', filterCat);
        if (filterSub) query = query.eq('sous_cat_id', filterSub);
        
        // Correction ici : Recherche sur 'name'
        if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
        
        const { data: prodData } = await query.order('id', { ascending: false }).limit(20);
        setProducts(prodData || []);
    };

    const handleCategoryChange = async (catId, isFilter = false) => {

        if (isFilter) {
            setFilterCat(catId);
            setFilterSub('');
        } else {
            setFormData(prev => ({
                ...prev,
                cat_id: catId,
                sous_cat_id: ''   // reset sous-cat when category changes
            }));
        }
    
        if (!catId) {
            setSubCategories([]);
            return;
        }
    
        const { data } = await supabase
            .from('sub_categories')
            .select('*')
            .eq('category_id', parseInt(catId));
    
        setSubCategories(data || []);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: formData.name,
            brand: formData.brand || null,
            description: formData.description || null,
            new_price: parseFloat(formData.new_price) || 0,
            old_price: formData.old_price ? parseFloat(formData.old_price) : null,
            stock: parseInt(formData.stock) || 0,
            cat_id: formData.cat_id ? Number(formData.cat_id) : null,
            sous_cat_id: formData.sous_cat_id ? Number(formData.sous_cat_id) : null,
            image_url: formData.image_url || null
        };

        try {
            const { error } = isEditing 
                ? await supabase.from('products').update(payload).eq('id', editId)
                : await supabase.from('products').insert([payload]);

            if (error) throw error;

            alert(isEditing ? "Produit mis à jour !" : "Produit ajouté !");
            resetForm();
            fetchInitialData();
        } catch (err) {
            alert("Erreur base de données : " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = async (product) => {
        setIsEditing(true);
        setEditId(product.id);
    
        // 🔥 Load subcategories before setting form
        if (product.cat_id) {
            const { data } = await supabase
                .from('sub_categories')
                .select('*')
                .eq('category_id', parseInt(product.cat_id));
    
            setSubCategories(data || []);
        }
    
        setFormData({
            name: product.name || '',
            brand: product.brand || '',
            description: product.description || '',
            new_price: product.new_price || '',
            old_price: product.old_price || '',
            stock: product.stock || '',
            // 👇 IMPORTANT: force string for select
            cat_id: product.cat_id ? String(product.cat_id) : '',
            sous_cat_id: product.sous_cat_id ? String(product.sous_cat_id) : '',
            image_url: product.image_url || ''
        });
    
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ name: '', brand: '', description: '', new_price: '', old_price: '', stock: '', cat_id: '', sous_cat_id: '', image_url: '' });
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="row g-4">
                
                {/* --- SECTION FORMULAIRE --- */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className={`p-4 d-flex align-items-center justify-content-between ${isEditing ? 'bg-warning text-dark' : 'bg-dark text-white'}`}>
                            <h4 className="fw-bold mb-0 d-flex align-items-center">
                                {isEditing ? <MdEdit className="me-2"/> : <MdAddCircleOutline className="me-2"/>}
                                {isEditing ? `Modifier : ${formData.name}` : 'Nouveau Produit'}
                            </h4>
                            {isEditing && (
                                <button className="btn btn-sm btn-light rounded-pill fw-bold" onClick={resetForm}>Annuler</button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 bg-white">
                            <div className="row g-3">
                                {/* Aperçu Image */}
                                <div className="col-12 text-center mb-3">
                                    <div className="border rounded-4 p-2 bg-light d-inline-block" style={{ width: '180px', height: '180px' }}>
                                        {formData.image_url ? (
                                            <img src={formData.image_url} className="rounded-3 w-100 h-100" style={{ objectFit: 'cover' }} alt="Preview" />
                                        ) : (
                                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                                                <MdImage size={40} className="opacity-25" />
                                                <small>Aucun aperçu</small>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label fw-bold small">Nom du produit</label>
                                    <input type="text" className="form-control bg-light border-0 shadow-none" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small">Marque</label>
                                    <input type="text" className="form-control bg-light border-0 shadow-none" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold small"><MdLink className="me-1"/> URL de l'image</label>
                                    <input type="text" className="form-control bg-light border-0 shadow-none" placeholder="https://..." required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small">Catégorie</label>
                                    <select className="form-select bg-light border-0 shadow-none" required value={formData.cat_id} onChange={e => handleCategoryChange(e.target.value)}>
                                        <option value="">Sélectionner...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small">Sous-Catégorie</label>
                                    <select className="form-select bg-light border-0 shadow-none" value={formData.sous_cat_id} onChange={e => setFormData({...formData, sous_cat_id: e.target.value})}>
                                        <option value="">Aucune</option>
                                        {subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold small text-success">Prix (TND)</label>
                                    <input type="number" step="0.001" className="form-control bg-light border-0 shadow-none fw-bold" required value={formData.new_price} onChange={e => setFormData({...formData, new_price: e.target.value})} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small text-muted">Ancien Prix</label>
                                    <input type="number" step="0.001" className="form-control bg-light border-0 shadow-none" value={formData.old_price} onChange={e => setFormData({...formData, old_price: e.target.value})} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small">Stock</label>
                                    <input type="number" className="form-control bg-light border-0 shadow-none" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                                </div>

                                <div className="col-12 mt-4">
                                    <button type="submit" disabled={loading} className={`btn w-100 py-3 rounded-4 shadow fw-bold ${isEditing ? 'btn-warning' : 'btn-success'}`}>
                                        {loading ? 'Action en cours...' : isEditing ? 'METTRE À JOUR' : 'AJOUTER AU CATALOGUE'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- SECTION LISTE --- */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
                        <div className="input-group bg-light rounded-pill px-3">
                            <span className="input-group-text bg-transparent border-0"><MdSearch /></span>
                            <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Rechercher..." onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }} className="custom-scrollbar">
                        {products.map(p => (
                            <div key={p.id} className="card border-0 shadow-sm rounded-4 mb-2 bg-white overflow-hidden">
                                <div className="p-3 d-flex align-items-center">
                                    <img src={p.image_url} className="rounded-3 border" style={{ width: '60px', height: '60px', objectFit: 'cover' }} alt={p.name} 
                                         onError={(e) => e.target.src = "https://via.placeholder.com/60?text=No+Img"} />
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-0 fw-bold">{p.name}</h6>
                                        <small className="text-success fw-bold">{parseFloat(p.new_price).toFixed(3)} TND</small>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Stock: {p.stock} | ID: #{p.id}</div>
                                    </div>
                                    <div className="d-flex gap-1">
                                        <button className="btn btn-sm btn-light text-warning" onClick={() => startEdit(p)}><MdEdit/></button>
                                        <button className="btn btn-sm btn-light text-danger" onClick={async () => { if(window.confirm('Supprimer ?')) { await supabase.from('products').delete().eq('id', p.id); fetchInitialData(); } }}><MdDelete/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;