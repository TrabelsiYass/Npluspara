import { useState } from 'react';
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Client';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- INSCRIPTION ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        alert("Inscription réussie ! Vérifiez votre boîte mail.");
      } else {
        // --- CONNEXION ---
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/profile');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleAuth}>
            <h1>Créer un compte</h1>
            <div className="social-container">
              <button type="button" className="social"><FaGoogle /></button>
              <button type="button" className="social"><FaFacebookF /></button>
            </div>
            <span>ou utilisez votre email</span>
            <input type="text" placeholder="Nom Complet" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="auth-btn" disabled={loading}>{loading ? "Patientez..." : "S'inscrire"}</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleAuth}>
            <h1>Connexion</h1>
            <div className="social-container">
              <button type="button" className="social"><FaGoogle /></button>
              <button type="button" className="social"><FaFacebookF /></button>
            </div>
            <span>accédez à votre compte client</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            <button className="auth-btn" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Heureux de vous revoir !</h1>
              <button className="ghost auth-btn" onClick={() => setIsSignUp(false)}>Se connecter</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Bonjour, l'ami !</h1>
              <button className="ghost auth-btn" onClick={() => setIsSignUp(true)}>S'inscrire</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;