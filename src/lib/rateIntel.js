// RateIQ — competitive rate intelligence for hotels.
// Data source: Xotelo (TripAdvisor-based). Free endpoints /list and /heatmap are
// used today; live nightly OTA quotes (/rates) require a RapidAPI key — set
// RAPIDAPI_KEY below to upgrade recommendations to live quotes when available.

const API_BASE = '/api/xotelo' // same-origin proxy (vite dev proxy / Amplify rewrite)

// Live-quote upgrade path: https://rapidapi.com/anastue-pGK7lGUO-Wo/api/xotelo-hotel-prices
// The RapidAPI key is NEVER shipped in the bundle — operators paste it once on the
// page ("Connect live OTA quotes") and it stays in that browser's localStorage.
// NOTE (2026-09-14): key verified working (heatmap/search respond), but Xotelo's
// /rates backend currently returns empty for every hotel worldwide. The analyzer
// tries live rates first on every run and falls back to range+demand modeling,
// so live quotes light up automatically when their scraper recovers.
const RAPIDAPI_HOST = 'xotelo-hotel-prices.p.rapidapi.com'
const KEY_STORAGE = 'ks_rateiq_rapidapi_key'
const LITE_KEY_STORAGE = 'ks_rateiq_liteapi_key'
const LITE_ID_CACHE = 'ks_rateiq_liteapi_ids'
const LITE_BASE = '/api/liteapi' // same-origin proxy → https://api.liteapi.travel/v3.0

const storageGet = (k) => { try { return localStorage.getItem(k) || '' } catch { return '' } }
const storageSet = (k, v) => {
  try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k) } catch { /* private browsing */ }
}

export const getRapidApiKey = () => storageGet(KEY_STORAGE)
export const setRapidApiKey = (key) => storageSet(KEY_STORAGE, (key || '').trim())
export const getLiteApiKey = () => storageGet(LITE_KEY_STORAGE)
export const setLiteApiKey = (key) => storageSet(LITE_KEY_STORAGE, (key || '').trim())

// Curated markets (TripAdvisor location keys, verified against the live API).
// city/country feed liteAPI's hotel resolver.
export const MARKETS = [
  { key: 'g60763', name: 'New York City, NY', hint: 'Manhattan, Midtown, Downtown & boroughs', city: 'New York', country: 'US' },
  { key: 'g60827', name: 'Brooklyn, NY', hint: 'Williamsburg, Downtown Brooklyn & beyond', city: 'Brooklyn', country: 'US' },
  { key: 'g40708', name: 'Lewiston, ME', hint: 'Central Maine market', city: 'Lewiston', country: 'US' },
  { key: 'g57097', name: 'Park City, UT', hint: 'Mountain resort market', city: 'Park City', country: 'US' },
]

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || 'API error')
  return data.result
}

const PAGE_SIZE = 100 // API maximum

const mapHotel = (h) => ({
  key: h.key,
  name: h.name,
  type: h.accommodation_type,
  rating: h.review_summary?.rating ?? null,
  reviews: h.review_summary?.count ?? 0,
  priceMin: h.price_ranges?.minimum ?? 0,
  priceMax: h.price_ranges?.maximum ?? 0,
  image: h.image || null,
})

async function fetchHotelPage(locationKey, offset) {
  const result = await getJson(`/list?location_key=${locationKey}&limit=${PAGE_SIZE}&offset=${offset}`)
  return { list: (result.list || []).map(mapHotel), total: result.total_count || 0 }
}

/** EVERY hotel in a market (the API caps pages at 100, so large markets are paged).
 *  onProgress(loaded, total) fires as pages land. Hotels without price data are
 *  kept out — they can't be benchmarked. */
export async function fetchHotels(locationKey, onProgress) {
  const first = await fetchHotelPage(locationKey, 0)
  const total = first.total
  let all = first.list
  onProgress?.(Math.min(PAGE_SIZE, total), total)

  const offsets = []
  for (let o = PAGE_SIZE; o < total; o += PAGE_SIZE) offsets.push(o)

  // Modest concurrency: polite to the free API, still fast for ~1,000 hotels.
  const CONCURRENCY = 4
  for (let i = 0; i < offsets.length; i += CONCURRENCY) {
    const pages = await Promise.all(
      offsets.slice(i, i + CONCURRENCY).map(o => fetchHotelPage(locationKey, o).catch(() => ({ list: [] })))
    )
    pages.forEach(p => { all = all.concat(p.list) })
    onProgress?.(Math.min(all.length, total), total)
  }

  const seen = new Set()
  const hotels = all.filter(h => {
    if (!h.priceMin || seen.has(h.key)) return false
    seen.add(h.key)
    return true
  }).sort((a, b) => b.reviews - a.reviews)
  return { hotels, total }
}

