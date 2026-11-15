import { TopNav, Kicker, Footer, Photo, TECH_PRODUCTS } from '../components/Parts.jsx'

// Technology: the KS Intelligence apps, each a card that opens the app's page.
export const HiFiTechnology = ({ onNav }) => {
  const open = (e, page) => {
    if (!onNav) return
    e.preventDefault()
    onNav(page)
  }

  return (
    <div className="ks">
      <TopNav active="Technology" onNav={onNav}/>

      <section style={{ padding: '100px 56px 48px' }}>
        <div className="container">
          <Kicker>KS Intelligence</Kicker>
          <h1 className="display-l" style={{ marginTop: 28, maxWidth: 1000 }}>
            Technology. <span className="ital">Built by operators.</span>
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 680 }}>
            The tools we use to price our hotels and staff our venues. Choose one to open it.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 56px 120px' }}>
        <div className="container tech-grid">
          {TECH_PRODUCTS.map((p, i) => (
            <a key={p.page} href={`?page=${p.page}`} className="tech-card" onClick={e => open(e, p.page)}>
              <Photo src={p.img} label={p.name} className="tech-card-img"/>
              <div className="tech-card-body">
                <div className="mono">{String(i + 1).padStart(2, '0')} · {p.line}</div>
                <h2 className="tech-card-name">{p.name}</h2>
                <p className="body">{p.desc}</p>
                <span className="mono tech-card-cta">Open <span aria-hidden="true">→</span></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer onNav={onNav}/>
    </div>
  )
}
