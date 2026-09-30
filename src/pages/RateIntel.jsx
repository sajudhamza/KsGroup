import { useMemo, useState } from 'react'
import { TopNav, Kicker, Footer } from '../components/Parts.jsx'
import {
  MARKETS, fetchHotels, fetchHeatmap, fetchLiveRates, fetchLiteRates, nightsBetween, computeRecommendation, fmt,
  getRapidApiKey, setRapidApiKey, getLiteApiKey, setLiteApiKey, liteConnected, LIVE_SERVER_MODE,
} from '../lib/rateIntel.js'

// RateIQ — KS Intelligence: competitive rate recommendations for any hotel.

const iso = (d) => d.toISOString().slice(0, 10)
const defaultDates = () => {
  const a = new Date(); a.setDate(a.getDate() + 14)
  const b = new Date(); b.setDate(b.getDate() + 16)
  return [iso(a), iso(b)]
}

/** One-click key handoff: /?page=intelligence&litekey=sand_… saves the key to this
 *  browser and scrubs it from the address bar. Runs before first render. */
function adoptKeyFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search)
    const k = params.get('litekey')
    if (k) {
      setLiteApiKey(k)
      params.delete('litekey')
      const q = params.toString()
      window.history.replaceState({}, '', window.location.pathname + (q ? `?${q}` : ''))
    }
  } catch { /* no-op */ }
  return liteConnected()
}

