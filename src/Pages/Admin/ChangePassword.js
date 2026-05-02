import { useState } from "react";
import { supabase } from "../../Client";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            alert("Erreur: " + error.message);
        } else {
            alert("Mot de passe mis à jour !");
            setNewPassword("");
        }

        setLoading(false);
    };

    return (
        <div className="card p-3 shadow-sm mt-4">
            <h5>🔐 Modifier le mot de passe admin</h5>

            <input
                type="password"
                className="form-control my-2"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
                className="btn btn-warning"
                onClick={handleChangePassword}
                disabled={loading}
            >
                {loading ? "Mise à jour..." : "Changer mot de passe"}
            </button>
        </div>
    );
};

export default ChangePassword;