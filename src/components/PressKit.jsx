import { useRef, useState } from 'react'
import { artist, downloads } from '../data/site.js'
import { config } from '../lib/env.js'
import { DownloadIcon } from './Icons.jsx'
import './Rows.css'
import './PressKit.css'

export default function PressKit({ onRequest }) {
  const bioRef = useRef(null)
  const [copyState, setCopyState] = useState('idle') // idle | copied | manual

  const copyBio = async () => {
    try {
      await navigator.clipboard.writeText(artist.bio)
      setCopyState('copied')
    } catch {
      // Clipboard needs a secure page. Fall back to selecting the text so the visitor can copy it.
      window.getSelection()?.selectAllChildren(bioRef.current)
      setCopyState('manual')
    }
    setTimeout(() => setCopyState('idle'), 2600)
  }

  const fileUrl = (file) => `${config.baseUrl.replace(/\/?$/, '/')}${file.replace(/^\//, '')}`

  return (
    <section id="epk" className="plane plane--black" data-plane="black" aria-labelledby="epk-title">
      <div className="wrap press">
        <div className="press__intro">
          <h2 id="epk-title" className="display h2">
            Press kit
          </h2>
          <p className="lede muted">
            Bio, high-res photos and the technical rider for A&amp;Rs, bookers and journalists.
          </p>
        </div>

        <div className="press__bio">
          <blockquote className="press__quote" ref={bioRef}>
            {artist.bio}
          </blockquote>
          <button type="button" className="btn btn--ghost" onClick={copyBio}>
            {copyState === 'copied' ? 'Bio copied' : copyState === 'manual' ? 'Selected. Press copy' : 'Copy bio'}
          </button>
          <span className="sr-only" role="status">
            {copyState === 'copied' ? 'Bio copied to clipboard' : ''}
          </span>
        </div>

        <ul className="rows press__downloads" aria-label="Press kit files">
          {downloads.map((d) => (
            <li key={d.id}>
              {d.file ? (
                <a className="row" href={fileUrl(d.file)} download>
                  <span className="row__label">
                    {d.label} ({d.format})
                  </span>
                  <span className="row__aside">Download</span>
                  <DownloadIcon className="row__go" />
                </a>
              ) : (
                <a
                  className="row"
                  href="#book"
                  onClick={() => onRequest(`Please send the ${d.label.toLowerCase()} (${d.format}).`)}
                >
                  <span className="row__label">
                    {d.label} ({d.format})
                  </span>
                  <span className="row__aside">Request</span>
                  <DownloadIcon className="row__go" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
