import { useMemo, useRef, useState } from 'react'
import { TopNav, Kicker, Footer } from '../components/Parts.jsx'
import {
  MARKETS, MAX_COMPETITORS, MAX_NIGHTS, fetchHotels, fetchNightlyRates, nightsBetween,
  buildPlan, addDays, todayIso, formatNight, fmt,
} from '../lib/rateIntel.js'

// RateIQ — KS Intelligence: pick up to three competitors, see what each charges
// night by night, and get the nightly rate that keeps your hotel competitive.

const PAGE = 12

const positioningLabel = (p) =>
  p === 0 ? 'Match the competitor average'
    : p < 0 ? `${Math.abs(p)}% below the competitor average`
      : `${p}% above the competitor average`

export const HiFiRateIntel = ({ onNav }) => {
  const [market, setMarket] = useState(null)
  const [hotels, setHotels] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [marketError, setMarketError] = useState(null)
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(PAGE)
  const [competitorIds, setCompetitorIds] = useState([])
  const [ownId, setOwnId] = useState('')
  const [checkIn, setCheckIn] = useState(() => addDays(todayIso(), 14))
  const [checkOut, setCheckOut] = useState(() => addDays(todayIso(), 17))
  const [positioning, setPositioning] = useState(0)
  const [result, setResult] = useState(null)
  const [loadingRates, setLoadingRates] = useState(false)
  const [progress, setProgress] = useState(null)
  const [ratesError, setRatesError] = useState(null)
  const marketRequest = useRef(0)
  const ratesRequest = useRef(0)

  const clearResult = () => { ratesRequest.current++; setResult(null); setRatesError(null); setLoadingRates(false) }

  const pickMarket = async (m) => {
    const request = ++marketRequest.current
    setMarket(m); setHotels([]); setCompetitorIds([]); setOwnId(''); setSearch(''); setVisible(PAGE)
    setMarketError(null); clearResult()
    setLoadingHotels(true)
    try {
      const list = await fetchHotels(m)
      if (request !== marketRequest.current) return
      setHotels(list)
      if (!list.length) setMarketError('No hotels came back for this market. Please try another one.')
    } catch {
      if (request !== marketRequest.current) return
      setMarketError('Could not load hotels for this market. Please try again in a moment.')
    } finally {
      if (request === marketRequest.current) setLoadingHotels(false)
    }
  }

  const toggleCompetitor = (id) => {
    if (id === ownId) return
    clearResult()
    setCompetitorIds(ids => ids.includes(id)
      ? ids.filter(x => x !== id)
      : ids.length >= MAX_COMPETITORS ? ids : [...ids, id])
  }

  const byId = useMemo(() => Object.fromEntries(hotels.map(h => [h.id, h])), [hotels])
  const competitors = competitorIds.map(id => byId[id]).filter(Boolean)
  const ownHotel = byId[ownId] || null
  const alphabetical = useMemo(() => [...hotels].sort((a, b) => a.name.localeCompare(b.name)), [hotels])

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? hotels.filter(h => h.name.toLowerCase().includes(q)) : hotels
  }, [hotels, search])

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut])
  const today = todayIso()
  const dateProblem =
    !checkIn || !checkOut ? 'Choose a check-in and a check-out date.'
      : checkIn < today ? 'Check-in cannot be in the past.'
        : checkOut <= checkIn ? 'Check-out must be after check-in.'
          : nights.length > MAX_NIGHTS ? `Choose a stay of ${MAX_NIGHTS} nights or fewer.`
            : null
  const blocker = !competitors.length ? 'Select at least one competitor.' : dateProblem
  const full = competitorIds.length >= MAX_COMPETITORS

  const getRates = async () => {
    const request = ++ratesRequest.current
    const ids = [...competitors.map(c => c.id), ...(ownHotel ? [ownHotel.id] : [])]
    setLoadingRates(true); setRatesError(null); setResult(null); setProgress([0, nights.length])
    try {
      const rates = await fetchNightlyRates(ids, nights, (done, total) => {
        if (request === ratesRequest.current) setProgress([done, total])
      })
      if (request !== ratesRequest.current) return
      setResult({ rates, nights, competitors, ownHotel })
    } catch {
      if (request !== ratesRequest.current) return
      setRatesError('Could not get rates right now. Please try again in a moment.')
    } finally {
      if (request === ratesRequest.current) setLoadingRates(false)
    }
  }

  const plan = useMemo(
    () => (result ? buildPlan({ ...result, positioningPct: positioning }) : null),
    [result, positioning],
  )

  return (
    <div className="ks">
      <TopNav active="Technology" onNav={onNav}/>

      <section style={{ padding: '100px 56px 40px' }}>
        <div className="container">
          <Kicker>KS Intelligence</Kicker>
          <h1 className="display-l" style={{ marginTop: 18, maxWidth: 1000 }}>
            RateIQ. <span className="ital">Price with precision.</span>
          </h1>
          <p className="body-l" style={{ marginTop: 28, maxWidth: 680 }}>
            Choose up to three competitors and see what each one is charging, night by night.
            Then pick your own hotel and get the nightly rate that keeps you competitive.
          </p>
        </div>
      </section>

      {/* 01 — MARKET */}
      <section style={{ padding: '32px 56px' }}>
        <div className="container">
          <div className="mono accent">01 / Choose your market</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {MARKETS.map(m => (
              <button key={m.id} type="button" onClick={() => pickMarket(m)}
                className={`tag ${market?.id === m.id ? 'tag-active' : ''}`}
                style={{ background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
                {m.name}
              </button>
            ))}
          </div>
          {market && (
            <div className="mono" style={{ marginTop: 14 }}>
              {loadingHotels ? 'Loading hotels…'
                : marketError ? <span style={{ color: 'var(--accent-2)' }}>{marketError}</span>
                  : `${market.hint} · ${hotels.length} hotels`}
            </div>
          )}
        </div>
      </section>

      {market && !loadingHotels && hotels.length > 0 && (
        <>
          {/* 02 — COMPETITORS */}
          <section style={{ padding: '32px 56px' }}>
            <div className="container">
              <div className="mono accent">02 / Choose up to {MAX_COMPETITORS} competitors</div>

              <div className="rateiq-picked" style={{ marginTop: 20 }}>
                {competitors.length === 0 && <span className="mono">No competitors selected yet.</span>}
                {competitors.map(c => (
                  <button key={c.id} type="button" className="tag tag-active" onClick={() => toggleCompetitor(c.id)}
                    style={{ background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)' }}
                    aria-label={`Remove ${c.name}`}>
                    {c.name} ✕
                  </button>
                ))}
                {competitors.length > 0 && (
                  <span className="mono">{competitors.length} of {MAX_COMPETITORS} selected</span>
                )}
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24, maxWidth: 420 }}>
                <span className="mono">Search hotels by name</span>
                <input className="ks-input" placeholder="e.g. Marriott, Hilton, Conrad…" value={search}
                  onChange={e => { setSearch(e.target.value); setVisible(PAGE) }}/>
              </label>

              {matches.length === 0 ? (
                <div className="mono" style={{ marginTop: 24 }}>No hotels match “{search}” in this market.</div>
              ) : (
                <div className="rateiq-grid" style={{ marginTop: 20 }}>
                  {matches.slice(0, visible).map(h => {
                    const selected = competitorIds.includes(h.id)
                    const mine = h.id === ownId
                    const disabled = mine || (full && !selected)
                    return (
                      <button key={h.id} type="button" disabled={disabled} onClick={() => toggleCompetitor(h.id)}
                        className={`rateiq-card ${selected ? 'is-selected' : ''}`}>
                        <span className="title-m">{h.name}</span>
                        <span className="mono">
                          {h.stars > 0 ? `${h.stars}-star` : 'Unrated'}
                          {h.rating > 0 ? ` · ${h.rating}/10 · ${h.reviews.toLocaleString('en-US')} reviews` : ''}
                        </span>
                        {h.address && <span className="mono rateiq-card-address">{h.address}</span>}
                        <span className="mono rateiq-card-state">
                          {mine ? 'Your hotel' : selected ? '✓ Selected' : full ? 'Limit reached' : '+ Add competitor'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
              {matches.length > visible && (
                <button type="button" className="btn" style={{ marginTop: 20 }} onClick={() => setVisible(v => v + PAGE)}>
                  Show more · {matches.length - visible} left
                </button>
              )}
            </div>
          </section>

          {/* 03 — YOUR HOTEL */}
          <section style={{ padding: '32px 56px' }}>
            <div className="container">
              <div className="mono accent">03 / Choose your hotel</div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20, maxWidth: 520 }}>
                <span className="mono">Your hotel</span>
                <select className="ks-input" value={ownId} onChange={e => { setOwnId(e.target.value); clearResult() }}>
                  <option value="">My hotel is not listed</option>
                  {alphabetical.map(h => (
                    <option key={h.id} value={h.id} disabled={competitorIds.includes(h.id)}>{h.name}</option>
                  ))}
                </select>
              </label>
              <div className="mono" style={{ marginTop: 10 }}>
                {ownHotel
                  ? 'Your current nightly prices will be shown next to the recommendation.'
                  : 'Without your hotel you still get the competitor prices and a recommended rate.'}
              </div>
            </div>
          </section>

          {/* 04 — DATES */}
          <section style={{ padding: '32px 56px 56px' }}>
            <div className="container">
              <div className="mono accent">04 / Choose your dates</div>
              <div className="rateiq-dates" style={{ marginTop: 20 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Check-in</span>
                  <input type="date" className="ks-input" value={checkIn} min={today}
                    onChange={e => { setCheckIn(e.target.value); clearResult() }}/>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="mono">Check-out</span>
                  <input type="date" className="ks-input" value={checkOut} min={checkIn || today}
                    onChange={e => { setCheckOut(e.target.value); clearResult() }}/>
                </label>
              </div>
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-fill" disabled={!!blocker || loadingRates} onClick={getRates}
                  style={{ opacity: blocker || loadingRates ? 0.5 : 1, cursor: blocker || loadingRates ? 'default' : 'pointer' }}>
                  {loadingRates
                    ? `Getting rates… ${progress ? `${progress[0]} of ${progress[1]} nights` : ''}`
                    : `Get nightly rates${!dateProblem ? ` · ${nights.length} night${nights.length === 1 ? '' : 's'}` : ''} →`}
                </button>
                {blocker && <span className="mono">{blocker}</span>}
              </div>
              {ratesError && <div className="mono" style={{ marginTop: 16, color: 'var(--accent-2)' }}>{ratesError}</div>}
            </div>
          </section>
        </>
      )}

      {/* RESULTS */}
      {plan && result && (
        <section style={{ padding: '64px 56px 100px', borderTop: '1px solid var(--line)' }}>
          <div className="container">
            <Kicker>Your competitive rate</Kicker>

            {plan.recommendedAvg == null ? (
              <p className="body-l" style={{ marginTop: 24, maxWidth: 620 }}>
                None of the selected competitors returned a price for these dates, so there is nothing to
                benchmark against. Try different dates or different competitors.
              </p>
            ) : (
              <div className="rateiq-summary" style={{ marginTop: 28 }}>
                <div>
                  <div className="mono">Recommended nightly rate{result.ownHotel ? ` · ${result.ownHotel.name}` : ''}</div>
                  <div className="serif rateiq-big">{fmt(plan.recommendedAvg)}</div>
                  <div className="mono" style={{ marginTop: 10 }}>
                    Average per night · {fmt(plan.recommendedTotal)} across {plan.pricedNights} night{plan.pricedNights === 1 ? '' : 's'}
                  </div>
                  {plan.ownAvg != null && (
                    <p className="body-l" style={{ marginTop: 24, maxWidth: 460 }}>
                      {result.ownHotel.name} is currently priced at {fmt(plan.ownAvg)} a night on average.{' '}
                      {plan.ownDeltaPct === 0
                        ? 'That is in line with the recommendation.'
                        : `The recommendation is ${Math.abs(plan.ownDeltaPct)}% ${plan.ownDeltaPct > 0 ? 'higher' : 'lower'}.`}
                    </p>
                  )}
                  {result.ownHotel && plan.ownAvg == null && (
                    <p className="body-l" style={{ marginTop: 24, maxWidth: 460 }}>
                      No current price came back for {result.ownHotel.name} on these dates, so only the
                      recommendation is shown.
                    </p>
                  )}
                </div>

                <div>
                  <div className="meta-row" style={{ padding: '12px 0' }}>
                    <span className="mono" style={{ width: 190 }}>Competitor average</span>
                    <span className="serif" style={{ fontSize: 18 }}>{fmt(plan.marketAvg)}</span>
                  </div>
                  <div className="meta-row" style={{ padding: '12px 0' }}>
                    <span className="mono" style={{ width: 190 }}>Lowest competitor night</span>
                    <span className="serif" style={{ fontSize: 18 }}>{fmt(plan.marketLow)}</span>
                  </div>
                  <div className="meta-row" style={{ padding: '12px 0' }}>
                    <span className="mono" style={{ width: 190 }}>Highest competitor night</span>
                    <span className="serif" style={{ fontSize: 18 }}>{fmt(plan.marketHigh)}</span>
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                    <span className="mono">Positioning · {positioningLabel(positioning)}</span>
                    <input type="range" min={-20} max={20} step={1} value={positioning}
                      onChange={e => setPositioning(Number(e.target.value))}/>
                  </label>
                </div>
              </div>
            )}

            <div className="mono" style={{ margin: '48px 0 12px' }}>Night by night</div>
            <div className="rateiq-table-wrap">
              <table className="rateiq-table">
                <thead>
                  <tr>
                    <th scope="col">Night</th>
                    {result.competitors.map(c => <th scope="col" key={c.id}>{c.name}</th>)}
                    <th scope="col">Competitor average</th>
                    {result.ownHotel && <th scope="col">{result.ownHotel.name} · now</th>}
                    <th scope="col" className="is-rec">Recommended</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.rows.map(r => (
                    <tr key={r.night}>
                      <th scope="row">{formatNight(r.night)}</th>
                      {r.competitorPrices.map((p, i) => <td key={result.competitors[i].id}>{p != null ? fmt(p) : '—'}</td>)}
                      <td>{r.average != null ? fmt(r.average) : '—'}</td>
                      {result.ownHotel && <td>{r.own != null ? fmt(r.own) : '—'}</td>}
                      <td className="is-rec">{r.recommended != null ? fmt(r.recommended) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mono" style={{ marginTop: 18, fontSize: 9, maxWidth: 640, lineHeight: 1.7 }}>
              Prices are each hotel&apos;s lowest available rate for that night, two adults, taxes and fees included,
              supplied by liteAPI. A dash means no availability came back for that night. The recommendation is the
              competitor average for the night, adjusted by your positioning.
            </p>
          </div>
        </section>
      )}

      <Footer onNav={onNav}/>
    </div>
  )
}
