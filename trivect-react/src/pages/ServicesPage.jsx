import PageHero from '../components/PageHero';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'aerospace',
    num: '01',
    title: 'Aerospace & Custom Drone Development',
    desc: 'End-to-end aerospace engineering and custom drone development — from aerodynamic studies and airframe design through to fully flight-tested systems. We build custom drones, integrate flight controllers (ArduPilot, Betaflight, PX4), add autonomous navigation and GPS waypoint features, and payload-integrate cameras and sensors.',
    bullets: [
      'Computational fluid dynamics (CFD) and aerodynamic analysis',
      'Custom airframe design — multi-rotor, fixed-wing, and hybrid VTOL',
      'Flight controller tuning and integration',
      'Autonomous navigation — GPS waypoints, follow-me, object avoidance',
      'Payload integration — cameras, sensors, and telemetry',
      'Flight testing, data logging, and post-flight analysis',
    ],
    icon: <svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="24" rx="14" ry="5" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="20" y1="2" x2="20" y2="19" stroke="#C0C0C0" strokeWidth="1.5"/><line x1="7" y1="24" x2="2" y2="19" stroke="#888" strokeWidth="1.5"/><line x1="33" y1="24" x2="38" y2="19" stroke="#888" strokeWidth="1.5"/></svg>,
  },
  {
    id: 'modelling',
    num: '02',
    title: 'Custom 3D Models & Prototyping',
    desc: 'Professional 3D modelling and CAD design services for engineering projects. We create production-ready models optimised for 3D printing, CNC machining, and documentation — then turn them into physical prototypes using FDM, SLA, and SLS printing in PLA, ABS, PETG, TPU, and carbon-fibre composites.',
    bullets: [
      'Parametric CAD modelling (Fusion 360, SolidWorks)',
      'Geometry optimisation for 3D printing and CNC machining',
      'Assembly modelling, tolerance analysis, and interference checks',
      'Detailed technical drawings with GD&T',
      'FDM, SLA, and SLS 3D printing in PLA, ABS, PETG, TPU, and composites',
      'Post-processing — sanding, painting, assembly, and finishing',
    ],
    icon: <svg viewBox="0 0 40 40" fill="none"><rect x="5" y="5" width="30" height="30" stroke="#CC0000" strokeWidth="1.5" fill="none"/><rect x="11" y="11" width="8" height="8" stroke="#C0C0C0" strokeWidth="1" fill="none"/><rect x="22" y="11" width="8" height="8" stroke="#C0C0C0" strokeWidth="1" fill="none"/><rect x="11" y="22" width="8" height="8" stroke="#C0C0C0" strokeWidth="1" fill="none"/><circle cx="30" cy="30" r="4" stroke="#CC0000" strokeWidth="1.5" fill="none"/></svg>,
  },
  {
    id: 'electronics',
    num: '03',
    title: 'Electronics Design',
    desc: 'Professional electronics design and PCB development for aerospace, robotics, and IoT applications. From schematic capture and multi-layer PCB layout through to component sourcing, firmware development, and fully assembled tested boards — we handle the full electronics lifecycle.',
    bullets: [
      'PCB schematic design and layout (KiCad, Altium, Eagle)',
      'Multi-layer boards, RF considerations, and high-density interconnects',
      'Component selection, BOM management, and procurement support',
      'Firmware development — embedded C, Arduino, STM32',
      'Bench testing and validation of assembled boards',
    ],
    icon: <svg viewBox="0 0 40 40" fill="none"><rect x="2" y="5" width="36" height="28" rx="2" stroke="#CC0000" strokeWidth="1.5" fill="none"/><circle cx="11" cy="16" r="3" stroke="#C0C0C0" strokeWidth="1" fill="none"/><circle cx="29" cy="16" r="3" stroke="#C0C0C0" strokeWidth="1" fill="none"/><line x1="11" y1="16" x2="29" y2="16" stroke="#888" strokeWidth="1"/></svg>,
  },
];

