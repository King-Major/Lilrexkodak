import { releases } from '../data/site.js'
import './Marquee.css'

/** A tilted white band of release titles that bridges the hero and the music. */
export default function Marquee() {
  const row = releases.map((r) => (
    <span className="marquee__item" key={r.id}>
      <span className="display">{r.title}</span>
      <span className="marquee__dino">🦖</span>
    </span>
  ))
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track">
          <div className="marquee__row">{row}</div>
          <div className="marquee__row">{row}</div>
        </div>
      </div>
    </div>
  )
}
