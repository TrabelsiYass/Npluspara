import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../Client';

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifie la session actuelle
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Écoute les changements (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div>Chargement...</div>;

    if (!session) {
        // Si pas de session, on renvoie vers le login
        return <Navigate to="/admin-login" />;
    }

    return children;
};

export default ProtectedRoute;