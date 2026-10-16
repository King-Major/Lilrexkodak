import { config } from './env.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Sends a form to its endpoint as JSON (works with Formspree and similar services).
 * - No endpoint + `npm run dev`: pretends to send, so you can try the design.
 * - No endpoint + live site: fails on purpose, so a lead is never silently lost.
 */
export async function submitForm(endpoint, payload) {
  if (!endpoint) {
    if (config.isDev) {
      console.warn('[Demo mode] No form endpoint set in .env, so nothing was sent:', payload)
      await wait(800)
      return
    }
    console.error('Form endpoint is not set. Add it to .env and rebuild (see README).')
    throw new Error('NOT_CONFIGURED')
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('REQUEST_FAILED')
}
