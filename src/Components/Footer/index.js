import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import './index.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <p>
              NPlusPara.tn est N°1 parapharmacie en ligne en Tunisie. 
              Vous trouverez chez Pharma-shop.tn tous vos produits parapharmaceutique 
              (santé, beauté, minceur...)
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Informations</h4>
              <ul>
                <li><a href="#">Promotions</a></li>
                <li><a href="#">Nouveaux produits</a></li>
                <li><a href="#">Meilleures ventes</a></li>
                <li><a href="#">Contactez-nous</a></li>
                <li><a href="#">A propos</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Mon compte</h4>
              <ul>
                <li><a href="#">Mes commandes</a></li>
                <li><a href="#">Mes avoirs</a></li>
                <li><a href="#">Mes informations personnelles</a></li>
                <li><a href="#">Mes bons de réduction</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Service client</h4>
              <ul>
                <li>Tél <a href="tel:+21670608000">+216 70 000 000</a></li>
                <li>Email <a href="mailto:contact@pharma-shop.tn">contact@npluspara.tn</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>Copyright 2026 © <a href="/">Npluspara.tn</a></p>
          </div>
          <div className="footer-nav">
            <a href="#">Comment commander ?</a>
            <a href="#">Réclamation Client</a>
            <a href="#">Comment ça marche ?</a>
          </div>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
