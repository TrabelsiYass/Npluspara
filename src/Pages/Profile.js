import { useEffect, useState, useCallback } from 'react';
import {
    MdCameraAlt, MdFavorite, MdLogout,
    MdShoppingBag, MdSettings, MdVerifiedUser, 
    MdLocalShipping, MdShield, MdDeleteOutline, MdVisibility
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Client';
import './Profile.css';

// Simple Modal Component for Order Details
const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card border-0 p-4 shadow" onClick={e => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Détails de la Commande #{order.id.toString().slice(-6)}</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <div className="order-info mb-3">
                    <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Statut:</strong> <span className="badge bg-primary">{order.status}</span></p>
                    <p><strong>Adresse:</strong> {order.address}, {order.city}</p>
                    <p><strong>Paiement:</strong> {order.payment_method}</p>
                    <p><strong>Contact:</strong> {order.phone}</p>
                </div>
                <hr />
                <div className="total-section text-end">
                    <h5 className="fw-bold text-success">Total: {parseFloat(order.total_amount).toFixed(3)} TND</h5>
                </div>
                <button className="btn btn-dark w-100 mt-3" onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [stats, setStats] = useState({ totalSpent: 0, orderCount: 0, wishCount: 0 });
    const [profile, setProfile] = useState({
        full_name: '', phone: '', address: '', city: '',
        postal_code: '', email: '', avatar_url: '',
        bio: '', birthdate: ''
    });

    // Array of colors for the "Commande i" header
    const headerColors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFB833', '#33FFF3'];

    // --- DATA FETCHING ---
    const getProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        
        if (data) setProfile(prev => ({ ...prev, ...data }));
        if (error) console.error("Error fetching profile:", error.message);
    };

    const getWishlist = async (userId) => {
        const { data } = await supabase
            .from('wishlist')
            .select('id, product_id, products(id, name, image_url, new_price)')
            .eq('user_id', userId);
        
        if (data) {
            setWishlist(data);
            setStats(prev => ({ ...prev, wishCount: data.length }));
        }
    };

    const getOrders = async (userId) => {
        const { data, error } = await supabase
            .from('commandes')
            .select('*')
            .eq('profile_id', userId)
            .order('id', { ascending: false });
    
        if (data) {
            setOrders(data);
            const total = data.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0);
            setStats(prev => ({ ...prev, orderCount: data.length, totalSpent: total }));
        }
    };

    const getInitialData = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            setProfile(prev => ({ ...prev, email: user.email }));
            await Promise.all([
                getProfile(user.id), 
                getWishlist(user.id), 
                getOrders(user.id)
            ]);
        } else {
            navigate('/login');
        }
        setLoading(false);
    }, [navigate]);

    useEffect(() => {
        getInitialData();
    }, [getInitialData]);

    // --- DELETE ACTIONS ---
    const deleteOrder = async (orderId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
        
        const { error } = await supabase.from('commandes').delete().eq('id', orderId);
        if (error) alert(error.message);
        else {
            setOrders(orders.filter(o => o.id !== orderId));
            alert("Commande supprimée.");
        }
    };

    const deleteWishlistItem = async (wishId) => {
        if (!window.confirm("Supprimer des favoris ?")) return;
        const { error } = await supabase.from('wishlist').delete().eq('id', wishId);
        if (error) alert(error.message);
        else {
            setWishlist(wishlist.filter(w => w.id !== wishId));
            setStats(prev => ({ ...prev, wishCount: prev.wishCount - 1 }));
        }
    };

    // --- LOGOUT & UPDATES ---
    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        navigate('/login');
    }, [navigate]);

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            const { data: { user } } = await supabase.auth.getUser();
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date() });
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            alert("Photo de profil mise à jour !");
        } catch (error) {
            alert("Erreur lors de l'envoi");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase.from('profiles').upsert({ 
                id: user.id, 
                full_name: profile.full_name,
                phone: profile.phone,
                address: profile.address,
                city: profile.city,
                postal_code: profile.postal_code,
                email: profile.email,
                updated_at: new Date() 
            });
            if (error) throw error;
            alert("Profil enregistré !");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container"><div className="custom-loader"></div></div>;

    return (
        <section className="profile-dashboard py-5">
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            
            <div className="container">
                <div className="dashboard-header mb-4 d-flex align-items-center justify-content-between">
                    <div>
                        <h2 className="fw-bold mb-1">Tableau de bord</h2>
                        <p className="text-muted">Gérez vos informations et suivez vos activités.</p>
                    </div>
                    <div className="status-badge d-none d-md-flex align-items-center">
                        <MdShield className="me-2 text-success" /> Compte Vérifié
                    </div>
                </div>

                <div className="row g-4">
                    {/* LEFT SIDEBAR */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="p-4 text-center border-bottom">
                                <div className="avatar-container mb-3">
                                    <img 
                                        src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=2ecc71&color=fff`} 
                                        className="dashboard-avatar"
                                        alt="avatar"
                                    />
                                    <label className="avatar-upload-label">
                                        {uploading ? <span className="spinner-border spinner-border-sm"></span> : <MdCameraAlt />}
                                        <input type="file" hidden onChange={uploadAvatar} disabled={uploading} />
                                    </label>
                                </div>
                                <h5 className="fw-bold mb-1">{profile.full_name || 'Utilisateur'}</h5>
                                <p className="text-muted small mb-3">{profile.email}</p>
                                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">Client Fidèle</span>
                            </div>

                            <div className="p-3">
                                <nav className="dashboard-nav">
                                    <button onClick={() => setActiveTab('profile')} className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}>
                                        <MdSettings className="icon" /> Paramètres
                                    </button>
                                    <button onClick={() => setActiveTab('orders')} className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}>
                                        <MdShoppingBag className="icon" /> Commandes
                                        <span className="ms-auto badge rounded-pill bg-light text-dark">{stats.orderCount}</span>
                                    </button>
                                    <button onClick={() => setActiveTab('wishlist')} className={`nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}>
                                        <MdFavorite className="icon" /> Favoris
                                        <span className="ms-auto badge rounded-pill bg-danger text-white">{stats.wishCount}</span>
                                    </button>
                                    <hr className="my-3 opacity-5" />
                                    <button onClick={handleLogout} className="nav-btn text-danger">
                                        <MdLogout className="icon" /> Déconnexion
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="col-lg-8">
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="stat-card p-3 shadow-sm rounded-4 bg-white h-100 border-0">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="stat-icon bg-primary-subtle text-primary"><MdShoppingBag /></div>
                                        <span className="ms-2 text-muted small fw-bold">Dépenses</span>
                                    </div>
                                    <h4 className="fw-bold mb-0">{stats.totalSpent.toFixed(3)} TND</h4>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="stat-card p-3 shadow-sm rounded-4 bg-white h-100 border-0">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="stat-icon bg-success-subtle text-success"><MdLocalShipping /></div>
                                        <span className="ms-2 text-muted small fw-bold">Commandes</span>
                                    </div>
                                    <h4 className="fw-bold mb-0">{stats.orderCount}</h4>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="stat-card p-3 shadow-sm rounded-4 bg-white h-100 border-0">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="stat-icon bg-danger-subtle text-danger"><MdFavorite /></div>
                                        <span className="ms-2 text-muted small fw-bold">Favoris</span>
                                    </div>
                                    <h4 className="fw-bold mb-0">{stats.wishCount}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            {activeTab === 'profile' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-4 d-flex align-items-center">
                                        <MdVerifiedUser className="text-primary me-2" /> Informations Personnelles
                                    </h5>
                                    <form onSubmit={handleUpdate} className="row g-4">
                                        <div className="col-md-6">
                                            <div className="form-group-premium">
                                                <label>Nom Complet</label>
                                                <input type="text" value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group-premium">
                                                <label>Email</label>
                                                <input type="text" value={profile.email || ''} readOnly className="bg-light" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group-premium">
                                                <label>Téléphone</label>
                                                <input type="text" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group-premium">
                                                <label>Adresse de livraison</label>
                                                <input type="text" value={profile.address || ''} onChange={(e) => setProfile({...profile, address: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group-premium">
                                                <label>Ville</label>
                                                <input type="text" value={profile.city || ''} onChange={(e) => setProfile({...profile, city: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group-premium">
                                                <label>Code Postal</label>
                                                <input type="text" value={profile.postal_code || ''} onChange={(e) => setProfile({...profile, postal_code: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-12 text-end">
                                            <button type="submit" className="btn-dashboard-save">Mettre à jour</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-4">Historique des Commandes</h5>
                                    {orders.length > 0 ? orders.map((order, index) => (
                                        <div key={order.id} className="modern-order-item mb-3 p-3 border rounded-3 shadow-sm d-flex justify-content-between align-items-center">
                                            <div onClick={() => setSelectedOrder(order)} style={{cursor: 'pointer', flexGrow: 1}}>
                                                <span className="fw-bold" style={{ color: headerColors[index % headerColors.length] }}>
                                                    Commande {index + 1}
                                                </span>
                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                    <span className="small text-muted">{new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span className={`badge ${order.status === 'Livré' ? 'bg-success' : 'bg-warning'} rounded-pill`}>{order.status}</span>
                                                </div>
                                                <span className="fw-bold d-block mt-1">{parseFloat(order.total_amount).toFixed(3)} TND</span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-light btn-sm text-primary" title="Voir détails" onClick={() => setSelectedOrder(order)}>
                                                    <MdVisibility size={20} />
                                                </button>
                                                <button className="btn btn-light btn-sm text-danger" title="Supprimer" onClick={() => deleteOrder(order.id)}>
                                                    <MdDeleteOutline size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : <p className="text-center text-muted py-4">Aucune commande pour le moment.</p>}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="fade-in">
                                    <h5 className="fw-bold mb-4">Mes Favoris</h5>
                                    <div className="row g-3">
                                        {wishlist.length > 0 ? wishlist.map((item) => (
                                            <div key={item.id} className="col-md-12">
                                                <div className="wishlist-item-pro shadow-sm p-3 bg-light rounded-3 d-flex align-items-center">
                                                    <img src={item.products.image_url} alt="" style={{width: '60px', height: '60px', objectFit: 'cover'}} className="rounded-2" />
                                                    <div className="ms-3 flex-grow-1" onClick={() => navigate(`/product/${item.products.id}`)} style={{cursor: 'pointer'}}>
                                                        <h6 className="mb-0 fw-bold">{item.products.name}</h6>
                                                        <span className="text-success fw-bold">{item.products.new_price.toFixed(3)} TND</span>
                                                    </div>
                                                    <button className="btn btn-link text-danger p-0" onClick={() => deleteWishlistItem(item.id)}>
                                                        <MdDeleteOutline size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        )) : <p className="text-center text-muted py-4">Votre liste est vide.</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;