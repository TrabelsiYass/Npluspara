import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineBadgeCheck, 
  HiOutlineSparkles, 
  HiOutlineTruck, 
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineLightBulb
} from "react-icons/hi";
import './WhoWeAre.css';

const WhoWeAre = () => {
  const stats = [
    { label: "Années d'Expérience", value: "10+" },
    { label: "Produits Authentiques", value: "2000+" },
    { label: "Clients Satisfaits", value: "15k+" },
    { label: "Marques Partenaires", value: "150+" },
    { label: "Livraison Rapide", value: "24/48h" },
    { label: "Conseils Experts", value: "100%" },
  ];

  return (
    <div className="who-we-are">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            L'Excellence N PLUS PARA
          </motion.h1>
          <p className="hero-subtitle">Votre destination santé et dermo-cosmétique de confiance en Tunisie.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-section container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="image-stack">
              <img 
                src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800" 
                alt="Expertise N PLUS PARA" 
                className="img-fluid rounded-4 shadow-lg main-img"
              />
              <div className="experience-badge">
                <span>10+ Ans</span>
                <p>d'Expertise</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-5 mt-md-0 ps-md-5">
            <h2 className="section-title">Notre Histoire</h2>
            <p className="lead fw-bold text-success">
              Plus qu'un simple point de vente, un partenaire de votre routine quotidienne.
            </p>
            <p>
              Depuis plus de 10 ans, <strong>N PLUS PARA</strong> s'engage à transformer l'accès aux soins de parapharmacie. Né d'une volonté d'allier la rigueur pharmaceutique au plaisir de la cosmétique, nous accompagnons nos clients dans leur quête de bien-être avec une sélection pointue et des conseils personnalisés.
            </p>
            <p>
              Nous ne vendons pas seulement des produits ; nous proposons des solutions concrètes pour la peau, les cheveux et la santé globale, testées et approuvées par nos experts.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise & Advisory Section (The "Rich" Content) */}
      <section className="expertise-advisory py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="section-title center">Pourquoi nous font-ils confiance ?</h2>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="advisory-card">
                <HiOutlineShieldCheck className="adv-icon" />
                <h4>Authenticité Garantie</h4>
                <p>Chaque produit sur nos étagères provient d'un circuit de distribution officiel. Nous luttons activement contre la contrefaçon pour protéger votre santé.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="advisory-card">
                <HiOutlineUserGroup className="adv-icon" />
                <h4>Conseil Personnalisé</h4>
                <p>Nos conseillers sont formés aux dernières innovations dermo-cosmétiques pour vous guider selon votre phototype et vos besoins spécifiques.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="advisory-card">
                <HiOutlineLightBulb className="adv-icon" />
                <h4>Innovation Continue</h4>
                <p>Nous suivons les tendances mondiales pour vous apporter les nouveautés Labo avant tout le monde : des soins bio aux technologies anti-âge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Carousel Stats Section */}
      <section className="stats-carousel-wrapper">
        <div className="carousel-track">
          {[...stats, ...stats].map((stat, index) => (
            <div className="stat-card" key={index}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brands & Values */}
      <section className="about-section container pb-5">
        <div className="row align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 pe-md-5">
            <h2 className="section-title">Nos Engagements Client</h2>
            <div className="engagement-list">
              <div className="engagement-item">
                <HiOutlineBadgeCheck className="e-icon" />
                <div>
                  <h5>Large Gamme de Marques</h5>
                  <p>De Vichy à La Roche-Posay, en passant par les marques bio, trouvez tout ce dont vous avez besoin en un seul endroit.</p>
                </div>
              </div>
              <div className="engagement-item">
                <HiOutlineTruck className="e-icon" />
                <div>
                  <h5>Service de Livraison Premium</h5>
                  <p>Un emballage soigné et une expédition express sur tout le territoire Tunisien.</p>
                </div>
              </div>
              <div className="engagement-item">
                <HiOutlineHeart className="e-icon" />
                <div>
                  <h5>Écoute et Accompagnement</h5>
                  <p>Une question ? Notre équipe est disponible via notre page Facebook et téléphone pour vous répondre.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-5 mb-md-0 text-center">
            <div className="branded-frame">
               <img 
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800" 
                alt="Nos Engagements" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;