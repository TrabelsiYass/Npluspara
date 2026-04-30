import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Client';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin 
        }
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        alert("Vérifiez votre email !");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
  
        if (data?.user) {
          // Using window.location.href instead of navigate() 
          // forces a full reload to the profile page, ensuring data is there.
          window.location.href = '/profile'; 
      }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>
        
        {/* Sign Up Section */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleAuth}>
            <div className="form-header">
              <h2>Créer un compte</h2>
              <p>Rejoignez notre communauté</p>
            </div>
            <div className="social-row">
              <button type="button" className="social-pill" onClick={handleGoogleLogin}>
                <FcGoogle size={20} /> <span>Google</span>
              </button>
            </div>
            <div className="divider"><span>ou via email</span></div>
            <div className="input-group">
              <AiOutlineUser className="input-icon" />
              <input type="text" placeholder="Nom Complet" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp} />
            </div>
            <div className="input-group">
              <AiOutlineMail className="input-icon" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <AiOutlineLock className="input-icon" />
              <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
            <div className="strength-bar-container">
              <div className="strength-bar" style={{ width: `${getPasswordStrength()}%`, backgroundColor: getPasswordStrength() < 66 ? '#ff4757' : '#629C38' }}></div>
            </div>
            <p className="toggle-link" onClick={() => setIsSignUp(false)}>
              Déjà un compte ? <strong>Se connecter</strong>
            </p>
            <button className="submit-btn" disabled={loading}>
              {loading ? "Chargement..." : "S'INSCRIRE"}
            </button>
          </form>
        </div>

        {/* Sign In Section */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleAuth}>
            <div className="form-header">
              <h2>Connexion</h2>
              <p>Ravi de vous revoir</p>
            </div>
            <div className="social-row">
              <button type="button" className="social-pill" onClick={handleGoogleLogin}>
                <FcGoogle size={20} /> <span>Continuer avec Google</span>
              </button>
            </div>
            <div className="divider"><span>ou connexion classique</span></div>
            <div className="input-group">
              <AiOutlineMail className="input-icon" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <AiOutlineLock className="input-icon" />
              <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <span className="forgot-text">Mot de passe oublié ?</span>
            <p className="toggle-link" onClick={() => setIsSignUp(true)}>
              Vous n'avez pas de compte ? <strong>S'inscrire</strong>
            </p>
            <button className="submit-btn" disabled={loading}>
              {loading ? "Chargement..." : "SE CONNECTER"}
            </button>
          </form>
        </div>

        {/* Overlay Section */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h3>Bon retour !</h3>
              <p>Pour rester connecté avec nous, merci de vous identifier.</p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>SE CONNECTER</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h3>Salut !</h3>
              <p>Entrez vos détails personnels et commencez votre aventure avec nous.</p>
              <button className="ghost-btn" onClick={() => setIsSignUp(true)}>S'INSCRIRE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;