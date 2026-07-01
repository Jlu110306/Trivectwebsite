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
  const [avatarMsg, setAvatarMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const dragRef = useRef({ dragging: false, start: { x: 0, y: 0 }, orig: { x: 0, y: 0 } });
  const cropCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/accounts');
    if (user) {
      setPfFirstName(user.name?.split(' ')[0] || '');
      setPfLastName(user.name?.split(' ').slice(1).join(' ') || '');
      setPfNickname(user.nickname || '');
      setPfAccountNumber(user.account_number || '');
      // Only seed avatarUrl from user when we don't already have one set locally.
      // (After an upload we set it with a cache-buster; we don't want to overwrite that
      // with the stale URL from user.avatar_url on the next effect run.)
      // Always append a cache-buster so the browser can't serve a stale cached image
      // (it might have cached the old/empty 1x1 avatar from before this user's fix).
      setAvatarUrl(prev => {
        if (prev) return prev;
        if (!user.avatar_url) return '';
        return user.avatar_url + '?t=' + Date.now();
      });
    }
  }, [user, loading, navigate]);

  const handleSave = async () => {
    setSaving(true);
    const body = { name: `${pfFirstName} ${pfLastName}`.trim(), nickname: pfNickname, account_number: pfAccountNumber };
    const { ok, error } = await updateProfile(body);
    setSaveMsg(ok ? '✓ Profile saved.' : (error ? `✗ ${error}` : '✗ Save failed.'));
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // Center-crop helpers ---------------------------------------------------
  const fitImageToCanvas = (img, canvasW = 320, canvasH = 320) => {
    // Choose a scale that makes the smaller side cover the canvas, then center.
    const scale = Math.max(canvasW / img.width, canvasH / img.height);
    const drawnW = img.width * scale;
    const drawnH = img.height * scale;
    return { scale, offset: { x: (canvasW - drawnW) / 2, y: (canvasH - drawnH) / 2 } };
  };

  const redrawCrop = () => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !cropImage) return;
    const ctx = canvas.getContext('2d');
    const size = 320;
    ctx.clearRect(0, 0, size, size);
    // Filled background so transparent PNGs crop against a neutral color.
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(cropImage, cropOffset.x, cropOffset.y, cropImage.width * cropScale, cropImage.height * cropScale);
  };

  useEffect(() => { redrawCrop(); }, [cropScale, cropOffset, cropImage]);

  const openCropModal = (img) => {
    setCropImage(img);
    const { scale, offset } = fitImageToCanvas(img, 320, 320);
    setCropScale(scale);
    setCropOffset(offset);
    setCropModalActive(true);
    setAvatarMsg('');
  };

  const handleCropSave = async () => {
    if (!cropImage) return;
    setUploading(true);
    setAvatarMsg('');
    try {
      // Stage 1: render the cropped image to a 320x320 canvas using the SAME
      // math the live preview uses (5-arg drawImage, cropOffset is the
      // destination position, scale is the user-controlled zoom).
      const stage = document.createElement('canvas');
      stage.width = 320; stage.height = 320;
      const sctx = stage.getContext('2d');
      sctx.fillStyle = '#1a1a1a';
      sctx.fillRect(0, 0, 320, 320);
      sctx.drawImage(cropImage, cropOffset.x, cropOffset.y,
                     cropImage.width * cropScale,
                     cropImage.height * cropScale);
      // Stage 2: scale the 320x320 stage to 256x256 with a circular clip.
      const outCanvas = document.createElement('canvas');
      outCanvas.width = 256; outCanvas.height = 256;
      const octx = outCanvas.getContext('2d');
      octx.fillStyle = '#1a1a1a';
      octx.fillRect(0, 0, 256, 256);
      octx.beginPath(); octx.arc(128, 128, 128, 0, Math.PI * 2); octx.clip();
      octx.drawImage(stage, 0, 0, 320, 320, 0, 0, 256, 256);
      const dataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
      const { ok, data, error } = await uploadAvatar(dataUrl);
      if (ok) {
        const newUrl = data?.user?.avatar_url || '';
        setAvatarUrl(newUrl ? newUrl + '?t=' + Date.now() : '');
        setAvatarMsg('✓ Photo updated.');
      } else {
        setAvatarMsg(error ? `✗ ${error}` : '✗ Upload failed.');
      }
    } catch (err) {
      setAvatarMsg('✗ ' + (err?.message || 'Upload error.'));
    } finally {
      setUploading(false);
      setCropModalActive(false);
      setTimeout(() => setAvatarMsg(''), 4000);
    }
  };

  // --- File picking & drag/drop -----------------------------------------
  const pickFile = () => {
    // Reset value first so picking the same file twice still triggers change.
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarMsg('✗ Please choose an image file.');
      setTimeout(() => setAvatarMsg(''), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => openCropModal(img);
      img.onerror = () => {
        setAvatarMsg('✗ Could not read image.');
        setTimeout(() => setAvatarMsg(''), 3000);
      };
      img.src = ev.target.result;
    };
    reader.onerror = () => {
      setAvatarMsg('✗ Could not read file.');
      setTimeout(() => setAvatarMsg(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarMsg('✗ Please drop an image file.');
      setTimeout(() => setAvatarMsg(''), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => openCropModal(img);
      img.onerror = () => {
        setAvatarMsg('✗ Could not read image.');
        setTimeout(() => setAvatarMsg(''), 3000);
      };
      img.src = ev.target.result;
    };
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

          <div
            className={`avatar-section${dragOver ? ' is-dragover' : ''}`}
            onDragEnter={e => { e.preventDefault(); setDragOver(true); }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={e => { if (e.currentTarget.contains(e.relatedTarget)) return; setDragOver(false); }}
            onDrop={handleDrop}
          >
            <div className="avatar-wrap" onClick={pickFile} title="Click or drag to change">
              <div className="avatar-ring">
                {avatarUrl ? (
                  <img className="avatar-preview" src={avatarUrl} alt="Profile" />
                ) : (
                  <div className="avatar-preview default">{initial}</div>
                )}
                <div className="avatar-overlay">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 7h3l2-2h6l2 2h3v12H4z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span>Change</span>
                </div>
              </div>
            </div>
            <button type="button" className="avatar-change-btn" onClick={pickFile}>Change Photo</button>
            <span className="avatar-drag-hint">or drag &amp; drop an image here</span>
            {avatarMsg && (
              <div className={`avatar-msg ${avatarMsg.startsWith('✓') ? 'ok' : 'err'}`}>{avatarMsg}</div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
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
        <div className="crop-modal active">
          <div className="crop-frame">
            <div className="crop-container">
              <canvas
                ref={cropCanvasRef}
                width={320}
                height={320}
                style={{ cursor: 'move', display: 'block' }}
                onMouseDown={e => { dragRef.current = { dragging: true, start: { x: e.clientX, y: e.clientY }, orig: { ...cropOffset } }; }}
                onTouchStart={e => { dragRef.current = { dragging: true, start: { x: e.touches[0].clientX, y: e.touches[0].clientY }, orig: { ...cropOffset } }; }}
                onMouseMove={e => { if (dragRef.current.dragging) setCropOffset({ x: dragRef.current.orig.x + (e.clientX - dragRef.current.start.x), y: dragRef.current.orig.y + (e.clientY - dragRef.current.start.y) }); }}
                onTouchMove={e => { if (dragRef.current.dragging) setCropOffset({ x: dragRef.current.orig.x + (e.touches[0].clientX - dragRef.current.start.x), y: dragRef.current.orig.y + (e.touches[0].clientY - dragRef.current.start.y) }); }}
                onMouseUp={() => dragRef.current.dragging = false}
                onMouseLeave={() => dragRef.current.dragging = false}
                onTouchEnd={() => dragRef.current.dragging = false}
              />
              <div className="crop-mask" aria-hidden="true" />
            </div>
          </div>
          <div className="crop-controls">
            <label>Scale</label>
            <input type="range" min="50" max="300" value={Math.round(cropScale * 100)} onChange={e => setCropScale(parseInt(e.target.value, 10) / 100)} />
          </div>
          <div className="crop-actions">
            <button type="button" className="crop-btn cancel" onClick={() => setCropModalActive(false)} disabled={uploading}>Cancel</button>
            <button type="button" className="crop-btn save" onClick={handleCropSave} disabled={uploading}>{uploading ? 'Uploading...' : 'Crop & Save'}</button>
          </div>
        </div>
      )}

      <style>{`
        .profile-page { min-height:100vh; padding:120px 5vw 80px; display:flex; justify-content:center; }
        .profile-card { max-width:560px; width:100%; background:var(--dark2); border:1px solid rgba(192,192,192,0.06); padding:48px 40px; }
        .profile-header { text-align:center; margin-bottom:36px; }
        .profile-header h1 { font-size:1.6rem; font-weight:800; color:var(--white); letter-spacing:2px; text-transform:uppercase; }
        .acct-number { font-size:0.78rem; color:var(--silver-dark); letter-spacing:2px; font-family:monospace; margin-top:8px; }

        .avatar-section { display:flex; flex-direction:column; align-items:center; margin-bottom:36px; padding:20px; border-radius:12px; transition:background 0.2s, border-color 0.2s; }
        .avatar-section.is-dragover { background:rgba(204,0,0,0.08); outline:2px dashed var(--red); outline-offset:-8px; }

        .avatar-wrap { position:relative; cursor:pointer; }
        .avatar-ring {
          position:relative; width:130px; height:130px; border-radius:50%;
          padding:5px; /* room for the border so it's never clipped */
          background:#1a1a1a;
          box-shadow:0 0 0 3px var(--red), 0 0 0 5px rgba(204,0,0,0.25), 0 6px 20px rgba(0,0,0,0.5);
          transition:box-shadow 0.2s, transform 0.2s;
        }
        .avatar-wrap:hover .avatar-ring { box-shadow:0 0 0 3px var(--red-bright), 0 0 0 7px rgba(230,0,0,0.35), 0 8px 24px rgba(0,0,0,0.6); transform:translateY(-1px); }
        .avatar-preview {
          width:120px; height:120px; border-radius:50%; object-fit:cover; display:block;
          background:#1a1a1a;
        }
        .avatar-preview.default {
          display:flex; align-items:center; justify-content:center;
          font-size:2.8rem; font-weight:800; color:var(--red);
          background:rgba(204,0,0,0.08);
        }
        .avatar-overlay {
          position:absolute; inset:5px; border-radius:50%;
          background:rgba(0,0,0,0.55); color:#fff;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
          font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; font-weight:600;
          opacity:0; transition:opacity 0.2s;
          pointer-events:none;
        }
        .avatar-wrap:hover .avatar-overlay,
        .avatar-wrap:focus-visible .avatar-overlay { opacity:1; }

        .avatar-change-btn { margin-top:14px; font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); background:none; border:none; cursor:pointer; font-family:var(--font); }
        .avatar-change-btn:hover { color:var(--red); }
        .avatar-drag-hint { font-size:0.62rem; color:rgba(192,192,192,0.4); margin-top:6px; letter-spacing:1px; text-transform:uppercase; }
        .avatar-msg { margin-top:12px; font-size:0.78rem; letter-spacing:1px; text-align:center; }
        .avatar-msg.ok { color:#80ff80; }
        .avatar-msg.err { color:#e60000; }
        .avatar-section input[type="file"] { display:none; }

        .profile-form { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .profile-form .full { grid-column:1/-1; }
        .profile-form .form-group { display:flex; flex-direction:column; }
        .profile-form label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:8px; }
        .profile-form input { background:var(--dark3); color:var(--silver); border:1px solid rgba(192,192,192,0.1); padding:13px 16px; font-size:0.9rem; font-family:var(--font); outline:none; width:100%; }
        .profile-form input:focus { border-color:var(--red); }
        .save-btn { background:var(--red); color:var(--white); border:none; padding:14px; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); grid-column:1/-1; margin-top:8px; }
        .save-btn:hover { background:var(--red-bright); }
        .save-btn:disabled { opacity:0.5; }

        .crop-modal { display:flex; position:fixed; inset:0; z-index:2000; background:rgba(0,0,0,0.92); flex-direction:column; align-items:center; justify-content:center; padding:24px; }
        .crop-frame { position:relative; padding:6px; border-radius:50%; box-shadow:0 0 0 3px var(--red), 0 0 0 5px rgba(204,0,0,0.25), 0 0 20px rgba(204,0,0,0.15); }
        .crop-container { position:relative; width:320px; height:320px; overflow:hidden; border-radius:50%; background:#1a1a1a; }
        .crop-mask { position:absolute; inset:0; border-radius:50%; box-shadow:inset 0 0 0 3px rgba(255,255,255,0.9); pointer-events:none; }
        .crop-controls { margin-top:24px; display:flex; align-items:center; gap:20px; }
        .crop-controls label { font-size:0.68rem; color:var(--silver-dark); letter-spacing:2px; text-transform:uppercase; }
        .crop-controls input[type="range"] { width:200px; accent-color:var(--red); }
        .crop-actions { display:flex; gap:16px; margin-top:24px; }
        .crop-btn { background:none; border:none; padding:12px 32px; cursor:pointer; font-family:var(--font); font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; transition:opacity 0.2s; }
        .crop-btn.cancel { color:var(--silver-dark); }
        .crop-btn.cancel:hover { color:var(--white); }
        .crop-btn.save { background:var(--red); color:#fff; }
        .crop-btn.save:hover { background:var(--red-bright); }
        .crop-btn:disabled { opacity:0.5; cursor:not-allowed; }

        @media(max-width:580px){ .profile-card { padding:32px 20px; } .profile-form { grid-template-columns:1fr; } .crop-container { width:260px; height:260px; } .crop-container canvas { width:260px; height:260px; } }
      `}</style>
    </div>
  );
}