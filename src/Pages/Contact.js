import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Header with Background Image */}
      <div className="contact-header">
        <h1>Contactez-Nous</h1>
        <p>Visitez notre point de vente ou envoyez-nous un message.</p>
      </div>

      <div className="container contact-container">
        <div className="row g-0 contact-card-shadow">
          
          {/* Left Side: Contact Information */}
          <div className="col-lg-5 contact-info">
            <h3>Notre Boutique</h3>
            <p className="mb-4">Retrouvez-nous à Ariana pour tous vos besoins en parapharmacie et bien-être.</p>
            
            {/* Location: Ariana */}
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-text">
                <span>N Plus Para - Ariana</span>
                <p>Avenue Fethi Zouhir, Ariana, Tunisie</p>
                <p className="hours-text">Lun-Sam: 08:30 - 19:30 | Dim: Fermé</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhoneAlt className="info-icon" />
              <div className="info-text">
                <span>Téléphone</span>
                <p>+216 71 700 000</p> {/* Update with your real number */}
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-text">
                <span>Email</span>
                <p>contact@npluspara.tn</p>
              </div>
            </div>
          </div>

          {/* Right Side: Message Form */}
          <div className="col-lg-7 contact-form-wrapper">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Nom Complet</label>
                  <input type="text" placeholder="Votre nom" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input type="email" placeholder="votre@email.com" required />
                </div>
              </div>
              <div className="mb-3">
                <label>Sujet</label>
                <input type="text" placeholder="Comment pouvons-nous vous aider ?" required />
              </div>
              <div className="mb-4">
                <label>Message</label>
                <textarea rows="5" placeholder="Votre message ici..."></textarea>
              </div>
              <button type="submit" className="submit-btn">Envoyer le message</button>
            </form>
          </div>
        </div>

        {/* Real Google Maps for N Plus Para Ariana */}
        <div className="map-container mt-5">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.802143058864!2d10.163625776472465!3d36.871146663673734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb36a537f59d%3A0xe54950e395780516!2sN%20plus%20Para!5e0!3m2!1sfr!2stn!4v1708360000000!5m2!1sfr!2stn" 
            width="100%" 
            height="450" 
            style={{border:0, borderRadius: '15px'}} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="N Plus Para Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;