/** Demand calendar for one hotel: sets of cheap / average / high-price dates. */
export async function fetchHeatmap(hotelKey, chkOut) {
  const result = await getJson(`/heatmap?hotel_key=${hotelKey}&chk_out=${chkOut}`)
  const hm = result.heatmap || {}
  return {
    cheap: new Set(hm.cheap_price_days || []),
    average: new Set(hm.average_price_days || []),
    high: new Set(hm.high_price_days || []),
  }
}

// ---------- liteAPI (Nuitee) — primary live-rate provider ----------

const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 || /^\d+$/.test(w))

/** Resolve a TripAdvisor-named hotel to a liteAPI hotel id (cached per browser). */
async function resolveLiteHotelId(hotel, market, key) {
  let cache = {}
  try { cache = JSON.parse(storageGet(LITE_ID_CACHE) || '{}') } catch { /* rebuild */ }
  if (hotel.key in cache) return cache[hotel.key] // may be null = known unmatched

  const search = async (nameQuery) => {
    const url = `${LITE_BASE}/data/hotels?countryCode=${market.country}&cityName=${encodeURIComponent(market.city)}&hotelName=${encodeURIComponent(nameQuery)}&limit=10`
    const res = await fetch(url, { headers: { 'X-API-Key': key } })
    if (!res.ok) throw new Error(`liteAPI ${res.status}`)
    return (await res.json()).data || []
  }
  const ts = tokens(hotel.name)
  let data = await search(ts.slice(0, 2).join(' '))
  if (!data.length && ts.length > 1) data = await search(ts[0]) // retry broader

  const want = new Set(tokens(hotel.name))
  let best = null, bestScore = 0
  for (const c of data || []) {
    const got = tokens(c.name)
    const score = got.filter(t => want.has(t)).length / Math.max(want.size, 1)
    if (score > bestScore) { best = c; bestScore = score }
  }
  const id = bestScore >= 0.4 ? best.id : null
  cache[hotel.key] = id
  storageSet(LITE_ID_CACHE, JSON.stringify(cache))
  return id
}

/** Live rates for the whole comparison set in ONE liteAPI call.
 *  Returns {taHotelKey: {ota, nightly}} for every hotel it could match & price. */
export async function fetchLiteRates(hotels, market, chkIn, chkOut, nightCount) {
  const key = getLiteApiKey()
  if (!key || !market?.city || !nightCount) return {}

  const idByTaKey = {}
  await Promise.all(hotels.map(async h => {
    try { idByTaKey[h.key] = await resolveLiteHotelId(h, market, key) } catch { idByTaKey[h.key] = null }
  }))
  const ids = Object.values(idByTaKey).filter(Boolean)
  if (!ids.length) return {}

  const postRates = async (hotelIds) => {
    const res = await fetch(`${LITE_BASE}/hotels/rates`, {
      method: 'POST',
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelIds,
        checkin: chkIn,
        checkout: chkOut,
        occupancies: [{ adults: 2 }],
        currency: 'USD',
        guestNationality: 'US',
      }),
    })
    if (!res.ok) return []
    return (await res.json()).data || []
  }

  const cheapestByLiteId = {}
  const collect = (data) => {
    for (const h of data) {
      let min = Infinity
      for (const rt of h.roomTypes || []) {
        for (const r of rt.rates || []) {
          const amt = Number(r.retailRate?.total?.[0]?.amount)
          if (amt > 0 && amt < min) min = amt
        }
      }
      if (min < Infinity) cheapestByLiteId[h.hotelId] = Math.round(min / nightCount)
    }
  }

  collect(await postRates(ids))
  // liteAPI occasionally answers "no availability" transiently — retry misses once.
  const missing = ids.filter(id => !cheapestByLiteId[id])
  if (missing.length) {
    await new Promise(r => setTimeout(r, 1500))
    collect(await postRates(missing))
  }

  const out = {}
  for (const [taKey, liteId] of Object.entries(idByTaKey)) {
    if (liteId && cheapestByLiteId[liteId]) out[taKey] = { ota: 'liteAPI', nightly: cheapestByLiteId[liteId] }
  }
  return out
}

// ---------- Xotelo /rates — fallback (backend currently returns empty) ----------

const RATES_QUERY = (hotelKey, chkIn, chkOut) =>
  `/rates?hotel_key=${hotelKey}&chk_in=${chkIn}&chk_out=${chkOut}&currency=USD&adults=2&rooms=1`

