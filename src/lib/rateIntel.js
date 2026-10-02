// RateIQ — competitive rate intelligence for hotels.
//
// Everything runs through one backend: the Cloudflare Worker in
// workers/liteapi-proxy.js, which holds the liteAPI key as a server secret and
// only answers the KS site origins. No key and no other data source is used in
// the browser, so local preview and production take exactly the same path.

const PROXY = 'https://rateiq-proxy.sajudhamza.workers.dev'

export const MAX_COMPETITORS = 3
export const MAX_NIGHTS = 14

// Markets are areas: a centre point and a radius in metres.
export const MARKETS = [
  { id: 'nyc-midtown', name: 'Manhattan · Midtown', hint: 'Times Square, Bryant Park, Midtown East & West', lat: 40.7549, lng: -73.984, radius: 1800 },
  { id: 'nyc-nomad', name: 'Manhattan · NoMad & Chelsea', hint: 'NoMad, Flatiron, Chelsea, Murray Hill', lat: 40.744, lng: -73.99, radius: 1200 },
  { id: 'nyc-downtown', name: 'Manhattan · Downtown', hint: 'Financial District, Tribeca, Battery Park', lat: 40.7075, lng: -74.0113, radius: 1500 },
  { id: 'nyc-soho', name: 'Manhattan · SoHo & LES', hint: 'SoHo, Lower East Side, the Village', lat: 40.724, lng: -73.997, radius: 1400 },
  { id: 'lic', name: 'Long Island City, NY', hint: 'Long Island City & Queens Plaza', lat: 40.749, lng: -73.94, radius: 2000 },
  { id: 'brooklyn', name: 'Brooklyn, NY', hint: 'Downtown Brooklyn, Williamsburg, Gowanus', lat: 40.69, lng: -73.965, radius: 3000 },
  { id: 'lewiston', name: 'Lewiston–Auburn, ME', hint: 'Lewiston, Auburn & Central Maine', lat: 44.09, lng: -70.21, radius: 12000 },
  { id: 'park-city', name: 'Park City, UT', hint: 'Main Street & Old Town', lat: 40.6461, lng: -111.498, radius: 2500 },
]

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

/** Every hotel in a market area, most-reviewed first. */
export async function fetchHotels(market) {
  const url = `${PROXY}/data/hotels?countryCode=US&latitude=${market.lat}&longitude=${market.lng}&radius=${market.radius}&limit=1000`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Hotel list failed (${res.status})`)
  const json = await res.json()
  const seen = new Set()
  return (json.data || [])
    .filter(h => h && h.id && h.name && !seen.has(h.id) && seen.add(h.id))
    .map(h => ({
      id: h.id,
      name: h.name,
      stars: num(h.stars),
      rating: num(h.rating),
      reviews: num(h.reviewCount),
      address: [h.address, h.city].filter(Boolean).join(', '),
    }))
    .sort((a, b) => b.reviews - a.reviews || a.name.localeCompare(b.name))
}

const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const parseDay = (s) => new Date(`${s}T12:00:00`)

export function addDays(dateStr, days) {
  const d = parseDay(dateStr)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

export const todayIso = () => toIso(new Date())

/** Every night of the stay, [checkIn, checkOut), as YYYY-MM-DD. */
export function nightsBetween(checkIn, checkOut) {
  const nights = []
  if (!checkIn || !checkOut) return nights
  let d = checkIn
  while (d < checkOut && nights.length <= MAX_NIGHTS) {
    nights.push(d)
    d = addDays(d, 1)
  }
  return nights
}

export const formatNight = (dateStr) =>
  parseDay(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

/** Lowest rate for each hotel for ONE night. Returns {hotelId: price}; a hotel
 *  with no availability that night is simply absent. */
async function fetchOneNight(hotelIds, night) {
  const res = await fetch(`${PROXY}/hotels/rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelIds,
      checkin: night,
      checkout: addDays(night, 1),
      occupancies: [{ adults: 2 }],
      currency: 'USD',
      guestNationality: 'US',
      maxRatesPerHotel: 1, // the API returns each hotel's cheapest rate
    }),
  })
  let json = null
  try { json = await res.json() } catch { /* handled below */ }
  if (!json) throw new Error(`Rates failed (${res.status})`)
  // "no availability found" is an answer, not a failure.
  if (json.error && !json.data) {
    if (json.error.code === 2001) return {}
    throw new Error(json.error.message || `Rates failed (${res.status})`)
  }
  const out = {}
  for (const h of json.data || []) {
    let min = Infinity
    for (const rt of h.roomTypes || []) {
      for (const r of rt.rates || []) {
        const amount = Number(r.retailRate?.total?.[0]?.amount)
        if (amount > 0 && amount < min) min = amount
      }
    }
    if (min < Infinity) out[h.hotelId] = Math.round(min)
  }
  return out
}

