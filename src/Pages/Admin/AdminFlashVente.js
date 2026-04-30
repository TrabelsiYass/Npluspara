import { useEffect, useState } from 'react';
import { MdDelete, MdEdit, MdFlashOn,  MdStar, MdWhatshot, MdSearch, MdCheckCircle,  } from "react-icons/md";
import { supabase } from '../../Client';

const AdminExtra = () => {
    const [flashData, setFlashData] = useState([]);
    const [topData, setTopData] = useState([]);
    const [hotData, setHotData] = useState([]);

    const [allProducts, setAllProducts] = useState([]);
    const [selectedDraft, setSelectedDraft] = useState([]); // Local state before submit
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Fully mapped states to match your DB columns including stock
    const [flashForm, setFlashForm] = useState({ name: '', brand: '', description: '', old_price: '', new_price: '', image_url: '', stock: 0 });
    const [topForm, setTopForm] = useState({ name: '', brand: '', description: '', old_price: '', new_price: '', image_url: '', stock: 0 });
    
    const [editingFlashId, setEditingFlashId] = useState(null);
    const [editingTopId, setEditingTopId] = useState(null);

    const fetchData = async () => {
        const { data: flash } = await supabase.from('Flash_products').select('*').order('id', { ascending: false });
        const { data: top } = await supabase.from('top_promos').select('*').order('id', { ascending: false });
        const { data: hot } = await supabase.from('HotDeals').select(`id, product_id, products (*)`).order('id', { ascending: false });
        const { data: products } = await supabase.from('products').select('*');
        
        setFlashData(flash || []);
        setTopData(top || []);
        setHotData(hot || []);
        setAllProducts(products || []);

        if (hot) setSelectedDraft(hot.map(h => h.products));
    };

    useEffect(() => { fetchData(); }, []);

    // --- FLASH PRODUCTS LOGIC ---
    const handleFlashSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            ...flashForm, 
            old_price: flashForm.old_price ? parseFloat(flashForm.old_price).toFixed(3) : null, 
            new_price: parseFloat(flashForm.new_price).toFixed(3),
            stock: parseInt(flashForm.stock)
        };
        if (editingFlashId) {
            await supabase.from('Flash_products').update(payload).eq('id', editingFlashId);
            setEditingFlashId(null);
        } else {
            await supabase.from('Flash_products').insert([payload]);
        }
        setFlashForm({ name: '', brand: '', description: '', old_price: '', new_price: '', image_url: '', stock: 0 });
        fetchData();
    };

    // --- TOP PROMOS LOGIC (Uses 'price' and 'badge') ---
    const handleTopSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            ...topForm,
            old_price: topForm.old_price ? parseFloat(topForm.old_price).toFixed(3) : null,
            price: parseFloat(topForm.price).toFixed(3),
            stock: parseInt(topForm.stock)
        };
        if (editingTopId) {
            await supabase.from('top_promos').update(payload).eq('id', editingTopId);
            setEditingTopId(null);
        } else {
            await supabase.from('top_promos').insert([payload]);
        }
        setTopForm({ name: '', brand: '', description: '', old_price: '', new_price: '',  image_url: '', stock: 0 });
        fetchData();
    };

    // --- HOT DEALS LOGIC ---
    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleProductSelection = (product) => {
        const isSelected = selectedDraft.some(p => p.id === product.id);
        if (isSelected) {
            setSelectedDraft(selectedDraft.filter(p => p.id !== product.id));
        } else {
            if (selectedDraft.length >= 9) return alert("Maximum 9 produits !");
            setSelectedDraft([...selectedDraft, product]);
        }
    };
    const deleteItem = async (id, table) => {
                if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                    const { error } = await supabase.from(table).delete().eq('id', id);
                    if (error) {
                        alert("Erreur lors de la suppression : " + error.message);
                    } else {
                        fetchData();
                    }
                }
            };

    const handleHotDealsSubmit = async () => {
        if (selectedDraft.length < 3) return alert("Veuillez sélectionner au moins 3 produits.");

        // 1. Delete old deals
        await supabase.from('HotDeals').delete().neq('id', 0); // Clear all

        // 2. Insert new selection
        const newEntries = selectedDraft.map(p => ({ product_id: p.id }));
        const { error } = await supabase.from('HotDeals').insert(newEntries);

        if (!error) {
            alert("Hot Deals mis à jour avec succès !");
            fetchData();
        }
    };
    return (
        <div className="container py-5 text-dark">
            <div className="text-center mb-5">
                <h1 className="fw-bold text-uppercase">🚀 Administration Management</h1>
                <p className="text-muted">Gérer tous les produits et promotions</p>
                <hr className="w-25 mx-auto" />
            </div>

            {/* --- HOT DEALS --- */}
            <section className="mb-5 shadow-sm rounded-4 overflow-hidden border">
                <div className="bg-danger p-3 d-flex justify-content-between align-items-center text-white">
                    <div className="d-flex align-items-center">
                        <MdWhatshot size={32} />
                        <h3 className="ms-2 mb-0 fw-bold">Hot Deals Manager</h3>
                    </div>
                    <span className="badge bg-white text-danger fw-bold">{selectedDraft.length} / 9 sélectionnés</span>
                </div>

                <div className="p-4 bg-white">
                    <div className="row g-3">
                        <div className="col-md-8 position-relative">
                            <label className="form-label fw-bold small">RECHERCHER ET SÉLECTIONNER</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><MdSearch /></span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Cliquez pour voir les produits..." 
                                    value={searchQuery}
                                    onFocus={() => setShowDropdown(true)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {showDropdown && (
                                <div className="position-absolute w-100 shadow-lg border rounded-3 mt-1 bg-white z-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <div className="p-2 border-bottom d-flex justify-content-between bg-light">
                                        <small className="text-muted">Cliquez pour ajouter/retirer</small>
                                        <small className="text-primary fw-bold" style={{cursor:'pointer'}} onClick={() => setShowDropdown(false)}>Fermer</small>
                                    </div>
                                    {filteredProducts.map(p => {
                                        const isSelected = selectedDraft.some(item => item.id === p.id);
                                        return (
                                            <div 
                                                key={p.id} 
                                                className={`p-3 d-flex align-items-center border-bottom item-hover ${isSelected ? 'bg-light' : ''}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleProductSelection(p)}
                                            >
                                                <img src={p.image_url} width="40" height="40" className="rounded me-3" alt="" />
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold">{p.name}</div>
                                                    <small className="text-muted">{p.new_price} TND</small>
                                                </div>
                                                {isSelected && <MdCheckCircle className="text-success" size={24} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-danger w-100 fw-bold py-2 shadow-sm" onClick={handleHotDealsSubmit}>
                                ENREGISTRER LA SÉLECTION
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 table-responsive">
                        <h6 className="fw-bold text-muted text-uppercase mb-3">Aperçu de la sélection actuelle :</h6>
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr className="small"><th>Produit</th><th>Prix</th><th className="text-center">Action</th></tr>
                            </thead>
                            <tbody>
                                {selectedDraft.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={p.image_url} width="35" className="rounded me-2" alt="" />
                                                <span className="fw-bold">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-danger fw-bold">{p.new_price}</td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-link text-danger p-0" onClick={() => toggleProductSelection(p)}>Retirer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- FLASH PRODUCTS --- */}
            <section className="mb-5 shadow-sm rounded-4 overflow-hidden border">
                <div className="bg-warning p-3 d-flex align-items-center text-dark">
                    <MdFlashOn size={32} />
                    <h3 className="ms-2 mb-0 fw-bold">Meilleures Réductions</h3>
                </div>
                <div className="p-4 bg-white">
                    <form onSubmit={handleFlashSubmit} className="row g-3 mb-4 p-4 bg-light rounded-3 border">
                        <div className="col-md-4"><label className="form-label small fw-bold">NOM</label><input type="text" className="form-control" value={flashForm.name} onChange={(e) => setFlashForm({...flashForm, name: e.target.value})} required /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">MARQUE</label><input type="text" className="form-control" value={flashForm.brand} onChange={(e) => setFlashForm({...flashForm, brand: e.target.value})} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">IMAGE URL</label><input type="text" className="form-control" value={flashForm.image_url} onChange={(e) => setFlashForm({...flashForm, image_url: e.target.value})} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">DESCRIPTION</label><textarea className="form-control" rows="1" value={flashForm.description} onChange={(e) => setFlashForm({...flashForm, description: e.target.value})} /></div>
                        <div className="col-md-2"><label className="form-label small fw-bold">OLD PRICE</label><input type="number" step="0.001" className="form-control" value={flashForm.old_price} onChange={(e) => setFlashForm({...flashForm, old_price: e.target.value})} /></div>
                        <div className="col-md-2"><label className="form-label small fw-bold text-dark">NEW PRICE</label><input type="number" step="0.001" className="form-control" value={flashForm.new_price} onChange={(e) => setFlashForm({...flashForm, new_price: e.target.value})} required /></div>
                        <div className="col-md-2"><label className="form-label small fw-bold">STOCK</label><input type="number" className="form-control" value={flashForm.stock} onChange={(e) => setFlashForm({...flashForm, stock: e.target.value})} required /></div>
                        <div className="col-md-2 d-flex align-items-end"><button type="submit" className="btn btn-warning w-100 fw-bold">{editingFlashId ? "Modifier" : "Ajouter"}</button></div>
                    </form>
                    <TableDisplay 
                        data={flashData} 
                        color="warning" 
                        onDelete={(id) => deleteItem(id, 'Flash_products')} 
                        onEdit={(item) => {
                            setEditingFlashId(item.id); 
                            setFlashForm({
                                name: item.name || '', brand: item.brand || '', description: item.description || '', 
                                old_price: item.old_price || '', price: item.new_price || '', image_url: item.image_url || '', stock: item.stock || 0
                            });
                        }} 
                    />
                </div>
            </section>

            {/* --- TOP PROMOS --- */}
            <section className="mb-5 shadow-sm rounded-4 overflow-hidden border">
                <div className="bg-primary p-3 d-flex align-items-center text-white">
                    <MdStar size={32} />
                    <h3 className="ms-2 mb-0 fw-bold">Vente Flash</h3>
                </div>
                <div className="p-4 bg-white">
                    <form onSubmit={handleTopSubmit} className="row g-3 mb-4 p-4 bg-light rounded-3 border">
                        <div className="col-md-3"><label className="form-label small fw-bold">NOM</label><input type="text" className="form-control" value={topForm.name} onChange={(e) => setTopForm({...topForm, name: e.target.value})} required /></div>
                        <div className="col-md-3"><label className="form-label small fw-bold">MARQUE</label><input type="text" className="form-control" value={topForm.brand} onChange={(e) => setTopForm({...topForm, brand: e.target.value})} /></div>
                        <div className="col-md-3"><label className="form-label small fw-bold">IMAGE URL</label><input type="text" className="form-control" value={topForm.image_url} onChange={(e) => setTopForm({...topForm, image_url: e.target.value})} /></div>
                        <div className="col-md-4"><label className="form-label small fw-bold">DESCRIPTION</label><textarea className="form-control" rows="1" value={topForm.description} onChange={(e) => setTopForm({...topForm, description: e.target.value})} /></div>
                        <div className="col-md-2"><label className="form-label small fw-bold">OLD PRICE</label><input type="number" step="0.001" className="form-control" value={topForm.old_price} onChange={(e) => setTopForm({...topForm, old_price: e.target.value})} /></div>
                        <div className="col-md-2"><label className="form-label small fw-bold text-primary">PRICE</label><input type="number" step="0.001" className="form-control" value={topForm.new_price} onChange={(e) => setTopForm({...topForm, price: e.target.value})} required /></div>
                        <div className="col-md-2"><label className="form-label small fw-bold">STOCK</label><input type="number" className="form-control" value={topForm.stock} onChange={(e) => setTopForm({...topForm, stock: e.target.value})} required /></div>
                        <div className="col-md-2 d-flex align-items-end"><button type="submit" className="btn btn-primary w-100 fw-bold">{editingTopId ? "Modifier" : "Ajouter"}</button></div>
                    </form>
                    <TableDisplay 
                        data={topData} 
                        color="primary" 
                        isTop={true} 
                        onDelete={(id) => deleteItem(id, 'top_promos')} 
                        onEdit={(item) => {
                            setEditingTopId(item.id); 
                            setTopForm({
                                name: item.name || '', brand: item.brand || '', description: item.description || '', 
                                old_price: item.old_price || '', new_price: item.new_price || '',  image_url: item.image_url || '', stock: item.stock || 0
                            });
                        }} 
                    />
                </div>
            </section>
        </div>
    );
};

const TableDisplay = ({ data, onDelete, onEdit, color, isTop }) => (
    <div className="table-responsive text-dark">
        <table className="table align-middle">
            <thead className="table-light">
                <tr className="text-uppercase small fw-bold text-muted">
                    <th>Aperçu</th>
                    <th>Infos Produit</th>
                    <th>Stock / Desc</th>
                    <th>Prix (TND)</th>
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map(p => (
                    <tr key={p.id}>
                        <td><img src={p.image_url} className="rounded shadow-sm border" width="50" height="50" style={{objectFit: 'cover'}} alt="" /></td>
                        <td>
                            <div className="fw-bold">{p.name}</div>
                            <small className="text-muted">{p.brand}</small>
                        </td>
                        <td>
                            <div className="mb-1">
                                <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'} me-1`}>Stock: {p.stock}</span>
                                {p.badge && <span className="badge bg-info text-dark">{p.badge}</span>}
                            </div>
                            <small className="text-muted d-block text-truncate" style={{maxWidth: '150px'}}>{p.description}</small>
                        </td>
                        <td>
                            <div className="text-muted text-decoration-line-through small" style={{fontSize: '0.75rem'}}>
                                {p.old_price ? Number(p.old_price).toFixed(3) : '---'}
                            </div>
                            <div className={`fw-bold text-${color}`}>
                                {isTop ? Number(p.price).toFixed(3) : Number(p.new_price).toFixed(3)}
                            </div>
                        </td>
                        <td className="text-center">
                            <div className="btn-group shadow-sm">
                                <button onClick={() => onEdit(p)} className="btn btn-sm btn-outline-primary"><MdEdit /></button>
                                <button onClick={() => onDelete(p.id)} className="btn btn-sm btn-outline-danger"><MdDelete /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminExtra;