import PageHero from '../components/PageHero';

const LAST_UPDATED = 'July 2026';

export default function PrivacyPolicy() {
  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]}
        title="Privacy <span>Policy</span>"
        subtitle={`Last updated: ${LAST_UPDATED}`}
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="privacy-wrap">
          <p className="privacy-intro">
            Trivect Aerospace ("we", "us", "our") operates the website
            <strong> trivect-aerospace.space</strong>. This page informs you of our policies regarding
            the collection, use, and disclosure of personal information we receive from users of the site.
          </p>
          <p className="privacy-intro">
            We use your data to provide and improve the service. By using the site, you agree to the
            collection and use of information in accordance with this policy.
          </p>

          <h2 className="privacy-h2">1. Information We Collect</h2>
          <h3 className="privacy-h3">Account information</h3>
          <p>When you create an account we collect your name, email address, and a password (stored as a one-way hash). Optional profile fields — nickname, phone number, account number — are stored only if you choose to provide them.</p>

          <h3 className="privacy-h3">Order and quote information</h3>
          <p>If you place an order or submit a quote request, we collect the information you provide (name, email, project details, shipping address where applicable) in order to fulfil your request.</p>

          <h3 className="privacy-h3">Usage data</h3>
          <p>Like most websites, our hosting provider may log your IP address, browser type, pages visited, and referring URL for the purposes of security, debugging, and aggregate analytics. We do not use third-party advertising trackers.</p>

          <h3 className="privacy-h3">Cookies</h3>
          <p>We use a small number of strictly necessary cookies and localStorage entries to keep you signed in, remember your shopping cart, and remember admin sessions. We do not use tracking cookies or third-party analytics cookies.</p>

          <h2 className="privacy-h2">2. How We Use Your Information</h2>
          <ul className="privacy-list">
            <li>To operate, maintain, and improve the website and our services.</li>
            <li>To respond to quote requests and customer enquiries.</li>
            <li>To process and ship orders.</li>
            <li>To authenticate you when you sign in.</li>
            <li>To detect and prevent fraud or abuse.</li>
            <li>To comply with applicable law.</li>
          </ul>
          <p>We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.</p>

          <h2 className="privacy-h2">3. Sharing of Information</h2>
          <p>We share personal information only with the following categories of recipients, and only the minimum data needed:</p>
          <ul className="privacy-list">
            <li><strong>Payment processors</strong> — to charge your card for orders. We never store your full card details on our servers.</li>
            <li><strong>Shipping and fulfilment partners</strong> — to deliver physical orders.</li>
            <li><strong>Hosting and infrastructure providers</strong> — to run the website and store data.</li>
            <li><strong>Law enforcement or regulators</strong> — where we are legally required to do so.</li>
          </ul>

          <h2 className="privacy-h2">4. Data Retention</h2>
          <p>We retain your account information for as long as your account is active. You may request deletion of your account at any time (see Section 6). Quote and order records are retained for up to 7 years for tax and accounting purposes.</p>

          <h2 className="privacy-h2">5. Security</h2>
          <p>We take reasonable precautions to protect your information. Passwords are stored using one-way hashing. Connections to the site use HTTPS. Access to administrative tools requires a separate login with a short-lived session token. No system is perfectly secure, but we work to minimise risk.</p>

          <h2 className="privacy-h2">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="privacy-list">
            <li>Access the personal information we hold about you.</li>
            <li>Correct inaccurate or incomplete information.</li>
            <li>Request deletion of your account and associated data, subject to our legal record-keeping obligations.</li>
            <li>Withdraw consent for any optional processing.</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:Johnny.lu110306@gmail.com" className="privacy-link">Johnny.lu110306@gmail.com</a>.</p>

          <h2 className="privacy-h2">7. Children's Privacy</h2>
          <p>The site is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.</p>

          <h2 className="privacy-h2">8. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will post the new policy on this page and update the "Last updated" date above. Material changes will be communicated by email where we have a current address on file.</p>

          <h2 className="privacy-h2">9. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="privacy-list">
            <li>By email: <a href="mailto:Johnny.lu110306@gmail.com" className="privacy-link">Johnny.lu110306@gmail.com</a></li>
            <li>By phone (UK): <a href="tel:+447****2403" className="privacy-link">+44 7421 272403</a></li>
            <li>By phone (CN): <a href="tel:+861****6559" className="privacy-link">+86 168 0268 6559</a></li>
          </ul>

          <div className="privacy-back">
            <a href="/" className="btn-outline">← Back to Home</a>
          </div>
        </div>
      </section>

      <style>{`
        .privacy-wrap { max-width: 820px; margin: 0 auto; padding: 60px 5vw 100px; color: var(--silver); }
        .privacy-intro { color: var(--silver-dark); line-height: 1.9; margin-bottom: 14px; font-size: 0.95rem; }
        .privacy-intro strong { color: var(--white); }
        .privacy-h2 { font-size: 1.2rem; font-weight: 800; color: var(--white); letter-spacing: 1px; text-transform: uppercase; margin: 40px 0 14px; padding-bottom: 8px; border-bottom: 1px solid rgba(204,0,0,0.25); }
        .privacy-h3 { font-size: 0.78rem; font-weight: 700; color: var(--red); letter-spacing: 2px; text-transform: uppercase; margin: 22px 0 8px; }
        .privacy-list { list-style: none; padding: 0; margin: 10px 0 14px; display: flex; flex-direction: column; gap: 8px; }
        .privacy-list li { font-size: 0.92rem; line-height: 1.7; padding-left: 22px; position: relative; color: var(--silver-dark); }
        .privacy-list li::before { content: '▸'; position: absolute; left: 0; top: 0; color: var(--red); }
        .privacy-wrap p { color: var(--silver-dark); line-height: 1.9; margin-bottom: 12px; font-size: 0.92rem; }
        .privacy-wrap p strong { color: var(--white); }
        .privacy-link { color: var(--red); text-decoration: none; transition: color 0.15s; }
        .privacy-link:hover { color: var(--red-bright); text-decoration: underline; }
        .privacy-back { margin-top: 40px; text-align: center; }
      `}</style>
    </div>
  );
}