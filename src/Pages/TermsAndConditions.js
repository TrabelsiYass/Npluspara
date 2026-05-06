import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineShieldCheck, 
  HiOutlineTruck, 
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineAnnotation,
  HiOutlineExclamation
} from "react-icons/hi";
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-page">
      {/* Hero Section - Matching WhoWeAre style */}
      <section className="terms-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Conditions Générales
          </motion.h1>
          <p className="hero-subtitle">Transparence, sécurité et engagement envers nos clients.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="terms-content container">
        <div className="row g-4">
          
          {/* Article 1 */}
          <div className="col-md-6">
            <div className="terms-card">
              <span className="article-number">01</span>
              <HiOutlineDocumentText className="terms-icon" />
              <h3>Objet du Site</h3>
              <p>Le site <strong>www.npluspara.com</strong> propose une sélection rigoureuse de produits de parapharmacie. Toute commande passée implique l'adhésion totale à ces conditions.</p>
            </div>
          </div>

          {/* Article 2 */}
          <div className="col-md-6">
            <div className="terms-card">
              <span className="article-number">02</span>
              <HiOutlineCurrencyDollar className="terms-icon" />
              <h3>Prix et Paiement</h3>
              <p>Il faut préciser que lorsque vous optez le choix de paiement à la livraison nous n'acceptons que le règlement en espèces.</p>
            </div>
          </div>

          {/* Article 3 */}
          <div className="col-md-6">
            <div className="terms-card">
              <span className="article-number">03</span>
              <HiOutlineTruck className="terms-icon" />
              <h3>Livraison </h3>
              <p>Nous livrons sur toute la Tunisie en 24h/48h. Assurez-vous de fournir une adresse exacte  pour garantir la rapidité du service.</p>
            </div>
          </div>

          {/* Article 4 */}
          <div className="col-md-6">
            <div className="terms-card">
              <span className="article-number">04</span>
              <HiOutlineShieldCheck className="terms-icon" />
              <h3>Authenticité</h3>
              <p>Tous nos produits proviennent de circuits officiels. Nous garantissons l'origine et la traçabilité de chaque article vendu.</p>
            </div>
          </div>
        </div>

        {/* Refund Policy (High Importance for Google) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="refund-alert"
        >
          <div className="row align-items-center">
            <div className="col-md-2 text-center">
              <HiOutlineExclamation size={60} color="#629C38" />
            </div>
            <div className="col-md-10">
              <h4 className="section-title">Politique de Retour (3 Jours)</h4>
              <p>Conformément à la loi, vous disposez de 3 jours pour retourner un produit. <strong>Attention :</strong> Pour des raisons d'hygiène et de santé, les produits dermo-cosmétiques ouverts ou testés ou packaging abîmé ne seront ni repris ni échangés.</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Info Frame */}
        <div className="contact-frame">
          <div className="row text-center text-md-start">
            <div className="col-md-8">
              <h4 className="text-white mb-3">Besoin d'aide ?</h4>
              <p className="mb-0">Notre équipe est à votre écoute pour toute question relative à vos commandes ou nos produits.</p>
              <p className="fw-bold mt-2">📍 Rue Assad Ibn Fourat, Résidence Rihab 4, Cité El Ghazala 1, Ariana.</p>
            </div>
            <div className="col-md-4 text-center d-flex align-items-center justify-content-center">
              <div className="bg-white text-success px-4 py-3 rounded-pill fw-bold">
                <HiOutlineAnnotation className="me-2" />
                +216 28 895 920
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;