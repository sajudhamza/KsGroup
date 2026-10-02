// RateIQ liteAPI proxy — Cloudflare Worker.
//
// Holds the liteAPI key as a server-side secret so it is never shipped to
// browsers. The site calls this worker with no key; the worker injects it,
// forwards to liteAPI, and only answers requests from the KS site origins.
//
// Deploy (≈5 minutes, free tier):
//   1. https://dash.cloudflare.com → Workers & Pages → Create → Worker.
//   2. Name it (e.g. "rateiq-proxy"), paste this file, Deploy.
//   3. Worker → Settings → Variables and Secrets → Add:
//        name  LITEAPI_KEY   (type: Secret)
//        value your liteAPI key (sand_… or prod_…)
//   4. Copy the worker URL (https://rateiq-proxy.<account>.workers.dev)
//      and set PROXY in src/lib/rateIntel.js to that URL.

const ALLOWED_ORIGINS = [
  'https://www.kshospitalitygroup.com',
  'https://kshospitalitygroup.com',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
]

// Only the two endpoints RateIQ needs — nothing else is forwarded.
const ALLOWED_ROUTES = [
  ['GET', '/data/hotels'],
  ['POST', '/hotels/rates'],
]

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const originAllowed = ALLOWED_ORIGINS.includes(origin)
    const cors = {
      'Access-Control-Allow-Origin': originAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    // Browsers always send Origin on cross-site requests; anything else is not the site.
    if (!originAllowed) return new Response('forbidden', { status: 403 })

    const url = new URL(request.url)
    const routeOk = ALLOWED_ROUTES.some(([m, p]) => m === request.method && p === url.pathname)
    if (!routeOk) return new Response('not found', { status: 404, headers: cors })

    const upstream = `https://api.liteapi.travel/v3.0${url.pathname}${url.search}`
    const res = await fetch(upstream, {
      method: request.method,
      headers: { 'X-API-Key': env.LITEAPI_KEY, 'Content-Type': 'application/json' },
      body: request.method === 'POST' ? await request.text() : undefined,
    })
    return new Response(res.body, {
      status: res.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  },
}
