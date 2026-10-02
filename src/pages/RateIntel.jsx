import { useEffect, useMemo, useRef, useState } from 'react'
import { TopNav, Kicker, Footer } from '../components/Parts.jsx'
import {
  MARKETS, MAX_COMPETITORS, MAX_NIGHTS, fetchHotels, fetchNightlyRates, nightsBetween,
  buildPlan, addDays, todayIso, formatNight, fmt,
} from '../lib/rateIntel.js'

// RateIQ — KS Intelligence: pick up to three competitors, see what each charges
// night by night, and get the nightly rate that keeps your hotel competitive.

const positioningLabel = (p) =>
  p === 0 ? 'Match the competitor average'
    : p < 0 ? `${Math.abs(p)}% below the competitor average`
      : `${p}% above the competitor average`

const OPTION_LIMIT = 40

/** Hotels whose name contains every typed word; address-only matches follow. */
function searchHotels(hotels, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return hotels
  const byName = []
  const byAddress = []
  for (const h of hotels) {
    const name = h.name.toLowerCase()
    if (words.every(w => name.includes(w))) byName.push(h)
    else if (words.every(w => `${name} ${h.address.toLowerCase()}`.includes(w))) byAddress.push(h)
  }
  return [...byName, ...byAddress]
}

/**
 * Type-to-search hotel picker. The list filters as you type; pick with a click
 * or with the arrow keys and Enter.
 * - single mode (default): shows the chosen hotel in the field, with a clear button
 * - multi mode: each pick is handed to the parent and the field resets for the next
 */
const HotelSearch = ({
  id, label, placeholder, hotels, onPick, blockedReason,
  selected = null, onClear, multi = false, locked = false, lockedText = '',
}) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const results = useMemo(() => searchHotels(hotels, query), [hotels, query])
  const shown = results.slice(0, OPTION_LIMIT)
  const showSelected = !multi && selected && !open

  useEffect(() => { if (locked) setOpen(false) }, [locked])
  useEffect(() => {
    if (open) listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const pick = (h) => {
    if (blockedReason(h)) return
    onPick(h)
    setQuery('')
    setActive(0)
    if (!multi) { setOpen(false); inputRef.current?.blur() }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      if (!shown.length) return
      setActive(i => (i + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length)
    } else if (e.key === 'Enter') {
      if (open && shown[active]) { e.preventDefault(); pick(shown[active]) }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="rateiq-combo">
      <label htmlFor={id} className="mono">{label}</label>
      <div className="rateiq-combo-field">
        <input
          ref={inputRef}
          id={id}
          className="ks-input"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && shown[active] ? `${id}-opt-${shown[active].id}` : undefined}
          autoComplete="off"
          spellCheck={false}
          disabled={locked}
          placeholder={locked ? lockedText : placeholder}
          value={showSelected ? selected.name : query}
          onChange={e => { setQuery(e.target.value); setActive(0); setOpen(true) }}
          onFocus={() => { setQuery(''); setActive(0); setOpen(true) }}
          onBlur={() => { setOpen(false); setQuery('') }}
          onKeyDown={onKeyDown}
        />
        {!multi && selected && onClear && (
          <button type="button" className="rateiq-combo-clear" aria-label={`Clear ${selected.name}`}
            onMouseDown={e => e.preventDefault()} onClick={onClear}>✕</button>
        )}
      </div>

      {open && (
        <ul ref={listRef} id={`${id}-list`} role="listbox" aria-label={label} className="rateiq-combo-list"
          onMouseDown={e => e.preventDefault()}>
          {shown.length === 0 && (
            <li className="mono rateiq-combo-note">No hotels match “{query}” in this market.</li>
          )}
          {shown.map((h, i) => {
            const blocked = blockedReason(h)
            return (
              <li key={h.id} id={`${id}-opt-${h.id}`} role="option"
                aria-selected={i === active} aria-disabled={blocked ? true : undefined}
                className={`rateiq-combo-option ${i === active ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)} onClick={() => pick(h)}>
                <span className="rateiq-combo-name">{h.name}</span>
                <span className="mono">
                  {blocked ? `${blocked} · ` : ''}
                  {h.stars > 0 ? `${h.stars}-star` : 'Unrated'}
                  {h.rating > 0 ? ` · ${h.rating}/10 · ${h.reviews.toLocaleString('en-US')} reviews` : ''}
                  {h.address ? ` · ${h.address}` : ''}
                </span>
              </li>
            )
          })}
          {results.length > shown.length && (
            <li className="mono rateiq-combo-note">
              Showing {shown.length} of {results.length} — keep typing to narrow it down.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export const HiFiRateIntel = ({ onNav }) => {
  const [market, setMarket] = useState(null)
  const [hotels, setHotels] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [marketError, setMarketError] = useState(null)
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
    setMarket(m); setHotels([]); setCompetitorIds([]); setOwnId('')
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

  const addCompetitor = (id) => {
    clearResult()
    setCompetitorIds(ids => (ids.includes(id) || ids.length >= MAX_COMPETITORS ? ids : [...ids, id]))
  }
  const removeCompetitor = (id) => {
    clearResult()
    setCompetitorIds(ids => ids.filter(x => x !== id))
  }

  const byId = useMemo(() => Object.fromEntries(hotels.map(h => [h.id, h])), [hotels])
  const competitors = competitorIds.map(id => byId[id]).filter(Boolean)
  const ownHotel = byId[ownId] || null

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
              <div style={{ marginTop: 20 }}>
                <HotelSearch
                  key={`competitors-${market.id}`}
                  id="rateiq-competitors"
                  label="Search competitor hotels"
                  placeholder="Start typing a hotel name…"
                  hotels={hotels}
                  multi
                  locked={full}
                  lockedText={`${MAX_COMPETITORS} of ${MAX_COMPETITORS} selected — remove one to change`}
                  onPick={h => addCompetitor(h.id)}
                  blockedReason={h => (h.id === ownId ? 'Your hotel' : competitorIds.includes(h.id) ? 'Already selected' : null)}
                />
              </div>
              <div className="rateiq-picked" style={{ marginTop: 20 }}>
                {competitors.length === 0 && <span className="mono">No competitors selected yet.</span>}
                {competitors.map(c => (
                  <button key={c.id} type="button" className="tag tag-active" onClick={() => removeCompetitor(c.id)}
                    style={{ background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)' }}
                    aria-label={`Remove ${c.name}`}>
                    {c.name} ✕
                  </button>
                ))}
                {competitors.length > 0 && (
                  <span className="mono">{competitors.length} of {MAX_COMPETITORS} selected</span>
                )}
              </div>
            </div>
          </section>

          {/* 03 — YOUR HOTEL */}
          <section style={{ padding: '32px 56px' }}>
            <div className="container">
              <div className="mono accent">03 / Choose your hotel</div>
              <div style={{ marginTop: 20 }}>
                <HotelSearch
                  key={`own-${market.id}`}
                  id="rateiq-own"
                  label="Search for your hotel"
                  placeholder="Start typing your hotel's name…"
                  hotels={hotels}
                  selected={ownHotel}
                  onPick={h => { setOwnId(h.id); clearResult() }}
                  onClear={() => { setOwnId(''); clearResult() }}
                  blockedReason={h => (competitorIds.includes(h.id) ? 'Selected as a competitor' : null)}
                />
              </div>
              <div className="mono" style={{ marginTop: 12 }}>
                {ownHotel
                  ? 'Your current nightly prices will be shown next to the recommendation.'
                  : 'Not listed? Leave this empty — you still get the competitor prices and a recommended rate.'}
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
