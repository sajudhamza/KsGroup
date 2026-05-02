import { useEffect, useState } from 'react'
import { KS_DATA } from '../data.js'

// LOGO 01 · PLATE — refined, used everywhere
export const LogoPlate = ({ size = 'md', color = 'var(--cream)' }) => {
  const sizes = {
    sm: { box: 32, font: 16, sub: 7 },
    md: { box: 44, font: 22, sub: 8 },
    lg: { box: 64, font: 32, sub: 9 },
  }
  const s = sizes[size] || sizes.md
  return (
    <div className="ks-plate">
      <div className="ks-plate-mark" style={{ width: s.box, height: s.box, borderColor: color }}>
        <span style={{ fontSize: s.font, color }}>KS</span>
      </div>
      <div className="ks-plate-text">
        <span className="name" style={{ fontSize: s.font * 0.78, color }}>{KS_DATA.brand.name}</span>
        <span className="sub" style={{ fontSize: s.sub }}>{KS_DATA.brand.sub}</span>
      </div>
    </div>
  )
}

// LOGO MARK ONLY (square plate, no text) — for tight spots
export const LogoMark = ({ size = 44, color = 'var(--cream)' }) => (
  <div className="ks-plate-mark" style={{ width: size, height: size, borderColor: color }}>
    <span style={{ fontSize: size * 0.5, color }}>KS</span>
  </div>
)

// Top nav (sticky) — desktop links inline, mobile collapses to a hamburger
export const TopNav = ({ active = 'Portfolio', onNav }) => {
  const items = ['Portfolio', 'The Group', 'Team', 'Contact']
  const map = { 'Portfolio': 'portfolio', 'The Group': 'about', 'Team': 'team', 'Contact': 'contact' }
  const [open, setOpen] = useState(false)

  const go = (e, page) => {
    if (!onNav) return
    e.preventDefault()
    setOpen(false)
    onNav(page)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    const closeOnDesktop = () => {
      if (mq.matches) setOpen(false)
    }
    closeOnDesktop()
    mq.addEventListener('change', closeOnDesktop)
    return () => mq.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <nav className={`ks-nav ${open ? 'is-open' : ''}`}>
      <div className="ks-nav-bar">
        <a href="#" onClick={(e) => go(e, 'home')} style={{ textDecoration: 'none' }}>
          <LogoPlate size="sm" />
        </a>
        <div className="ks-nav-links">
          {items.map(i => (
            <a key={i} href="#" onClick={(e) => go(e, map[i])} className={i === active ? 'active' : ''}>{i}</a>
          ))}
        </div>
        <a href="#" onClick={(e) => go(e, 'contact')} className="btn btn-accent ks-nav-cta" style={{ padding: '10px 16px' }}>
          Get in touch <span>→</span>
        </a>
        <button
          type="button"
          className="ks-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span/><span/><span/>
        </button>
      </div>

      <div className={`ks-nav-drawer ${open ? 'is-open' : ''}`} role="dialog" aria-hidden={!open}>
        <div className="ks-nav-drawer-inner">
          {items.map(i => (
            <a
              key={i}
              href="#"
              onClick={(e) => go(e, map[i])}
              className={`ks-nav-drawer-link ${i === active ? 'active' : ''}`}
            >
              <span className="mono" style={{ fontSize: 9 }}>{String(items.indexOf(i) + 1).padStart(2, '0')} /</span>
              <span className="serif" style={{ fontSize: 36 }}>{i}</span>
            </a>
          ))}
          <a href="#" onClick={(e) => go(e, 'contact')} className="btn btn-accent" style={{ marginTop: 24, alignSelf: 'flex-start' }}>
            Get in touch →
          </a>
        </div>
      </div>
    </nav>
  )
}

