import React, { useEffect, useState } from 'react';
import { 
    HiOutlineTruck, 
    HiOutlineCash,
    HiOutlineTrash, 
    HiOutlineEye,
    HiOutlineChatAlt2
} from "react-icons/hi";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    IconButton,
    CircularProgress,
    Button
} from '@mui/material';
import { supabase } from '../../Client';
import './Commandes.css';

const Commandes = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [reclamations, setReclamations] = useState([]);
    const [filter, setFilter] = useState('ALL');
    
    // States for Order Items Modal
    const [open, setOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    // --- NEW: States for Reclamation Details Modal ---
    const [recOpen, setRecOpen] = useState(false);
    const [selectedRec, setSelectedRec] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: orderData, error: orderError } = await supabase
                .from('commandes')
                .select('*')
                .order('created_at', { ascending: false });
            if (orderError) throw orderError;
            setOrders(orderData || []);

            const { data: recData, error: recError } = await supabase
                .from('reclamations')
                .select('*')
                .order('created_at', { ascending: false });
            if (recError) throw recError;
            setReclamations(recData || []);

        } catch (err) {
            console.error("Erreur chargement données:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleViewDetails = async (orderId) => {
        setOpen(true);
        setModalLoading(true);
        try {
            const { data, error } = await supabase
                .from('commande_items')
                .select('*')
                .eq('commande_id', orderId);
            if (error) throw error;
            setSelectedItems(data || []);
        } catch (err) {
            console.error("Erreur détails:", err.message);
        } finally {
            setModalLoading(false);
        }
    };

    // --- NEW: Handle opening full message details ---
    const handleViewRec = (rec) => {
        setSelectedRec(rec);
        setRecOpen(true);
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('commandes')
                .update({ status: newStatus })
                .eq('id', orderId);
            if (error) throw error;
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            alert("Erreur lors de la mise à jour: " + err.message);
        }
    };

    const deleteOrder = async (orderId) => {
        if (window.confirm("Supprimer cette commande définitivement ?")) {
            try {
                const { error } = await supabase.from('commandes').delete().eq('id', orderId);
                if (error) throw error;
                setOrders(orders.filter(order => order.id !== orderId));
            } catch (err) {
                alert("Erreur lors de la suppression: " + err.message);
            }
        }
    };

    const deleteReclamation = async (id) => {
        if (window.confirm("Supprimer ce message ?")) {
            try {
                const { error } = await supabase.from('reclamations').delete().eq('id', id);
                if (error) throw error;
                setReclamations(reclamations.filter(r => r.id !== id));
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    if (loading) return <div className="p-5 text-center text-primary">Chargement...</div>;

    return (
        <div className="p-4 bg-light min-vh-100">
            {/* ORDERS SECTION */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold m-0 text-dark">Gestion des Commandes</h2>
                    <p className="text-muted small">Suivez et gérez les ventes de NPLUSPARA</p>
                </div>
                <div className="d-flex gap-2">
                    <select className="form-select border-0 shadow-sm rounded-3" onChange={(e) => setFilter(e.target.value)}>
                        <option value="ALL">Tous les statuts</option>
                        <option value="PENDING">En attente</option>
                        <option value="PAID">Payé</option>
                        <option value="SHIPPED">Expédié</option>
                        <option value="CANCELLED">Annulé</option>
                    </select>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-white border-bottom">
                            <tr>
                                <th className="ps-4 py-3 text-secondary small text-uppercase">ID</th>
                                <th className="py-3 text-secondary small text-uppercase">Client</th>
                                <th className="py-3 text-secondary small text-uppercase">Total</th>
                                <th className="py-3 text-secondary small text-uppercase">Paiement</th>
                                <th className="py-3 text-secondary small text-uppercase">Statut</th>
                                <th className="py-3 text-secondary small text-uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-bottom-0">
                                    <td className="ps-4">
                                        <span className="fw-bold text-primary">#{order.id.toString().slice(0, 5)}</span>
                                        <div className="text-muted" style={{fontSize: '0.7rem'}}>
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="fw-bold">{order.first_name} {order.last_name}</div>
                                        <div className="text-muted small">{order.phone}</div>
                                    </td>
                                    <td>
                                        <span className="fw-bold text-dark">{Number(order.total_amount).toFixed(3)} DT</span>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${order.payment_method === 'ONLINE' ? 'bg-info-light text-info' : 'bg-secondary-light text-secondary'}`}>
                                            {order.payment_method === 'ONLINE' ? <HiOutlineCash className="me-1"/> : <HiOutlineTruck className="me-1"/>}
                                            {order.payment_method}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            className="form-select form-select-sm fw-bold border-0"
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            style={{
                                                backgroundColor: order.status === 'PAID' ? '#e8f5e9' : order.status === 'SHIPPED' ? '#e3f2fd' : order.status === 'CANCELLED' ? '#ffebee' : '#fff4e5',
                                                color: order.status === 'PAID' ? '#2e7d32' : order.status === 'SHIPPED' ? '#1565c0' : order.status === 'CANCELLED' ? '#c62828' : '#ed6c02',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <option value="PENDING">EN ATTENTE</option>
                                            <option value="PAID">PAYÉ</option>
                                            <option value="SHIPPED">EXPÉDIÉ</option>
                                            <option value="CANCELLED">ANNULÉ</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <IconButton size="small" className="shadow-sm bg-white" onClick={() => handleViewDetails(order.id)}>
                                                <HiOutlineEye color="#666" />
                                            </IconButton>
                                            <IconButton size="small" className="shadow-sm bg-white" onClick={() => deleteOrder(order.id)}>
                                                <HiOutlineTrash color="#dc3545" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* OBSERVATIONS SECTION */}
            <div className="mb-4 mt-5">
                <h2 className="fw-bold m-0 text-dark">Observations & Réclamations</h2>
                <p className="text-muted small">Messages reçus via le formulaire de contact</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-white border-bottom">
                            <tr>
                                <th className="ps-4 py-3 text-secondary small text-uppercase">Date</th>
                                <th className="py-3 text-secondary small text-uppercase">Client</th>
                                <th className="py-3 text-secondary small text-uppercase">Sujet</th>
                                <th className="py-3 text-secondary small text-uppercase">Aperçu Message</th>
                                <th className="py-3 text-secondary small text-uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reclamations.map((rec) => (
                                <tr key={rec.id}>
                                    <td className="ps-4 text-muted small">
                                        {new Date(rec.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td>
                                        <div className="fw-bold">{rec.full_name}</div>
                                        <div className="text-muted small">{rec.email}</div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">{rec.subject}</span>
                                    </td>
                                    <td style={{ maxWidth: '250px' }}>
                                        <div className="text-truncate small text-muted">
                                            {rec.message}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <IconButton size="small" className="shadow-sm bg-white" onClick={() => handleViewRec(rec)}>
                                                <HiOutlineEye color="#0071e3" />
                                            </IconButton>
                                            <IconButton size="small" className="shadow-sm bg-white" onClick={() => deleteReclamation(rec.id)}>
                                                <HiOutlineTrash color="#dc3545" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL 1: ORDER ITEMS --- */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="fw-bold border-bottom">Détails de la Commande</DialogTitle>
                <DialogContent className="pt-3">
                    {modalLoading ? (
                        <div className="text-center p-4"><CircularProgress size={30} /></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Produit</th>
                                        <th className="text-center">Qté</th>
                                        <th className="text-end">Prix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.product_name}</td>
                                            <td className="text-center">x{item.quantity}</td>
                                            <td className="text-end">{Number(item.price).toFixed(3)} DT</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* --- MODAL 2: FULL RECLAMATION MESSAGE --- */}
            <Dialog open={recOpen} onClose={() => setRecOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="fw-bold border-bottom d-flex justify-content-between align-items-center">
                    Message de {selectedRec?.full_name}
                    <span className="badge bg-primary-light text-primary small" style={{fontSize: '0.7rem'}}>
                        {selectedRec?.subject}
                    </span>
                </DialogTitle>
                <DialogContent className="pt-4 pb-4">
                    {selectedRec && (
                        <div>
                            <div className="mb-3">
                                <label className="text-muted small fw-bold text-uppercase">Contact</label>
                                <p className="mb-0">{selectedRec.email}</p>
                            </div>
                            <div className="p-3 rounded-3 bg-light border">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-2">Message Complet :</label>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                    {selectedRec.message}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <div className="p-3 border-top text-end">
                    <Button onClick={() => setRecOpen(false)} variant="contained" sx={{ bgcolor: '#1d1d1f' }}>
                        Fermer
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default Commandes;