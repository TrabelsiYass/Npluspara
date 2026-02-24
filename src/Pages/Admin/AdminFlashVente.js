import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit, MdFlashOn, MdSave, MdStar, MdWhatshot } from "react-icons/md";
import { supabase } from '../../Client';

const AdminExtra = () => {
    const [flashData, setFlashData] = useState([]);
    const [topData, setTopData] = useState([]);
    const [hotData, setHotData] = useState([]);

    // États des formulaires
    const [flashForm, setFlashForm] = useState({ name: '', brand: '', old_price: '', new_price: '', discount_label: '', badge: '', img_url: '' });
    const [topForm, setTopForm] = useState({ name: '', brand: '', old_price: '', new_price: '', discount_label: '', badge: '', img_url: '' });
    const [hotForm, setHotForm] = useState({ name: '', brand: '', old_price: '', new_price: '', image_url: '' });
    
    const [editingFlashId, setEditingFlashId] = useState(null);
    const [editingTopId, setEditingTopId] = useState(null);
    const [editingHotId, setEditingHotId] = useState(null);

    const fetchData = async () => {
        const { data: flash } = await supabase.from('Flash_products').select('*').order('id', { ascending: false });
        const { data: top } = await supabase.from('top_promos').select('*').order('id', { ascending: false });
        const { data: hot } = await supabase.from('HotDeals').select('*').order('id', { ascending: false });
        
        setFlashData(flash || []);
        setTopData(top || []);
        setHotData(hot || []);
    };

    useEffect(() => { fetchData(); }, []);

    // --- LOGIQUE FLASH PRODUCTS ---
    const handleFlashSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            ...flashForm, 
            old_price: flashForm.old_price ? parseFloat(flashForm.old_price).toFixed(3) : null, 
            new_price: parseFloat(flashForm.new_price).toFixed(3) 
        };
        if (editingFlashId) {
            await supabase.from('Flash_products').update(payload).eq('id', editingFlashId);
            setEditingFlashId(null);
        } else {
            await supabase.from('Flash_products').insert([payload]);
        }
        setFlashForm({ name: '', brand: '', old_price: '', new_price: '', discount_label: '', badge: '', img_url: '' });
        fetchData();
    };

    // --- LOGIQUE TOP PROMOS (Colonne 'price') ---
    const handleTopSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            name: topForm.name,
            brand: topForm.brand,
            img_url: topForm.img_url,
            old_price: topForm.old_price ? parseFloat(topForm.old_price).toFixed(3) : null,
            price: parseFloat(topForm.new_price).toFixed(3),
            discount_label: topForm.discount_label,
            badge: topForm.badge
        };
        if (editingTopId) {
            await supabase.from('top_promos').update(payload).eq('id', editingTopId);
            setEditingTopId(null);
        } else {
            await supabase.from('top_promos').insert([payload]);
        }
        setTopForm({ name: '', brand: '', old_price: '', new_price: '', discount_label: '', badge: '', img_url: '' });
        fetchData();
    };

    // --- LOGIQUE HOT DEALS ---
    const handleHotSubmit = async (e) => {
        e.preventDefault();
        const payload = { 
            name: hotForm.name,
            brand: hotForm.brand,
            image_url: hotForm.image_url,
            old_price: hotForm.old_price ? parseFloat(hotForm.old_price).toFixed(3) : null,
            new_price: parseFloat(hotForm.new_price).toFixed(3),
            is_active: true
        };
        if (editingHotId) {
            await supabase.from('HotDeals').update(payload).eq('id', editingHotId);
            setEditingHotId(null);
        } else {
            await supabase.from('HotDeals').insert([payload]);
        }
        setHotForm({ name: '', brand: '', old_price: '', new_price: '', image_url: '' });
        fetchData();
    };

    const deleteItem = async (id, table) => {
        if (window.confirm("Supprimer cet article ?")) {
            await supabase.from(table).delete().eq('id', id);
            fetchData();
        }
    };

    return (
        <div className="container py-5 text-dark">
            <div className="text-center mb-5">
                <h1 className="fw-bold text-uppercase">🚀 Dashboard Extras</h1>
                <hr className="w-25 mx-auto" />
            </div>

            {/* --- SECTION 1: HOT DEALS (CAROUSEL) --- */}
            <section className="mb-5 shadow-sm rounded-4 overflow-hidden border">
                <div className="bg-danger p-3 d-flex align-items-center text-white">
                    <MdWhatshot size={32} />
                    <h3 className="ms-2 mb-0 fw-bold">Hot Deals (Section Carousel)</h3>
                </div>
                <div className="p-4 bg-white">
                    <form onSubmit={handleHotSubmit} className="row g-3 mb-4 p-4 bg-light rounded-3 border">
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-uppercase text-danger">Nom du Produit</label>
                            <input type="text" className="form-control" value={hotForm.name} onChange={(e) => setHotForm({...hotForm, name: e.target.value})} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small text-uppercase">Marque</label>
                            <input type="text" className="form-control" value={hotForm.brand} onChange={(e) => setHotForm({...hotForm, brand: e.target.value})} />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label fw-bold small text-uppercase">URL Image</label>
                            <input type="text" className="form-control" value={hotForm.image_url} onChange={(e) => setHotForm({...hotForm, image_url: e.target.value})} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small text-uppercase">Prix Normal</label>
                            <input type="number" step="0.001" className="form-control" value={hotForm.old_price} onChange={(e) => setHotForm({...hotForm, old_price: e.target.value})} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small text-uppercase text-danger">Prix Promo</label>
                            <input type="number" step="0.001" className="form-control" value={hotForm.new_price} onChange={(e) => setHotForm({...hotForm, new_price: e.target.value})} required />
                        </div>
                        <div className="col-md-6 d-flex align-items-end gap-2">
                            <button type="submit" className="btn btn-danger fw-bold flex-grow-1">
                                {editingHotId ? <><MdSave /> Mettre à jour</> : <><MdAdd /> Ajouter au Carousel</>}
                            </button>
                        </div>
                    </form>
                    <TableDisplay data={hotData} color="danger" isHot={true} onDelete={(id) => deleteItem(id, 'HotDeals')} onEdit={(item) => {setEditingHotId(item.id); setHotForm(item);}} />
                </div>
            </section>

            {/* --- SECTION 2: FLASH PRODUCTS --- */}
            <section className="mb-5 shadow-sm rounded-4 overflow-hidden border">
                <div className="bg-warning p-3 d-flex align-items-center text-dark">
                    <MdFlashOn size={32} />
                    <h3 className="ms-2 mb-0 fw-bold">Flash Products</h3>
                </div>
                <div className="p-4 bg-white">
                    <form onSubmit={handleFlashSubmit} className="row g-3 mb-4 p-4 bg-light rounded-3 border">
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-uppercase">Nom</label>
                            <input type="text" className="form-control" value={flashForm.name} onChange={(e) => setFlashForm({...flashForm, name: e.target.value})} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-uppercase">URL Image</label>
                            <input type="text" className="form-control" value={flashForm.img_url} onChange={(e) => setFlashForm({...flashForm, img_url: e.target.value})} />
                        </div>
                        <div className="col-md-2"><label className="form-label fw-bold small text-uppercase">Old Price</label><input type="number" step="0.001" className="form-control" value={flashForm.old_price} onChange={(e) => setFlashForm({...flashForm, old_price: e.target.value})} /></div>
                        <div className="col-md-2"><label className="form-label fw-bold small text-uppercase text-success">New Price</label><input type="number" step="0.001" className="form-control" value={flashForm.new_price} onChange={(e) => setFlashForm({...flashForm, new_price: e.target.value})} required /></div>
                        <div className="col-md-12 text-end mt-3">
                            <button type="submit" className="btn btn-warning fw-bold px-5">{editingFlashId ? "Mettre à jour" : "Ajouter Flash"}</button>
                        </div>
                    </form>
                    <TableDisplay data={flashData} color="warning" onDelete={(id) => deleteItem(id, 'Flash_products')} onEdit={(item) => {setEditingFlashId(item.id); setFlashForm(item);}} />
                </div>
            </section>

            {/* --- SECTION 3: TOP PROMOS --- */}
            <section className="mb-5 shadow-sm rounded-4 overflow-hidden border">
                <div className="bg-primary p-3 d-flex align-items-center text-white">
                    <MdStar size={32} />
                    <h3 className="ms-2 mb-0 fw-bold">Top Promotions</h3>
                </div>
                <div className="p-4 bg-white">
                    <form onSubmit={handleTopSubmit} className="row g-3 mb-4 p-4 bg-light rounded-3 border">
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-uppercase">Nom</label>
                            <input type="text" className="form-control" value={topForm.name} onChange={(e) => setTopForm({...topForm, name: e.target.value})} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-uppercase">URL Image</label>
                            <input type="text" className="form-control" value={topForm.img_url} onChange={(e) => setTopForm({...topForm, img_url: e.target.value})} />
                        </div>
                        <div className="col-md-2"><label className="form-label fw-bold small text-uppercase text-primary">Prix</label><input type="number" step="0.001" className="form-control" value={topForm.new_price} onChange={(e) => setTopForm({...topForm, new_price: e.target.value})} required /></div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button type="submit" className="btn btn-primary fw-bold w-100">{editingTopId ? "Mettre à jour" : "Ajouter Top"}</button>
                        </div>
                    </form>
                    <TableDisplay data={topData} color="primary" isTop={true} onDelete={(id) => deleteItem(id, 'top_promos')} onEdit={(item) => {setEditingTopId(item.id); setTopForm({...item, new_price: item.price});}} />
                </div>
            </section>
        </div>
    );
};

// COMPOSANT TABLEAU UNIQUE ET ROBUSTE
const TableDisplay = ({ data, onDelete, onEdit, color, isTop, isHot }) => (
    <div className="table-responsive text-dark">
        <table className="table align-middle border-top">
            <thead className="table-light">
                <tr className="text-uppercase small fw-bold text-muted">
                    <th>Aperçu</th>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map(p => (
                    <tr key={p.id}>
                        <td><img src={isHot ? p.image_url : p.img_url} className="rounded shadow-sm border" width="55" height="55" style={{objectFit: 'cover'}} alt="" /></td>
                        <td>
                            <div className="fw-bold">{p.name}</div>
                            <small className="text-muted">{p.brand}</small>
                        </td>
                        <td>
                            <div className="text-muted text-decoration-line-through small" style={{fontSize: '0.8rem'}}>
                                {p.old_price ? Number(p.old_price).toFixed(3) : '---'}
                            </div>
                            <div className={`fw-bold text-${color}`}>
                                {isTop ? Number(p.price).toFixed(3) : Number(p.new_price).toFixed(3)} TND
                            </div>
                        </td>
                        <td className="text-center">
                            <div className="btn-group">
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