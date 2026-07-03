import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import PageHero from '../components/PageHero';

const ADMIN_TOKEN_KEY = 'trivect_admin_token';

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect straight to dashboard
  const existing = getAdminToken();
  if (existing) return <Navigate to="/admin/dashboard" replace />;

  useEffect(() => { setError(''); }, [email, password]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) return setError('Enter email and password.');
    setSubmitting(true);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(data.error || `Login failed (HTTP ${r.status}).`);
      }
    } catch (err) {
      setError('Network error. Is the quote API running?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Admin' }]}
        title="Admin <span>Login</span>"
        subtitle="Trivect Aerospace — internal dashboard"
        style={{ minHeight: 200 }}
      />
      <section style={{ background: 'var(--black)', padding: '60px 5vw 100px' }}>
        <div className="admin-login-wrap">
          <form className="admin-login-card" onSubmit={handleSubmit} noValidate>
            <span className="section-label">Restricted</span>
            <h2 className="admin-login-title">Sign in to dashboard</h2>
            <div className="divider-line"></div>

            <div className="admin-form-row">
              <label htmlFor="adm-email">Email</label>
              <input
                id="adm-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="luj_ceo-founder@trivect-aerospace.space"
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-form-row">
              <label htmlFor="adm-pw">Password</label>
              <input
                id="adm-pw"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="admin-form-status err">{error}</div>}

            <button type="submit" className="btn-primary admin-login-submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .admin-login-wrap { max-width: 460px; margin: 0 auto; }
        .admin-login-card {
          background: var(--dark2);
          border: 1px solid rgba(192,192,192,0.10);
          padding: 36px 32px;
        }
        .admin-login-title {
          font-size: 1.4rem; font-weight: 800; color: var(--white);
          letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 14px;
        }
        .admin-form-row { display: flex; flex-direction: column; margin-top: 18px; }
        .admin-form-row label {
          font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase;
          color: var(--silver-dark); margin-bottom: 8px;
        }
        .admin-form-row input {
          background: var(--dark3); color: var(--silver);
          border: 1px solid rgba(192,192,192,0.12);
          padding: 12px 14px; font-family: var(--font);
          font-size: 0.92rem; outline: none;
        }
        .admin-form-row input:focus { border-color: var(--red); }
        .admin-form-status {
          margin-top: 16px;
          font-size: 0.85rem; padding: 10px 12px;
          color: #ff8080; background: rgba(255,128,128,0.06);
          border-left: 3px solid #ff8080;
        }
        .admin-login-submit { margin-top: 22px; width: 100%; }
      `}</style>
    </div>
  );
}