import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Fills in the site address used by the canonical link and share image.
// Set VITE_SITE_URL in .env (see .env.example). Without it, those tags fall back to relative paths.
function siteUrl(url) {
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      let out = html.replaceAll('%SITE_URL%', url)
      if (!url) {
        out = out
          .replace(/<link rel="canonical"[^>]*>\s*/g, '')
          .replace(/<meta property="og:url"[^>]*>\s*/g, '')
      }
      return out
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const url = (env.VITE_SITE_URL || '').replace(/\/$/, '')
  return {
    // Relative base: the built site works at a domain root or inside a sub-folder.
    base: './',
    plugins: [react(), siteUrl(url)],
  }
})
