import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <span className="nav-logo-text">TRIVECT <span>AEROSPACE</span></span>
          </Link>
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
            <li><Link to="/services#aerospace">Aerospace Engineering</Link></li>
            <li><Link to="/services#modelling">3D Modelling</Link></li>
            <li><Link to="/services#printing">3D Printing</Link></li>
            <li><Link to="/services#electronics">Electronics Design</Link></li>
            <li><Link to="/services#drones">Drone Development</Link></li>
            <li><Link to="/services#rocketry">Model Rocketry</Link></li>
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
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li><a href="mailto:Johnny.lu110306@gmail.com">Johnny.lu110306@gmail.com</a></li>
            <li><a href="tel:+447421272403">🇬🇧 +44 7421 272403</a></li>
            <li><a href="tel:+8616802686559">🇨🇳 +86 168 0268 6559</a></li>
            <li><Link to="/contact">Start a Project</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2025 <span>Trivect Aerospace</span>. All rights reserved. "Made to Lift Off"</span>
        <span className="footer-copy">Aerospace · Electronics · 3D · Drones · Rocketry</span>
      </div>
    </footer>
  );
}
