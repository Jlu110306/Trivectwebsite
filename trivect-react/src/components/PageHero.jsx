import { Link } from 'react-router-dom';

export default function PageHero({ breadcrumbs, title, subtitle, style }) {
  const parts = title.split('<span>');
  let titleEl;
  if (parts.length > 1) {
    const spanContent = parts[1].split('</span>');
    titleEl = <>{parts[0]}<span>{spanContent[0]}</span>{spanContent[1] || ''}</>;
  } else {
    titleEl = title;
  }

  return (
    <div className="page-hero" style={style}>
      <div className="page-hero-grid"></div>
      <div className="page-hero-orb"></div>
      <div className="page-hero-content">
        <div className="page-hero-breadcrumb">
          {breadcrumbs.map((b, i) => (
            <span key={i}>
              {i > 0 && <span> / </span>}
              {b.to ? <Link to={b.to}>{b.label}</Link> : b.label}
            </span>
          ))}
        </div>
        <h1>{titleEl}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
