import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const MICROSITES = ['maine-grill']

/** Vite dev/preview do not map /maine-grill/ → /maine-grill/index.html; rewrite those requests. */
function micrositeIndexPlugin() {
  const rewrite = (req, _res, next) => {
    const [pathname, search = ''] = (req.url || '').split('?')
    const query = search ? `?${search}` : ''
    for (const site of MICROSITES) {
      if (pathname === `/${site}` || pathname === `/${site}/`) {
        req.url = `/${site}/index.html${query}`
        break
      }
      // SPA fallback for React microsites (client-side routes)
      if (site === 'maine-grill' && pathname.startsWith(`/${site}/`)) {
        const rest = pathname.slice(`/${site}/`.length)
        const looksLikeAsset = /\.[a-zA-Z0-9]+$/.test(rest)
        if (!looksLikeAsset) {
          req.url = `/${site}/index.html${query}`
        }
        break
      }
    }
    next()
  }

  return {
    name: 'microsite-index',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

/** Same-origin proxies for rate-data APIs (no CORS headers upstream).
 *  Production equivalents live in amplify.yml as 200 rewrites. */
const XOTELO_PROXY = {
  '/api/xotelo': {
    target: 'https://data.xotelo.com',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api\/xotelo/, '/api'),
  },
  '/api/liteapi': {
    target: 'https://api.liteapi.travel',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api\/liteapi/, '/v3.0'),
  },
}

export default defineConfig({
  plugins: [react(), micrositeIndexPlugin()],
  server: {
    port: 5174,
    host: true,
    open: false,
    proxy: XOTELO_PROXY,
  },
  preview: {
    port: 5174,
    host: true,
    proxy: XOTELO_PROXY,
  },
})
