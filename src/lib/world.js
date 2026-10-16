// Procedural halftone planets.
// Each release gets its own world, drawn as a grid of dots whose size follows
// how lit that part of the sphere is. Same seed, same planet, every time.

function xmur3(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BUCKETS = 8
const SCALE = 100 // the planet has a radius of 100 units
const cache = new Map()

/**
 * mode 'onBlack': dots are biggest where the planet is lit (white dots on black).
 * mode 'onWhite': dots are biggest in shadow (black dots on white paper).
 * Returns { groups: [{ width, d }] }. Dots with similar radii share one path,
 * drawn as round-capped zero-length lines, which keeps the markup small.
 */
export function buildWorld(seed, { grid = 16, mode = 'onWhite', bands, light: fixedLight, craters: withCraters = true } = {}) {
  const key = `${seed}|${grid}|${mode}|${bands}|${fixedLight}|${withCraters}`
  if (cache.has(key)) return cache.get(key)

  const rand = mulberry32(xmur3(seed)())

  // Light comes from somewhere in the upper half.
  const theta = ((-160 + rand() * 140) * Math.PI) / 180
  const lz = 0.5 + rand() * 0.25
  const lx = Math.cos(theta) * 0.8
  const ly = Math.sin(theta) * 0.8
  const ln = Math.hypot(lx, ly, lz)
  let light = [lx / ln, ly / ln, lz / ln]
  if (fixedLight) {
    const fn = Math.hypot(...fixedLight)
    light = fixedLight.map((v) => v / fn)
  }

  const bandAmp = (bands ?? rand() > 0.55) ? 0.14 + rand() * 0.16 : 0
  const bandFreq = 2 + rand() * 5
  const bandPhase = rand() * 6.28
  const bandTilt = (rand() - 0.5) * 0.6
  const craters = Array.from({ length: withCraters ? Math.floor(rand() * 3) : 0 }, () => ({
    x: (rand() - 0.5) * 1.1,
    y: (rand() - 0.5) * 1.1,
    r: 0.1 + rand() * 0.14,
  }))

  const cell = 2 / grid
  const rowH = cell * 0.866
  const maxR = cell * 0.74
  const buckets = Array.from({ length: BUCKETS }, () => [])

  let row = 0
  for (let y = -1 + rowH / 2; y <= 1; y += rowH, row++) {
    const offset = row % 2 ? cell / 2 : 0
    for (let x = -1 + cell / 2 + offset; x <= 1; x += cell) {
      const d2 = x * x + y * y
      if (d2 > 0.955) continue
      const nz = Math.sqrt(1 - d2)
      let lit = Math.max(0, x * light[0] + y * light[1] + nz * light[2])

      if (bandAmp) {
        const yy = y * Math.cos(bandTilt) + x * Math.sin(bandTilt)
        lit *= 1 - bandAmp + bandAmp * Math.sin(yy * bandFreq * Math.PI + bandPhase)
      }
      for (const c of craters) {
        const dd = Math.hypot(x - c.x, y - c.y) / c.r
        if (dd < 1) lit *= 0.45 + 0.55 * dd * dd
      }

      lit = Math.pow(Math.min(1, Math.max(0, lit)), 1.05)
      const t = mode === 'onBlack' ? lit : 1 - lit
      const r = t * maxR * (0.94 + rand() * 0.12)
      if (r < cell * 0.07) continue

      const b = Math.min(BUCKETS - 1, Math.floor((r / maxR) * BUCKETS))
      buckets[b].push(`M${(x * SCALE).toFixed(1)} ${(y * SCALE).toFixed(1)}h.01`)
    }
  }

  const groups = buckets
    .map((list, b) => ({
      width: Number((2 * ((b + 0.6) / BUCKETS) * maxR * SCALE).toFixed(2)),
      d: list.join(''),
    }))
    .filter((g) => g.d)

  const world = { groups }
  cache.set(key, world)
  return world
}
