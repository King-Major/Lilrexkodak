import { useEffect, useState } from 'react'
import { artist, nav, platforms } from '../data/site.js'
import { useHeaderTone } from '../hooks/useHeaderTone.js'
import { platformIcons, PlayIcon } from './Icons.jsx'
import './Header.css'

export default function Header({ onListen }) {
  const [open, setOpen] = useState(false)
  const tone = useHeaderTone()

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', open)
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('is-locked')
    }
  }, [open])

  return (
    <>
    <header className="site-header" data-tone={open ? 'black' : tone}>
      <div className="site-header__bar">
        <a className="site-header__logo" href="#top" aria-label={`${artist.name} home`} onClick={() => setOpen(false)}>
          <span className="display">L.R.K</span>
          <span aria-hidden="true">🦖</span>
        </a>

        <nav className="site-nav" aria-label="Main">
          {nav.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <button type="button" className="btn btn--rex site-nav__cta" onClick={onListen}>
            <PlayIcon /> Listen
          </button>
        </nav>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="menu-btn__bars" aria-hidden="true" />
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
    </header>

    {/* Outside the header on purpose: the header's blur would otherwise trap this fixed layer. */}
    <div id="menu" className="menu" hidden={!open}>
        <nav aria-label="Menu" className="menu__links">
          {nav.map((l) => (
            <a key={l.href} className="display" href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <ul className="menu__platforms" aria-label="Listen on">
          {platforms.map((p) => {
            const Icon = platformIcons[p.id]
            return (
              <li key={p.id}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                  <Icon />
                </a>
              </li>
            )
          })}
        </ul>
    </div>
    </>
  )
}
