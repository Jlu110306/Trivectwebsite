import { useState } from 'react';
import PageHero from '../components/PageHero';
import ScrollReveal from '../components/ScrollReveal';

const projects = [
  { cat: 'drone', tag: 'Drone', title: 'Custom Quadcopter Airframe',
    desc: 'Custom-designed 250mm quadcopter airframe with integrated electronics bay. Optimised for weight and stiffness using Fusion 360 generative design tools.',
    tech: 'Fusion 360 · FEA Analysis · Carbon Fibre' },
  { cat: 'pcb', tag: 'PCB Design', title: 'Flight Controller PCB',
    desc: 'Four-layer PCB with STM32F405 MCU, MPU-9250 IMU, BMP388 barometer, and integrated GPS. Designed from scratch with full schematic review and bench testing.',
    tech: 'KiCad · Embedded C · Sensor Fusion' },
  { cat: 'rocketry', tag: 'Rocketry', title: 'Model Rocket System',
    desc: 'Full model rocket design from CAD to launch pad. Includes aerodynamic optimisation, recovery system design, and three successful test flights.',
    tech: 'OpenRocket · Fusion 360 · Flight Testing' },
  { cat: 'printing', tag: '3D Printing', title: 'Engineering Prototype Parts',
    desc: 'Series of precision 3D printed components for a research drone project. Printed in carbon-fibre-reinforced nylon with tight tolerances for structural mounting.',
    tech: 'PrusaSlicer · Nylon CF · Post-Processing' },
  { cat: 'electronics', tag: 'Electronics', title: 'Sensor Integration Module',
    desc: 'Custom sensor breakout board integrating GPS, IMU, altimeter, and magnetometer into a single compact module for drone applications.',
    tech: 'PCB Design · I²C Bus · Sensor Calibration' },
  { cat: 'modelling', tag: 'CAD Design', title: 'Aerodynamic Nose Cone',
    desc: 'Parametric CAD model of an optimised nose cone profile for a high-performance model rocket. Includes computational flow analysis and 3D printable output.',
    tech: 'Fusion 360 · CFD · Parametric Design' },
];

const cats = ['all', 'drone', 'pcb', 'rocketry', 'printing', 'electronics', 'modelling'];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? projects : projects.filter(p => p.cat === filter);

  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Portfolio' }]}
        title="Our <span>Portfolio</span>"
        subtitle="A selection of engineering projects across all our core specialisations."
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="filter-bar">
          {cats.map(c => (
            <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
              {c === 'all' ? 'All Projects' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {filtered.map((p, i) => (
            <ScrollReveal key={i}>
              <div className="port-card">
                <div className="port-img img-placeholder" data-label={`${p.tag} Image`}>
                  <div className="port-img-placeholder-inner">
                    <span style={{ fontSize: '0.65rem', letterSpacing: 2, color: 'rgba(192,192,192,0.3)' }}>{p.tag}</span>
                  </div>
                  <span className="port-tag">{p.tag}</span>
                </div>
                <div className="port-body">
                  <div className="port-title">{p.title}</div>
                  <p className="port-desc">{p.desc}</p>
                  <div className="port-tech">{p.tech.split(' · ').map((t, j) => <span key={j}>{t}</span>)}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <style>{`
        .filter-bar { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:48px; }
        .filter-btn { padding:8px 20px; background:transparent; color:var(--silver-dark); font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-family:var(--font); border:1px solid rgba(192,192,192,0.1); }
        .filter-btn:hover,.filter-btn.active { background:var(--red); color:var(--white); border-color:var(--red); }
        .portfolio-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
        .port-card { background:var(--dark3); overflow:hidden; transition:transform 0.3s; display:flex; flex-direction:column; }
        .port-card:hover { transform:translateY(-6px); }
        .port-img { height:220px; position:relative; }
        .port-img-placeholder-inner { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:var(--dark2); }
        .port-tag { position:absolute; top:14px; left:14px; background:var(--red); color:var(--white); font-size:0.62rem; letter-spacing:2px; text-transform:uppercase; padding:4px 10px; font-weight:700; z-index:2; }
        .port-body { padding:22px; flex:1; display:flex; flex-direction:column; }
        .port-title { font-size:0.92rem; font-weight:700; color:var(--white); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
        .port-desc { font-size:0.82rem; color:var(--silver-dark); line-height:1.7; margin-bottom:14px; flex:1; }
        .port-tech { display:flex; gap:6px; flex-wrap:wrap; }
        .port-tech span { font-size:0.62rem; letter-spacing:1px; color:var(--silver); background:rgba(204,0,0,0.1); padding:3px 8px; }
        @media(max-width:900px){ .portfolio-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:600px){ .portfolio-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
