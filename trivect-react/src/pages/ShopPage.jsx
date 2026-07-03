import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ScrollReveal from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';

const products = [
  { id: '1', cat: 'stationery storage', name: 'Paper+', price: 24.99, badge: 'New', image: '/images/product-paper-plus.jpg',
    catLabel: 'Stationery / 3D Printed', desc: 'Honeycomb-textured tissue box holder with "Trivect Aerospace Official" branding. Precision 3D printed in matte black.' },
  { id: '2', cat: 'stationery', name: 'Pen+', price: 18.99, badge: 'New', image: '/images/Front%20page%20six%20image/Pen%20Lid.png',
    catLabel: 'Stationery / 3D Printed', desc: 'Aerodynamic 3D printed pen with matte black body and red "Trivect Aerospace" embossed cap.' },
  { id: '3', cat: 'stationery storage', name: 'Paper Squared+', price: 29.99, badge: 'New', image: '/images/product-paper-squared.jpg',
    catLabel: 'Stationery / 3D Printed', desc: 'Finned cylindrical paper / sticky-note holder with "Trivect Aerospace" engraved branding.' },
  { id: '4', cat: 'home storage', name: 'Bin+', price: 22.99, badge: null, image: '/images/product-bin-plus.jpg',
    catLabel: 'Home / 3D Printed', desc: 'Fluted desk bin with flowing vertical channels. 3D printed in matte orange ABS.' },
  { id: '5', cat: 'home', name: 'Lamp+', price: 54.99, badge: 'New', image: '/images/product-lamp-plus.jpg',
    catLabel: 'Home / 3D Printed', desc: 'Walnut-finish table lamp with a glowing acrylic cylinder column and circular wooden base.' },
  { id: '6', cat: 'home storage', name: 'Ring+', price: 14.99, badge: null, image: '/images/product-ring-plus.jpg',
    catLabel: 'Home / 3D Printed', desc: 'Minimalist ring dish / catch-all tray in smooth white with a navy inset base.' },
  { id: '7', cat: 'home', name: 'Cigar+', price: 19.99, badge: null, image: '/images/product-cigar-plus.jpg',
    catLabel: 'Home / 3D Printed', desc: 'Industrial-design ashtray with ribbed exterior and a machined-bolt centrepiece.' },
  { id: '8', cat: 'storage', name: 'Box+', price: 34.99, badge: 'New', image: '/images/product-box-plus.jpg',
    catLabel: 'Storage / 3D Printed', desc: '4-compartment desk organiser with a bold red lid and white ABS tray insert.' },
  { id: '9', cat: 'home', name: 'Door Stop+', price: 12.99, badge: null, image: '/images/product-doorstop.jpg',
    catLabel: 'Home / 3D Printed', desc: 'Aerodynamically shaped door stop with a hollow back channel.' },
  { id: '10', cat: 'home', name: 'Diamond Pot', price: 16.99, badge: null, image: '/images/product-diamond-pot.jpg',
    catLabel: 'Home / 3D Printed', desc: 'Geometric faceted planter / pen pot with a full diamond-pyramid surface pattern.' },
  { id: '11', cat: 'aerospace', name: 'SA-DR-2526 Model Rocket', price: 79.99, badge: 'New', image: '/images/product-rocket.jpg',
    catLabel: 'Aerospace / 3D Printed', desc: 'Streamlined model rocket with glossy black ABS body, red matte ABS fin assembly.' },
  { id: '12', cat: 'stationery', name: 'Pen+ Bundle (2-Pack)', price: 34.99, oldPrice: 37.98, badge: 'Bundle', badgeClass: 'badge-sale', image: '/images/product-pen-plus-open.jpg',
    catLabel: 'Stationery / Bundle', desc: 'Two Pen+ pens — one capped, one displayed open showing the precision tip.' },
];

const filterCats = [
  { key: 'all', label: 'All Products' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'pcb', label: 'PCB & Boards' },
  { key: 'drone', label: 'Drone Parts' },
  { key: 'rocketry', label: 'Rocketry' },
  { key: '3d', label: '3D Printed' },
  { key: 'kit', label: 'Kits' },
];