/** Nightly prices for every hotel across the stay: {night: {hotelId: price}}.
 *  One request per night, a few at a time; hotels that come back empty are
 *  retried once, because the rate feed occasionally misses on the first ask. */
export async function fetchNightlyRates(hotelIds, nights, onProgress) {
  const result = {}
  let done = 0
  let failures = 0
  const loadNight = async (night) => {
    let prices = {}
    try {
      prices = await fetchOneNight(hotelIds, night)
      const missing = hotelIds.filter(id => prices[id] == null)
      if (missing.length) {
        await new Promise(r => setTimeout(r, 900))
        prices = { ...(await fetchOneNight(missing, night).catch(() => ({}))), ...prices }
      }
    } catch {
      failures++
    }
    result[night] = prices
    done++
    onProgress?.(done, nights.length)
  }
  const CONCURRENCY = 3
  for (let i = 0; i < nights.length; i += CONCURRENCY) {
    await Promise.all(nights.slice(i, i + CONCURRENCY).map(loadNight))
  }
  if (failures === nights.length) throw new Error('The rate service did not respond.')
  return result
}

const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length

/**
 * Turn nightly prices into a pricing plan.
 * For each night the benchmark is the average of the competitors that have a
 * price that night; the recommendation is that average moved by the chosen
 * positioning (negative = undercut, positive = premium).
 */
export function buildPlan({ nights, rates, competitors, ownHotel, positioningPct = 0 }) {
  const factor = 1 + positioningPct / 100
  const rows = nights.map(night => {
    const prices = rates[night] || {}
    const competitorPrices = competitors.map(c => prices[c.id] ?? null)
    const available = competitorPrices.filter(p => p != null)
    const average = available.length ? Math.round(mean(available)) : null
    return {
      night,
      competitorPrices,
      average,
      low: available.length ? Math.min(...available) : null,
      high: available.length ? Math.max(...available) : null,
      own: ownHotel ? (prices[ownHotel.id] ?? null) : null,
      recommended: average != null ? Math.round(average * factor) : null,
    }
  })

  const priced = rows.filter(r => r.recommended != null)
  const both = rows.filter(r => r.recommended != null && r.own != null)
  const recommendedAvg = priced.length ? Math.round(mean(priced.map(r => r.recommended))) : null
  const ownAvg = both.length ? Math.round(mean(both.map(r => r.own))) : null
  const recommendedAvgVsOwn = both.length ? Math.round(mean(both.map(r => r.recommended))) : null

  return {
    rows,
    pricedNights: priced.length,
    recommendedAvg,
    recommendedTotal: priced.reduce((s, r) => s + r.recommended, 0),
    marketAvg: priced.length ? Math.round(mean(priced.map(r => r.average))) : null,
    marketLow: priced.length ? Math.min(...priced.map(r => r.low)) : null,
    marketHigh: priced.length ? Math.max(...priced.map(r => r.high)) : null,
    ownAvg,
    // recommendation vs your current price, over the nights where both exist
    ownDeltaPct: ownAvg ? Math.round(((recommendedAvgVsOwn - ownAvg) / ownAvg) * 100) : null,
    ownNights: both.length,
  }
}

export const fmt = (n) => `$${Number(n).toLocaleString('en-US')}`
