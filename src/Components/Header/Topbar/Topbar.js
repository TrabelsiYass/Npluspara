import { FaBook } from 'react-icons/fa'
import './Topbar.css'

function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-content">
          <a href="/blog" className="blog-link">
            <FaBook className="icon" />
            <span>BLOG</span>
          </a>
          <div className="delivery-message">
            <span className="scrolling-text">
              Livraison gratuite dès 99 DT d&apos;achat! ! Livraison gratuite dès 99 DT d&apos;achat! ! Livraison gratuite dès 99 DT d&apos;achat! !
            </span>
          </div>
          <a href="/contact" className="contact-link">Contact</a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
