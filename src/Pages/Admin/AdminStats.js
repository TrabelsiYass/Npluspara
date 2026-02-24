import React, { useCallback, useEffect, useState } from 'react';
import {
    MdAttachMoney,
    MdErrorOutline,
    MdQueryStats,
    MdShowChart,
    MdTrendingUp,
    MdVisibility
} from "react-icons/md";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell, Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import { supabase } from '../../Client';

const AdminStats = () => {

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ views: 0, clics: 0, revenue: 0, conv: 0 });
    const [lowStock, setLowStock] = useState([]);
    const [revenueHistory, setRevenueHistory] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];

    // --- LOGIQUE DE LOGOUT ---
    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        window.location.href = "/#";
    }, []);

    // --- LOGIQUE DE TIME OUT (15 minutes d'inactivité) ---
    useEffect(() => {
        let timeout;
        const TIMEOUT_DURATION = 1 * 60 * 1000; 

        const resetTimer = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                handleLogout();
            }, TIMEOUT_DURATION);
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, resetTimer));
        
        resetTimer();

        return () => {
            if (timeout) clearTimeout(timeout);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [handleLogout]);


    const fetchData = async () => {
    setLoading(true);
    try {
        // 1. Récupération des produits (on simplifie la jointure au cas où)
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*'); // On récupère d'abord tout pour tester

        // 2. Récupération des commandes
        const { data: orders, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: true });

        if (prodError) console.error("Erreur Produits:", prodError);
        if (orderError) console.error("Erreur Commandes:", orderError);

        if (products) {
            console.log("Produits reçus:", products);
            
            const v = products.reduce((acc, p) => acc + (Number(p.views_count) || 0), 0);
            const c = products.reduce((acc, p) => acc + (Number(p.clicks_count) || 0), 0);
            const rev = orders?.reduce((acc, o) => acc + (Number(o.total_price) || 0), 0) || 0;
            
            setStats({ 
                views: v, 
                clics: c, 
                revenue: rev, 
                conv: v > 0 ? ((c / v) * 100).toFixed(1) : 0 
            });

            // Alertes Stock
            setLowStock(products.filter(p => p.stock < 5).sort((a, b) => a.stock - b.stock));

            // Top Products - Correction substring pour éviter erreur si name est null
            setTopProducts(products
                .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
                .slice(0, 5)
                .map(p => ({
                    name: p.name ? p.name.substring(0, 10) : 'Sans nom',
                    vues: p.views_count || 0,
                    clics: p.clicks_count || 0
                })));

            // Simulation de catégories si la jointure sub_categories est cassée
            const catMap = {};
            products.forEach(p => {
                const catName = "Produits"; // Valeur par défaut
                catMap[catName] = (catMap[catName] || 0) + (p.clicks_count || 0);
            });
            setCategoryData(Object.keys(catMap).map(name => ({ name, value: catMap[name] })));
        }

        if (orders && orders.length > 0) {
            console.log("Commandes reçues:", orders);
            const daily = orders.reduce((acc, o) => {
                if (!o.created_at) return acc;
                const d = new Date(o.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
                acc[d] = (acc[d] || 0) + (Number(o.total_price) || 0);
                return acc;
            }, {});
            setRevenueHistory(Object.keys(daily).map(d => ({ date: d, montant: daily[d] })));
        } else {
            // Si pas de commandes, on met une donnée vide pour éviter que le graphique plante
            setRevenueHistory([{date: 'Aucune data', montant: 0}]);
        }

    } catch (err) {
        console.error("Erreur globale fetchData:", err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => { fetchData(); }, []);

    if (loading) return <div className="p-5 text-center">Analyse du business...</div>;

    return (

        <div className="p-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0 text-dark">Tableau de Bord Stratégique</h2>
                <span className="badge bg-white text-dark border p-2 shadow-sm">Mise à jour: {new Date().toLocaleTimeString()}</span>
                <button className="btn btn-danger mb-3" onClick={handleLogout}>Déconnexion</button>
            </div>

            {/* --- CARDS DE STATISTIQUES --- */}
            <div className="row g-4 mb-4">
                <StatCard title="Revenu Global" value={`${stats.revenue.toLocaleString()} DT`} icon={<MdAttachMoney/>} grad="linear-gradient(135deg, #11998e, #38ef7d)" />
                <StatCard title="Vues Totales" value={stats.views} icon={<MdVisibility/>} grad="linear-gradient(135deg, #4e73df, #224abe)" />
                <StatCard title="Taux Conv." value={`${stats.conv}%`} icon={<MdQueryStats/>} grad="linear-gradient(135deg, #f6c23e, #f4b619)" />
                <StatCard title="Alertes Stock" value={lowStock.length} icon={<MdErrorOutline/>} grad={lowStock.length > 0 ? "linear-gradient(135deg, #e74a3b, #be2617)" : "linear-gradient(135deg, #858796, #60616f)"} />
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-4 text-secondary"><MdShowChart className="me-2"/>Courbe des Ventes</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={revenueHistory}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#11998e" stopOpacity={0.3}/><stop offset="95%" stopColor="#11998e" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="montant" stroke="#11998e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4 text-secondary"><MdTrendingUp className="me-2"/>Performance : Vues vs Clics (Top 5)</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={topProducts}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Legend />
                                    <Bar dataKey="vues" fill="#4e73df" radius={[5, 5, 0, 0]} barSize={30} />
                                    <Bar dataKey="clics" fill="#1cc88a" radius={[5, 5, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-4 text-secondary">Clics par Catégorie</h5>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={categoryData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                        {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-3">
                            {categoryData.slice(0, 3).map((c, i) => (
                                <div key={i} className="d-flex justify-content-between small mb-1">
                                    <span><span style={{color: COLORS[i]}}>●</span> {c.name}</span>
                                    <span className="fw-bold">{c.value} clics</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="bg-danger p-3 text-white fw-bold"><MdErrorOutline/> Alerte Stocks Bas</div>
                        <div className="list-group list-group-flush">
                            {lowStock.length > 0 ? lowStock.map(p => (
                                <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center border-0 py-3">
                                    <div>
                                        <div className="fw-bold small">{p.name}</div>
                                        <div className="text-muted" style={{fontSize: '0.7rem'}}>{p.sub_categories?.name}</div>
                                    </div>
                                    <span className={`badge ${p.stock === 0 ? 'bg-dark' : 'bg-danger'}`}>{p.stock}</span>
                                </div>
                            )) : <div className="p-4 text-center text-muted">Stock impeccable ! ✅</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, grad }) => (
    <div className="col-md-3">
        <div className="card border-0 shadow-sm rounded-4 text-white" style={{ background: grad }}>
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="text-white-50 text-uppercase fw-bold mb-1 small">{title}</h6>
                    <h3 className="mb-0 fw-bold">{value}</h3>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{width: '55px', height: '55px'}}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
            </div>
        </div>
    </div>
);

export default AdminStats;