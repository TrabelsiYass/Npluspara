import React from 'react';
import './WhoWeAre.css';

const WhoWeAre = () => {
  return (
    <div className="who-we-are">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>Qui Sommes-Nous</h1>
          <p>Bâtir l'avenir avec passion, précision et intégrité.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800" 
              alt="Notre Équipe" 
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6 mt-4 mt-md-0">
            <h2 className="section-title">Notre Mission</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-bar">
        <div className="container">
          <div className="row text-center">
            <div className="col-6 col-md-3">
              <h3>10+</h3>
              <p>Années d'Expérience</p>
            </div>
            <div className="col-6 col-md-3">
              <h3>500+</h3>
              <p>Projets Terminé</p>
            </div>
            <div className="col-6 col-md-3">
              <h3>200+</h3>
              <p>Partenaires</p>
            </div>
            <div className="col-6 col-md-3">
              <h3>24/7</h3>
              <p>Support Client</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section container pb-5">
        <div className="row align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6">
            <h2 className="section-title">Pourquoi Nous Choisir ?</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent 
              libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
            </p>
            <ul className="values-list">
              <li><strong>Qualité:</strong> Lorem ipsum dolor sit amet.</li>
              <li><strong>Innovation:</strong> Consectetur adipiscing elit.</li>
              <li><strong>Fiabilité:</strong> Sed do eiusmod tempor incididunt.</li>
            </ul>
          </div>
          <div className="col-md-6 mb-4 mb-md-0">
            <img 
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800" 
              alt="Nos Valeurs" 
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;