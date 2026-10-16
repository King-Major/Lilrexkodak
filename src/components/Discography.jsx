import { useState } from 'react'
import { catalogTabs, releases } from '../data/site.js'
import FitText from './FitText.jsx'
import WorldArt from './WorldArt.jsx'
import { PlayIcon } from './Icons.jsx'
import './Discography.css'

// A few worlds get a ring, chosen from the title so it stays the same on every visit.
const hasRing = (id) => [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 2 === 0

export default function Discography({ onOpen }) {
  const [tabId, setTabId] = useState('all')
  const tab = catalogTabs.find((t) => t.id === tabId) ?? catalogTabs[0]
  const list = releases.filter((r) => tab.types.includes(r.type))

  return (
    <section id="music" className="plane plane--white music" data-plane="white" aria-labelledby="music-title">
      <div className="wrap">
        <h2 id="music-title" className="display h2">
          The music
        </h2>

        <div className="tabs" role="group" aria-label="Show releases">
          {catalogTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className="tab"
              aria-pressed={t.id === tabId}
              onClick={() => setTabId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <ul className="tracklist" aria-live="polite">
          {list.map((r) => (
            <li key={r.id}>
              <button type="button" className="track" data-world={r.world} onClick={() => onOpen(r)}>
                <span className="track__thumb">
                  <WorldArt seed={r.id} grid={14} mode="onWhite" ring={hasRing(r.id)} solid />
                </span>
                <span className="track__text">
                  <FitText wrap className="display track__title" min={20}>{r.title}</FitText>
                  <span className="track__meta">
                    {r.latest && <span className="track__new">New</span>}
                    <span>{r.feat ? `feat. ${r.feat}` : r.note ?? r.type}</span>
                  </span>
                </span>
                <span className="track__go" aria-hidden="true">
                  <PlayIcon />
                </span>
                <span className="sr-only">Choose where to listen to {r.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
