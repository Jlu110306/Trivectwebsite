import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState('standard');
  const [paymentTab, setPaymentTab] = useState('card');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', addr1: '', addr2: '', city: '', postcode: '', country: 'gb' });
  const [cardForm, setCardForm] = useState({ cardNum: '', cardExp: '', cardCvv: '', cardName: '' });
  const [errors, setErrors] = useState({});

  const shippingCost = { standard: 4.99, express: 12.99, international: 19.99 }[shipping] || 4.99;
  const vat = subtotal * 0.2;
  const total = subtotal + shippingCost + vat;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNum') value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    if (name === 'cardExp') value = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2').slice(0, 7);
    setCardForm({ ...cardForm, [name]: value });
  };

  const handleSubmit = () => {
    const required = ['firstName', 'lastName', 'email', 'addr1', 'city', 'postcode'];
    const newErrors = {};
    required.forEach(k => { if (!form[k].trim()) newErrors[k] = true; });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="page-body">
        <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Checkout' }]}
                  title="Check<span>out</span>" subtitle="Complete your order securely." style={{ minHeight: 240 }} />
        <section style={{ background: 'var(--black)', textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,120,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem' }}>✓</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Order <span style={{ color: 'var(--red)' }}>Confirmed!</span></h2>
          <p style={{ color: 'var(--silver-dark)', marginBottom: 32, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>Thank you for your order. A confirmation has been sent to your email.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            <Link to="/accounts" className="btn-outline">View My Orders</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-body">
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Checkout' }]}
                title="Check<span>out</span>" subtitle="Complete your order securely." style={{ minHeight: 240 }} />
      <section style={{ background: 'var(--black)' }}>
        <div className="checkout-grid">
          <div>
            <div className="checkout-section">
              <div className="checkout-section-title">01 — Contact Information</div>
              <div className="form-grid">
                <div className="form-group"><label>First Name <span className="required-mark">*</span></label><input name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} style={errors.firstName ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} /></div>
                <div className="form-group"><label>Last Name <span className="required-mark">*</span></label><input name="lastName" placeholder="Smith" value={form.lastName} onChange={handleChange} style={errors.lastName ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} /></div>
                <div className="form-group full"><label>Email <span className="required-mark">*</span></label><input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} style={errors.email ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} /></div>
                <div className="form-group full"><label>Phone</label><input name="phone" type="tel" placeholder="+44 ..." value={form.phone} onChange={handleChange} /></div>
              </div>
            </div>
            <div className="checkout-section">
              <div className="checkout-section-title">02 — Shipping Address</div>
              <div className="form-grid">
                <div className="form-group full"><label>Address <span className="required-mark">*</span></label><input name="addr1" placeholder="Street address" value={form.addr1} onChange={handleChange} style={errors.addr1 ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} /></div>
                <div className="form-group full"><label>Apt / Suite</label><input name="addr2" placeholder="(optional)" value={form.addr2} onChange={handleChange} /></div>
                <div className="form-group"><label>City <span className="required-mark">*</span></label><input name="city" placeholder="London" value={form.city} onChange={handleChange} style={errors.city ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} /></div>
                <div className="form-group"><label>Postcode <span className="required-mark">*</span></label><input name="postcode" placeholder="SW1A 1AA" value={form.postcode} onChange={handleChange} style={errors.postcode ? { borderColor: 'rgba(204,0,0,0.6)' } : {}} /></div>
                <div className="form-group full">
                  <label>Country</label>
                  <select name="country" value={form.country} onChange={handleChange}>
                    <option value="gb">United Kingdom 🇬🇧</option><option value="cn">China 🇨🇳</option><option value="us">US 🇺🇸</option><option value="au">Australia 🇦🇺</option><option value="de">Germany 🇩🇪</option><option value="fr">France 🇫🇷</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="checkout-section">
              <div className="checkout-section-title">03 — Shipping Method</div>
              {[{ val: 'standard', label: 'Standard (3–7 days)', price: '£4.99' }, { val: 'express', label: 'Express (1–2 days)', price: '£12.99' }, { val: 'international', label: 'International (7–21 days)', price: '£19.99' }].map(s => (
                <label key={s.val} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--dark3)', cursor: 'pointer', color: 'var(--white)', border: shipping === s.val ? '1px solid rgba(204,0,0,0.3)' : '1px solid rgba(192,192,192,0.08)' }}>
                  <input type="radio" name="shipping" value={s.val} checked={shipping === s.val} onChange={e => setShipping(e.target.value)} style={{ accentColor: 'var(--red)' }} />
                  <span style={{ flex: 1 }}>{s.label}</span><span style={{ color: 'var(--silver-dark)' }}>{s.price}</span>
                </label>
              ))}
            </div>
            <div className="checkout-section">
              <div className="checkout-section-title">04 — Payment</div>
              <div className="pay-tabs">
                {['card', 'paypal', 'bank'].map(t => (
                  <button key={t} className={`pay-tab ${paymentTab === t ? 'active' : ''}`} onClick={() => setPaymentTab(t)}>
                    {t === 'card' ? 'Credit / Debit Card' : t === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                  </button>
                ))}
              </div>
              {paymentTab === 'card' && (
                <div>
                  <div className="card-icons"><span>VISA</span><span>MC</span><span>AMEX</span><span>MAESTRO</span></div>
                  <div className="form-grid">
                    <div className="form-group full"><label>Card Number</label><input name="cardNum" placeholder="1234 5678 9012 3456" value={cardForm.cardNum} onChange={handleCardChange} /></div>
                    <div className="form-group"><label>Expiry</label><input name="cardExp" placeholder="MM / YY" value={cardForm.cardExp} onChange={handleCardChange} /></div>
                    <div className="form-group"><label>CVV</label><input name="cardCvv" placeholder="123" value={cardForm.cardCvv} onChange={handleCardChange} /></div>
                    <div className="form-group full"><label>Cardholder</label><input name="cardName" placeholder="Name on card" value={cardForm.cardName} onChange={handleCardChange} /></div>
                  </div>
                </div>
              )}
              {paymentTab === 'paypal' && <div style={{ background: 'var(--dark3)', padding: 28, textAlign: 'center' }}><p style={{ color: 'var(--silver-dark)', marginBottom: 20 }}>You'll be redirected to PayPal.</p><div style={{ background: '#003087', color: '#fff', padding: '12px 28px', display: 'inline-block' }}>Pay<span style={{ color: '#009cde', fontWeight: 900 }}>Pal</span></div></div>}
              {paymentTab === 'bank' && <div style={{ background: 'var(--dark3)', padding: 24 }}><p style={{ color: 'var(--silver-dark)', lineHeight: 1.8 }}>Place your order and we'll send bank details by email.</p></div>}
            </div>
          </div>
          <div className="order-summary">
            <div className="summary-title">Order Summary</div>
            <div className="summary-items">
              {cart.map(i => (
                <div className="summary-item" key={i.id}>
                  <div><div className="summary-item-name">{i.name}</div><span className="summary-item-qty">Qty: {i.qty}</span></div>
                  <div className="summary-item-price">£{(i.price * i.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>£{shippingCost.toFixed(2)}</span></div>
              <div className="summary-row"><span>VAT (20%)</span><span>£{vat.toFixed(2)}</span></div>
              <div className="summary-row total"><span>Total</span><span>£{total.toFixed(2)}</span></div>
            </div>
            <button className="place-order-btn" onClick={handleSubmit}>Place Order →</button>
          </div>
        </div>
      </section>
      <style>{`
        .checkout-grid { display:grid; grid-template-columns:1fr 380px; gap:48px; align-items:start; }
        .checkout-section { margin-bottom:40px; }
        .checkout-section-title { font-size:0.78rem; letter-spacing:3px; text-transform:uppercase; color:var(--red); margin-bottom:20px; padding-bottom:12px; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .form-group { display:flex; flex-direction:column; }
        .form-group label { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); margin-bottom:7px; }
        .form-group input,.form-group select { background:var(--dark3); color:var(--silver); padding:12px 16px; font-size:0.88rem; font-family:var(--font); outline:none; border:1px solid rgba(192,192,192,0.1); width:100%; }
        .form-group.full { grid-column:1/-1; }
        .required-mark { color:var(--red); }
        .pay-tabs { display:flex; gap:0; margin-bottom:24px; }
        .pay-tab { flex:1; padding:12px; background:var(--dark3); cursor:pointer; text-align:center; font-size:0.78rem; letter-spacing:1px; text-transform:uppercase; color:var(--silver-dark); font-family:var(--font); border:1px solid rgba(192,192,192,0.06); }
        .pay-tab.active { background:rgba(204,0,0,0.08); color:var(--white); border-color:rgba(204,0,0,0.2); }
        .card-icons { display:flex; gap:8px; margin-bottom:16px; }
        .card-icons span { padding:5px 10px; background:var(--dark3); font-size:0.65rem; letter-spacing:1px; color:var(--silver-dark); }
        .order-summary { background:var(--dark2); padding:32px; position:sticky; top:90px; }
        .summary-title { font-size:0.78rem; letter-spacing:3px; text-transform:uppercase; color:var(--white); margin-bottom:24px; padding-bottom:16px; }
        .summary-items { margin-bottom:24px; }
        .summary-item { display:flex; justify-content:space-between; padding:12px 0; }
        .summary-item-name { font-size:0.85rem; color:var(--silver); }
        .summary-item-qty { font-size:0.75rem; color:var(--silver-dark); }
        .summary-item-price { font-size:0.88rem; color:var(--white); font-weight:600; }
        .summary-totals { padding-top:16px; }
        .summary-row { display:flex; justify-content:space-between; padding:6px 0; font-size:0.85rem; }
        .summary-row span:first-child { color:var(--silver-dark); }
        .summary-row.total { padding-top:14px; margin-top:8px; font-size:1.05rem; font-weight:800; color:var(--white); }
        .place-order-btn { width:100%; background:var(--red); color:var(--white); border:none; padding:15px; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; cursor:pointer; font-family:var(--font); margin-top:24px; }
        .place-order-btn:hover { background:var(--red-bright); }
        @media(max-width:900px){ .checkout-grid { grid-template-columns:1fr; } .order-summary { position:static; } }
      `}</style>
    </div>
  );
}
