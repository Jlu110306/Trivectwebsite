import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useAuth } from '../context/AuthContext';

export default function AccountsPage() {
  const { user, loading, login, register, logout, updateProfile, uploadAvatar } = useAuth();
  const [authTab, setAuthTab] = useState('login');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Dashboard
  const [activePanel, setActivePanel] = useState('overview');
  const [pfNickname, setPfNickname] = useState('');
  const [pfFirstName, setPfFirstName] = useState('');
  const [pfLastName, setPfLastName] = useState('');
  const [pfEmail, setPfEmail] = useState('');
  const [pfPhoneUK, setPfPhoneUK] = useState('');
  const [pfPhoneCN, setPfPhoneCN] = useState('');
  const [pfPassword, setPfPassword] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgColor, setSaveMsgColor] = useState('#80ff80');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [cropModalActive, setCropModalActive] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ dragging: false, start: { x: 0, y: 0 }, orig: { x: 0, y: 0 } });
  const cropCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setPfFirstName(user.name?.split(' ')[0] || '');
      setPfLastName(user.name?.split(' ').slice(1).join(' ') || '');
      setPfNickname(user.nickname || '');
      setPfEmail(user.email || '');
      setPfPhoneUK(user.phone_uk || '');
      setPfPhoneCN(user.phone_cn || '');
      setAvatarUrl(prev => prev || user.avatar_url || '');
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return setError('Please fill in all fields.');
    setLoggingIn(true);
    const { ok, error: err } = await login(loginEmail, loginPassword);
    setLoggingIn(false);
    if (!ok) setError(err || 'Invalid credentials.');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return setError('Please fill in all fields.');
    if (regPassword !== regConfirm) return setError('Passwords do not match.');
    if (regPassword.length < 8) return setError('Password must be at least 8 characters.');
    setLoggingIn(true);
    const { ok, error: err } = await register(regName, regEmail, regPassword);
    setLoggingIn(false);
    if (!ok) setError(err || 'Registration failed.');
  };

  const handleSaveProfile = async () => {
    const body = { name: `${pfFirstName} ${pfLastName}`.trim(), nickname: pfNickname, phone_uk: pfPhoneUK, phone_cn: pfPhoneCN };
    if (pfPassword && pfPassword.length >= 8) body.password = pfPassword;
    const { ok } = await updateProfile(body);
    setSaveMsg(ok ? '✓ Profile saved.' : '✗ Save failed.');
    setSaveMsgColor(ok ? '#80ff80' : '#e60000');
    setTimeout(() => setSaveMsg(''), 3000);
    if (ok) setPfPassword('');
  };

  const redrawCrop = () => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !cropImage) return;
    const ctx = canvas.getContext('2d');
    const size = 320;
    ctx.clearRect(0, 0, size, size);
    const s = cropScale;
    ctx.drawImage(cropImage, cropOffset.x, cropOffset.y, cropImage.width * s, cropImage.height * s);
  };

  useEffect(() => { redrawCrop(); }, [cropScale, cropOffset, cropImage]);

  const openCropModal = (img) => {
    setCropImage(img);
    setCropScale(1);
    setCropOffset({ x: 0, y: 0 });
    setCropModalActive(true);
  };

  const handleCropSave = async () => {
    if (!cropImage) return;
    const outSize = 256;
    // Stage 1: render the crop to a 320x320 canvas using the live-preview math.
    const stage = document.createElement('canvas');
    stage.width = 320; stage.height = 320;
    const sctx = stage.getContext('2d');
    sctx.fillStyle = '#1a1a1a';
    sctx.fillRect(0, 0, 320, 320);
    sctx.drawImage(cropImage, cropOffset.x, cropOffset.y,
                   cropImage.width * cropScale,
                   cropImage.height * cropScale);
    // Stage 2: scale the stage into the 256x256 circular output.
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outSize; outCanvas.height = outSize;
    const octx = outCanvas.getContext('2d');
    octx.fillStyle = '#1a1a1a';
    octx.fillRect(0, 0, outSize, outSize);
    octx.beginPath();
    octx.arc(outSize / 2, outSize / 2, outSize / 2, 0, Math.PI * 2);
    octx.clip();
    octx.drawImage(stage, 0, 0, 320, 320, 0, 0, outSize, outSize);
    const { ok, data } = await uploadAvatar(outCanvas.toDataURL('image/jpeg', 0.9));
    if (ok) {
      const newUrl = data?.user?.avatar_url || '';
      setAvatarUrl(newUrl ? newUrl + '?t=' + Date.now() : '');
      setSaveMsg('✓ Photo updated.'); setSaveMsgColor('#80ff80'); setTimeout(() => setSaveMsg(''), 3000);
    } else {
      setSaveMsg('✗ Upload failed.'); setSaveMsgColor('#e60000'); setTimeout(() => setSaveMsg(''), 3000);
    }
    setCropModalActive(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const img = new Image(); img.onload = () => openCropModal(img); img.src = ev.target.result; };
    reader.readAsDataURL(file);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--silver-dark)' }}>Loading...</div>;

  if (user) {
    const avatarSrc = avatarUrl || user.avatar_url || '';
    const initial = (user.nickname || user.name || '?').charAt(0).toUpperCase();

    return (
      <div className="page-body">
        <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]} title="My <span>Account</span>" subtitle="Manage your orders, details, and preferences." style={{ minHeight: 240 }} />
        <section style={{ background: 'var(--black)' }}>
          <div className="dashboard-grid">
            <div className="account-sidebar">
              <div className="account-profile-block">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: '2px solid var(--red)' }} />
                ) : (
                  <div className="account-avatar" id="avatarInitial">{initial}</div>
                )}
                <div className="account-name">{user.name}</div>
                <div className="account-email">{user.email}</div>
              </div>
              <ul className="account-nav">
                {[{ p: 'overview', l: 'Overview', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" stroke="#888" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" stroke="#888" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" stroke="#888" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" stroke="#888" strokeWidth="1.2"/></svg> },
                  { p: 'orders', l: 'My Orders', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1" stroke="#888" strokeWidth="1.2"/><line x1="1" y1="6" x2="13" y2="6" stroke="#888" strokeWidth="1.2"/></svg> },
                  { p: 'profile', l: 'Profile & Details', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="#888" strokeWidth="1.2"/><path d="M1 13 Q1 9 7 9 Q13 9 13 13" stroke="#888" strokeWidth="1.2" fill="none"/></svg> },
                  { p: 'addresses', l: 'Addresses', svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.8 1 3 2.8 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" stroke="#888" strokeWidth="1.2" fill="none"/><circle cx="7" cy="5" r="1.5" stroke="#888" strokeWidth="1" fill="none"/></svg> },
                ].map(({ p, l, svg }) => (
                  <li key={p}><a href="#" className={activePanel === p ? 'active' : ''} onClick={e => { e.preventDefault(); setActivePanel(p); }}>{svg}{l}</a></li>
                ))}
                <li><a href="#" style={{ color: '#CC0000' }} onClick={e => { e.preventDefault(); logout(); }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 7h8M10 4l3 3-3 3" stroke="#CC0000" strokeWidth="1.2"/><path d="M8 2H2v10h6" stroke="#888" strokeWidth="1.2" fill="none"/></svg>Sign Out</a></li>
              </ul>
            </div>
            <div>
              {activePanel === 'overview' && (
                <div>
                  <div className="panel-title">Account Overview</div>
                  <div className="account-stats">
                    <div className="account-stat"><span className="account-stat-num">2</span><span className="account-stat-label">Orders</span></div>
                    <div className="account-stat"><span className="account-stat-num">£174.97</span><span className="account-stat-label">Total Spent</span></div>
                    <div className="account-stat"><span className="account-stat-num">1</span><span className="account-stat-label">In Progress</span></div>
                  </div>
                  <div style={{ background: 'var(--dark2)', padding: 24 }}>
                    <div style={{ fontSize: '0.72rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>Latest Order</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--white)', marginBottom: 4 }}>Order #TA-0002 — Custom Flight Controller PCB</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--silver-dark)' }}>Placed 28 May 2025 · <span style={{ color: '#f0c040' }}>Processing</span></div>
                  </div>
                  <div style={{ marginTop: 24 }}><Link to="/shop" className="btn-primary">Continue Shopping</Link></div>
                </div>
              )}
              {activePanel === 'orders' && (
                <div>
                  <div className="panel-title">My Orders</div>
                  <table className="orders-table">
                    <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                      <tr><td style={{ color: 'var(--red)', fontWeight: 600 }}>#TA-0001</td><td>12 Apr 2025</td><td>Mini Quadcopter Build Kit</td><td>£129.99</td><td><span className="order-status status-delivered">Delivered</span></td></tr>
                      <tr><td style={{ color: 'var(--red)', fontWeight: 600 }}>#TA-0002</td><td>28 May 2025</td><td>Custom Flight Controller PCB × 2</td><td>£99.98</td><td><span className="order-status status-processing">Processing</span></td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activePanel === 'profile' && (
                <div>
                  <div className="panel-title">Profile & Details</div>
                  <div className="avatar-section" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
                    <img className="avatar-preview" src={avatarSrc} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--red)', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()} />
                    <div><button className="avatar-upload-btn" onClick={() => fileInputRef.current?.click()}>Change Photo</button><span style={{ fontSize: '0.62rem', color: 'var(--silver-dark)', display: 'block' }}>or drag & drop</span></div>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  </div>
                  <div className="profile-form">
                    <div className="form-group"><label>Nickname</label><input value={pfNickname} onChange={e => setPfNickname(e.target.value)} /></div>
                    <div className="form-group"><label>First Name</label><input value={pfFirstName} onChange={e => setPfFirstName(e.target.value)} /></div>
                    <div className="form-group"><label>Last Name</label><input value={pfLastName} onChange={e => setPfLastName(e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input value={pfEmail} onChange={e => setPfEmail(e.target.value)} /></div>
                    <div className="form-group"><label>Phone 🇬🇧</label><input value={pfPhoneUK} onChange={e => setPfPhoneUK(e.target.value)} /></div>
                    <div className="form-group"><label>Phone 🇨🇳</label><input value={pfPhoneCN} onChange={e => setPfPhoneCN(e.target.value)} /></div>
                    <div className="form-group"><label>New Password <span style={{ color: 'var(--silver-dark)', textTransform: 'none', letterSpacing: 0, fontSize: '0.65rem' }}>(leave blank to keep current)</span></label><input type="password" value={pfPassword} onChange={e => setPfPassword(e.target.value)} /></div>
                  </div>
                  <div style={{ marginTop: 24 }}><button className="save-btn" onClick={handleSaveProfile}>Save Changes</button></div>
                  {saveMsg && <div style={{ marginTop: 12, fontSize: '0.78rem', color: saveMsgColor }}>{saveMsg}</div>}
                </div>
              )}
              {activePanel === 'addresses' && (
                <div>
                  <div className="panel-title">Saved Addresses</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ background: 'var(--dark2)', padding: 24 }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>Default Address</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--silver)', lineHeight: 1.8 }}>Johnny Lu<br/>🇬🇧 United Kingdom<br/><span style={{ color: 'var(--silver-dark)' }}>Add your full address</span></div>
                    </div>
                    <div style={{ background: 'var(--dark3)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <div style={{ fontSize: '1.5rem', color: 'rgba(204,0,0,0.4)', marginBottom: 8 }}>+</div>
                      <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(192,192,192,0.3)' }}>Add New Address</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {cropModalActive && (
          <div id="crop-modal" className="active" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', background: 'rgba(0,0,0,0.92)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 320, height: 320, overflow: 'hidden', borderRadius: '50%' }}>
              <canvas ref={cropCanvasRef} width={320} height={320} style={{ cursor: 'move' }}
                onMouseDown={e => { dragRef.current = { dragging: true, start: { x: e.clientX, y: e.clientY }, orig: { ...cropOffset } }; }}
                onTouchStart={e => { dragRef.current = { dragging: true, start: { x: e.touches[0].clientX, y: e.touches[0].clientY }, orig: { ...cropOffset } }; }}
                onMouseMove={e => { if (dragRef.current.dragging) setCropOffset({ x: dragRef.current.orig.x + (e.clientX - dragRef.current.start.x), y: dragRef.current.orig.y + (e.clientY - dragRef.current.start.y) }); }}
                onTouchMove={e => { if (dragRef.current.dragging) setCropOffset({ x: dragRef.current.orig.x + (e.touches[0].clientX - dragRef.current.start.x), y: dragRef.current.orig.y + (e.touches[0].clientY - dragRef.current.start.y) }); }}
                onMouseUp={() => dragRef.current.dragging = false}
                onTouchEnd={() => dragRef.current.dragging = false}
              />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 0 9999px rgba(0,0,0,0.65), inset 0 0 0 3px rgba(255,255,255,0.9)', pointerEvents: 'none' }} />
            </div>
            <div style={{ marginTop: 20 }}>
              <input type="range" min="50" max="200" value={cropScale * 100} onChange={e => setCropScale(parseInt(e.target.value) / 100)} style={{ width: 260, accentColor: 'var(--red)' }} />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                <button className="crop-cancel" onClick={() => setCropModalActive(false)} style={{ background: 'transparent', color: 'var(--silver)', border: '1px solid rgba(192,192,192,0.2)', padding: '10px 24px', cursor: 'pointer', fontFamily: 'var(--font)' }}>Cancel</button>
                <button onClick={handleCropSave} style={{ background: 'var(--red)', color: '#fff', border: 'none', padding: '10px 24px', cursor: 'pointer', fontFamily: 'var(--font)' }}>Crop & Save</button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .dashboard-grid { display:grid; grid-template-columns:240px 1fr; gap:40px; align-items:start; }
          .account-sidebar { background:var(--dark2); overflow:hidden; }
          .account-profile-block { padding:28px 24px; text-align:center; }
          .account-avatar { width:64px; height:64px; border-radius:50%; background:rgba(204,0,0,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:1.4rem; font-weight:800; color:var(--red); }
          .account-name { font-size:0.9rem; font-weight:700; color:var(--white); margin-bottom:4px; }
          .account-email { font-size:0.75rem; color:var(--silver-dark); }
          .account-nav { list-style:none; }
          .account-nav li a { display:flex; align-items:center; gap:12px; padding:14px 24px; color:var(--silver-dark); text-decoration:none; font-size:0.82rem; letter-spacing:1px; text-transform:uppercase; border-left:2px solid transparent; transition:all 0.2s; }
          .account-nav li a:hover,.account-nav li a.active { color:var(--white); border-left-color:var(--red); background:rgba(255,255,255,0.02); }
          .panel-title { font-size:0.78rem; letter-spacing:3px; text-transform:uppercase; color:var(--red); margin-bottom:24px; padding-bottom:16px; }
          .account-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; }
          .account-stat { background:var(--dark3); padding:20px; text-align:center; }
          .account-stat-num { font-size:1.8rem; font-weight:900; color:var(--white); display:block; }
          .account-stat-label { font-size:0.65rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-top:4px; }
          .orders-table { width:100%; border-collapse:collapse; }
          .orders-table th { font-size:0.65rem; letter-spacing:3px; text-transform:uppercase; color:var(--silver-dark); padding:10px 16px; text-align:left; }
          .orders-table td { padding:16px; font-size:0.85rem; color:var(--silver); }
          .orders-table tr:hover td { background:rgba(255,255,255,0.02); }
          .order-status { font-size:0.65rem; letter-spacing:2px; text-transform:uppercase; padding:3px 10px; font-weight:700; }
          .status-processing { background:rgba(180,120,0,0.2); color:#f0c040; }
          .status-delivered { background:rgba(0,100,0,0.2); color:#80ff80; }
          .profile-form { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
          .profile-form .form-group { display:flex; flex-direction:column; }
          .profile-form .form-group label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:8px; }
          .profile-form .form-group input { background:var(--dark3); color:var(--silver); padding:13px 16px; font-size:0.9rem; font-family:var(--font); outline:none; border:1px solid rgba(192,192,192,0.1); width:100%; }
          .save-btn { background:var(--red); color:var(--white); border:none; padding:12px 28px; font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); }
          .save-btn:hover { background:var(--red-bright); }
          .avatar-upload-btn { background:transparent; color:var(--silver); border:1px solid rgba(192,192,192,0.2); padding:8px 18px; font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); }
          @media(max-width:900px){ .dashboard-grid { grid-template-columns:1fr; } .account-stats { grid-template-columns:1fr 1fr; } }
          @media(max-width:580px){ .account-stats { grid-template-columns:1fr; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-body">
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]} title="My <span>Account</span>" subtitle="Manage your orders, details, and preferences." style={{ minHeight: 240 }} />
      <section style={{ background: 'var(--black)' }} id="authSection">
        <div className="auth-tabs" style={{ display: 'flex', maxWidth: 480, margin: '0 auto 48px' }}>
          <button className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => { setAuthTab('login'); setError(''); }}>Sign In</button>
          <button className={`auth-tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => { setAuthTab('register'); setError(''); }}>Create Account</button>
        </div>
        {error && <div style={{ display: 'block', maxWidth: 480, margin: '0 auto 16px', padding: '12px 16px', background: 'rgba(204,0,0,0.1)', borderLeft: '2px solid var(--red)', color: 'var(--red-bright)', fontSize: '0.78rem' }}>{error}</div>}
        {authTab === 'login' && (
          <div className="auth-panel active" style={{ maxWidth: 480, margin: '0 auto' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group"><label>Email</label><input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" /></div>
              <div className="form-group"><label>Password</label><input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" /></div>
              <button type="submit" className="auth-submit" disabled={loggingIn}>{loggingIn ? 'Signing in...' : 'Sign In →'}</button>
              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--silver-dark)' }}>Don't have an account? <a href="#" onClick={e => { e.preventDefault(); setAuthTab('register'); }} style={{ color: 'var(--red)', textDecoration: 'none' }}>Create one</a></div>
            </form>
          </div>
        )}
        {authTab === 'register' && (
          <div className="auth-panel active" style={{ maxWidth: 480, margin: '0 auto' }}>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group"><label>Full Name</label><input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your name" /></div>
              <div className="form-group"><label>Email</label><input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="your@email.com" /></div>
              <div className="form-group"><label>Password</label><input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Min. 8 characters" /></div>
              <div className="form-group"><label>Confirm Password</label><input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="Repeat password" /></div>
              <button type="submit" className="auth-submit" disabled={loggingIn}>{loggingIn ? 'Creating account...' : 'Create Account →'}</button>
              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--silver-dark)' }}>Already have an account? <a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); }} style={{ color: 'var(--red)', textDecoration: 'none' }}>Sign in</a></div>
            </form>
          </div>
        )}
      </section>
      <style>{`
        .auth-tab { flex:1; padding:14px; background:var(--dark3); cursor:pointer; text-align:center; font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); font-family:var(--font); border:1px solid rgba(192,192,192,0.06); }
        .auth-tab.active { background:rgba(204,0,0,0.08); color:var(--white); border-color:rgba(204,0,0,0.2); }
        .auth-submit { background:var(--red); color:var(--white); border:none; padding:14px; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); }
        .auth-submit:hover { background:var(--red-bright); }
        .auth-submit:disabled { opacity:0.5; }
        label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:8px; display:block; }
        input { background:var(--dark3); color:var(--silver); padding:13px 16px; font-size:0.9rem; font-family:var(--font); outline:none; border:1px solid rgba(192,192,192,0.1); width:100%; }
      `}</style>
    </div>
  );
}
