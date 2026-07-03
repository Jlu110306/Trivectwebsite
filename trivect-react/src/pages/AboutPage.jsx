import PageHero from '../components/PageHero';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        title="About <span>Trivect</span>"
        subtitle="Engineering company specialising in aerospace, electronics, 3D modelling, and rapid prototyping."
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="story-grid">
          <ScrollReveal><div className="story-img">
            <img src="/images/Other/Hex%20Lamp.png" alt="Hex Lamp — 3D printed by Trivect Aerospace" />
          </div></ScrollReveal>
          <ScrollReveal><div className="story-text">
            <span className="section-label">Our Story</span>
            <h2 className="section-title">Built on Engineering<br/>and <span style={{ color: 'var(--red)' }}>Innovation</span></h2>
            <div className="divider-line"></div>
            <p>Trivect Aerospace was founded with a clear purpose: to push the boundaries of what's achievable through engineering. The company was built by engineers who believe that the best solutions come from deep technical expertise, hands-on prototyping, and a relentless drive to improve.</p>
            <p>Starting with a focus on drone development and electronics design, Trivect Aerospace quickly expanded into 3D modelling, 3D printing, and model rocketry — building a complete end-to-end engineering capability that few companies of our size can match.</p>
            <p>Every project we take on goes through the same rigorous process: concept and research, 3D design and simulation, electronics development, prototype manufacturing, and real-world testing. We don't ship until it works.</p>
          </div></ScrollReveal>
        </div>
      </section>

      <section style={{ background: 'var(--dark2)' }}>
        <div className="section-header centered">
          <span className="section-label">Purpose</span>
          <h2 className="section-title">Mission &amp; Vision</h2>
          <div className="divider-line"></div>
        </div>
        <ScrollReveal><div className="mv-grid">
          <div className="mv-card">
            <span className="mv-label">Mission</span>
            <div className="mv-title">What We Do Every Day</div>
            <p className="mv-text">Trivect Aerospace is focused on designing, developing, and prototyping innovative aerospace and electronic systems. We combine precision engineering with creativity to deliver solutions that actually work — not just on paper, but in the real world.</p>
            <p className="mv-text" style={{ marginTop: 14 }}>We specialise in 3D modelling, 3D printing, PCB and electronics design, drones, and model rocketry — always using the best available tools and always with a prototype-first approach.</p>
          </div>
          <div className="mv-card">
            <span className="mv-label">Vision</span>
            <div className="mv-title">Where We're Going</div>
            <p className="mv-text">To become a leading engineering company that develops advanced aerospace and electronic technologies through design, prototyping, and innovation. We want Trivect Aerospace to be the name people think of when they need serious engineering done right.</p>
            <p className="mv-text" style={{ marginTop: 14 }}>We are building toward larger, more ambitious projects — more advanced drones, more complex electronics, and more sophisticated aerospace systems — all rooted in the same engineering discipline we started with.</p>
          </div>
        </div></ScrollReveal>
      </section>

      <section style={{ background: 'var(--black)' }}>
        <div className="section-header centered">
          <span className="section-label">What Drives Us</span>
          <h2 className="section-title">Core Values</h2>
          <div className="divider-line"></div>
        </div>
        <ScrollReveal><div className="values-grid">
          {[
            { title: 'Precision', text: 'Every measurement, every design decision, and every solder joint matters. We hold ourselves to the highest engineering standards.',
              icon: <svg viewBox="0 0 44 44" fill="none"><polygon points="22,3 41,38 3,38" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="22" y1="16" x2="22" y2="28" stroke="#C0C0C0" strokeWidth="1.5"/><circle cx="22" cy="32" r="1.5" fill="#C0C0C0"/></svg> },
            { title: 'Innovation', text: "We don't copy — we create. Every project is an opportunity to develop something new, something better, something that didn't exist before.",
              icon: <svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="16" stroke="#CC0000" strokeWidth="1.5" fill="none"/><path d="M16 22 Q22 12 28 22 Q22 32 16 22Z" stroke="#C0C0C0" strokeWidth="1" fill="none"/></svg> },
            { title: 'Reliability', text: "If it leaves our workshop, it works. We test rigorously, iterate honestly, and only deliver systems we're confident in.",
              icon: <svg viewBox="0 0 44 44" fill="none"><rect x="6" y="6" width="32" height="32" rx="4" stroke="#CC0000" strokeWidth="1.5" fill="none"/><path d="M14 22 L20 28 L30 16" stroke="#C0C0C0" strokeWidth="1.8" strokeLinecap="round"/></svg> },
            { title: 'Efficiency', text: 'Smart design means less waste, lighter systems, and better performance. We optimise everything — from weight to manufacturing time.',
              icon: <svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="12" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="22" y1="6" x2="22" y2="10" stroke="#C0C0C0" strokeWidth="1.5"/><line x1="22" y1="34" x2="22" y2="38" stroke="#C0C0C0" strokeWidth="1.5"/><line x1="6" y1="22" x2="10" y2="22" stroke="#C0C0C0" strokeWidth="1.5"/><line x1="34" y1="22" x2="38" y2="22" stroke="#C0C0C0" strokeWidth="1.5"/><line x1="22" y1="22" x2="28" y2="17" stroke="#CC0000" strokeWidth="1.5"/></svg> },
          ].map(v => (
            <div className="value-card" key={v.title}>
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <p className="value-text">{v.text}</p>
            </div>
          ))}
        </div></ScrollReveal>
      </section>

      <div className="team-section">
        <div className="section-header centered">
          <span className="section-label">The Team</span>
          <h2 className="section-title">People Behind the Engineering</h2>
          <div className="divider-line"></div>
        </div>
        <ScrollReveal><div className="team-note">
          <p>Trivect Aerospace is built by engineers who are passionate about aerospace, electronics, and making things that fly, compute, and perform. We are a small, focused team — which means every project gets real attention, real expertise, and a real commitment to getting it right.</p>
          <p style={{ marginTop: 14 }}>As we grow, we bring in specialists who share our standards and our ambition. If you're an engineer who wants to work on genuinely interesting projects, <Link to="/contact" style={{ color: 'var(--red)', textDecoration: 'none' }}>get in touch</Link>.</p>
        </div></ScrollReveal>
      </div>

      <section style={{ background: 'var(--dark2)' }}>
        <div className="section-header">
          <span className="section-label">What's Next</span>
          <h2 className="section-title">Future Goals</h2>
          <div className="divider-line"></div>
          <p className="section-subtitle">Where Trivect Aerospace is heading over the next few years.</p>
        </div>
        <ScrollReveal><div className="future-grid">
          {[
            { title: 'Advanced Drone Platforms', text: 'Developing long-range, autonomous drone systems with custom-built electronics and airframes for professional applications.' },
            { title: 'High-Power Rocketry', text: 'Scaling from model rockets to high-power rocketry — larger motors, higher altitudes, more complex recovery and telemetry systems.' },
            { title: 'PCB Product Line', text: 'Developing a range of custom PCBs for drone builders and aerospace hobbyists — flight controllers, sensor boards, and power systems.' },
            { title: 'Simulation & Testing Lab', text: 'Building out a formal simulation and testing capability — wind tunnel testing, stress analysis, and structured flight test programs.' },
            { title: 'Client Engineering Services', text: 'Expanding our client-facing engineering work — delivering full design-to-prototype services for companies and research organisations.' },
            { title: 'Aerospace Research', text: 'Conducting original aerodynamics and propulsion research, contributing to the wider engineering community through published findings.' },
          ].map((g, i) => (
            <div className="future-card" key={i}>
              <div className="future-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="future-title">{g.title}</div>
              <p className="future-text">{g.text}</p>
            </div>
          ))}
        </div></ScrollReveal>
      </section>

      <section style={{ background: 'var(--black)', textAlign: 'center' }}>
        <ScrollReveal>
          <span className="section-label" style={{ display: 'block', marginBottom: 16 }}>Work With Us</span>
          <h2 className="section-title" style={{ marginBottom: 24 }}>Ready to Start a Project?</h2>
          <p style={{ color: 'var(--silver-dark)', marginBottom: 36, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>Tell us what you're building. We'll tell you how we can help.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">Start a Project</Link>
            <Link to="/services" className="btn-outline">View Services</Link>
          </div>
        </ScrollReveal>
      </section>

      <style>{`
        .story-grid { display:grid; grid-template-columns:5fr 6fr; gap:64px; align-items:center; margin-bottom:80px; }
        /* Portrait image (Hex Lamp) on the left. Cap height to match the
           text column and use object-fit:contain so the tall photo isn't
           cropped. */
        .story-img { display:flex; align-items:center; justify-content:center; max-height:560px; overflow:hidden; }
        .story-img img { display:block; max-width:100%; max-height:560px; width:auto; height:auto; object-fit:contain; }
        .story-img svg { position: absolute; }
        .story-text { display:flex; flex-direction:column; justify-content:center; }
        .story-text p { color:var(--silver-dark); line-height:1.85; margin-bottom:16px; font-size:0.92rem; }
        .mv-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-bottom:80px; }
        .mv-card { padding:36px 32px; background:var(--dark3); position:relative; overflow:hidden; }
        .mv-card::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; background:var(--red); }
        .mv-label { font-size:0.7rem; letter-spacing:4px; text-transform:uppercase; color:var(--red); margin-bottom:12px; display:block; }
        .mv-title { font-size:1.2rem; font-weight:800; color:var(--white); text-transform:uppercase; letter-spacing:1px; margin-bottom:14px; }
        .mv-text { font-size:0.88rem; color:var(--silver-dark); line-height:1.8; }
        .values-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(192,192,192,0.08); margin-bottom:80px; }
        .value-card { background:var(--dark); padding:32px 24px; transition:background 0.3s; }
        .value-card:hover { background:var(--dark3); }
        .value-icon { width:44px; height:44px; margin-bottom:20px; }
        .value-title { font-size:0.9rem; font-weight:700; color:var(--white); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
        .value-text { font-size:0.8rem; color:var(--silver-dark); line-height:1.7; }
        .team-section { background:var(--dark2); padding:80px 5vw; }
        .team-note { background:var(--dark3); padding:32px; max-width:700px; margin:0 auto; text-align:center; }
        .team-note p { font-size:0.95rem; color:var(--silver-dark); line-height:1.8; }
        .future-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .future-card { padding:32px 28px; background:var(--dark2); position:relative; }
        .future-num { font-size:2.5rem; font-weight:900; color:rgba(204,0,0,0.15); position:absolute; top:20px; right:20px; }
        .future-title { font-size:0.9rem; font-weight:700; color:var(--white); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
        .future-text { font-size:0.82rem; color:var(--silver-dark); line-height:1.7; }
        @media(max-width:900px){ .story-grid,.mv-grid { grid-template-columns:1fr; } .values-grid { grid-template-columns:1fr 1fr; } .future-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:600px){ .values-grid,.future-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
