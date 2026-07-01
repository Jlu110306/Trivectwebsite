import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, loading, updateProfile, uploadAvatar } = useAuth();
  const navigate = useNavigate();

  const [pfFirstName, setPfFirstName] = useState('');
  const [pfLastName, setPfLastName] = useState('');
  const [pfNickname, setPfNickname] = useState('');
  const [pfAccountNumber, setPfAccountNumber] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Avatar crop
  const [cropModalActive, setCropModalActive] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ dragging: false, start: { x: 0, y: 0 }, orig: { x: 0, y: 0 } });
  const cropCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/accounts');
    if (user) {
      setPfFirstName(user.name?.split(' ')[0] || '');
      setPfLastName(user.name?.split(' ').slice(1).join(' ') || '');
      setPfNickname(user.nickname || '');
      setPfAccountNumber(user.account_number || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user, loading, navigate]);

  const handleSave = async () => {
    setSaving(true);
    const body = { name: `${pfFirstName} ${pfLastName}`.trim(), nickname: pfNickname, account_number: pfAccountNumber };
    const { ok } = await updateProfile(body);
    setSaveMsg(ok ? '✓ Profile saved.' : '✗ Save failed.');
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const redrawCrop = () => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !cropImage) return;
    const ctx = canvas.getContext('2d');
    const size = 320;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(cropImage, cropOffset.x, cropOffset.y, cropImage.width * cropScale, cropImage.height * cropScale);
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
    const outCanvas = document.createElement('canvas');
    outCanvas.width = 256; outCanvas.height = 256;
    const octx = outCanvas.getContext('2d');
    octx.beginPath(); octx.arc(128, 128, 128, 0, Math.PI * 2); octx.clip();
    octx.drawImage(cropImage, cropOffset.x, cropOffset.y, cropImage.width * cropScale, cropImage.height * cropScale, 0, 0, 256, 256);
    const { ok, data } = await uploadAvatar(outCanvas.toDataURL('image/jpeg', 0.85));
    if (ok) setAvatarUrl((data?.user?.avatar_url || '') + '?t=' + Date.now());
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
  if (!user) return null;

  const initial = (pfNickname || user?.name || '?').charAt(0).toUpperCase();
  const displayAccount = pfAccountNumber || user?.account_number || '@--------';

  return (
    <div className="profile-page">
      <ScrollReveal>
        <div className="profile-card">
          <div className="profile-header">
            <h1>My Profile</h1>
            <div className="acct-number">{displayAccount}</div>
          </div>

          <div className="avatar-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}
               onDragOver={e => e.preventDefault()}
               onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) { const r = new FileReader(); r.onload = ev => { const img = new Image(); img.onload = () => openCropModal(img); img.src = ev.target.result; }; r.readAsDataURL(f); } }}>
            {avatarUrl ? (
              <img className="avatar-preview" src={avatarUrl} alt="Profile" onClick={() => fileInputRef.current?.click()} title="Click or drag to change" style={{ display: 'block' }} />
            ) : (
              <div className="avatar-preview default" onClick={() => fileInputRef.current?.click()} title="Click or drag to change">{initial}</div>
            )}
            <button className="avatar-change-btn" onClick={() => fileInputRef.current?.click()}>Change Photo</button>
            <span className="avatar-drag-hint">or drag & drop an image here</span>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          <div className="profile-form">
            <div className="form-group"><label>First Name</label><input placeholder="First name" value={pfFirstName} onChange={e => setPfFirstName(e.target.value)} /></div>
            <div className="form-group"><label>Last Name</label><input placeholder="Last name" value={pfLastName} onChange={e => setPfLastName(e.target.value)} /></div>
            <div className="form-group full"><label>Nickname</label><input placeholder="How should we call you?" value={pfNickname} onChange={e => setPfNickname(e.target.value)} /></div>
            <div className="form-group full"><label>Account Number</label><input placeholder="@XX00000000" maxLength={12} value={pfAccountNumber} onChange={e => setPfAccountNumber(e.target.value)} /></div>
            <div className="save-msg" style={{ display: saveMsg ? 'block' : 'none', color: saveMsg.includes('✓') ? '#80ff80' : '#e60000', textAlign: 'center', gridColumn: '1/-1' }}>{saveMsg}</div>
            <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      </ScrollReveal>

      {cropModalActive && (
        <div className="crop-modal active" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.92)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="crop-container" style={{ position: 'relative', width: 320, height: 320, overflow: 'hidden', borderRadius: '50%' }}>
            <canvas ref={cropCanvasRef} width={320} height={320} style={{ cursor: 'move' }}
              onMouseDown={e => { dragRef.current = { dragging: true, start: { x: e.clientX, y: e.clientY }, orig: { ...cropOffset } }; }}
              onTouchStart={e => { dragRef.current = { dragging: true, start: { x: e.touches[0].clientX, y: e.touches[0].clientY }, orig: { ...cropOffset } }; }}
              onMouseMove={e => { if (dragRef.current.dragging) setCropOffset({ x: dragRef.current.orig.x + (e.clientX - dragRef.current.start.x), y: dragRef.current.orig.y + (e.clientY - dragRef.current.start.y) }); }}
              onTouchMove={e => { if (dragRef.current.dragging) setCropOffset({ x: dragRef.current.orig.x + (e.touches[0].clientX - dragRef.current.start.x), y: dragRef.current.orig.y + (e.touches[0].clientY - dragRef.current.start.y) }); }}
              onMouseUp={() => dragRef.current.dragging = false}
              onTouchEnd={() => dragRef.current.dragging = false}
            />
          </div>
          <div className="crop-controls" style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <label style={{ fontSize: '0.68rem', color: 'var(--silver-dark)', letterSpacing: 2, textTransform: 'uppercase' }}>Scale</label>
            <input type="range" min="50" max="200" value={cropScale * 100} onChange={e => setCropScale(parseInt(e.target.value) / 100)} style={{ width: 160, accentColor: 'var(--red)' }} />
          </div>
          <div className="crop-actions" style={{ display: 'flex', gap: 16, marginTop: 20 }}>
            <button className="crop-btn cancel" onClick={() => setCropModalActive(false)} style={{ background: 'none', color: 'var(--silver-dark)', border: 'none', padding: '12px 32px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '0.78rem', letterSpacing: 2, textTransform: 'uppercase' }}>Cancel</button>
            <button className="crop-btn save" onClick={handleCropSave} style={{ background: 'var(--red)', color: '#fff', border: 'none', padding: '12px 32px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '0.78rem', letterSpacing: 2, textTransform: 'uppercase' }}>Crop & Save</button>
          </div>
        </div>
      )}

      <style>{`
        .profile-page { min-height:100vh; padding:120px 5vw 80px; display:flex; justify-content:center; }
        .profile-card { max-width:560px; width:100%; background:var(--dark2); border:1px solid rgba(192,192,192,0.06); padding:48px 40px; }
        .profile-header { text-align:center; margin-bottom:36px; }
        .profile-header h1 { font-size:1.6rem; font-weight:800; color:var(--white); letter-spacing:2px; text-transform:uppercase; }
        .acct-number { font-size:0.78rem; color:var(--silver-dark); letter-spacing:2px; font-family:monospace; margin-top:8px; }
        .avatar-preview { width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid var(--red); cursor:pointer; }
        .avatar-preview.default { display:flex; align-items:center; justify-content:center; font-size:2.8rem; font-weight:800; color:var(--red); background:rgba(204,0,0,0.08); }
        .avatar-change-btn { margin-top:12px; font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); background:none; border:none; cursor:pointer; font-family:var(--font); }
        .avatar-change-btn:hover { color:var(--red); }
        .avatar-drag-hint { font-size:0.62rem; color:rgba(192,192,192,0.25); margin-top:6px; }
        .profile-form { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .profile-form .full { grid-column:1/-1; }
        .profile-form .form-group { display:flex; flex-direction:column; }
        .profile-form label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:8px; }
        .profile-form input { background:var(--dark3); color:var(--silver); border:1px solid rgba(192,192,192,0.1); padding:13px 16px; font-size:0.9rem; font-family:var(--font); outline:none; width:100%; }
        .profile-form input:focus { border-color:var(--red); }
        .save-btn { background:var(--red); color:var(--white); border:none; padding:14px; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); grid-column:1/-1; margin-top:8px; }
        .save-btn:hover { background:var(--red-bright); }
        .save-btn:disabled { opacity:0.5; }
        @media(max-width:580px){ .profile-card { padding:32px 20px; } .profile-form { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
