import { useState } from 'react'
import { KS_DATA } from '../data.js'
import { TopNav, Photo, PropertyCard, Kicker, Footer } from '../components/Parts.jsx'

// Hi-fi interior pages: Portfolio (filterable), The Group, Property detail, Team, Contact.

export const HiFiPortfolio = ({ onNav, openProperty }) => {
  const D = KS_DATA
  const [filter, setFilter] = useState('all')
  const cats = [{ name: 'All', slug: 'all' }, ...D.categories]
  const all = D.properties
  const filtered = filter === 'all' ? all : all.filter(p => p.catSlug === filter)
  const countFor = (slug) => slug === 'all' ? all.length : all.filter(p => p.catSlug === slug).length

  return (
    <div className="ks">
      <TopNav active="Portfolio" onNav={onNav}/>

      <section style={{ padding: '100px 56px 60px' }}>
        <div className="container">
          <Kicker>The Portfolio</Kicker>
          <h1 className="display-l" style={{ marginTop: 18, maxWidth: 1000 }}>
            {all.length} houses across<br/><span className="ital">four regions</span>.
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 640 }}>
            Each property is concepted, built and operated by KS. We do not franchise.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c.slug} onClick={() => setFilter(c.slug)}
                className={`tag ${filter === c.slug ? 'tag-active' : ''}`}
                style={{ background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
                {c.name} <span style={{ opacity: 0.5, marginLeft: 4 }}>{countFor(c.slug)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 56px 120px' }}>
        <div className="container" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {filtered.map((p, i) => {
              const big = i === 0 && filter === 'all'
              return (
                <a key={p.id} href="#" onClick={(e) => { e.preventDefault(); openProperty && openProperty(p.id) }}
                  style={{ textDecoration: 'none', color: 'inherit',
                    gridColumn: big ? 'span 2' : 'span 1',
                    gridRow: big ? 'span 2' : 'span 1' }}>
                  <PropertyCard p={p} height={big ? 540 : 280} kenBurns={big} big={big}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                    <div>
                      <div className={big ? 'display-s' : 'title-m'}>{p.name}</div>
                      <div className="mono" style={{ marginTop: 6 }}>{p.cat} · {p.loc}</div>
                    </div>
                    <span className="mono">→</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}

export const HiFiAbout = ({ onNav }) => {
  const D = KS_DATA
  return (
    <div className="ks">
      <TopNav active="The Group" onNav={onNav}/>

      <section style={{ padding: '100px 56px 80px' }}>
        <div className="container">
          <Kicker>The Group</Kicker>
          <h1 className="display-xl" style={{ marginTop: 24, maxWidth: 1100 }}>
            Decades of work.<br/>
            {D.properties.length} houses.<br/>
            <span className="ital" style={{ color: 'var(--cream-2)' }}>One philosophy.</span>
          </h1>
        </div>
      </section>

      <section style={{ padding: '60px 56px 120px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <Photo src="/img/Rooftops/Elsie Rooftop/1.jpg" label="Elsie Rooftop" style={{ height: 620 }}/>
          <div style={{ paddingTop: 40 }}>
            <p className="body-l">
              KS Hospitality Group is a vertically integrated company operating restaurants, rooftops,
              hotels and residential rentals across New York, the Hamptons, Maine and Utah.
            </p>
            <p className="body-l" style={{ marginTop: 24 }}>
              Our concepts blend authentic hospitality, quality-driven product, and the kind of social
              spaces that redefine, not duplicate, their neighborhoods.
            </p>
            <p className="body-l" style={{ marginTop: 24 }}>
              Menus are artistic creations. Cocktails are labors of love. Every interaction means something.
            </p>
            <p className="body-l ital" style={{ marginTop: 24, color: 'var(--cream)' }}>
              We concept, build and operate. We do not franchise.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '120px 56px' }}>
        <div className="container">
          <Kicker>How we work</Kicker>
          <h2 className="display-m" style={{ marginTop: 16, maxWidth: 720 }}>Four non-negotiables.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 64, border: '1px solid var(--line)' }}>
            {[
              ['I', 'Neighborhood first', 'Every concept starts with the block, not the brand book.'],
              ['II', 'Operator-led', 'Decisions made by people who have run a Saturday-night service.'],
              ['III', 'Beautiful, not precious', 'Rooms that feel cared for, not curated to death.'],
              ['IV', 'Honest economics', "If the model doesn't work for the staff, it doesn't open."],
            ].map(([n, t, d], i) => (
              <div key={n} style={{
                padding: 48,
                borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
              }}>
                <div className="serif ital" style={{ fontSize: 36, color: 'var(--accent-2)', lineHeight: 1 }}>{n}</div>
                <div className="title-l" style={{ marginTop: 24 }}>{t}</div>
                <p className="body" style={{ marginTop: 14 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '120px 56px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <Kicker>Leadership</Kicker>
          <h2 className="display-m" style={{ marginTop: 16, maxWidth: 720 }}>
            Operators, <span className="ital">not consultants.</span>
          </h2>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('team') }} className="btn" style={{ marginTop: 32 }}>Meet the team →</a>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 64 }}>
            {D.team.slice(0, 3).map(m => (
              <div key={m.name}>
                <Photo src={m.img} label={m.name} style={{ height: 380 }} objectPosition="top"/>
                <div className="title-m" style={{ marginTop: 18 }}>{m.name}</div>
                <div className="mono accent" style={{ marginTop: 8 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}

export const HiFiTeam = ({ onNav }) => {
  const D = KS_DATA
  return (
    <div className="ks">
      <TopNav active="Team" onNav={onNav}/>

      <section style={{ padding: '100px 56px 60px' }}>
        <div className="container">
          <Kicker>Our Team</Kicker>
          <h1 className="display-xl" style={{ marginTop: 24, maxWidth: 1100 }}>
            Operators behind<br/><span className="ital">every detail</span>.
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 620 }}>
            The people who concept, build and run every KS property. Decades of combined experience,
            from Michelin kitchens to global hotel groups.
          </p>
        </div>
      </section>

      <section style={{ padding: '40px 56px 120px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 48 }}>
            {D.team.map((m, i) => (
              <div key={m.name} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, padding: '32px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)', paddingTop: i === 0 ? 0 : 32 }}>
                <Photo src={m.img} label={m.name} style={{ height: 360 }} objectPosition="top"/>
                <div>
                  <div className="mono accent">{String(i + 1).padStart(2, '0')} / {String(D.team.length).padStart(2, '0')}</div>
                  <div className="display-s" style={{ marginTop: 14 }}>{m.name}</div>
                  <div className="mono" style={{ marginTop: 10 }}>{m.role}</div>
                  <p className="body" style={{ marginTop: 20 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 56px', borderTop: '1px solid var(--line)', background: 'var(--bg-2)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Kicker>Careers</Kicker>
          <h2 className="display-m" style={{ marginTop: 16, maxWidth: 720, marginInline: 'auto' }}>
            Want to <span className="ital">work with us?</span>
          </h2>
          <p className="body-l" style={{ marginTop: 24, maxWidth: 520, marginInline: 'auto' }}>
            We're always looking for operators, chefs, designers and front-of-house talent.
          </p>
          <a href={`mailto:${D.contact.careersEmail}`} className="btn btn-fill" style={{ marginTop: 32 }}>
            {D.contact.careersEmail} →
          </a>
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}

export const HiFiProperty = ({ onNav, propertyId, openProperty }) => {
  const D = KS_DATA
  const p = D.properties.find(x => x.id === propertyId) || D.properties[0]
  const related = D.properties.filter(x => x.catSlug === p.catSlug && x.id !== p.id).slice(0, 3)
  const fallback = D.properties.filter(x => x.id !== p.id).slice(0, 3)
  const rel = related.length >= 3 ? related : [...related, ...fallback].slice(0, 3)

  return (
    <div className="ks">
      <TopNav active="Portfolio" onNav={onNav}/>

      <div className="container" style={{ padding: '32px 56px 0' }}>
        <div className="mono">
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('portfolio') }} style={{ color: 'inherit', textDecoration: 'none' }}>Portfolio</a>
          {' / '}{p.cat}{' / '}{p.name}
        </div>
      </div>

      <section style={{ padding: '32px 56px 0' }}>
        <PropertyCard p={p} height={640} kenBurns big/>
      </section>

      <section style={{ padding: '60px 56px 100px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 96 }}>
          <div>
            <Kicker>{p.cat} · {p.loc}</Kicker>
            <h1 className="display-l" style={{ marginTop: 18 }}>{p.name}</h1>
            <p className="title-l ital" style={{ marginTop: 32, color: 'var(--cream-2)', maxWidth: 620 }}>
              {p.blurb}
            </p>
            <p className="body-l" style={{ marginTop: 32, maxWidth: 580 }}>
              Concept by KS, build by KS, operated by KS. Visit the property site for reservations,
              menus, and current events.
            </p>
          </div>

          <aside style={{ position: 'sticky', top: 120, alignSelf: 'start', border: '1px solid var(--line)', padding: 32 }}>
            <Kicker>Fact sheet</Kicker>
            <div style={{ marginTop: 24 }}>
              {[
                ['Category', p.cat],
                ['Location', p.loc],
                ['Operated by', 'KS Hospitality Group'],
              ].map(([k, v]) => (
                <div key={k} className="meta-row" style={{ padding: '14px 0' }}>
                  <span className="mono" style={{ width: 110 }}>{k}</span>
                  <span className="serif" style={{ fontSize: 16, flex: 1 }}>{v}</span>
                </div>
              ))}
            </div>
            {p.url && p.url !== '#' && (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-fill" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
                Visit site →
              </a>
            )}
          </aside>
        </div>
      </section>

      <section style={{ padding: '100px 56px', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <Kicker>Related houses</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32 }}>
            {rel.map(r => (
              <a key={r.id} href="#" onClick={(e) => { e.preventDefault(); openProperty && openProperty(r.id) }} style={{ textDecoration: 'none', color: 'inherit' }}>
                <PropertyCard p={r} height={280}/>
                <div className="title-m" style={{ marginTop: 14 }}>{r.name}</div>
                <div className="mono" style={{ marginTop: 6 }}>{r.cat} · {r.loc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}

export const HiFiContact = ({ onNav }) => {
  const D = KS_DATA
  return (
    <div className="ks">
      <TopNav active="Contact" onNav={onNav}/>

      <section style={{ padding: '120px 56px 80px' }}>
        <div className="container">
          <Kicker>Contact</Kicker>
          <h1 className="display-xl" style={{ marginTop: 24, maxWidth: 1000 }}>
            Get in <span className="ital">touch</span>.
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 600 }}>
            Reservations, partnerships, press, careers. Every message reaches a real person.
            We respond within two business days.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 56px 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--line)' }}>
            {[
              ['I', 'General', D.contact.email, 'Reservations, partnerships, events.', false],
              ['II', 'Phone', D.contact.phone, 'Available business hours, Mon–Fri.', true],
              ['III', 'Careers', D.contact.careersEmail, 'Operators, chefs, FOH talent.', false],
            ].map(([n, k, val, d, hl], i) => (
              <div key={k} style={{
                padding: 40,
                background: hl ? 'var(--accent)' : 'transparent',
                borderRight: i < 2 ? '1px solid var(--line)' : 'none',
                color: hl ? 'var(--cream)' : undefined,
              }}>
                <div className="serif ital" style={{ fontSize: 36, lineHeight: 1, color: hl ? 'var(--cream)' : 'var(--accent-2)' }}>{n}</div>
                <div className="mono" style={{ marginTop: 24, color: hl ? 'rgba(237,230,216,0.7)' : undefined }}>{k}</div>
                <div className="title-m" style={{ marginTop: 12, wordBreak: 'break-all' }}>{val}</div>
                <div className="body" style={{ marginTop: 14, color: hl ? 'rgba(237,230,216,0.85)' : undefined }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 56px', borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
          <div>
            <Kicker>Or leave a note</Kicker>
            <h2 className="display-m" style={{ marginTop: 16 }}>
              We read <span className="ital">every</span> message.
            </h2>
            <p className="body-l" style={{ marginTop: 24, maxWidth: 380 }}>
              Tell us a little about what you're looking for and we'll reply within two business days.
            </p>
            <div style={{ marginTop: 40 }}>
              <div className="meta-row">
                <span className="mono" style={{ width: 90 }}>Email</span>
                <span className="title-m" style={{ flex: 1, wordBreak: 'break-all' }}>{D.contact.email}</span>
              </div>
              <div className="meta-row">
                <span className="mono" style={{ width: 90 }}>Phone</span>
                <span className="title-m" style={{ flex: 1 }}>{D.contact.phone}</span>
              </div>
              <div className="meta-row">
                <span className="mono" style={{ width: 90 }}>Instagram</span>
                <a href={D.contact.instagram} target="_blank" rel="noopener noreferrer" className="title-m" style={{ flex: 1, color: 'inherit', textDecoration: 'none' }}>@kshospitalitygroup ↗</a>
              </div>
            </div>
          </div>

          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} onSubmit={(e) => e.preventDefault()}>
            {[
              ['First name', 'text'],
              ['Last name', 'text'],
              ['Email', 'email'],
              ['Phone', 'tel'],
            ].map(([l, type]) => (
              <label key={l} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="mono">{l}</span>
                <input type={type} className="ks-input"/>
              </label>
            ))}

            <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="mono">Reason</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Reservations', 'Partnership', 'Press', 'Careers', 'Other'].map((t, i) => (
                  <span key={t} className={`tag ${i === 0 ? 'tag-active' : ''}`} style={{ cursor: 'pointer' }}>{t}</span>
                ))}
              </div>
            </label>

            <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="mono">Message</span>
              <textarea className="ks-input" rows={5} style={{ resize: 'vertical' }}/>
            </label>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-fill">Send →</button>
            </div>
          </form>
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}