const bestQuote = (rates) => {
  const priced = (rates || []).filter(r => Number(r.rate) > 0)
  if (!priced.length) return null
  const best = priced.reduce((a, b) => (Number(a.rate) <= Number(b.rate) ? a : b))
  return { ota: best.name || best.code || 'OTA', nightly: Math.round(Number(best.rate)) }
}

/** Live nightly OTA quotes for one hotel: cheapest quote {ota, nightly} or null.
 *  Tries the free direct endpoint first (no key, no quota, same-origin proxy);
 *  falls back to the operator's RapidAPI key if one is connected. */
export async function fetchLiveRates(hotelKey, chkIn, chkOut) {
  try {
    const direct = await getJson(RATES_QUERY(hotelKey, chkIn, chkOut))
    const quote = bestQuote(direct.rates)
    if (quote) return quote
  } catch { /* fall through to RapidAPI */ }

  const key = getRapidApiKey()
  if (!key) return null
  try {
    const res = await fetch(`https://${RAPIDAPI_HOST}/api${RATES_QUERY(hotelKey, chkIn, chkOut)}`, {
      headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': RAPIDAPI_HOST },
    })
    if (!res.ok) return null
    const data = await res.json()
    return bestQuote(data.result?.rates)
  } catch {
    return null
  }
}

/** Every night of the stay: [chkIn, chkOut) as YYYY-MM-DD strings. */
export function nightsBetween(chkIn, chkOut) {
  const nights = []
  const d = new Date(`${chkIn}T12:00:00`)
  const end = new Date(`${chkOut}T12:00:00`)
  while (d < end && nights.length < 60) {
    nights.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return nights
}

/**
 * Recommendation engine (v1, price-range + demand based).
 * - Market band: floor = avg of competitor minimums, ceiling = avg of maximums,
 *   base = avg of midpoints.
 * - Each night moves from base toward ceiling on peak-demand dates and toward
 *   floor on low-demand dates (per competitor demand calendars), then the
 *   operator's positioning (± %) is applied.
 */
export function computeRecommendation({ competitors, heatmaps, nights, positioningPct = 0, ownHotel = null, liveRates = {} }) {
  // Blend: each competitor contributes its actual live rate when we have one,
  // and its TripAdvisor range otherwise — so one unmatched hotel never drags
  // the whole analysis back to range modeling.
  const lows = competitors.map(c => liveRates[c.key]?.nightly ?? c.priceMin)
  const highs = competitors.map(c => liveRates[c.key]?.nightly ?? c.priceMax)
  const mids = competitors.map(c => liveRates[c.key]?.nightly ?? (c.priceMin + c.priceMax) / 2)
  const liveCount = competitors.filter(c => liveRates[c.key]).length

  const floor = Math.min(...lows)
  const ceiling = Math.max(...highs)
  const base = avg(mids)
  const posFactor = 1 + positioningPct / 100

  const perNight = nights.map(date => {
    let high = 0, cheap = 0, known = 0
    competitors.forEach(c => {
      const hm = heatmaps[c.key]
      if (!hm) return
      if (hm.high.has(date)) { high++; known++ }
      else if (hm.cheap.has(date)) { cheap++; known++ }
      else if (hm.average.has(date)) { known++ }
    })
    const score = known ? (high - cheap) / known : 0 // -1 … 1
    const raw = score >= 0
      ? base + score * (ceiling - base) * 0.6
      : base + score * (base - floor) * 0.6
    const demand = score > 0.34 ? 'Peak' : score < -0.34 ? 'Low' : 'Typical'
    return { date, demand, rate: Math.round(raw * posFactor) }
  })

  const nightlyAvg = Math.round(avg(perNight.map(n => n.rate)))
  const stayTotal = perNight.reduce((s, n) => s + n.rate, 0)

  let ownComparison = null
  if (ownHotel) {
    // Prefer the hotel's actual live rate; fall back to its TripAdvisor midpoint.
    const ownLive = liveRates[ownHotel.key]?.nightly
    const ownMid = ownLive ?? (ownHotel.priceMin + ownHotel.priceMax) / 2
    ownComparison = {
      ownMid: Math.round(ownMid),
      ownIsLive: !!ownLive,
      deltaPct: Math.round(((nightlyAvg - ownMid) / ownMid) * 100),
    }
  }

  return {
    floor: Math.round(floor),
    ceiling: Math.round(ceiling),
    base: Math.round(base),
    nightlyAvg,
    stayTotal,
    perNight,
    ownComparison,
    live: liveCount > 0,
    liveCount,
    competitorCount: competitors.length,
  }
}

const avg = (xs) => xs.reduce((s, x) => s + x, 0) / (xs.length || 1)

export const fmt = (n) => `$${Number(n).toLocaleString('en-US')}`
