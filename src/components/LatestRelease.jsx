import { useState } from 'react'
import { latestRelease, linkFor, platforms, spotifyEmbed } from '../data/site.js'
import { ArrowOutIcon, PlayIcon, platformIcons } from './Icons.jsx'
import FitText from './FitText.jsx'
import './Rows.css'
import './LatestRelease.css'

/** A spinning record. The label wraps the title and the dino. */
function Vinyl({ title }) {
  const text = `${title.toUpperCase()} • LIL REX KODAK • `
  return (
    <div className="vinyl" role="img" aria-label={`${title}, shown as a spinning record`}>
      <div className="vinyl__disc">
        <div className="vinyl__label">
          <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <defs>
              <path id="vinyl-ring" d="M50 50m-39 0a39 39 0 1 1 78 0a39 39 0 1 1 -78 0" />
            </defs>
            <text className="vinyl__text">
              <textPath href="#vinyl-ring" textLength="243" lengthAdjust="spacing">
                {text}
              </textPath>
            </text>
          </svg>
          <span className="vinyl__dino" aria-hidden="true">🦖</span>
        </div>
      </div>
    </div>
  )
}

/** The Spotify player only loads when asked, so the page stays fast on mobile data. */
function SpotifyPlayer() {
  const [on, setOn] = useState(false)
  if (!on) {
    return (
      <button type="button" className="btn btn--ghost latest__preview" onClick={() => setOn(true)}>
        <PlayIcon /> Play on this page
      </button>
    )
  }
  return (
    <iframe
      className="latest__player"
      title="Spotify player for Lil Rex Kodak"
      src={spotifyEmbed}
      width="100%"
      height="352"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  )
}

export default function LatestRelease() {
  const r = latestRelease
  return (
    <section id="latest" className="plane plane--black" data-plane="black" aria-labelledby="latest-title">
      <div className="wrap latest">
        <Vinyl title={r.title} />

        <div className="latest__info">
          <p className="latest__tag">Latest release</p>
          <FitText as="h2" id="latest-title" className="display latest__title" max={192}>
            {r.title}
          </FitText>
          {r.feat && <p className="latest__feat muted">feat. {r.feat}</p>}

          <ul className="rows latest__platforms" aria-label={`Listen to ${r.title}`}>
            {platforms.map((p) => {
              const Icon = platformIcons[p.id]
              return (
                <li key={p.id}>
                  <a className="row" href={linkFor(r, p)} target="_blank" rel="noopener noreferrer">
                    <Icon className="row__icon" />
                    <span className="row__label">{p.name}</span>
                    <ArrowOutIcon className="row__go" />
                  </a>
                </li>
              )
            })}
          </ul>

          <SpotifyPlayer />
        </div>
      </div>
    </section>
  )
}
