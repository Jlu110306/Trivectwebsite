import PageHero from '../components/PageHero';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'aerospace', num: '01', title: 'Aerospace Engineering', reverse: false,
    desc: 'Comprehensive aerospace engineering services covering the full spectrum from initial aerodynamic studies to advanced system integration. We bring deep technical knowledge and hands-on experience to every aerospace project.',
    bullets: ['Computational fluid dynamics (CFD) and aerodynamic analysis', 'Airframe structural design and weight optimisation', 'Flight system integration — sensors, controls, and telemetry', 'Failure mode analysis and reliability engineering'],
    imageLabel: 'Aerospace Engineering',
    icon: <svg viewBox="0 0 40 40" fill="none"><polygon points="20,2 38,36 2,36" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="20" y1="2" x2="20" y2="36" stroke="#888" strokeWidth="1"/><circle cx="20" cy="24" r="6" stroke="#C0C0C0" strokeWidth="1.5" fill="none"/></svg>
  },
  {
    id: 'modelling', num: '02', title: '3D Modelling & CAD Design', reverse: true,
    desc: 'Professional 3D modelling and CAD design services for engineering projects. We create production-ready models optimised for manufacturing, simulation, and documentation.',
    bullets: ['Parametric CAD modelling (Fusion 360, SolidWorks)', 'Geometry optimisation for 3D printing and CNC machining', 'Assembly modelling, tolerance analysis, and interference checks', 'Detailed technical drawings with GD&T'],
    imageLabel: '3D Modelling',
    icon: <svg viewBox="0 0 40 40" fill="none"><rect x="5" y="5" width="30" height="30" stroke="#CC0000" strokeWidth="1.5" fill="none"/><rect x="11" y="11" width="8" height="8" stroke="#C0C0C0" strokeWidth="1" fill="none"/><rect x="22" y="11" width="8" height="8" stroke="#C0C0C0" strokeWidth="1" fill="none"/><rect x="11" y="22" width="8" height="8" stroke="#C0C0C0" strokeWidth="1" fill="none"/><circle cx="30" cy="30" r="4" stroke="#CC0000" strokeWidth="1.5" fill="none"/></svg>
  },
  {
    id: 'printing', num: '03', title: '3D Printing & Prototyping', reverse: false,
    desc: 'Rapid prototyping and custom manufacturing services using a range of materials and technologies. Turn your CAD model into a physical prototype in days, not weeks.',
    bullets: ['FDM, SLA, and SLS 3D printing capabilities', 'Multi-material printing — PLA, ABS, PETG, TPU, carbon-fibre composites', 'Post-processing — sanding, painting, assembly, and finishing', 'Small-batch production and bespoke one-off manufacturing'],
    imageLabel: '3D Printing',
    icon: <svg viewBox="0 0 40 40" fill="none"><rect x="7" y="12" width="26" height="18" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="7" y1="17" x2="33" y2="17" stroke="#888" strokeWidth="1"/><rect x="14" y="5" width="12" height="7" stroke="#C0C0C0" strokeWidth="1" fill="none"/></svg>
  },
  {
    id: 'electronics', num: '04', title: 'Electronics Design', reverse: true,
    desc: 'Professional electronics design and PCB development services for aerospace, robotics, and IoT applications. From schematic capture through to fully assembled and tested boards.',
    bullets: ['PCB schematic design and layout (KiCad, Altium, Eagle)', 'Multi-layer boards, RF considerations, and high-density interconnects', 'Component selection, BOM management, and procurement support', 'Firmware development — embedded C, Arduino, STM32'],
    imageLabel: 'Electronics Design',
    icon: <svg viewBox="0 0 40 40" fill="none"><rect x="2" y="5" width="36" height="28" rx="2" stroke="#CC0000" strokeWidth="1.5" fill="none"/><circle cx="11" cy="16" r="3" stroke="#C0C0C0" strokeWidth="1" fill="none"/><circle cx="29" cy="16" r="3" stroke="#C0C0C0" strokeWidth="1" fill="none"/><line x1="11" y1="16" x2="29" y2="16" stroke="#888" strokeWidth="1"/></svg>
  },
  {
    id: 'drones', num: '05', title: 'Drone Development', reverse: false,
    desc: 'End-to-end drone development — from conceptual design through to a fully flight-tested system. We build custom airframes, integrate flight controllers, and deliver flying prototypes.',
    bullets: ['Custom airframe design — fixed-wing, multi-rotor, and hybrid VTOL', 'Flight controller selection, tuning, and integration (ArduPilot, Betaflight, PX4)', 'Autonomous navigation — GPS waypoint, follow-me, and object avoidance', 'Payload integration — cameras, sensors, and scientific instrumentation'],
    imageLabel: 'Drone Development',
    icon: <svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="24" rx="14" ry="5" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="20" y1="2" x2="20" y2="19" stroke="#C0C0C0" strokeWidth="1.5"/><line x1="7" y1="24" x2="2" y2="19" stroke="#888" strokeWidth="1.5"/><line x1="33" y1="24" x2="38" y2="19" stroke="#888" strokeWidth="1.5"/></svg>
  },
  {
    id: 'rocketry', num: '06', title: 'Model Rocketry', reverse: true,
    desc: 'Model rocketry design and development services — from aerodynamic simulation to flight testing. We design and build rockets that fly reliably, recover safely, and look great.',
    bullets: ['Aerodynamic design — nose cone profiles, fin geometry, and stability analysis', 'Structural modelling — materials selection, weight budgets, and strength analysis', 'Recovery systems — parachute sizing, ejection mechanisms, and dual-deployment', 'Flight testing — launch procedures, data logging, and post-flight analysis'],
    imageLabel: 'Model Rocketry',
    icon: <svg viewBox="0 0 40 40" fill="none"><polygon points="20,2 26,30 20,27 14,30" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="20" y1="30" x2="20" y2="38" stroke="#C0C0C0" strokeWidth="2"/></svg>
  },
];

