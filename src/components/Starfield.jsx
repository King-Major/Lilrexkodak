import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

/**
 * Fixed canvas behind the whole page: twinkling stars that drift with scroll
 * and pointer, plus the odd shooting star. White stars, very rarely a green one.
 */
export default function Starfield() {
  const ref = useRef(null)
  const calm = usePrefersReducedMotion()

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    let W = 0
    let H = 0
    let stars = []
    let shooters = []
    let raf = 0
    let mx = 0
    let my = 0

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const density = W < 700 ? 4200 : 5500
      stars = Array.from({ length: Math.round((W * H) / density) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.9 + 0.1,
        p: Math.random() * 6,
        green: Math.random() < 0.035,
      }))
    }

    const wrap = (v, m) => ((v % m) + m) % m

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H)
      const sy = window.scrollY
      for (const s of stars) {
        const a = calm ? 0.3 + 0.6 * s.z : 0.3 + 0.7 * Math.abs(Math.sin((t / 900) * s.z + s.p))
        ctx.globalAlpha = a
        ctx.fillStyle = s.green ? '#2bd964' : '#fff'
        const x = wrap(s.x - mx * 50 * s.z, W)
        const y = wrap(s.y - my * 40 * s.z - sy * 0.07 * s.z, H)
        const size = s.z * 2
        ctx.fillRect(x, y, size, size)
      }
      ctx.globalAlpha = 1

      if (!calm) {
        if (Math.random() < 0.004) {
          shooters.push({ x: Math.random() * W * 0.8, y: Math.random() * H * 0.45, life: 0 })
        }
        shooters = shooters.filter((s) => s.life < 42)
        for (const s of shooters) {
          s.life++
          const gx = s.x + s.life * 14
          const gy = s.y + s.life * 7
          ctx.strokeStyle = `rgba(255,255,255,${1 - s.life / 42})`
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(gx, gy)
          ctx.lineTo(gx - 90, gy - 45)
          ctx.stroke()
        }
        raf = requestAnimationFrame(draw)
      }
    }

    build()
    if (calm) draw(0)
    else raf = requestAnimationFrame(draw)

    const onResize = () => {
      // Phones fire resize when the address bar shows or hides. Ignore those.
      if (window.innerWidth === W && Math.abs(window.innerHeight - H) < 140) return
      build()
      if (calm) draw(0)
    }
    const onPointer = (e) => {
      if (e.pointerType !== 'mouse') return
      mx = e.clientX / W - 0.5
      my = e.clientY / H - 0.5
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [calm])

  return <canvas ref={ref} className="starfield" aria-hidden="true" />
}
