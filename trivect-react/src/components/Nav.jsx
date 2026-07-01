import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Nav.css';

const PROFILE_ICON = (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
);

export default function Nav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navBg, setNavBg] = useState(false);
  const dropdownRef = useRef(null);

  const currentPage = location.pathname === '/' ? 'index' : location.pathname.replace('/', '').split('/')[0];

  useEffect(() => {
    const handleScroll = () => setNavBg(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const navLinks = [
    { to: '/', page: 'index', label: 'Home' },
    { to: '/about', page: 'about', label: 'About' },
    { to: '/services', page: 'services', label: 'Services' },
    { to: '/portfolio', page: 'portfolio', label: 'Portfolio' },
    { to: '/shop', page: 'shop', label: 'Shop' },
    { to: '/contact', page: 'contact', label: 'Contact' },
    { to: '/accounts', page: 'accounts', label: 'Account' },
  ];

  const nick = user ? (user.nickname || user.name?.split(' ')[0]) : null;

  return (
    <>
      <nav id="site-nav" style={{ background: navBg ? 'rgba(0,0,0,0.98)' : 'rgba(0,0,0,0.92)' }}>
        <Link to="/" className="nav-logo">
          <span className="nav-logo-text">TRIVECT <span>AEROSPACE</span></span>
        </Link>
        <ul className="nav-links">
          {navLinks.map(l => (
            <li key={l.page}>
              <Link to={l.to} className={currentPage === l.page ? 'active' : ''}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <span id="nav-user-slot">
          {user ? (
            <span className="nav-avatar-btn" ref={dropdownRef} onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
              <img className="nav-avatar-img" src={user.avatar_url || '/images/logo.png'}
                   alt={nick} onError={(e) => e.target.src = '/images/logo.png'} />
              <span className="nav-avatar-nick">{nick}</span>
              {dropdownOpen && (
                <div className="nav-dropdown open">
                  <Link to="/accounts" onClick={() => setDropdownOpen(false)}>My Account</Link>
                  <Link to="/accounts" onClick={() => setDropdownOpen(false)}>Orders</Link>
                  <div className="drop-divider"></div>
                  <button className="drop-signout" onClick={() => { logout(); setDropdownOpen(false); }}>Sign Out</button>
                </div>
              )}
            </span>
          ) : (
            <Link to="/shop" className="nav-cta">Shop Now</Link>
          )}
        </span>
        <span id="nav-profile-slot">
          {user ? (
            <Link to="/profile" className="nav-profile-btn has-avatar" title="Profile">
              <img src={user.avatar_url || '/images/logo.png'} alt={nick}
                   onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = PROFILE_ICON; e.target.parentNode.classList.remove('has-avatar'); }} />
            </Link>
          ) : (
            <Link to="/accounts" className="nav-profile-btn" title="Sign In / My Account">
              {PROFILE_ICON}
            </Link>
          )}
        </span>
        <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} role="button" tabIndex={0}>
          <span></span><span></span><span></span>
        </div>
      </nav>
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map(l => (
            <Link key={l.page} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}
          <Link to="/shop" className="btn-primary" style={{ marginTop: 8, textAlign: 'center', clipPath: 'none' }}
                onClick={() => setMobileOpen(false)}>Shop Now</Link>
        </div>
      )}
    </>
  );
}
