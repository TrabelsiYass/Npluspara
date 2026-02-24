import { useEffect, useState } from 'react';
import {
    MdCameraAlt, MdDelete,
    MdFavorite,
    MdLocationCity,
    MdLogout,
    MdPhone,
    MdSettings,
    MdShoppingBag
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Client';
import './Profile.css';



const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); 
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]); 
    const [profile, setProfile] = useState({
        full_name: '', phone: '', address: '', city: '', 
        postal_code: '', email: '', avatar_url: ''
    });

    useEffect(() => {
        getInitialData();
    }, []);

    async function getInitialData() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setProfile(prev => ({ ...prev, email: user.email }));
            await Promise.all([getProfile(user.id), getWishlist(user.id), getOrders(user.id)]);
        }
        setLoading(false);
    }

    async function getProfile(userId) {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (data) setProfile(data);
    }

    async function getWishlist(userId) {
        const { data } = await supabase.from('wishlist').select('id, products(id, name, image_url, new_price)').eq('user_id', userId);
        if (data) setWishlist(data);
    }

    async function getOrders(userId) {
        const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        // Données fictives si vide pour le design
        setOrders(data?.length ? data : [
            { id: 'ORD-2026-A1', status: 'Livré', total: 125.500, created_at: '2026-02-10' },
            { id: 'ORD-2026-B4', status: 'En cours', total: 45.000, created_at: '2026-02-21' }
        ]);
    }

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            const { data: { user } } = await supabase.auth.getUser();
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar-${Math.random()}.${fileExt}`;

            await supabase.storage.from('avatars').upload(filePath, file);
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: publicUrl });
            await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl });
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('profiles').upsert({ id: user.id, ...profile, updated_at: new Date() });
        if (!error) alert("Profil mis à jour !");
        setLoading(false);
    };

    if (loading) return <div className="loader-container"><div className="custom-loader"></div></div>;

    return (
        <section className="profile-page bg-light-gray py-5">
            <div className="container">
                <div className="row g-4">
                    {/* --- SIDEBAR --- */}
                    <div className="col-lg-4">
                        <div className="profile-sidebar card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="sidebar-header p-4 text-center">
                                <div className="avatar-wrapper position-relative mx-auto">
                                    <img 
                                        src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=2ecc71&color=fff`} 
                                        alt="User" className="main-avatar shadow-sm"
                                    />
                                    <label className="avatar-edit-btn">
                                        {uploading ? <div className="spinner-border spinner-border-sm text-light"></div> : <MdCameraAlt />}
                                        <input type="file" hidden onChange={uploadAvatar} />
                                    </label>
                                </div>
                                <h5 className="mt-3 fw-bold mb-0 text-dark">{profile.full_name || 'Votre Nom'}</h5>
                                <span className="text-muted small">{profile.email}</span>
                            </div>

                            <div className="sidebar-menu p-3">
                                <button onClick={() => setActiveTab('profile')} className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}>
                                    <MdSettings className="icon" /> Paramètres du compte
                                </button>
                                <button onClick={() => setActiveTab('orders')} className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}>
                                    <MdShoppingBag className="icon" /> Mes Commandes
                                    <span className="count-badge ms-auto">{orders.length}</span>
                                </button>
                                <button onClick={() => setActiveTab('wishlist')} className={`menu-item ${activeTab === 'wishlist' ? 'active' : ''}`}>
                                    <MdFavorite className="icon" /> Ma Wishlist
                                    <span className="count-badge ms-auto text-danger bg-danger-subtle">{wishlist.length}</span>
                                </button>
                                <hr className="my-3 opacity-10" />
                                <button className="menu-item text-danger border-0 bg-transparent w-100">
                                    <MdLogout className="icon" /> Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="col-lg-8">
                        <div className="profile-content card border-0 shadow-sm rounded-4 p-4 p-md-5">
                            
                            {activeTab === 'profile' && (
                                <div className="tab-pane-content fade-in">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="icon-box me-3"><MdSettings size={24} /></div>
                                        <h4 className="fw-bold mb-0">Paramètres Généraux</h4>
                                    </div>
                                    <form onSubmit={handleUpdate}>
                                        <div className="row g-4">
                                            <div className="col-md-12">
                                                <label className="custom-label">Nom complet</label>
                                                <input type="text" className="custom-input" placeholder="Ex: Ahmed Ben Ali" value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="custom-label">Numéro de téléphone</label>
                                                <div className="input-with-icon">
                                                    <MdPhone className="field-icon" />
                                                    <input type="text" className="custom-input ps-5" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="custom-label">Ville</label>
                                                <div className="input-with-icon">
                                                    <MdLocationCity className="field-icon" />
                                                    <input type="text" className="custom-input ps-5" value={profile.city || ''} onChange={(e) => setProfile({...profile, city: e.target.value})} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="custom-label">Code Postal</label>
                                                <input type="text" className="custom-input" value={profile.postal_code || ''} onChange={(e) => setProfile({...profile, postal_code: e.target.value})} />
                                            </div>
                                            <div className="col-md-8">
                                                <label className="custom-label">Adresse de livraison</label>
                                                <input type="text" className="custom-input" value={profile.address || ''} onChange={(e) => setProfile({...profile, address: e.target.value})} />
                                            </div>
                                            <div className="col-12 pt-3 text-end">
                                                <button type="submit" className="btn-premium">Enregistrer les modifications</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="tab-pane-content fade-in">
                                    <h4 className="fw-bold mb-4">Suivi des commandes</h4>
                                    {orders.map((order, index) => (
                                        <div key={index} className="order-card p-3 mb-3 d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="order-icon"><MdShoppingBag /></div>
                                                <div className="ms-3">
                                                    <h6 className="fw-bold mb-0">{order.id}</h6>
                                                    <span className="text-muted x-small">{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="text-center d-none d-md-block">
                                                <span className={`status-pill ${order.status === 'Livré' ? 'delivered' : 'pending'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold text-success">{order.total.toFixed(3)} TND</div>
                                                <button className="btn-link-custom">Voir détails</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="tab-pane-content fade-in">
                                    <h4 className="fw-bold mb-4">Mes articles favoris</h4>
                                    <div className="row g-3">
                                        {wishlist.map((item) => (
                                            <div key={item.id} className="col-md-6">
                                                <div className="wishlist-item-pro shadow-sm" onClick={() => navigate(`/product/${item.products.id}`)}>
                                                    <img src={item.products.image_url} alt="" />
                                                    <div className="details">
                                                        <h6 className="text-truncate">{item.products.name}</h6>
                                                        <span className="price">{item.products.new_price.toFixed(3)} TND</span>
                                                    </div>
                                                    <button className="delete-btn" onClick={(e) => {e.stopPropagation(); /* Logic Delete */}}>
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
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