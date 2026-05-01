import { Fragment } from 'react'
import { KS_DATA } from '../data.js'
import { TopNav, Photo, PropertyCard, Kicker, Footer } from '../components/Parts.jsx'

// Hi-fi homepage — Cinematic Full-Bleed direction.
// Dark, moody, big imagery, hairline rules, oxblood accents.
export default function HiFiHome({ onNav }) {
  const D = KS_DATA
  const featured = D.properties.find(p => p.featured) || D.properties[0]
  const props = D.properties
  const go = (e, p) => { if (!onNav) return; e.preventDefault(); onNav(p) }

  return (
    <div className="ks">
      <TopNav active="" onNav={onNav}/>

      {/* HERO — full-bleed photo, type lockup bottom-left */}
      <section style={{ position: 'relative', height: 'calc(100vh - 71px)', minHeight: 720, overflow: 'hidden' }}>
        <Photo
          src={D.heroImage}
          label={D.heroLabel}
          style={{ position: 'absolute', inset: 0 }}
          kenBurns
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,13,11,0.45) 0%, rgba(14,13,11,0.1) 35%, rgba(14,13,11,0.2) 55%, rgba(14,13,11,0.95) 100%)' }}/>

        <div className="reveal-fade" style={{ position: 'absolute', top: 32, right: 56, textAlign: 'right' }}>
          <div className="mono mono-on">SPRING / SUMMER · 2024</div>
          <div className="mono" style={{ marginTop: 4 }}>NEW YORK · HAMPTONS · MAINE · UTAH</div>
        </div>

        <div className="reveal" style={{ position: 'absolute', left: 56, right: 56, bottom: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 980 }}>
            <Kicker>Hospitality · Food &amp; Beverage · Real Estate</Kicker>
            <h1 className="display-xl" style={{ marginTop: 18, color: 'var(--cream)' }}>
              We don&apos;t just build brands.<br/>
              <span className="ital" style={{ color: 'var(--cream-2)' }}>We give them life.</span>
            </h1>
            <p className="body-l" style={{ marginTop: 24, maxWidth: 620, color: 'var(--cream-2)' }}>
              Unforgettable F&amp;B and hospitality experiences. Concepted, built and operated by KS Hospitality Group.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <a href="#" onClick={(e) => go(e, 'portfolio')} className="btn btn-fill">Explore the portfolio →</a>
              <a href="#" onClick={(e) => go(e, 'about')} className="btn">Who we are</a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 40, paddingBottom: 8 }}>
            {[
              [props.length, 'Properties'],
              ['4', 'Regions'],
              ['2024', 'Founded'],
            ].map(([k, v]) => (
              <div key={v}>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1, color: 'var(--cream)' }}>{k}</div>
                <div className="mono" style={{ marginTop: 8 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="mono" style={{ fontSize: 8 }}>SCROLL</div>
          <div style={{ width: 1, height: 24, background: 'var(--cream-3)' }}/>
        </div>
      </section>

      {/* MARQUEE — italics murmur of property names */}
      <div className="marquee-wrap">
        <div className="marquee">
          {[...Array(2)].map((_, r) => (
            <Fragment key={r}>
              {props.map((p, i) => (
                <span key={`${r}-${i}`}>{p.name}<span className="dot"/></span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <section style={{ padding: '140px 56px', background: 'var(--bg-2)', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 96, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <Kicker>Our Mission</Kicker>
            <div className="serif ital" style={{ marginTop: 56, fontSize: 36, color: 'var(--accent-2)', lineHeight: 1 }}>I.</div>
            <div style={{ marginTop: 20, height: 1, width: 56, background: 'var(--cream-3)' }}/>
            <p className="mono" style={{ marginTop: 20, maxWidth: 220 }}>
              {D.brand.tagline}
            </p>
          </div>
          <div>
            <h2 className="display-l" style={{ color: 'var(--cream)' }}>
              Unforgettable F&amp;B and<br/>
              <span className="ital">hospitality experiences</span>.
            </h2>

            {D.mission.map((p, i) => (
              <p key={i} className="body-l" style={{ marginTop: i === 0 ? 36 : 18, maxWidth: 640 }}>{p}</p>
            ))}

            <div style={{
              marginTop: 56,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              padding: '40px 0',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
            }}>
              {D.values.map(v => (
                <div key={v.label}>
                  <div className="mono accent">{v.numeral}</div>
                  <div className="title-l" style={{ marginTop: 14 }}>{v.label}</div>
                  <p className="body-s" style={{ marginTop: 10, maxWidth: 220 }}>{v.line}</p>
                </div>
              ))}
            </div>

            <p className="display-s ital" style={{ marginTop: 56, color: 'var(--cream)', maxWidth: 720, lineHeight: 1.2 }}>
              {D.missionShort}
            </p>

            <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <a href="#" onClick={(e) => go(e, 'about')} className="btn">Read more about the group →</a>
              <a href="#" onClick={(e) => go(e, 'team')} className="btn btn-ghost">Meet the team →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO — asymmetric grid using real properties */}
      <section id="portfolio" style={{ padding: '140px 0 100px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <Kicker>The Portfolio</Kicker>
              <h2 className="display-m" style={{ marginTop: 16 }}>
                {props.length} houses.<br/>
                <span className="ital" style={{ color: 'var(--cream-2)' }}>One philosophy.</span>
              </h2>
            </div>
            <a href="#" onClick={(e) => go(e, 'portfolio')} className="btn">View all →</a>
          </div>
        </div>

        <div style={{ padding: '0 56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 24 }}>
            <a href={featured.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <PropertyCard p={featured} height={540} kenBurns big/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 }}>
                <div>
                  <div className="title-l">{featured.name}</div>
                  <div className="mono" style={{ marginTop: 6 }}>{featured.cat} · {featured.loc}</div>
                </div>
                <span className="mono accent">Featured ↗</span>
              </div>
            </a>

            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
              {props.slice(1, 3).map(p => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                  <PropertyCard p={p} height={258}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                    <div>
                      <div className="title-m">{p.name}</div>
                      <div className="mono" style={{ marginTop: 4 }}>{p.cat} · {p.loc}</div>
                    </div>
                    <span className="mono">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 48 }}>
            {props.slice(3, 6).map(p => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <PropertyCard p={p} height={320}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                  <div>
                    <div className="title-m">{p.name}</div>
                    <div className="mono" style={{ marginTop: 4 }}>{p.cat} · {p.loc}</div>
                  </div>
                  <span className="mono">→</span>
                </div>
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 64 }}>
            <a href="#" onClick={(e) => go(e, 'portfolio')} className="btn">View all {props.length} properties →</a>
          </div>
        </div>
      </section>

      {/* FULL-BLEED CINEMATIC DIVIDER */}
      <section style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
        <Photo src="/img/Lounges/Skewr/1.jpg" label="Atmosphere" style={{ position: 'absolute', inset: 0 }} kenBurns/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,13,11,0.65)' }}/>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 56, textAlign: 'center' }}>
          <div className="mono mono-on">II · THE WORK</div>
          <h2 className="display-m serif ital" style={{ marginTop: 28, maxWidth: 880, lineHeight: 1.15 }}>
            Menus as artistic creations.<br/>
            Cocktails as labors of love.<br/>
            Interactions that mean something.
          </h2>
        </div>
      </section>

      {/* CATEGORIES — four large links */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <Kicker>Explore by category</Kicker>
          <h2 className="display-m" style={{ marginTop: 16, maxWidth: 720 }}>Pick your atmosphere.</h2>
        </div>
        <div className="num-list" style={{ marginTop: 56, padding: '0 56px' }}>
          {D.categories.map((c, i) => {
            const count = props.filter(p => p.catSlug === c.slug).length
            return (
              <a href="#" key={c.slug} onClick={(e) => go(e, 'portfolio')} className="num-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="mono" style={{ fontSize: 11 }}>{String(i + 1).padStart(2, '0')} /</span>
                <div>
                  <div className="display-s">{c.name}</div>
                  <div className="body" style={{ marginTop: 10, maxWidth: 540 }}>{c.blurb}</div>
                </div>
                <div className="mono">{String(count).padStart(2, '0')} {count === 1 ? 'PROPERTY' : 'PROPERTIES'}</div>
                <span className="mono num-arrow" style={{ transition: 'transform .3s, color .3s', color: 'var(--cream-3)' }}>→</span>
              </a>
            )
          })}
        </div>
      </section>

      {/* CONTACT TEASE */}
      <section style={{ padding: '120px 56px', borderTop: '1px solid var(--line)', background: 'var(--bg)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96, alignItems: 'center' }}>
          <div>
            <Kicker>Next step</Kicker>
            <h2 className="display-l" style={{ marginTop: 16 }}>
              Let&apos;s talk about<br/><span className="ital" style={{ color: 'var(--cream-2)' }}>the next house.</span>
            </h2>
            <p className="body-l" style={{ marginTop: 24, maxWidth: 520 }}>
              Reservations, partnerships, press, careers. Every message reaches a real person.
            </p>
            <a href="#" onClick={(e) => go(e, 'contact')} className="btn btn-fill" style={{ marginTop: 32 }}>Get in touch →</a>
          </div>
          <div>
            <div className="meta-row">
              <div className="mono" style={{ width: 100 }}>Email</div>
              <div className="title-m" style={{ flex: 1, wordBreak: 'break-all' }}>{D.contact.email}</div>
            </div>
            <div className="meta-row">
              <div className="mono" style={{ width: 100 }}>Phone</div>
              <div className="title-m" style={{ flex: 1 }}>{D.contact.phone}</div>
            </div>
            <div className="meta-row">
              <div className="mono" style={{ width: 100 }}>Instagram</div>
              <a href={D.contact.instagram} target="_blank" rel="noopener noreferrer" className="title-m" style={{ flex: 1, color: 'inherit', textDecoration: 'none' }}>@kshospitalitygroup ↗</a>
            </div>
          </div>
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}
