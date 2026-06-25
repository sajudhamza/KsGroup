import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const MICROSITES = ['fishbowl', 'rickey']

/** Vite dev/preview do not map /rickey/ → /rickey/index.html; rewrite those requests. */
function micrositeIndexPlugin() {
  const rewrite = (req, _res, next) => {
    const [pathname, search = ''] = (req.url || '').split('?')
    const query = search ? `?${search}` : ''
    for (const site of MICROSITES) {
      if (pathname === `/${site}` || pathname === `/${site}/`) {
        req.url = `/${site}/index.html${query}`
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

export default defineConfig({
  plugins: [react(), micrositeIndexPlugin()],
  server: {
    port: 5174,
    host: true,
    open: false,
  },
  preview: {
    port: 5174,
    host: true,
  },
})