export default function ShopPage() {
  const { cart, addToCart, totalItems } = useCart();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [addedMsg, setAddedMsg] = useState(null);

  const handleAdd = (product) => {
    addToCart(product);
    setAddedMsg(product.id);
    setTimeout(() => setAddedMsg(null), 1500);
  };

  const filtered = useMemo(() => {
    let items = filter === 'all' ? [...products] : products.filter(p => p.cat.includes(filter));
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [filter, sort]);

  return (
    <div className="page-body">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
        title="Trivect <span>Shop</span>"
        subtitle="3D printed products, stationery, and aerospace designs — made by Trivect Aerospace."
      />

      <section style={{ background: 'var(--black)' }}>
        <div className="shop-toolbar">
          <div className="shop-filters">
            {filterCats.map(c => (
              <button key={c.key} className={`filter-btn ${filter === c.key ? 'active' : ''}`} onClick={() => setFilter(c.key)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="shop-sort">
            <label>Sort</label>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {filtered.map(p => (
            <ScrollReveal key={p.id}>
              <div className="product-card">
                <div className="product-img" style={{ backgroundImage: `url(${p.image})` }}>
                  {p.badge && <span className={`product-badge ${p.badgeClass || 'badge-new'}`}>{p.badge}</span>}
                </div>
                <div className="product-body">
                  <div className="product-cat">{p.catLabel}</div>
                  <div className="product-name">{p.name}</div>
                  <p className="product-desc">{p.desc}</p>
                  <div className="product-footer">
                    <div className="product-price">
                      {p.oldPrice && <span className="old-price">£{p.oldPrice.toFixed(2)}</span>}
                      £{p.price.toFixed(2)}
                    </div>
                    <button className="add-to-cart" onClick={() => handleAdd(p)}
                            style={addedMsg === p.id ? { background: '#1a5c1a' } : {}}>
                      {addedMsg === p.id ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--dark2)', textAlign: 'center' }}>
        <ScrollReveal>
          <span className="section-label" style={{ display: 'block', marginBottom: 16 }}>Custom Orders</span>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Want a Custom <span style={{ color: 'var(--red)' }}>Colour or Design?</span></h2>
          <p style={{ color: 'var(--silver-dark)', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.8 }}>All products can be printed in custom colours and materials. Contact us with your requirements.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">Request Custom Order</Link>
            <Link to="/portfolio" className="btn-outline">View Portfolio</Link>
          </div>
        </ScrollReveal>
      </section>

      <div className={`cart-bar ${totalItems > 0 ? 'visible' : ''}`} id="cartBar">
        <span className="cart-bar-text">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</span>
        <Link to="/checkout" className="cart-bar-btn">View Cart & Checkout →</Link>
      </div>

      <style>{`
        .shop-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; flex-wrap:wrap; gap:16px; }
        .shop-filters { display:flex; gap:8px; flex-wrap:wrap; }
        .filter-btn { padding:8px 18px; background:transparent; color:var(--silver-dark); border:1px solid rgba(192,192,192,0.1); font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-family:var(--font); }
        .filter-btn:hover,.filter-btn.active { background:var(--red); border-color:var(--red); color:var(--white); }
        .shop-sort { display:flex; align-items:center; gap:10px; }
        .shop-sort label { font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; color:var(--silver-dark); }
        .shop-sort select { background:var(--dark3); color:var(--silver); padding:8px 14px; font-size:0.78rem; font-family:var(--font); outline:none; cursor:pointer; border:1px solid rgba(192,192,192,0.1); }
        .products-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .product-card { background:var(--dark3); overflow:hidden; transition:transform 0.3s; display:flex; flex-direction:column; }
        .product-card:hover { transform:translateY(-5px); }
        .product-img { height:220px; position:relative; background-size:cover; background-position:center; }
        .product-badge { position:absolute; top:14px; left:14px; z-index:2; font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; padding:4px 10px; font-weight:700; }
        .badge-new { background:var(--red); color:#fff; }
        .badge-sale { background:#9a6e00; color:#fff; }
        .product-body { padding:22px; flex:1; display:flex; flex-direction:column; }
        .product-cat { font-size:0.62rem; letter-spacing:3px; text-transform:uppercase; color:var(--red); margin-bottom:6px; }
        .product-name { font-size:0.95rem; font-weight:700; color:var(--white); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
        .product-desc { font-size:0.8rem; color:var(--silver-dark); line-height:1.7; margin-bottom:16px; flex:1; }
        .product-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:auto; padding-top:16px; }
        .product-price { font-size:1.1rem; font-weight:800; color:var(--white); }
        .old-price { font-size:0.78rem; color:var(--silver-dark); text-decoration:line-through; margin-right:6px; font-weight:400; }
        .add-to-cart { background:var(--red); color:var(--white); border:none; padding:9px 18px; font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:pointer; font-family:var(--font); white-space:nowrap; }
        .add-to-cart:hover { background:var(--red-bright); }
        .cart-bar { position:fixed; bottom:0; left:0; right:0; z-index:500; background:var(--red); padding:14px 5vw; display:flex; align-items:center; justify-content:space-between; transform:translateY(100%); transition:transform 0.4s; }
        .cart-bar.visible { transform:translateY(0); }
        .cart-bar-text { font-size:0.85rem; font-weight:600; color:var(--white); letter-spacing:1px; }
        .cart-bar-btn { background:var(--white); color:var(--red); border:none; padding:9px 22px; font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; cursor:pointer; font-family:var(--font); text-decoration:none; }
        @media(max-width:900px){ .products-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:580px){ .products-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
