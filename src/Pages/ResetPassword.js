import { useState, useEffect } from 'react';
import { supabase } from '../Client';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse your login styles

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if the user is actually authorized to be here
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                alert("Session expirée ou invalide. Veuillez recommencer la procédure.");
                navigate('/login');
            }
        };
        checkSession();
    }, [navigate]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            alert("Mot de passe mis à jour avec succès !");
            navigate('/login');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="auth-container" style={{ height: 'auto', padding: '40px' }}>
                <form onSubmit={handlePasswordUpdate} style={{ width: '100%' }}>
                    <h1 className="mb-4">Nouveau mot de passe</h1>
                    <p className="text-muted small">Entrez votre nouveau mot de passe ci-dessous.</p>
                    
                    <input 
                        type="password" 
                        placeholder="Nouveau mot de passe" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="mb-3"
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Confirmer le mot de passe" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className="mb-4"
                    />
                    
                    <button className="auth-btn w-100" disabled={loading}>
                        {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;