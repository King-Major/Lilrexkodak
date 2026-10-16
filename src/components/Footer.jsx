import { artist, platforms } from '../data/site.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer plane plane--black" data-plane="black">
      <div className="wrap">
        <svg className="footer__mark" viewBox="0 0 100 15" aria-hidden="true" focusable="false">
          <text x="0" y="13" textLength="100" lengthAdjust="spacingAndGlyphs">
            LIL REX KODAK
          </text>
        </svg>

        <div className="footer__row">
          <ul className="footer__links" aria-label="Listen on">
            {platforms.map((p) => (
              <li key={p.id}>
                <a href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
          <a className="footer__top" href="#top">
            Back to top
          </a>
        </div>

        <p className="footer__legal muted">
          © {artist.year} {artist.name} ({artist.realName}). All rights reserved.
        </p>
      </div>
    </footer>
  )
}
