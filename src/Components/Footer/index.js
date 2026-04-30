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
              Vous trouverez chez NPlusPara.tn tous vos produits parapharmaceutique 
              (santé, beauté, minceur...)
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Informations</h4>
              <ul>
                <li><a href="/category/promotions">Promotions</a></li>
                <li><a href="category/nouveautes">Nouveaux produits</a></li>
                <li><a href="category/bons-plans">Meilleures ventes</a></li>
                <li><a href="/Contact">Contactez-nous</a></li>
                <li><a href="/WhoWeAre">A propos</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Mon compte</h4>
              <ul>
                <li><a href="#">Mes commandes</a></li>
                <li><a href="#">Mes avoirs</a></li>
                <li><a href="#">Mes informations personnelles</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Service client</h4>
              <ul>
                <li>Tél <a href="tel:+21670608000">+216 28 895 920</a></li>
                <li>Email <a href="mailto:contact@pharma-shop.tn">npluspara@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>Copyright 2026 © <a href="/">Npluspara.tn</a></p>
          </div>
          
          <div className="social-links">
            <a href="https://www.facebook.com/NPLUSPARA" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
            <a href="https://www.instagram.com/npluspara/" className="social-link"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
