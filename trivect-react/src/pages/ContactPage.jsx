import { useState } from 'react';
import PageHero from '../components/PageHero';
import ScrollReveal from '../components/ScrollReveal';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', projectType: '', budget: '', message: '', newsletter: false });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim()) newErrors.email = true;
    if (!form.projectType) newErrors.projectType = true;
    if (!form.message.trim()) newErrors.message = true;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setSending(true);
    setTimeout(() => { setSubmitted(true); setSending(false); }, 800);
  };

  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        title="Get <span>In Touch</span>"
        subtitle="Tell us about your project. We'll respond within 48 hours."
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="contact-grid">
          <ScrollReveal>
            <h2 className="contact-info-title">Let's Build the<br/><span>Future Together</span></h2>
            <p className="contact-info-desc">Whether you have a complete project brief or just an idea you want to explore — we're here to help turn it into something real. No project is too complex and no question is too simple.</p>

            <div className="contact-details">
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="3" width="16" height="12" rx="2" stroke="#CC0000" strokeWidth="1.5" fill="none"/><polyline points="1,5 9,10 17,5" stroke="#CC0000" strokeWidth="1.5" fill="none"/></svg>, label: 'Email', value: <a href="mailto:Johnny.lu110306@gmail.com">Johnny.lu110306@gmail.com</a> },
                { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 2h3l1.5 4-2 1.5a11 11 0 005 5L12 10.5l4 1.5v3a1 1 0 01-1 1C6 16 2 10 2 3a1 1 0 011-1z" stroke="#CC0000" strokeWidth="1.5" fill="none"/></svg>, label: 'Phone — England 🇬🇧', value: <a href="tel:+447****2403">+44 7421 272403</a> },
                { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 2h3l1.5 4-2 1.5a11 11 0 005 5L12 10.5l4 1.5v3a1 1 0 01-1 1C6 16 2 10 2 3a1 1 0 011-1z" stroke="#CC0000" strokeWidth="1.5" fill="none"/></svg>, label: 'Phone — China 🇨🇳', value: <a href="tel:+861****6559">+86 168 0268 6559</a> },
                { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#CC0000" strokeWidth="1.5" fill="none"/><line x1="9" y1="4" x2="9" y2="9" stroke="#CC0000" strokeWidth="1.5"/><line x1="9" y1="9" x2="13" y2="12" stroke="#CC0000" strokeWidth="1.5"/></svg>, label: 'Response Time', value: 'Within 48 hours' },
                { icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="8" r="4" stroke="#CC0000" strokeWidth="1.5" fill="none"/><path d="M2 16 Q2 12 9 12 Q16 12 16 16" stroke="#CC0000" strokeWidth="1.5" fill="none"/></svg>, label: 'Availability', value: 'Open to new projects' },
              ].map((d, i) => (
                <div className="contact-detail" key={i}>
                  <div className="cd-icon">{d.icon}</div>
                  <div>
                    <div className="cd-label">{d.label}</div>
                    <div className="cd-value">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="response-note">
              <strong style={{ color: 'var(--white)' }}>Before you reach out:</strong> The more detail you can provide about your project — scope, timeline, technical requirements — the faster we can give you a useful response.
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="contact-form-wrap">
              <div className="form-title">Send Us a Message</div>
              {submitted ? (
                <div id="form-success" style={{ display: 'block' }}>
                  <strong style={{ color: '#fff', fontSize: '1rem' }}>Message Sent</strong><br/>
                  Thanks for getting in touch. We'll review your project and get back to you within 48 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name <span className="required-mark">*</span></label>
                      <input type="text" id="name" name="name" placeholder="Your name" value={form.name} onChange={handleChange}
                             style={errors.name ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email <span className="required-mark">*</span></label>
                      <input type="email" id="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange}
                             style={errors.email ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Company <span style={{ color: '#555', letterSpacing: 0, textTransform: 'none', fontSize: '0.65rem' }}>(optional)</span></label>
                      <input type="text" id="company" name="company" placeholder="Your company or organisation" value={form.company} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone <span style={{ color: '#555', letterSpacing: 0, textTransform: 'none', fontSize: '0.65rem' }}>(optional)</span></label>
                      <input type="tel" id="phone" name="phone" placeholder="+44 ..." value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="project-type">Project Type <span className="required-mark">*</span></label>
                    <select id="project-type" name="projectType" value={form.projectType} onChange={handleChange}
                            style={errors.projectType ? { borderColor: 'rgba(204,0,0,0.6)' } : {}}>
                      <option value="" disabled>Select a service area...</option>
                      <option value="drone">Drone Development</option>
                      <option value="cad">3D Modelling / CAD Design</option>
                      <option value="printing">3D Printing / Prototyping</option>
                      <option value="electronics">Electronics Design</option>
                      <option value="pcb">PCB Design</option>
                      <option value="rocketry">Model Rocketry</option>
                      <option value="aerospace">Aerospace Engineering</option>
                      <option value="multiple">Multiple Services</option>
                      <option value="other">Other / Not Sure Yet</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Budget Range <span style={{ color: '#555', letterSpacing: 0, textTransform: 'none', fontSize: '0.65rem' }}>(optional)</span></label>
                    <div className="budget-options">
                      {['small', 'medium', 'large', 'discuss'].map((b, i) => (
                        <div className="budget-opt" key={b}>
                          <input type="radio" id={'b' + (i + 1)} name="budget" value={b} checked={form.budget === b} onChange={handleChange} />
                          <label htmlFor={'b' + (i + 1)}>{['Small Scale', 'Medium Scale', 'Large Scale', 'Discuss First'][i]}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Project Description <span className="required-mark">*</span></label>
                    <textarea id="message" name="message" placeholder="Describe your project..." value={form.message} onChange={handleChange}
                              style={errors.message ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} />
                  </div>
                  <div className="checkbox-row">
                    <input type="checkbox" id="newsletter" name="newsletter" checked={form.newsletter} onChange={handleChange} />
                    <label htmlFor="newsletter">Keep me updated on Trivect Aerospace news and project announcements.</label>
                  </div>
                  <button type="submit" className="form-submit" disabled={sending}>{sending ? 'Sending...' : 'Send Message →'}</button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section style={{ background: 'var(--dark2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div>
            <span className="section-label">Common Questions</span>
            <h2 className="section-title">FAQ</h2>
            <div className="divider-line"></div>
          </div>
          <div>
            {[
              { q: 'What types of projects do you take on?', a: 'We work on projects across all six of our service areas — drone development, 3D modelling, 3D printing, electronics and PCB design, model rocketry, and aerospace engineering more broadly.' },
              { q: 'How long does a typical project take?', a: 'It depends entirely on the scope. A quick CAD model or 3D print can be turned around in days. A full drone development project is more likely to take several weeks to months.' },
              { q: 'Do you work with clients internationally?', a: 'Yes. Design work, CAD models, and PCB designs can be delivered digitally anywhere. For physical prototypes, we work with clients to arrange shipping.' },
              { q: 'Can I commission just part of a project?', a: "Absolutely. You might just need a CAD model, just a PCB design, or just 3D printed parts. We're happy to slot into an existing workflow." },
              { q: "I have an idea but I'm not sure where to start. Can you help?", a: "Yes — that's often how the best projects start. Tell us your idea and we'll help you figure out the right approach." },
            ].map((faq, i) => (
              <details className="faq-item" key={i}>
                <summary className="faq-q">{faq.q}</summary>
                <p className="faq-a">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .contact-grid { display:grid; grid-template-columns:1fr 1.4fr; gap:80px; align-items:start; }
        .contact-info-title { font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:800; color:var(--white); text-transform:uppercase; letter-spacing:2px; line-height:1.15; margin-bottom:20px; }
        .contact-info-title span { color:var(--red); }
        .contact-info-desc { font-size:0.9rem; color:var(--silver-dark); line-height:1.8; margin-bottom:36px; }
        .contact-details { display:flex; flex-direction:column; gap:0; margin-bottom:40px; }
        .contact-detail { display:flex; align-items:flex-start; gap:16px; padding:20px 0; }
        .cd-icon { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cd-label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:4px; }
        .cd-value { font-size:0.9rem; color:var(--white); }
        .cd-value a { color:var(--white); text-decoration:none; transition:color 0.2s; }
        .cd-value a:hover { color:var(--red); }
        .response-note { background:var(--dark3); padding:20px; font-size:0.82rem; color:var(--silver-dark); line-height:1.7; }
        .contact-form-wrap { background:var(--dark2); padding:48px; }
        .form-title { font-size:1.1rem; font-weight:700; color:var(--white); text-transform:uppercase; letter-spacing:2px; margin-bottom:32px; padding-bottom:20px; }
        form { display:flex; flex-direction:column; gap:20px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .form-group { display:flex; flex-direction:column; }
        label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:8px; }
        .required-mark { color:var(--red); margin-left:2px; }
        input, select, textarea { background:var(--dark3); color:var(--silver); padding:12px 16px; font-size:0.9rem; font-family:var(--font); outline:none; border:1px solid rgba(192,192,192,0.08); width:100%; }
        select { cursor:pointer; }
        select option { background:var(--dark3); }
        textarea { resize:vertical; min-height:130px; }
        .budget-options { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .budget-opt { position:relative; }
        .budget-opt input[type="radio"] { position:absolute; opacity:0; width:0; height:0; }
        .budget-opt label { display:block; padding:10px 14px; background:var(--dark3); cursor:pointer; font-size:0.78rem; letter-spacing:1px; text-transform:uppercase; color:var(--silver-dark); margin:0; }
        .budget-opt input[type="radio"]:checked + label { color:var(--white); background:rgba(204,0,0,0.06); }
        .checkbox-row { display:flex; align-items:flex-start; gap:12px; }
        .checkbox-row input[type="checkbox"] { width:16px; height:16px; margin-top:2px; accent-color:var(--red); flex-shrink:0; }
        .checkbox-row label { font-size:0.78rem; letter-spacing:0.5px; text-transform:none; color:var(--silver-dark); margin-bottom:0; line-height:1.6; }
        .form-submit { background:var(--red); color:var(--white); border:none; padding:15px; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); width:100%; }
        .form-submit:hover { background:var(--red-bright); }
        .form-submit:disabled { background:#555; }
        #form-success { background:rgba(0,80,0,0.3); padding:24px; text-align:center; color:#aaffaa; font-size:0.88rem; line-height:1.7; }
        .faq-q { padding:20px 0; font-size:0.9rem; font-weight:600; color:var(--white); cursor:pointer; display:flex; justify-content:space-between; align-items:center; user-select:none; list-style:none; }
        .faq-q::-webkit-details-marker { display:none; }
        .faq-q::after { content:'+'; color:var(--red); font-size:1.2rem; font-weight:300; transition:transform 0.2s; }
        details[open] .faq-q::after { transform:rotate(45deg); }
        .faq-a { font-size:0.85rem; color:var(--silver-dark); line-height:1.8; padding-bottom:20px; padding-right:32px; }
        @media(max-width:900px){ .contact-grid { grid-template-columns:1fr; } .form-row { grid-template-columns:1fr; } .contact-form-wrap { padding:32px 24px; } }
      `}</style>
    </div>
  );
}
