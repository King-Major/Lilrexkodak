import { useEffect, useRef } from 'react'
import { linkFor, platforms } from '../data/site.js'
import { ArrowOutIcon, CloseIcon, platformIcons } from './Icons.jsx'
import FitText from './FitText.jsx'
import './Rows.css'
import './ListenSheet.css'

/**
 * A bottom sheet on phones and a centred panel on larger screens.
 * Built on the native <dialog>, so Esc, focus trapping and the backdrop come for free.
 */
export default function ListenSheet({ release, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (release && !d.open) d.showModal()
    if (!release && d.open) d.close()
    document.documentElement.classList.toggle('is-locked', Boolean(release))
    return () => document.documentElement.classList.remove('is-locked')
  }, [release])

  // Clicking the dimmed area outside the sheet closes it.
  const onBackdropClick = (e) => {
    if (e.target === ref.current) ref.current.close()
  }

  return (
    <dialog ref={ref} className="sheet" aria-labelledby="sheet-title" onClose={onClose} onClick={onBackdropClick}>
      {release && (
        <div className="sheet__body">
          <div className="sheet__grab" aria-hidden="true" />
          <div className="sheet__head">
            <div className="sheet__headtext">
              <p className="sheet__kicker muted">Listen to</p>
              <FitText as="h2" wrap id="sheet-title" className="display sheet__title" min={24}>
                {release.title}
              </FitText>
            </div>
            <button type="button" className="sheet__close" onClick={() => ref.current.close()} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          <ul className="rows">
            {platforms.map((p) => {
              const Icon = platformIcons[p.id]
              return (
                <li key={p.id}>
                  <a className="row" href={linkFor(release, p)} target="_blank" rel="noopener noreferrer">
                    <Icon className="row__icon" />
                    <span className="row__label">{p.name}</span>
                    <ArrowOutIcon className="row__go" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </dialog>
  )
}
