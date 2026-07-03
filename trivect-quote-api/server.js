// Trivect Aerospace — Quote / Information Submission API
//
// A small Express server that:
//   - Accepts quote/information submissions from the website (POST /api/quote)
//   - Stores them in data/quotes.json (one JSON file, atomic writes)
//   - Provides admin login + JWT-protected endpoints to view/manage quotes
//   - Optionally proxies a list of registered customer accounts from the
//     existing auth backend if AUTH_API_BASE is set
//
// Configure via environment variables (see README.md):
//   PORT            default 3001
//   ADMIN_EMAIL     default luj_ceo-founder@trivect-aerospace.space
//   ADMIN_PASSWORD  REQUIRED — set this before first start
//   JWT_SECRET      REQUIRED — long random string
//   CORS_ORIGIN     default https://trivect-aerospace.space
//   AUTH_API_BASE   optional, e.g. http://localhost:3000  (the existing auth backend)

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PORT           = parseInt(process.env.PORT || '3001', 10);
const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL || 'luj_ceo-founder@trivect-aerospace.space').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const JWT_SECRET     = process.env.JWT_SECRET || '';
const CORS_ORIGIN    = process.env.CORS_ORIGIN || '*';
const AUTH_API_BASE  = process.env.AUTH_API_BASE || '';
const DATA_DIR       = path.join(__dirname, 'data');
const QUOTES_FILE    = path.join(DATA_DIR, 'quotes.json');

if (!ADMIN_PASSWORD) {
  console.error('[FATAL] ADMIN_PASSWORD env var is required.');
  console.error('       Set it before starting:  ADMIN_PASSWORD=yourpassword node server.js');
  process.exit(1);
}
if (!JWT_SECRET || JWT_SECRET.length < 16) {
  console.error('[FATAL] JWT_SECRET env var is required and must be at least 16 characters.');
  process.exit(1);
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(QUOTES_FILE)) fs.writeFileSync(QUOTES_FILE, '[]');

// ---------------------------------------------------------------------------
// Storage helpers (atomic JSON writes)
// ---------------------------------------------------------------------------
function readQuotes() {
  try { return JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8')); }
  catch (_) { return []; }
}
function writeQuotes(quotes) {
  const tmp = QUOTES_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(quotes, null, 2));
  fs.renameSync(tmp, QUOTES_FILE);
}

// ---------------------------------------------------------------------------
// JWT (HS256, zero deps)
// ---------------------------------------------------------------------------
function b64url(buf) {
  const b = Buffer.from(buf).toString('base64');
  return b.split('=').join('').split('+').join('-').split('/').join('_');
}
function b64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}
function signJwt(payload, expiresInSec = 60 * 60 * 8) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec };
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(body))}`;
  const sig = b64url(crypto.createHmac('sha256', JWT_SECRET).update(data).digest());
  return `${data}.${sig}`;
}
function verifyJwt(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expected = b64url(crypto.createHmac('sha256', JWT_SECRET).update(`${h}.${p}`).digest());
  if (s.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(b64urlDecode(p).toString('utf8'));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch (_) { return null; }
}

// ---------------------------------------------------------------------------
// Password hashing (PBKDF2 — no native deps)
// ---------------------------------------------------------------------------
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt] = stored.split(':');
  const expected = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(stored), Buffer.from(expected));
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json({ limit: '64kb' }));
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map(s => s.trim()),
  credentials: false,
}));

// --- Public: submit a quote --------------------------------------------------
app.post('/api/quote', (req, res) => {
  const { name, email, information, service } = req.body || {};
  const cleanName  = String(name  || '').trim().slice(0, 200);
  const cleanEmail = String(email || '').trim().toLowerCase().slice(0, 200);
  const cleanInfo  = String(information || '').slice(0, 5000);
  const cleanSvc   = String(service || '').slice(0, 200);

  if (!cleanName) return res.status(400).json({ error: 'Name is required.' });
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail)) return res.status(400).json({ error: 'Valid email is required.' });
  if (!cleanInfo) return res.status(400).json({ error: 'Information is required.' });

  const quotes = readQuotes();
  const quote = {
    id: crypto.randomBytes(8).toString('hex'),
    name: cleanName,
    email: cleanEmail,
    information: cleanInfo,
    service: cleanSvc,
    status: 'new',
    created_at: new Date().toISOString(),
  };
  quotes.unshift(quote);
  writeQuotes(quotes);

  console.log(`[quote] new from ${cleanEmail} — service="${cleanSvc || 'general'}"`);
  return res.json({ ok: true, message: '✓ Quote received. We will be in touch shortly.', id: quote.id });
});

// --- Admin: login -------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (cleanEmail !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials.' });
  const stored = hashPassword(ADMIN_PASSWORD);
  if (!verifyPassword(password || '', stored)) return res.status(401).json({ error: 'Invalid credentials.' });
  const token = signJwt({ sub: cleanEmail, role: 'admin' });
  return res.json({ ok: true, token });
});

// --- Admin: auth middleware ---------------------------------------------------
function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const payload = verifyJwt(token);
  if (!payload || payload.role !== 'admin') return res.status(401).json({ error: 'Unauthorized.' });
  req.admin = payload;
  next();
}

// --- Admin: list quotes -------------------------------------------------------
app.get('/api/admin/quotes', requireAdmin, (_req, res) => {
  return res.json({ ok: true, quotes: readQuotes() });
});

// --- Admin: update status -----------------------------------------------------
app.patch('/api/admin/quotes/:id', requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const ALLOWED = ['new', 'contacted', 'in_progress', 'closed'];
  if (!ALLOWED.includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  const quotes = readQuotes();
  const idx = quotes.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Quote not found.' });
  quotes[idx].status = status;
  quotes[idx].updated_at = new Date().toISOString();
  writeQuotes(quotes);
  return res.json({ ok: true, quote: quotes[idx] });
});

// --- Admin: delete ------------------------------------------------------------
app.delete('/api/admin/quotes/:id', requireAdmin, (req, res) => {
  const quotes = readQuotes();
  const next = quotes.filter(q => q.id !== req.params.id);
  if (next.length === quotes.length) return res.status(404).json({ error: 'Quote not found.' });
  writeQuotes(next);
  return res.json({ ok: true });
});

// --- Admin: list customer accounts (proxies existing auth backend) -----------
app.get('/api/admin/users', requireAdmin, async (_req, res) => {
  if (!AUTH_API_BASE) {
    return res.status(404).json({
      error: 'AUTH_API_BASE is not configured. Set it to the URL of your existing auth backend to enable user listing.',
    });
  }
  try {
    const r = await fetch(`${AUTH_API_BASE.replace(/\/$/, '')}/admin/users`, {
      headers: { Authorization: `Bearer ${process.env.AUTH_ADMIN_TOKEN || ''}` },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: data.error || `Auth backend returned ${r.status}` });
    return res.json({ ok: true, users: data.users || [] });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach auth backend.' });
  }
});

// --- Health -------------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'trivect-quote-api', ts: Date.now() }));

// --- 404 ----------------------------------------------------------------------
app.use((req, res) => res.status(404).json({ error: 'Not found.', path: req.path }));

// --- Start --------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[trivect-quote-api] listening on :${PORT}`);
  console.log(`  admin email: ${ADMIN_EMAIL}`);
  if (AUTH_API_BASE) console.log(`  auth backend proxy: ${AUTH_API_BASE}`);
  else               console.log(`  user listing disabled (set AUTH_API_BASE to enable)`);
});
