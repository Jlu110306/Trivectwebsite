import { useState, useEffect, useRef } from 'react';

// Reusable modal that submits a quote/information request to the backend.
// Props:
//   open      - boolean, whether modal is visible
//   onClose   - callback to close the modal
//   service   - optional string, which service the user is enquiring about (e.g. "Aerospace & Custom Drones")
//   apiBase   - optional override for the API base path (defaults to '/api')
export default function QuoteModal({ open, onClose, service = '', apiBase = '/api' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [info, setInfo] = useState(service ? `Interested in: ${service}\n\n` : '');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: '', text: '' }); // 'ok' | 'err' | ''
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  // Reset form when modal opens; focus first field
  useEffect(() => {
    if (open) {
      setName(''); setEmail('');
      setInfo(service ? `Interested in: ${service}\n\n` : '');
      setStatus({ kind: '', text: '' });
      // Defer focus so the modal has rendered
      const t = setTimeout(() => firstInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open, service]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close when clicking the backdrop (but not the dialog itself)
  const onBackdropMouseDown = e => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ kind: '', text: '' });

    if (!name.trim()) return setStatus({ kind: 'err', text: 'Please enter your name.' });
    if (!email.trim()) return setStatus({ kind: 'err', text: 'Please enter your email.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setStatus({ kind: 'err', text: 'Please enter a valid email address.' });
    }
    if (!info.trim()) return setStatus({ kind: 'err', text: 'Please add some information about your project.' });

    setSubmitting(true);
    try {
      const r = await fetch(`${apiBase}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          information: info.trim(),
          service,
        }),
      });
      let data = {};
      try { data = await r.json(); } catch (_) { /* non-JSON response */ }
      if (r.ok) {
        setStatus({ kind: 'ok', text: data.message || '✓ Sent. We will be in touch shortly.' });
        // Auto-close after a brief moment so the user sees the success message
        setTimeout(() => onClose(), 1400);
      } else {
        setStatus({ kind: 'err', text: data.error || `✗ Send failed (HTTP ${r.status}).` });
      }
    } catch (err) {
      setStatus({ kind: 'err', text: '✗ Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="quote-modal-backdrop" onMouseDown={onBackdropMouseDown} role="presentation">
      <div className="quote-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
        <button type="button" className="quote-modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="quote-modal-header">
          <span className="quote-modal-label">Get a Quote</span>
          <h2 id="quote-modal-title" className="quote-modal-title">
            {service ? <>Tell us about your <span style={{ color: 'var(--red)' }}>{service}</span> project</> : 'Tell us about your project'}
          </h2>
          <div className="divider-line"></div>
        </div>

        <form className="quote-form" onSubmit={handleSubmit} noValidate>
          <div className="quote-form-row">
            <label htmlFor="qm-name">Name</label>
            <input
              id="qm-name"
              ref={firstInputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              maxLength={120}
              required
            />
          </div>

          <div className="quote-form-row">
            <label htmlFor="qm-email">Email</label>
            <input
              id="qm-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={200}
              required
            />
          </div>

          <div className="quote-form-row">
            <label htmlFor="qm-info">Information</label>
            <textarea
              id="qm-info"
              value={info}
              onChange={e => setInfo(e.target.value)}
              placeholder="Tell us about your project, requirements, timeline, budget, etc."
              rows={6}
              maxLength={5000}
              required
            />
            <span className="quote-form-counter">{info.length} / 5000</span>
          </div>

          {status.text && (
            <div className={`quote-form-status ${status.kind}`} role="alert">{status.text}</div>
          )}

          <div className="quote-form-actions">
            <button type="button" className="quote-btn cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="quote-btn send" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .quote-modal-backdrop {
          position: fixed; inset: 0; z-index: 3000;
          background: rgba(0,0,0,0.78);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: qm-fade 0.18s ease-out;
        }
        @keyframes qm-fade { from { opacity: 0; } to { opacity: 1; } }

        .quote-modal {
          position: relative;
          width: 100%;
          max-width: 520px;
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          background: var(--dark2, #111);
          border: 1px solid rgba(192,192,192,0.10);
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(204,0,0,0.10);
          padding: 36px 32px 28px;
          animation: qm-pop 0.18s ease-out;
        }
        @keyframes qm-pop {
          from { transform: translateY(8px) scale(0.985); opacity: 0; }
          to   { transform: none; opacity: 1; }
        }

        .quote-modal-close {
          position: absolute; top: 10px; right: 12px;
          width: 32px; height: 32px;
          background: none; border: none; cursor: pointer;
          color: var(--silver-dark, #888);
          font-size: 1.6rem; line-height: 1;
          transition: color 0.15s;
        }
        .quote-modal-close:hover { color: var(--white, #fff); }

        .quote-modal-header { margin-bottom: 22px; padding-right: 28px; }
        .quote-modal-label {
          font-size: 0.68rem; letter-spacing: 4px; text-transform: uppercase;
          color: var(--red, #CC0000); display: block; margin-bottom: 10px;
        }
        .quote-modal-title {
          font-size: 1.35rem; font-weight: 800; color: var(--white, #fff);
          letter-spacing: 1px; text-transform: uppercase; line-height: 1.2;
          margin: 0;
        }
        .quote-modal .divider-line { margin-top: 14px; margin-bottom: 0; }

        .quote-form { display: flex; flex-direction: column; gap: 18px; }
        .quote-form-row { display: flex; flex-direction: column; position: relative; }
        .quote-form-row label {
          font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase;
          color: var(--silver-dark, #888); margin-bottom: 8px;
        }
        .quote-form-row input,
        .quote-form-row textarea {
          background: var(--dark3, #1a1a1a);
          color: var(--silver, #C0C0C0);
          border: 1px solid rgba(192,192,192,0.12);
          padding: 12px 14px;
          font-family: var(--font, inherit);
          font-size: 0.92rem;
          outline: none;
          width: 100%;
          resize: vertical;
          transition: border-color 0.15s;
        }
        .quote-form-row input:focus,
        .quote-form-row textarea:focus { border-color: var(--red, #CC0000); }

        .quote-form-counter {
          position: absolute; right: 4px; bottom: 6px;
          font-size: 0.62rem; color: rgba(192,192,192,0.35);
          pointer-events: none;
        }

        .quote-form-status {
          font-size: 0.85rem; padding: 10px 12px;
          letter-spacing: 0.5px;
          border-left: 3px solid;
        }
        .quote-form-status.ok { color: #80ff80; background: rgba(128,255,128,0.06); border-color: #80ff80; }
        .quote-form-status.err { color: #ff8080; background: rgba(255,128,128,0.06); border-color: #ff8080; }

        .quote-form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 4px; }
        .quote-btn {
          background: none; border: none; padding: 12px 24px;
          font-family: var(--font, inherit); font-size: 0.78rem;
          letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
          cursor: pointer; transition: background 0.15s, color 0.15s, opacity 0.15s;
        }
        .quote-btn.cancel { color: var(--silver-dark, #888); }
        .quote-btn.cancel:hover { color: var(--white, #fff); }
        .quote-btn.send { background: var(--red, #CC0000); color: #fff; }
        .quote-btn.send:hover { background: var(--red-bright, #e60000); }
        .quote-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        @media (max-width: 560px) {
          .quote-modal { padding: 28px 20px 22px; }
          .quote-modal-title { font-size: 1.15rem; }
        }
      `}</style>
    </div>
  );
}