import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { getAdminToken, clearAdminToken } from './AdminLogin';

const STATUSES = [
  { key: 'new',         label: 'New' },
  { key: 'contacted',   label: 'Contacted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'closed',      label: 'Closed' },
];

function authFetch(path, opts = {}) {
  const token = getAdminToken();
  return fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState('');

  // Redirect if no token
  if (!getAdminToken()) return <Navigate to="/admin" replace />;

  const loadQuotes = useCallback(async () => {
    setError('');
    try {
      const r = await authFetch('/api/admin/quotes');
      const data = await r.json().catch(() => ({}));
      if (r.status === 401) {
        clearAdminToken();
        navigate('/admin', { replace: true });
        return;
      }
      if (!r.ok) { setError(data.error || `Failed to load (HTTP ${r.status})`); return; }
      setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
    } catch (err) {
      setError('Network error loading quotes.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadUsers = useCallback(async () => {
    setUsersError('');
    try {
      const r = await authFetch('/api/admin/users');
      const data = await r.json().catch(() => ({}));
      if (r.ok && Array.isArray(data.users)) setUsers(data.users);
      else if (r.status === 404) setUsersError('User endpoint not configured on the backend yet.');
      else if (r.status === 401) setUsersError('Session expired — log in again.');
      else setUsersError(data.error || `Could not load users (HTTP ${r.status}).`);
    } catch (err) {
      setUsersError('Network error loading users.');
    }
  }, []);

  useEffect(() => { loadQuotes(); loadUsers(); }, [loadQuotes, loadUsers]);

  const updateStatus = async (id, status) => {
    try {
      const r = await authFetch(`/api/admin/quotes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (r.ok) {
        setQuotes(qs => qs.map(q => q.id === id ? { ...q, status } : q));
      } else if (r.status === 401) {
        clearAdminToken(); navigate('/admin', { replace: true });
      }
    } catch (_) { /* noop */ }
  };

  const deleteQuote = async (id) => {
    if (!confirm('Delete this quote permanently?')) return;
    try {
      const r = await authFetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
      if (r.ok) setQuotes(qs => qs.filter(q => q.id !== id));
    } catch (_) { /* noop */ }
  };

  const logout = () => {
    clearAdminToken();
    navigate('/admin', { replace: true });
  };

  const filtered = filter === 'all' ? quotes : quotes.filter(q => (q.status || 'new') === filter);
  const counts = STATUSES.reduce((acc, s) => { acc[s.key] = quotes.filter(q => (q.status || 'new') === s.key).length; return acc; }, {});

  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Dashboard' }]}
        title="Admin <span>Dashboard</span>"
        subtitle="Quotes, customer accounts, and submissions."
        style={{ minHeight: 200 }}
      />

      <section style={{ background: 'var(--black)', padding: '40px 5vw 100px' }}>
        <div className="admin-topbar">
          <div className="admin-stats">
            <div className="admin-stat"><span>{quotes.length}</span><label>Total</label></div>
            {STATUSES.map(s => (
              <div key={s.key} className="admin-stat"><span>{counts[s.key] || 0}</span><label>{s.label}</label></div>
            ))}
          </div>
          <button type="button" className="btn-outline admin-logout" onClick={logout}>Sign Out</button>
        </div>

        {error && <div className="admin-form-status err" style={{ marginBottom: 20 }}>{error}</div>}

        <div className="admin-tabs">
          <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All ({quotes.length})</button>
          {STATUSES.map(s => (
            <button key={s.key} type="button" className={filter === s.key ? 'active' : ''} onClick={() => setFilter(s.key)}>
              {s.label} ({counts[s.key] || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading">Loading quotes…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            {filter === 'all' ? 'No quotes yet. Submit one from the Services page to test.' : `No quotes with status "${filter}".`}
          </div>
        ) : (
          <div className="admin-quote-list">
            {filtered.map(q => {
              const status = q.status || 'new';
              const expanded = expandedId === q.id;
              return (
                <div key={q.id} className={`admin-quote-card status-${status}`}>
                  <button type="button" className="admin-quote-summary" onClick={() => setExpandedId(expanded ? null : q.id)}>
                    <div className="admin-quote-main">
                      <div className="admin-quote-name">{q.name || '(no name)'}</div>
                      <div className="admin-quote-email">{q.email}</div>
                    </div>
                    <div className="admin-quote-meta">
                      {q.service && <span className="admin-quote-service">{q.service}</span>}
                      <span className={`admin-quote-status-pill status-${status}`}>{status.replace('_', ' ')}</span>
                      <span className="admin-quote-date">{new Date(q.created_at).toLocaleString()}</span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="admin-quote-detail">
                      <div className="admin-quote-info-label">Project information</div>
                      <pre className="admin-quote-info">{q.information}</pre>

                      <div className="admin-quote-actions">
                        <label>Status:
                          <select value={status} onChange={e => updateStatus(q.id, e.target.value)}>
                            {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                          </select>
                        </label>
                        <button type="button" className="admin-quote-delete" onClick={() => deleteQuote(q.id)}>Delete</button>
                        <a className="admin-quote-mail" href={`mailto:${q.email}?subject=Re: Your Trivect Aerospace quote request`}>Reply by email</a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <h2 className="admin-section-h2">Customer Accounts</h2>
        {usersError && <div className="admin-form-status err" style={{ marginBottom: 12 }}>{usersError}</div>}
        {!usersError && users.length === 0 && <div className="admin-empty">No customer accounts visible. (The user list requires the existing auth backend to expose a users endpoint — see the quote API README.)</div>}
        {users.length > 0 && (
          <table className="admin-users-table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id || u.email}>
                  <td>{u.name || '—'}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <style>{`
        .admin-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        .admin-stats { display: flex; gap: 16px; flex-wrap: wrap; }
        .admin-stat {
          background: var(--dark2); border: 1px solid rgba(192,192,192,0.08);
          padding: 14px 22px; text-align: center; min-width: 90px;
        }
        .admin-stat span { display: block; font-size: 1.6rem; font-weight: 800; color: var(--white); }
        .admin-stat label { font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase; color: var(--silver-dark); margin-top: 4px; display: block; }
        .admin-logout { padding: 10px 22px; }

        .admin-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
        .admin-tabs button {
          background: var(--dark2); color: var(--silver-dark); border: 1px solid rgba(192,192,192,0.10);
          padding: 8px 16px; font-family: var(--font); font-size: 0.72rem;
          letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer;
        }
        .admin-tabs button:hover { color: var(--white); }
        .admin-tabs button.active { background: var(--red); color: #fff; border-color: var(--red); }

        .admin-loading, .admin-empty {
          padding: 40px; text-align: center; color: var(--silver-dark);
          background: var(--dark2); border: 1px dashed rgba(192,192,192,0.12);
        }

        .admin-quote-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 50px; }
        .admin-quote-card { background: var(--dark2); border: 1px solid rgba(192,192,192,0.08); border-left: 4px solid var(--silver-dark); }
        .admin-quote-card.status-new { border-left-color: var(--red); }
        .admin-quote-card.status-contacted { border-left-color: #f0c040; }
        .admin-quote-card.status-in_progress { border-left-color: #4aa8ff; }
        .admin-quote-card.status-closed { border-left-color: #4a4a4a; }

        .admin-quote-summary {
          display: flex; justify-content: space-between; align-items: center;
          width: 100%; padding: 16px 20px; background: none; border: none; cursor: pointer;
          color: var(--white); font-family: var(--font); text-align: left;
        }
        .admin-quote-summary:hover { background: rgba(255,255,255,0.02); }
        .admin-quote-name { font-size: 1rem; font-weight: 700; }
        .admin-quote-email { font-size: 0.78rem; color: var(--silver-dark); margin-top: 2px; }
        .admin-quote-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .admin-quote-service {
          font-size: 0.65rem; padding: 4px 10px; background: rgba(204,0,0,0.10);
          color: var(--red); letter-spacing: 1px; text-transform: uppercase;
        }
        .admin-quote-status-pill {
          font-size: 0.62rem; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 4px 10px; font-weight: 600;
        }
        .admin-quote-status-pill.status-new { background: rgba(204,0,0,0.18); color: var(--red); }
        .admin-quote-status-pill.status-contacted { background: rgba(240,192,64,0.18); color: #f0c040; }
        .admin-quote-status-pill.status-in_progress { background: rgba(74,168,255,0.18); color: #4aa8ff; }
        .admin-quote-status-pill.status-closed { background: rgba(192,192,192,0.10); color: var(--silver-dark); }
        .admin-quote-date { font-size: 0.7rem; color: var(--silver-dark); }

        .admin-quote-detail { padding: 0 20px 20px; border-top: 1px solid rgba(192,192,192,0.06); }
        .admin-quote-info-label { font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--silver-dark); margin: 14px 0 8px; }
        .admin-quote-info { white-space: pre-wrap; word-break: break-word; color: var(--silver); font-family: var(--font); font-size: 0.9rem; line-height: 1.7; margin: 0 0 16px; }
        .admin-quote-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid rgba(192,192,192,0.06); }
        .admin-quote-actions label { font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--silver-dark); display: flex; align-items: center; gap: 8px; }
        .admin-quote-actions select { background: var(--dark3); color: var(--silver); border: 1px solid rgba(192,192,192,0.12); padding: 6px 10px; font-family: var(--font); font-size: 0.82rem; }
        .admin-quote-delete { background: none; border: 1px solid #ff8080; color: #ff8080; padding: 6px 14px; font-family: var(--font); font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; }
        .admin-quote-delete:hover { background: rgba(255,128,128,0.10); }
        .admin-quote-mail { color: var(--silver); text-decoration: none; font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 14px; border: 1px solid rgba(192,192,192,0.2); }
        .admin-quote-mail:hover { color: var(--white); border-color: var(--white); }

        .admin-section-h2 { font-size: 1.2rem; font-weight: 800; color: var(--white); letter-spacing: 2px; text-transform: uppercase; margin: 30px 0 14px; }
        .admin-users-table { width: 100%; border-collapse: collapse; }
        .admin-users-table th, .admin-users-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid rgba(192,192,192,0.08); font-size: 0.85rem; }
        .admin-users-table th { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--silver-dark); }
        .admin-users-table td { color: var(--silver); }
      `}</style>
    </div>
  );
}