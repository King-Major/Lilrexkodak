import { useEffect, useRef, useState } from 'react'
import { artist, latestRelease, linkFor, platforms } from '../data/site.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import WorldArt from './WorldArt.jsx'
import { PlayIcon } from './Icons.jsx'
import './Hero.css'

const TILT = (-16 * Math.PI) / 180 // must match the ring's rotation in Hero.css
const HERO_LIGHT = [0.55, -0.45, 0.7] // light from the upper right, so the title crosses the shadow side

/** Moves the dino around the ring, switching between "in front of" and "behind" the planet. */
function useOrbit(systemRef, orbiterRef, calm) {
  useEffect(() => {
    const sys = systemRef.current
    const orb = orbiterRef.current
    if (!sys || !orb) return undefined

    let size = sys.offsetWidth
    let ringW = 1.72 // ring width as a multiple of the planet, read from --ringw in Hero.css
    let theta = 0.62 * Math.PI // starts front-right
    let raf = 0
    let last = 0
    let visible = true

    const place = () => {
      const rx = (size * ringW) / 2
      const ry = rx * 0.2
      const x = rx * Math.cos(theta)
      const y = ry * Math.sin(theta)
      const X = x * Math.cos(TILT) - y * Math.sin(TILT)
      const Y = x * Math.sin(TILT) + y * Math.cos(TILT)
      const depth = Math.sin(theta) // > 0 means in front
      const k = 0.8 + 0.24 * ((depth + 1) / 2)
      orb.style.transform = `translate(${X.toFixed(1)}px, ${Y.toFixed(1)}px) scale(${k.toFixed(3)})`
      orb.dataset.layer = depth > 0 ? 'front' : 'back'
    }

    const step = (t) => {
      if (!visible) {
        raf = 0
        return
      }
      const dt = last ? Math.min(t - last, 64) : 16
      last = t
      theta += dt * 0.00034 // one lap about every 18 seconds
      place()
      raf = requestAnimationFrame(step)
    }
    const start = () => {
      if (!raf && !calm) {
        last = 0
        raf = requestAnimationFrame(step)
      }
    }

    const ro = new ResizeObserver(() => {
      size = sys.offsetWidth
      ringW = parseFloat(getComputedStyle(sys).getPropertyValue('--ringw')) || 1.72
      place()
    })
    ro.observe(sys)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(sys)

    place()
    start()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [systemRef, orbiterRef, calm])
}

export default function Hero() {
  const heroRef = useRef(null)
  const systemRef = useRef(null)
  const orbiterRef = useRef(null)
  const calm = usePrefersReducedMotion()
  const [roars, setRoars] = useState(0) // how many times the dino has been tapped
  const [roarShown, setRoarShown] = useState(false)

  useOrbit(systemRef, orbiterRef, calm)

  // Scroll parallax: the planet drifts up slightly as you leave the hero.
  useEffect(() => {
    if (calm) return undefined
    const el = heroRef.current
    let raf = 0
    const update = () => {
      raf = 0
      el.style.setProperty('--scroll', Math.min(window.scrollY, window.innerHeight * 1.2).toFixed(0))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [calm])

  useEffect(() => {
    if (!roarShown) return undefined
    const t = setTimeout(() => setRoarShown(false), 1000)
    return () => clearTimeout(t)
  }, [roarShown, roars])

  const onRoar = () => {
    setRoars((n) => n + 1)
    setRoarShown(true)
    if (navigator.vibrate) navigator.vibrate([30, 40, 60])
  }

  const spotify = platforms.find((p) => p.id === 'spotify') ?? platforms[0]

  return (
    <section id="top" ref={heroRef} className="hero" data-plane="black" aria-label="Introduction">
      <div className="hero__stage">
        <div className="system" ref={systemRef}>
          <span className="ring ring--back" aria-hidden="true" />
          <WorldArt className="system__planet" seed="rex-prime" grid={48} mode="onBlack" bands={false} craters={false} light={HERO_LIGHT} solid />
          <span className="ring ring--front" aria-hidden="true" />
          <div className="orbiter" ref={orbiterRef} data-layer="front">
            <button
              type="button"
              className="dino"
              onClick={onRoar}
              aria-label="Make the dino roar"
              style={roars ? { animation: `${roars % 2 ? 'shake' : 'shake-b'} 0.5s ease-in-out` } : undefined}
            >
              <span aria-hidden="true">🦖</span>
              {roarShown && <span key={roars} className="roar" aria-hidden="true">RAWR</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="hero__copy">
        <h1 className="hero__title" aria-label={artist.name}>
          <svg viewBox="0 0 100 52" aria-hidden="true" focusable="false">
            <text x="0" y="24" textLength="100" lengthAdjust="spacingAndGlyphs">LIL REX</text>
            <text x="0" y="50" textLength="100" lengthAdjust="spacingAndGlyphs" className="outline">KODAK</text>
          </svg>
        </h1>
        <p className="lede hero__lede">{artist.tagline}</p>
        <div className="hero__actions">
          <a
            className="btn btn--rex"
            href={linkFor(latestRelease, spotify)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlayIcon /> Play {latestRelease.title}
          </a>
          <a className="btn btn--ghost" href="#music">Explore the music</a>
        </div>
      </div>
    </section>
  )
}