export const HiFiRateIntel = ({ onNav }) => {
  const [market, setMarket] = useState(null)
  const [hotels, setHotels] = useState([])
  const [totalHotels, setTotalHotels] = useState(0)
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [loadProgress, setLoadProgress] = useState(null)
  const [filter, setFilter] = useState('')
  const [ownKey, setOwnKey] = useState('')
  const [competitorKeys, setCompetitorKeys] = useState([])
  const [[chkIn, chkOut], setDates] = useState(defaultDates)
  const [positioning, setPositioning] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [liveQuotes, setLiveQuotes] = useState({})
  const [showKeyField, setShowKeyField] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [liteDraft, setLiteDraft] = useState('')
  const [hasKey, setHasKey] = useState(() => !!getRapidApiKey())
  const [hasLiteKey, setHasLiteKey] = useState(adoptKeyFromUrl)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const pickMarket = async (m) => {
    setMarket(m); setHotels([]); setOwnKey(''); setCompetitorKeys([]); setAnalysis(null); setError(null)
    setLoadingHotels(true); setLoadProgress(null)
    try {
      const { hotels: list, total } = await fetchHotels(m.key, (loaded, tot) => setLoadProgress([loaded, tot]))
      setHotels(list); setTotalHotels(total)
    } catch (e) {
      setError('Could not load hotels for this market. Please try again.')
    } finally {
      setLoadingHotels(false)
    }
  }

  const toggleCompetitor = (key) => {
    setAnalysis(null)
    setCompetitorKeys(ks => ks.includes(key)
      ? ks.filter(k => k !== key)
      : ks.length >= 3 ? ks : [...ks, key])
  }

  const visibleHotels = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const list = q ? hotels.filter(h => h.name.toLowerCase().includes(q)) : hotels
    return { shown: list.slice(0, 24), matches: list.length }
  }, [hotels, filter])

  const competitors = hotels.filter(h => competitorKeys.includes(h.key))
  const ownHotel = hotels.find(h => h.key === ownKey) || null
  const nights = useMemo(() => (chkIn && chkOut ? nightsBetween(chkIn, chkOut) : []), [chkIn, chkOut])
  const ready = competitors.length >= 1 && nights.length >= 1

  const analyze = async () => {
    setAnalyzing(true); setError(null); setAnalysis(null)
    try {
      const heatmaps = {}
      const set = [...competitors, ...(ownHotel ? [ownHotel] : [])]

      // liteAPI first (one batched call for the whole set), Xotelo as per-hotel fallback.
      const [rates] = await Promise.all([
        fetchLiteRates(set, market, chkIn, chkOut, nights.length).catch(() => ({})),
        ...set.map(async c => {
          heatmaps[c.key] = await fetchHeatmap(c.key, chkOut).catch(() => null)
        }),
      ])
      await Promise.all(set.filter(c => !rates[c.key]).map(async c => {
        const live = await fetchLiveRates(c.key, chkIn, chkOut)
        if (live) rates[c.key] = live
      }))
      setLiveQuotes(rates)
      setAnalysis(computeRecommendation({
        competitors, heatmaps, nights, positioningPct: positioning, ownHotel, liveRates: rates,
      }))
    } catch (e) {
      setError('Analysis failed — the market data service may be busy. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const scaleMin = Math.min(...competitors.map(c => c.priceMin), ownHotel ? ownHotel.priceMin : Infinity)
  const scaleMax = Math.max(...competitors.map(c => c.priceMax), ownHotel ? ownHotel.priceMax : 0)
  const pct = (v) => `${Math.round(((v - scaleMin) / Math.max(scaleMax - scaleMin, 1)) * 100)}%`

  return (
    <div className="ks">
      <TopNav active="Technology" onNav={onNav}/>

      <section style={{ padding: '100px 56px 60px' }}>
        <div className="container">
          <Kicker>KS Intelligence</Kicker>
          <h1 className="display-l" style={{ marginTop: 18, maxWidth: 1000 }}>
            RateIQ. <span className="ital">Price with precision.</span>
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 660 }}>
            The pricing engine we use across the KS portfolio, open for any hotelier. Pick your market,
            benchmark up to three competitors, and get a recommended nightly rate for your dates —
            built on live market data.
          </p>
          <div className="mono" style={{ marginTop: 20, color: hasLiteKey ? 'var(--accent-2)' : 'var(--cream-3)' }}>
            {hasLiteKey
              ? '● LIVE RATE FEED CONNECTED — ANALYSES USE ACTUAL NIGHTLY PRICES'
              : '○ LIVE RATE FEED NOT CONNECTED IN THIS BROWSER — ANALYSES USE MARKET PRICE RANGES. CONNECT YOUR LITEAPI KEY BELOW.'}
          </div>
        </div>
      </section>

      {/* STEP 01 — MARKET */}
      <section style={{ padding: '40px 56px' }}>
        <div className="container">
          <div className="mono accent">01 / SELECT YOUR MARKET</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {MARKETS.map(m => (
              <button key={m.key} onClick={() => pickMarket(m)}
                className={`tag ${market?.key === m.key ? 'tag-active' : ''}`}
                style={{ background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
                {m.name}
              </button>
            ))}
          </div>
          {market && (
            <div className="mono" style={{ marginTop: 12 }}>
              {loadingHotels
                ? `Loading market…${loadProgress ? ` ${loadProgress[0]} of ${loadProgress[1]} properties` : ''}`
                : `${market.hint} · ${hotels.length} priced properties of ${totalHotels} tracked`}
            </div>
          )}
        </div>
      </section>

      {market && !loadingHotels && hotels.length > 0 && (
        <>
          {/* STEP 02 — HOTELS */}
          <section style={{ padding: '40px 56px' }}>
            <div className="container">
              <div className="mono accent">02 / YOUR HOTEL & COMPETITORS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20, maxWidth: 900 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Your hotel (optional)</span>
                  <select className="ks-input" value={ownKey} onChange={e => { setOwnKey(e.target.value); setAnalysis(null) }}>
                    <option value="">Not listed / skip</option>
                    {hotels.map(h => <option key={h.key} value={h.key}>{h.name}</option>)}
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Filter competitors</span>
                  <input className="ks-input" placeholder="Search by name…" value={filter} onChange={e => setFilter(e.target.value)}/>
                </label>
              </div>

              <div className="mono" style={{ marginTop: 24 }}>
                Select up to three competitors · {competitorKeys.length}/3 selected
                {visibleHotels.matches > visibleHotels.shown.length &&
                  ` · showing ${visibleHotels.shown.length} of ${visibleHotels.matches} — refine the filter to narrow`}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16 }}>
                {visibleHotels.shown.map(h => {
                  const sel = competitorKeys.includes(h.key)
                  const mine = h.key === ownKey
                  return (
                    <button key={h.key} onClick={() => !mine && toggleCompetitor(h.key)}
                      style={{
                        textAlign: 'left', cursor: mine ? 'default' : 'pointer', padding: 16,
                        background: sel ? 'var(--accent)' : 'transparent',
                        border: `1px solid ${sel ? 'var(--accent)' : 'var(--line)'}`,
                        color: 'inherit', opacity: mine ? 0.45 : 1,
                      }}>
                      <div className="title-m" style={{ minHeight: 44 }}>{h.name}</div>
                      <div className="mono" style={{ marginTop: 10 }}>
                        {h.rating ? `★ ${h.rating} · ${h.reviews.toLocaleString()} reviews` : 'Unrated'}
                      </div>
                      <div className="mono" style={{ marginTop: 6, color: sel ? 'var(--cream)' : 'var(--cream-2)' }}>
                        {fmt(h.priceMin)}–{fmt(h.priceMax)} / night
                      </div>
                      <div className="mono" style={{ marginTop: 10, fontSize: 9 }}>
                        {mine ? 'YOUR HOTEL' : sel ? '✓ SELECTED' : '+ COMPARE'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* STEP 03 — DATES & POSITIONING */}
          <section style={{ padding: '40px 56px' }}>
            <div className="container">
              <div className="mono accent">03 / DATES & POSITIONING</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 260px))', gap: 24, marginTop: 20 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Check-in</span>
                  <input type="date" className="ks-input" value={chkIn} onChange={e => { setDates([e.target.value, chkOut]); setAnalysis(null) }}/>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Check-out</span>
                  <input type="date" className="ks-input" value={chkOut} onChange={e => { setDates([chkIn, e.target.value]); setAnalysis(null) }}/>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Positioning: {positioning > 0 ? `+${positioning}` : positioning}% {positioning < 0 ? '(undercut)' : positioning > 0 ? '(premium)' : '(match market)'}</span>
                  <input type="range" min={-15} max={15} step={1} value={positioning}
                    onChange={e => { setPositioning(Number(e.target.value)); setAnalysis(null) }}/>
                </label>
              </div>
              <div style={{ marginTop: 32 }}>
                <button className="btn btn-fill" disabled={!ready || analyzing} onClick={analyze}
                  style={{ opacity: !ready || analyzing ? 0.5 : 1, cursor: !ready || analyzing ? 'default' : 'pointer' }}>
                  {analyzing ? 'Analyzing market…' : `Analyze ${nights.length || 0} night${nights.length === 1 ? '' : 's'} →`}
                </button>
                {!ready && <span className="mono" style={{ marginLeft: 16 }}>Select at least one competitor and valid dates.</span>}
              </div>

              <div style={{ marginTop: 24 }}>
                {LIVE_SERVER_MODE ? (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--cream-3)' }}>
                    LIVE RATE FEED IS SERVER-CONNECTED FOR ALL VISITORS.
                  </div>
                ) : !showKeyField ? (
                  <button onClick={() => { setKeyDraft(getRapidApiKey()); setLiteDraft(getLiteApiKey()); setShowKeyField(true) }}
                    className="mono" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-3)', padding: 0 }}>
                    {hasLiteKey ? '● LIVE RATES CONNECTED (LITEAPI) — MANAGE KEYS'
                      : hasKey ? '● LIVE RATES: XOTELO KEY ONLY — MANAGE KEYS'
                      : '○ CONNECT LIVE RATES (LITEAPI KEY)'}
                  </button>
                ) : (
                  <div style={{ display: 'grid', gap: 8, maxWidth: 560 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="mono" style={{ width: 130 }}>liteAPI key</span>
                      <input type="password" className="ks-input" placeholder="sand_… or prod_…"
                        value={liteDraft} onChange={e => setLiteDraft(e.target.value)} style={{ flex: 1, minWidth: 200 }}/>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="mono" style={{ width: 130 }}>RapidAPI key</span>
                      <input type="password" className="ks-input" placeholder="Optional Xotelo fallback…"
                        value={keyDraft} onChange={e => setKeyDraft(e.target.value)} style={{ flex: 1, minWidth: 200 }}/>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn" onClick={() => {
                        setLiteApiKey(liteDraft); setHasLiteKey(!!liteDraft.trim())
                        setRapidApiKey(keyDraft); setHasKey(!!keyDraft.trim())
                        setShowKeyField(false); setAnalysis(null)
                      }}>Save</button>
                      <button className="btn btn-ghost" onClick={() => {
                        setLiteApiKey(''); setHasLiteKey(false); setLiteDraft('')
                        setRapidApiKey(''); setHasKey(false); setKeyDraft('')
                        setShowKeyField(false)
                      }}>Disconnect all</button>
                    </div>
                  </div>
                )}
                {!LIVE_SERVER_MODE && (
                  <div className="mono" style={{ marginTop: 8, fontSize: 9 }}>
                    KEYS ARE STORED ONLY IN THIS BROWSER — NEVER PUBLISHED WITH THE SITE. GET A FREE KEY AT LITEAPI.TRAVEL.
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {error && (
        <section style={{ padding: '20px 56px' }}>
          <div className="container mono" style={{ color: 'var(--accent-2)' }}>{error}</div>
        </section>
      )}

      {/* RESULTS */}
      {analysis && (
        <section style={{ padding: '60px 56px 100px', borderTop: '1px solid var(--line)' }}>
          <div className="container">
            <Kicker>Recommendation</Kicker>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 96, marginTop: 32, alignItems: 'start' }}>
              <div>
                <div className="mono">Recommended nightly rate</div>
                <div className="serif" style={{ fontSize: 72, lineHeight: 1, color: 'var(--cream)', marginTop: 12 }}>
                  {fmt(analysis.nightlyAvg)}
                </div>
                <div className="mono" style={{ marginTop: 10 }}>
                  {fmt(analysis.stayTotal)} total · {nights.length} night{nights.length === 1 ? '' : 's'} · {chkIn} → {chkOut}
                </div>
                <div style={{ marginTop: 32 }}>
                  {[['Market floor', analysis.floor], ['Market base', analysis.base], ['Market ceiling', analysis.ceiling]].map(([k, v]) => (
                    <div key={k} className="meta-row" style={{ padding: '12px 0' }}>
                      <span className="mono" style={{ width: 140 }}>{k}</span>
                      <span className="serif" style={{ fontSize: 18 }}>{fmt(v)}</span>
                    </div>
                  ))}
                </div>
                {analysis.ownComparison && ownHotel && (
                  <p className="body-l" style={{ marginTop: 28, maxWidth: 420 }}>
                    {ownHotel.name} is currently {analysis.ownComparison.ownIsLive ? 'selling at' : 'positioned around'} {fmt(analysis.ownComparison.ownMid)}/night —
                    the recommendation is {Math.abs(analysis.ownComparison.deltaPct)}%
                    {analysis.ownComparison.deltaPct >= 0 ? ' above' : ' below'} that.
                  </p>
                )}
              </div>

              <div>
                <div className="mono" style={{ marginBottom: 16 }}>Competitive set · nightly range</div>
                {[...competitors, ...(ownHotel ? [ownHotel] : [])].map(h => (
                  <div key={h.key} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <span className="title-m">{h.name}{h.key === ownKey ? ' · you' : ''}</span>
                      <span className="mono">
                        {liveQuotes[h.key]
                          ? <>LIVE {fmt(liveQuotes[h.key].nightly)}/nt · {liveQuotes[h.key].ota}</>
                          : <>{fmt(h.priceMin)}–{fmt(h.priceMax)}</>}
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: 6, background: 'var(--line)', marginTop: 8 }}>
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0,
                        left: pct(h.priceMin), right: `calc(100% - ${pct(h.priceMax)})`,
                        background: h.key === ownKey ? 'var(--cream-2)' : 'var(--accent)',
                      }}/>
                    </div>
                  </div>
                ))}

                <div className="mono" style={{ margin: '32px 0 12px' }}>Night-by-night</div>
                <div style={{ border: '1px solid var(--line)' }}>
                  {analysis.perNight.map(n => (
                    <div key={n.date} className="meta-row" style={{ padding: '10px 16px', display: 'flex' }}>
                      <span className="mono" style={{ width: 120 }}>{n.date}</span>
                      <span className="mono" style={{ width: 90, color: n.demand === 'Peak' ? 'var(--accent-2)' : n.demand === 'Low' ? 'var(--cream-3)' : undefined }}>{n.demand}</span>
                      <span className="serif" style={{ fontSize: 16, marginLeft: 'auto' }}>{fmt(n.rate)}</span>
                    </div>
                  ))}
                </div>
                <p className="mono" style={{ marginTop: 20, fontSize: 9, maxWidth: 520 }}>
                  {analysis.live
                    ? `MARKET DATA: LIVE RATES FOR ${analysis.liveCount} OF ${analysis.competitorCount} COMPETITORS (LITEAPI), REMAINDER FROM TRIPADVISOR PRICE RANGES + DEMAND CALENDARS.`
                    : 'MARKET DATA: TRIPADVISOR PRICE RANGES & DEMAND CALENDARS VIA XOTELO. LIVE RATES ARE CHECKED ON EVERY ANALYSIS AND USED AUTOMATICALLY WHEN AVAILABLE.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer onNav={onNav}/>
    </div>
  )
}
