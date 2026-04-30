import { useState } from 'react';
import { 
    FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaClock, 
    FaFacebook, FaInstagram, FaWhatsapp, FaShieldAlt, 
    FaTruck, FaHeadset 
} from 'react-icons/fa';
import { supabase } from '../Client'; // Ensure this path is correct
import './Contact.css';

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    { q: "Quels sont vos délais de livraison ?", a: "Nous livrons partout en Tunisie sous 24h à 48h ouvrables." },
    { q: "Puis-je commander en ligne et récupérer en magasin ?", a: "Oui, notre service 'Click & Collect' est disponible gratuitement à notre boutique d'El Ghazala." },
    { q: "Proposez-vous des conseils personnalisés ?", a: "Absolument. Nos conseillers en parapharmacie sont disponibles sur place ou par téléphone." }
  ];

  // --- THE UPDATED SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('reclamations')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }]);

      if (error) throw error;

      setSent(true);
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Reset success message after 5 seconds
      setTimeout(() => setSent(false), 5000);

    } catch (error) {
      console.error('Database Error:', error.message);
      alert("Une erreur est survenue lors de l'envoi de votre message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* 1. HERO SECTION */}
      <section className="contact-hero">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-badge">Expertise & Bien-être</div>
            <h1>Contactez N Plus Para</h1>
            <p>Une question sur un produit ? Besoin d'un conseil dermatologique ? <br/> Notre équipe d'experts est là pour vous.</p>
          </div>
        </div>
      </section>

      <div className="container main-content">
        {/* 2. TRUST BAR */}
        <div className="trust-bar">
          <div className="trust-item">
            <FaShieldAlt /> <span>Produits 100% Authentiques</span>
          </div>
          <div className="trust-item">
            <FaTruck /> <span>Livraison sur toute la Tunisie</span>
          </div>
          <div className="trust-item">
            <FaHeadset /> <span>Support Client 6j/7</span>
          </div>
        </div>

        <div className="contact-grid">
          {/* 3. SIDEBAR INFO */}
          <div className="contact-sidebar">
            <div className="status-pill">
              <span className="dot"></span> Ouvert Actuellement
            </div>
            
            <div className="info-section">
              <div className="info-box">
                <div className="icon-wrapper"><FaMapMarkerAlt /></div>
                <div className="text-content">
                  <h4>Notre Adresse</h4>
                  <p>Rue Assad Ibn Fourat, Résidence Rihab 4</p>
                  <p>Cité El Ghazala 1, 2083 Ariana</p>
                </div>
              </div>

              <div className="info-box">
                <div className="icon-wrapper"><FaPhoneAlt /></div>
                <div className="text-content">
                  <h4>Ligne Directe</h4>
                  <p>+216 71 700 000</p>
                  <p className="sub-text">WhatsApp: +216 99 000 000</p>
                </div>
              </div>

              <div className="info-box">
                <div className="icon-wrapper"><FaClock /></div>
                <div className="text-content">
                  <h4>Heures d'Ouverture</h4>
                  <p>Lundi — Samedi: 08:30 - 19:30</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>
            </div>

            <div className="social-footer">
              <h5>Suivez notre actualité</h5>
              <div className="social-icons">
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaWhatsapp /></a>
              </div>
            </div>
          </div>

          {/* 4. MAIN FORM */}
          <div className="contact-main-form">
            <div className="form-header">
              <h3>Envoyez-nous un message</h3>
              <p>Réponse garantie sous 2 heures ouvrables.</p>
            </div>

            {sent ? (
              <div className="success-message-apple" style={{ textAlign: 'center', padding: '40px' }}>
                <FaShieldAlt size={50} color="#629C38" style={{ marginBottom: '20px' }} />
                <h3>Merci !</h3>
                <p>Votre message a été envoyé avec succès.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="input-field">
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <label className={formData.name ? 'active' : ''}>Nom Complet</label>
                  </div>
                  <div className="input-field">
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <label className={formData.email ? 'active' : ''}>Adresse Email</label>
                  </div>
                </div>
                <div className="input-field">
                  <select 
                    required 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="" disabled>Quel est l'objet de votre demande ?</option>
                    <option value="conseil">Conseil Produit</option>
                    <option value="commande">Suivi de Commande</option>
                    <option value="reclamation">Réclamation</option>
                  </select>
                </div>
                <div className="input-field">
                  <textarea 
                    rows="4" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                  <label className={formData.message ? 'active' : ''}>Comment pouvons-nous vous aider ?</label>
                </div>

                <button type="submit" className="luxury-submit-btn" disabled={loading}>
                  <div className="btn-content">
                    {loading ? (
                       <span>ENVOI EN COURS...</span>
                    ) : (
                      <>
                        <FaEnvelope className="btn-icon" />
                        <span>ENVOYER LE MESSAGE</span>
                      </>
                    )}
                  </div>
                  <div className="btn-shine"></div>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 5. FAQ SECTION */}
        <div className="faq-section">
          <div className="section-title">
            <h2>Questions Fréquentes</h2>
            <div className="underline"></div>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`} 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  {faq.q} <span className="arrow">+</span>
                </div>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. MAP SECTION */}
        <div className="map-wrapper">
          <div className="map-info-overlay">
            <FaMapMarkerAlt />
            <div>
              <strong>N Plus Para</strong>
              <span>Ghazala, Ariana</span>
            </div>
          </div>

          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1500!2d10.1801209528992!3d36.88375462880081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn" 
            width="100%" 
            height="100%" 
            style={{ 
              border: 0, 
              filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.2) saturate(0.5)' 
            }} 
            allowFullScreen="" 
            loading="lazy"
            title="N Plus Para Precise Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;