// PropertyCard — renders either a real photo (cover-fit) or a logo mark
// If a `logo` is provided alongside a photo, it's overlaid as a small "chip"
// in the top-right corner for brand recognition without hiding the image.
export const PropertyCard = ({ p, height, kenBurns = false, big = false }) => {
  const isLogo = p.kind === 'logo'
  if (isLogo) {
    return (
      <div className={`img img-logocard img-grain ${big ? 'img-big' : ''}`} style={{ height, width: '100%', position: 'relative' }}>
        <img
          src={p.img}
          alt={p.name}
          style={{
            position: 'absolute', inset: '26%',
            width: '48%', height: '48%',
            objectFit: 'contain',
            filter: 'brightness(0) invert(0.9)',
            opacity: 0.9,
          }}
        />
        <span className="ph-label" style={{ left: 20, bottom: 16 }}>
          <span className="accent-dot"></span>
          {p.cat} · {p.loc}
        </span>
      </div>
    )
  }
  return (
    <Photo src={p.img} label={p.name} style={{ height, width: '100%' }} kenBurns={kenBurns}>
      {p.logo && (
        <div className="property-logo-chip" aria-hidden="true">
          <img src={p.logo} alt="" />
        </div>
      )}
    </Photo>
  )
}

// Photo. If `src` is provided, renders the real image; otherwise a labeled placeholder.
export const Photo = ({ label, sub, src, style, className = '', kenBurns = false, objectPosition = 'center', children }) => {
  if (src) {
    return (
      <div className={`img img-real img-grain ${kenBurns ? 'ken-burns' : ''} ${className}`} style={style}>
        <img
          src={src}
          alt={label || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
        />
        {children}
      </div>
    )
  }
  return (
    <div className={`img ph img-grain ${kenBurns ? 'ken-burns' : ''} ${className}`} style={style}>
      <span className="ph-label">
        <span className="accent-dot"></span>
        {label}{sub ? ` · ${sub}` : ''}
      </span>
      {children}
    </div>
  )
}

// Section kicker (small uppercase mono with leading hairline)
export const Kicker = ({ children, color }) => (
  <div className="kicker" style={color ? { color } : undefined}>{children}</div>
)

// Footer
export const Footer = ({ onNav }) => {
  const D = KS_DATA
  const go = (e, page) => { if (!onNav) return; e.preventDefault(); onNav(page) }
  return (
    <footer className="ks-foot">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <LogoPlate size="md" />
          <div className="body" style={{ marginTop: 24, maxWidth: 320 }}>
            A vertically integrated hospitality group.<br/>
            Restaurants. Rooftops. Hotels. Residences.
          </div>
          <div className="mono mono-on" style={{ marginTop: 24 }}>{D.contact.email}</div>
          <div className="mono" style={{ marginTop: 6 }}>{D.contact.phone}</div>
        </div>
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>Navigate</div>
          {[['Portfolio','portfolio'],['The Group','about'],['Team','team'],['Contact','contact']].map(([l,p]) => (
            <a key={l} href="#" onClick={(e) => go(e, p)} className="body" style={{ padding: '6px 0', display: 'block', color: 'inherit', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>Categories</div>
          {D.categories.map(c => (
            <a key={c.slug} href="#" onClick={(e) => go(e, 'portfolio')} className="body" style={{ padding: '6px 0', display: 'block', color: 'inherit', textDecoration: 'none' }}>{c.name}</a>
          ))}
        </div>
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>Follow</div>
          <a href={D.contact.instagram} target="_blank" rel="noopener noreferrer" className="body" style={{ padding: '6px 0', display: 'block', color: 'inherit', textDecoration: 'none' }}>Instagram →</a>
          <a href={`mailto:${D.contact.careersEmail}`} className="body" style={{ padding: '6px 0', display: 'block', color: 'inherit', textDecoration: 'none' }}>Careers →</a>
        </div>
      </div>
      <div className="rule" style={{ margin: '48px 0 24px' }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div className="mono">© 2024 · KS Hospitality Group</div>
        <div className="mono">New York · Hamptons · Lewiston · Park City</div>
        <div className="mono">All rights reserved</div>
      </div>
    </footer>
  )
}
