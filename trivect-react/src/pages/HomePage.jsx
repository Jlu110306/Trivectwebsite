import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const SLIDE_COUNT = 6;

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const trackRef = useRef(null);
  const touchStartX = useRef(0);

  const goTo = useCallback((n) => {
    const total = SLIDE_COUNT;
    const next = ((n % total) + total) % total;
    setCurrent(next);
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.7s cubic-bezier(0.77,0,0.18,1)';
      trackRef.current.style.transform = `translateX(-${next * 100}%)`;
    }
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 2000);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [current, goTo]);

  return (
    <div className="page-body">
      <style>{`
        #hero { position:relative; width:100%; height:100vh; overflow:hidden; display:flex; flex-direction:column; }
        .slider-track { position:absolute; inset:0; display:flex; }
        .slide { flex:0 0 100%; height:100%; background-color:#0a0a0a; background-size:cover; background-position:center; position:relative; }
        .slide::before { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.5) 40%,rgba(0,0,0,0.7) 100%); z-index:1; }
        .slide-placeholder { position:absolute; inset:0; z-index:0; display:flex; align-items:center; justify-content:center; }
        .slide-placeholder-grid { position:absolute; inset:-60%; background-image:radial-gradient(circle,rgba(192,192,192,0.13) 2.5px,transparent 2.5px); background-size:32px 32px; transform:rotate(67deg); }
        .slide-placeholder-label { position:relative; z-index:2; text-align:center; font-size:0.68rem; letter-spacing:3px; text-transform:uppercase; color:rgba(192,192,192,0.2); padding:12px 24px; }
        .hero-overlay { position:absolute; inset:0; z-index:3; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 5vw; }
        .hero-tagline { font-size:clamp(0.7rem,1.4vw,0.85rem); letter-spacing:5px; text-transform:uppercase; color:var(--red); margin-bottom:20px; font-weight:500; }
        .hero-title { font-size:clamp(2.4rem,6vw,5.5rem); font-weight:900; color:var(--white); letter-spacing:2px; line-height:1.05; margin-bottom:20px; text-shadow:0 2px 40px rgba(0,0,0,0.6); }
        .hero-title span { color:var(--red); }
        .hero-question { font-size:clamp(1.1rem,2.5vw,1.8rem); font-weight:300; color:var(--silver-light); letter-spacing:1px; margin-bottom:36px; font-style:italic; text-shadow:0 1px 20px rgba(0,0,0,0.8); }
        .hero-divider { width:60px; height:2px; background:var(--red); margin:0 auto 32px; position:relative; }
        .hero-divider::before,.hero-divider::after { content:''; position:absolute; top:50%; width:6px; height:6px; transform:translateY(-50%) rotate(45deg); }
        .hero-divider::before { left:-12px; } .hero-divider::after { right:-12px; }
        .hero-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
        .slider-dots { position:absolute; bottom:28px; left:50%; transform:translateX(-50%); z-index:10; display:flex; gap:10px; }
        .dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.3); cursor:pointer; border:none; transition:all 0.3s; }
        .dot.active { background:var(--red); transform:scale(1.3); }
        .slide-counter { position:absolute; bottom:28px; right:32px; z-index:10; font-size:0.7rem; letter-spacing:3px; color:rgba(255,255,255,0.4); }
        .slide-counter span { color:rgba(255,255,255,0.7); }

        #home-about { background:var(--dark2); }
        .home-about-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .about-visual { position:relative; aspect-ratio:1; max-width:420px; display:flex; align-items:center; justify-content:center; }
        .about-ring { position:absolute; border-radius:50%; border:1px solid rgba(192,192,192,0.08); }
        .about-ring:nth-child(1) { width:100%;height:100%; animation:spin 30s linear infinite; border-top-color:rgba(204,0,0,0.3); }
        .about-ring:nth-child(2) { width:72%;height:72%; animation:spin 20s linear infinite reverse; border-right-color:rgba(192,192,192,0.2); }
        .about-ring:nth-child(3) { width:46%;height:46%; animation:spin 12s linear infinite; border-top-color:rgba(204,0,0,0.4); }
        @keyframes spin { to { transform:rotate(360deg); } }
        .about-center { position:relative; z-index:2; }
        .about-text p { color:var(--silver-dark); line-height:1.9; margin-bottom:20px; font-size:0.95rem; }
        .pillars { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:28px; }
        .pillar { padding:14px 16px; background:rgba(255,255,255,0.02); position:relative; }
        .pillar::before { content:''; position:absolute; left:0;top:0;bottom:0; width:2px; background:var(--red); }
        .pillar-t { font-size:0.78rem; font-weight:700; color:var(--white); letter-spacing:1px; text-transform:uppercase; margin-bottom:4px; }
        .pillar-d { font-size:0.75rem; color:var(--silver-dark); }

        #home-services { background:var(--black); }
        .home-services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0; }
        .svc-card { background:var(--dark); padding:36px 28px; transition:background 0.3s; cursor:default; border:1px solid rgba(192,192,192,0.03); }
        .svc-card:hover { background:var(--dark3); }
        .svc-num { font-size:0.65rem; letter-spacing:3px; color:var(--red); text-transform:uppercase; margin-bottom:8px; display:block; }
        .svc-title { font-size:1rem; font-weight:700; color:var(--white); margin-bottom:10px; text-transform:uppercase; letter-spacing:1px; }
        .svc-desc { font-size:0.82rem; color:var(--silver-dark); line-height:1.7; margin-bottom:18px; }
        .svc-link { font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; color:var(--red); text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:8px; transition:gap 0.2s; }
        .svc-link:hover { gap:14px; }

        #home-process { background:var(--dark2); }
        .process-steps { display:grid; grid-template-columns:repeat(5,1fr); gap:0; position:relative; }
        .process-steps::before { content:''; position:absolute; top:36px; left:10%; right:10%; height:1px; background:rgba(192,192,192,0.1); }
        .p-step { text-align:center; padding:0 16px; position:relative; }
        .p-node { width:56px; height:56px; border-radius:50%; background:var(--dark); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; position:relative; z-index:1; }
        .p-num { font-size:0.82rem; font-weight:800; color:var(--red); }
        .p-title { font-size:0.82rem; font-weight:700; color:var(--white); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
        .p-desc { font-size:0.76rem; color:var(--silver-dark); line-height:1.6; }

        #home-projects { background:var(--black); }
        .proj-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .proj-card { background:var(--dark3); overflow:hidden; transition:transform 0.3s; }
        .proj-card:hover { transform:translateY(-6px); }
        .proj-img { height:200px; position:relative; }
        .proj-tag { position:absolute; top:14px; left:14px; background:var(--red); color:var(--white); font-size:0.65rem; letter-spacing:2px; text-transform:uppercase; padding:4px 12px; font-weight:600; z-index:2; }
        .proj-body { padding:22px; }
        .proj-title { font-size:0.95rem; font-weight:700; color:var(--white); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
        .proj-summary { font-size:0.82rem; color:var(--silver-dark); line-height:1.7; margin-bottom:18px; }
        .proj-link { font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; color:var(--red); text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:8px; transition:gap 0.2s; }
        .proj-link:hover { gap:14px; }

        #home-cta { background:var(--red); padding:80px 5vw; text-align:center; position:relative; overflow:hidden; }
        #home-cta::before { content:''; position:absolute; inset:0; background-image:linear-gradient(rgba(0,0,0,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.1) 1px,transparent 1px); background-size:40px 40px; }
        .cta-content { position:relative; z-index:2; }
        #home-cta h2 { font-size:clamp(1.8rem,4vw,3rem); font-weight:800; color:var(--white); text-transform:uppercase; letter-spacing:3px; margin-bottom:16px; }
        #home-cta p { font-size:1rem; color:rgba(255,255,255,0.8); margin-bottom:36px; max-width:500px; margin-left:auto; margin-right:auto; }
        #home-cta .btn-outline { color:var(--white); }

        @media(max-width:900px){ .home-about-grid{grid-template-columns:1fr} .home-services-grid{grid-template-columns:1fr 1fr} .process-steps{grid-template-columns:1fr 1fr;gap:32px} .process-steps::before{display:none} .proj-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:600px){ .home-services-grid{grid-template-columns:1fr} .proj-grid{grid-template-columns:1fr} .process-steps{grid-template-columns:1fr} .pillars{grid-template-columns:1fr} }
      `}</style>

      <section id="hero">
        <div className="slider-track" ref={trackRef}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
          }}>
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <div className="slide" key={i} data-slide={i + 1}>
              <div className="slide-placeholder">
                <div className="slide-placeholder-grid"></div>
                <div className="slide-placeholder-label">Slide {i + 1} — images/slide{i + 1}.jpg</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-overlay">
          <p className="hero-tagline">Aerospace · Electronics · Prototyping</p>
          <h1 className="hero-title">Trivect <span>Aerospace</span></h1>
          <p className="hero-question">Building the future of technology?</p>
          <div className="hero-divider"></div>
          <div className="hero-btns">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/about" className="btn-outline">About Us</Link>
          </div>
        </div>

        <div className="slider-dots">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button key={i} className={`dot ${i === current ? 'active' : ''}`}
                    onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <div className="slide-counter"><span>{current + 1}</span> / {SLIDE_COUNT}</div>
      </section>

      <section id="home-about">
        <div className="home-about-grid">
          <ScrollReveal><div className="about-visual">
            <div className="about-ring"></div><div className="about-ring"></div><div className="about-ring"></div>
            <div className="about-center"><img src="/images/logo.png" width="160" height="160" alt="Trivect Aerospace" style={{ objectFit: 'contain' }} /></div>
          </div></ScrollReveal>
          <ScrollReveal><div className="about-text">
            <span className="section-label">Who We Are</span>
            <h2 className="section-title">Precision Engineering<br/>Meets Innovation</h2>
            <div className="divider-line"></div>
            <p>Trivect Aerospace is an engineering company specialising in aerospace technologies, electronics design, 3D modelling, and rapid prototyping. We develop innovative solutions through advanced design tools, manufacturing techniques, and engineering expertise.</p>
            <p>From initial concept to functional prototype, we combine precision engineering with creative problem-solving to push the boundaries of what's possible.</p>
            <div className="pillars">
              <div className="pillar"><div className="pillar-t">Mission</div><div className="pillar-d">Design, develop, and prototype innovative aerospace and electronic systems</div></div>
              <div className="pillar"><div className="pillar-t">Vision</div><div className="pillar-d">A leading engineering company advancing aerospace and electronic technologies</div></div>
            </div>
            <div style={{ marginTop: 32 }}><Link to="/about" className="btn-outline">Learn More About Us</Link></div>
          </div></ScrollReveal>
        </div>
      </section>

      <section id="home-services">
        <div className="section-header centered">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Core Services</h2>
          <div className="divider-line"></div>
          <p className="section-subtitle">Comprehensive engineering solutions from concept to working prototype.</p>
        </div>
        <div className="home-services-grid">
          {[
            { num: '01', title: 'Aerospace Engineering', desc: 'Drone development, model rocketry, aerodynamics research, and flight systems.', to: '/services#aerospace' },
            { num: '02', title: '3D Modelling', desc: 'Professional CAD design for aerospace, robotics, and engineering projects.', to: '/services#modelling' },
            { num: '03', title: '3D Printing', desc: 'Rapid prototyping and custom manufacturing of engineering components.', to: '/services#printing' },
            { num: '04', title: 'Electronics Design', desc: 'PCB design, sensor integration, flight controllers, and embedded systems.', to: '/services#electronics' },
            { num: '05', title: 'Drone Development', desc: 'Custom airframes, flight controller integration, and autonomous systems.', to: '/services#drones' },
            { num: '06', title: 'Model Rocketry', desc: 'Aerodynamic design, structural modelling, recovery systems, and flight testing.', to: '/services#rocketry' },
          ].map(s => (
            <ScrollReveal key={s.num}><div className="svc-card">
              <span className="svc-num">{s.num}</span>
              <div className="svc-title">{s.title}</div>
              <p className="svc-desc">{s.desc}</p>
              <Link to={s.to} className="svc-link">Learn More →</Link>
            </div></ScrollReveal>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/services" className="btn-primary">View All Services</Link>
        </div>
      </section>

      <section id="home-process">
        <div className="section-header centered">
          <span className="section-label">How We Work</span>
          <h2 className="section-title">Engineering Process</h2>
          <div className="divider-line"></div>
        </div>
        <ScrollReveal><div className="process-steps">
          {[
            { num: '01', title: 'Concept & Research', desc: 'Define objectives and engineering specifications' },
            { num: '02', title: '3D Design', desc: 'CAD modelling and simulation in Fusion 360 / SolidWorks' },
            { num: '03', title: 'Electronics', desc: 'PCB design, firmware, and bench testing' },
            { num: '04', title: 'Manufacturing', desc: '3D printing, assembly, and integration' },
            { num: '05', title: 'Test & Iterate', desc: 'Flight testing, data review, and refinement' },
          ].map(s => (
            <div className="p-step" key={s.num}>
              <div className="p-node"><span className="p-num">{s.num}</span></div>
              <div className="p-title">{s.title}</div>
              <p className="p-desc">{s.desc}</p>
            </div>
          ))}
        </div></ScrollReveal>
      </section>

      <section id="home-projects">
        <div className="section-header">
          <span className="section-label">Featured Work</span>
          <h2 className="section-title">Recent Projects</h2>
          <div className="divider-line"></div>
          <p className="section-subtitle">A selection of engineering projects across our core specialisations.</p>
        </div>
        <div className="proj-grid">
          {[
            { tag: 'Drone', title: 'Custom Drone Development', desc: 'Custom quadcopter airframe with integrated flight controller and GPS navigation.' },
            { tag: 'PCB Design', title: 'Flight Controller PCB', desc: 'Custom flight controller board with IMU fusion, barometer, and embedded MCU.' },
            { tag: 'Rocketry', title: 'Model Rocket System', desc: 'Full rocket from aerodynamic CAD design through recovery system and launch testing.' },
          ].map((p, i) => (
            <ScrollReveal key={i}><div className="proj-card">
              <div className="proj-img img-placeholder" data-label={`Project Image — ${p.tag}`}>
                <span className="proj-tag">{p.tag}</span>
              </div>
              <div className="proj-body">
                <div className="proj-title">{p.title}</div>
                <p className="proj-summary">{p.desc}</p>
                <Link to="/portfolio" className="proj-link">View Project →</Link>
              </div>
            </div></ScrollReveal>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/portfolio" className="btn-outline">View Full Portfolio</Link>
        </div>
      </section>

      <section id="home-cta">
        <ScrollReveal><div className="cta-content">
          <h2>Let's Build the Future Together</h2>
          <p>Have a project in mind? Whether it's a drone, PCB, CAD model, or aerospace prototype — we're ready.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
            <Link to="/contact" className="btn-outline" style={{ background: '#000', clipPath: 'none' }}>Start a Project</Link>
          </div>
        </div></ScrollReveal>
      </section>
    </div>
  );
}
