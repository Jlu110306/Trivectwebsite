import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <span className="nav-logo-text">TRIVECT <span>AEROSPACE</span></span>
          </Link>
          <div className="footer-tagline">Made to <span className="footer-tagline-accent">LIFT OFF!</span></div>
          <p>Engineering and technology company specialising in aerospace systems, electronics design, 3D modelling, and rapid prototyping.</p>
          <div className="social-links">
            <a href="#" className="social-link" title="LinkedIn">in</a>
            <a href="#" className="social-link" title="YouTube">▶</a>
            <a href="#" className="social-link" title="Instagram">◉</a>
            <a href="#" className="social-link" title="GitHub">⌥</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Services</div>
          <ul className="footer-links">
            <li><Link to="/services#aerospace">Aerospace &amp; Custom Drones</Link></li>
            <li><Link to="/services#modelling">Custom 3D Models</Link></li>
            <li><Link to="/services#electronics">Electronics Design</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/accounts">My Account</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li><a href="mailto:Johnny.lu110306@gmail.com">Johnny.lu110306@gmail.com</a></li>
            <li><a href="tel:+447****2403">🇬🇧 +44 7421 272403</a></li>
            <li><a href="tel:+861****6559">🇨🇳 +86 168 0268 6559</a></li>
            <li><Link to="/contact">Start a Project</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© {year} <span>Trivect Aerospace</span>. All rights reserved.</span>
        <span className="footer-copy">Aerospace · Electronics · 3D · Drones · Rocketry</span>
      </div>
    </footer>
  );
}