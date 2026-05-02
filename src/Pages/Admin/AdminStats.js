import React, { useCallback, useEffect, useState } from 'react';
import {
    MdAttachMoney,
    MdErrorOutline,
    MdQueryStats,
    MdShowChart,
    MdTrendingUp
} from "react-icons/md";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import { supabase } from '../../Client';
import ChangePassword from "./ChangePassword";

const AdminStats = () => {

    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("month");

    const [showModal, setShowModal] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [loadingPass, setLoadingPass] = useState(false);

    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        cancelled: 0,
        pending: 0
    });

    const [revenueHistory, setRevenueHistory] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [topDays, setTopDays] = useState([]);

    const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];

    const normalize = (s) => (s || "").toLowerCase().trim();

    // --- STATUS HELPERS ---
    const isPaid = (o) => normalize(o.status) === "paid";
    const isCancelled = (o) => normalize(o.status) === "cancelled";
    const isPending = (o) => normalize(o.status) === "pending";

    // --- LOGOUT ---
    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        window.location.href = "/#";
    }, []);

    // --- DATE FILTER ---
    const isToday = (date) => {
        const now = new Date();
        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        );
    };

    const filterOrdersByDate = (orders) => {
        const now = new Date();

        return orders.filter(o => {
            const d = new Date(o.created_at);

            if (filter === "today") {
                return isToday(d);
            }

            if (filter === "week") {
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return d >= weekAgo;
            }

            return true;
        });
    };

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);

        const { data: orders, error } = await supabase
            .from('commandes')
            .select('*')
            .order('created_at', { ascending: true });

        if (error || !orders) {
            console.error("Fetch error:", error);
            setLoading(false);
            return;
        }

        const filtered = filterOrdersByDate(orders);

        // --- STATS ---
        const revenue = filtered
            .filter(isPaid)
            .reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);

        const ordersCount = filtered.length;
        const cancelled = filtered.filter(isCancelled).length;
        const pending = filtered.filter(isPending).length;

        setStats({
            revenue,
            orders: ordersCount,
            cancelled,
            pending
        });

        // --- REVENUE HISTORY ---
        // --- REVENUE HISTORY (PAID ONLY) ---
            const daily = filtered
            .filter(isPaid)
            .reduce((acc, o) => {
                const d = new Date(o.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                });

                acc[d] = (acc[d] || 0) + (Number(o.total_amount) || 0);
                return acc;
            }, {});

        setRevenueHistory(
            Object.entries(daily)
                .map(([date, montant]) => ({ date, montant }))
                .sort((a, b) => new Date(a.date) - new Date(b.date))
        );

        // --- PAYMENT METHODS ---
        const paymentMap = {};

        filtered.forEach(o => {
            const method = o.payment_method || "unknown";
            paymentMap[method] = (paymentMap[method] || 0) + 1;
        });

        setPaymentData(
            Object.entries(paymentMap).map(([name, value]) => ({
                name,
                value
            }))
        );

        // --- TOP DAYS ---
        const sortedDays = Object.entries(daily)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        setTopDays(sortedDays);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    if (loading) return <div className="p-5 text-center">Analyse...</div>;


    const handleChangePassword = async () => {
        setLoadingPass(true);
    
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
    
        if (error) {
            alert("Erreur: " + error.message);
        } else {
            alert("Mot de passe mis à jour !");
            setShowModal(false);
            
            setNewPassword("");
        }
    
        setLoadingPass(false);
    };

    return (
        <div className="p-4 bg-light min-vh-100">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Dashboard</h2>

                <div className="d-flex gap-2 align-items-center">

                    <select
                        className="form-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="today">Aujourd'hui</option>
                        <option value="week">7 jours</option>
                        <option value="month">Tout</option>
                    </select>

                    <button className="btn btn-danger" onClick={handleLogout}>
                        Déconnexion
                    </button>

                    <button
                        className="btn btn-warning"
                        onClick={() => setShowModal(true)}
                    >
                        🔐 Password
                    </button>

                    
                </div>
            </div>

            {/* STATS */}
            <div className="row g-4 mb-4">

                <StatCard
                    title="Revenu"
                    value={`${stats.revenue.toLocaleString()} DT`}
                    icon={<MdAttachMoney />}
                    grad="linear-gradient(135deg,#11998e,#38ef7d)"
                />

                <StatCard
                    title="Total Commandes"
                    value={stats.orders}
                    icon={<MdTrendingUp />}
                    grad="linear-gradient(135deg,#4e73df,#224abe)"
                />

                <StatCard
                    title="Commandes Annulées"
                    value={stats.cancelled}
                    icon={<MdErrorOutline />}
                    grad="linear-gradient(135deg,#e74a3b,#be2617)"
                />

                <StatCard
                    title="En Attente"
                    value={stats.pending}
                    icon={<MdQueryStats />}
                    grad="linear-gradient(135deg,#f6c23e,#f4b619)"
                />

            </div>

            {/* CHARTS */}
            <div className="row g-4">

                <div className="col-lg-8">

                    {/* REVENUE */}
                    <div className="card p-4 mb-4 shadow-sm">
                        <h5><MdShowChart /> Revenus</h5>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="montant"
                                    stroke="#11998e"
                                    fill="#11998e33"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* TOP DAYS */}
                    <div className="card p-4 shadow-sm">
                        <h5>🔥 Meilleurs jours</h5>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topDays}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#1cc88a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                <div className="col-lg-4">

                    {/* PAYMENT */}
                    <div className="card p-4 shadow-sm">
                        <h5>💳 Paiement</h5>

                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={paymentData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                >
                                    {paymentData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>

            {/*Password */}
            <br />
            {showModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content p-3">

                            <h5>🔐 Changer mot de passe</h5>

                            {/* OLD PASSWORD */}
                            

                            {/* NEW PASSWORD */}
                            <input
                                type="password"
                                className="form-control my-2"
                                placeholder="Nouveau mot de passe"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <div className="d-flex gap-2 mt-2">

                                <button
                                    className="btn btn-secondary w-50"
                                    onClick={() => setShowModal(false)}
                                >
                                    Annuler
                                </button>

                                <button
                                    className="btn btn-warning w-50"
                                    onClick={handleChangePassword}
                                    disabled={loadingPass}
                                >
                                    {loadingPass ? "..." : "Valider"}
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- CARD ---
const StatCard = ({ title, value, icon, grad }) => (
    <div className="col-md-3">
        <div className="card text-white shadow-sm" style={{ background: grad }}>
            <div className="card-body d-flex justify-content-between">
                <div>
                    <h6>{title}</h6>
                    <h3>{value}</h3>
                </div>
                <div style={{ fontSize: "1.8rem" }}>{icon}</div>
            </div>
        </div>
    </div>
);





export default AdminStats;