export default function ServicesPage() {
  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        title="Our <span>Services</span>"
        subtitle="Engineering solutions across aerospace, electronics, 3D design, and prototyping."
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="services-intro">
          <div className="intro-text reveal">
            <span className="section-label">What We Do</span>
            <h2 className="section-title">End-to-End Engineering<br/>Under <span style={{ color: 'var(--red)' }}>One Roof</span></h2>
            <div className="divider-line"></div>
            <p>Trivect Aerospace offers a complete suite of engineering services designed to take your project from concept through to a working prototype — and beyond. With expertise spanning aerospace engineering, 3D modelling, 3D printing, electronics design, drone development, and model rocketry, we provide integrated solutions that most companies would need to subcontract across multiple firms.</p>
            <p>Every service is backed by hands-on experience, professional-grade tools, and a rigorous engineering process. We don't just design things — we build them, test them, and iterate until they work.</p>
          </div>
          <div className="service-visual img-placeholder reveal" data-label="Add Services Image">
            <span className="service-num-big">6</span>
            <span className="service-visual-label">6 Engineering Services — One Company</span>
          </div>
        </div>
      </section>

      {services.map(svc => (
        <section id={svc.id} key={svc.id} className={`service-section ${svc.reverse ? 'alt' : ''}`}>
          <div className={`service-inner ${svc.reverse ? 'reverse' : ''}`}>
            <div className="service-visual img-placeholder reveal" data-label={`${svc.title} Image`}>
              <span className="service-num-big">{svc.num}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={{ width: 80, height: 80, opacity: 0.3 }}>{svc.icon}</div>
              </div>
              <span className="service-visual-label">{svc.imageLabel}</span>
            </div>
            <div className="service-content reveal">
              <span className="section-label">{svc.num}</span>
              <h2>{svc.title}</h2>
              <div className="divider-line"></div>
              <p>{svc.desc}</p>
              <ul className="service-list">
                {svc.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <div style={{ marginTop: 28 }}>
                <Link to="/contact" className="btn-outline">Enquire About {svc.title} →</Link>
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
        .services-intro { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .intro-text p { color:var(--silver-dark); line-height:1.9; margin-bottom:16px; font-size:0.95rem; }
        .service-section { padding:80px 5vw; background:var(--black); }
        .service-section.alt { background:var(--dark2); }
        .service-inner { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }
        .service-inner.reverse .service-visual { order:2; }
        .service-inner.reverse .service-content { order:1; }
        .service-visual { aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; background:var(--dark3); position:relative; }
        .service-visual-label { position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); padding:8px 16px; font-size:0.65rem; letter-spacing:2px; text-transform:uppercase; color:rgba(192,192,192,0.4); text-align:center; }
        .service-num-big { position:absolute; top:16px; right:20px; font-size:4rem; font-weight:900; color:rgba(204,0,0,0.08); line-height:1; pointer-events:none; }
        .service-content h2 { font-size:clamp(1.5rem,3vw,2.2rem); font-weight:800; color:var(--white); text-transform:uppercase; letter-spacing:2px; margin-bottom:14px; line-height:1.15; }
        .service-content p { color:var(--silver-dark); line-height:1.9; font-size:0.92rem; margin-bottom:23px; }
        .service-list { list-style:none; display:flex; flex-direction:column; gap:8px; }
        .service-list li { font-size:0.85rem; color:var(--silver-dark); padding-left:20px; position:relative; line-height:1.7; }
        .service-list li::before { content:'▸'; position:absolute; left:0; color:var(--red); }
        @media(max-width:900px){ .services-intro,.service-inner { grid-template-columns:1fr; } .service-inner.reverse .service-visual { order:1; } .service-inner.reverse .service-content { order:2; } }
      `}</style>
    </div>
  );
}