export default function ServicesPage() {
  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        title="Our <span>Services</span>"
        subtitle="Three core engineering capabilities — from aerospace and drones to 3D design and electronics."
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="services-intro">
          <div className="intro-text reveal">
            <span className="section-label">What We Do</span>
            <h2 className="section-title">Three Services.<br/><span style={{ color: 'var(--red)' }}>End-to-End</span> Capability.</h2>
            <div className="divider-line"></div>
            <p>Trivect Aerospace focuses on three core engineering services designed to take your project from concept through to a working prototype. Aerospace and drone development, custom 3D models and prototyping, and electronics design — each one backed by hands-on experience, professional-grade tools, and a rigorous engineering process.</p>
            <p>We don't just design things — we build them, test them, and iterate until they work.</p>
          </div>
        </div>
      </section>

      {services.map(svc => (
        <section id={svc.id} key={svc.id} className="service-section">
          <div className="service-inner">
            <div className="service-visual reveal">
              <div className="service-icon-wrap">{svc.icon}</div>
            </div>
            <div className="service-content reveal">
              <span className="section-label">{svc.num}</span>
              <h2>{svc.title}</h2>
              <div className="divider-line"></div>
              <p>{svc.desc}</p>
              <ul className="service-list">
                {svc.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <div className="service-cta">
                <Link to="/contact" className="btn-primary">Send Info &amp; Get a Quote →</Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section style={{ background: 'var(--black)', textAlign: 'center' }} className="reveal">
        <span className="section-label" style={{ display: 'block', marginBottom: 16 }}>Ready to Start</span>
        <h2 className="section-title">Need Something <span style={{ color: 'var(--red)' }}>Custom?</span></h2>
        <p style={{ color: 'var(--silver-dark)', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.8 }}>Every project is different. Tell us what you're building and we'll put together a tailored service package that fits your requirements.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-primary">Start a Project</Link>
          <Link to="/portfolio" className="btn-outline">View Portfolio</Link>
        </div>
      </section>

      <style>{`
        .services-intro { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; max-width:880px; margin:0 auto; text-align:center; padding:60px 0; }
        .services-intro .divider-line { margin:24px auto; }
        .intro-text p { color:var(--silver-dark); line-height:1.9; margin-bottom:16px; font-size:0.95rem; }
        .service-section { padding:80px 5vw; background:var(--black); border-top:1px solid rgba(192,192,192,0.06); }
        .service-section:nth-of-type(odd) { background:var(--dark2); }
        .service-inner { display:grid; grid-template-columns:1fr 1.4fr; gap:64px; align-items:center; max-width:1200px; margin:0 auto; }
        .service-visual {
          aspect-ratio:1/1;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg, var(--dark3) 0%, rgba(204,0,0,0.08) 100%);
          border:1px solid rgba(204,0,0,0.25);
          position:relative;
        }
        .service-visual::before {
          content:'';
          position:absolute; inset:12px;
          border:1px solid rgba(192,192,192,0.08);
          pointer-events:none;
        }
        .service-icon-wrap { width:120px; height:120px; opacity:0.85; position:relative; z-index:1; }
        .service-content h2 { font-size:clamp(1.5rem,3vw,2.2rem); font-weight:800; color:var(--white); text-transform:uppercase; letter-spacing:2px; margin-bottom:14px; line-height:1.15; }
        .service-content p { color:var(--silver-dark); line-height:1.9; font-size:0.95rem; margin-bottom:23px; }
        .service-list { list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; margin-bottom:8px; }
        .service-list li { font-size:0.85rem; color:var(--silver-dark); padding-left:20px; position:relative; line-height:1.7; }
        .service-list li::before { content:'▸'; position:absolute; left:0; color:var(--red); }
        .service-cta { margin-top:32px; }
        @media(max-width:900px){
          .service-inner { grid-template-columns:1fr; gap:40px; }
          .service-visual { max-width:280px; margin:0 auto; }
          .service-list { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}