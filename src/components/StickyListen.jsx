import { useEffect, useState } from 'react'
import { latestRelease } from '../data/site.js'
import { PlayIcon } from './Icons.jsx'
import './StickyListen.css'

/**
 * A pill pinned to the bottom of phone screens. It appears once the hero is out of view
 * and steps aside while the booking form and the club sign-up are on screen.
 */
export default function StickyListen({ onListen }) {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const ids = ['top', 'book', 'club']
    const seen = Object.fromEntries(ids.map((id) => [id, id === 'top']))
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen[e.target.id] = e.isIntersecting
      setHidden(ids.some((id) => seen[id]))
    })
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div className="sticky-listen" data-hidden={hidden}>
      <button type="button" className="btn btn--rex" onClick={onListen} tabIndex={hidden ? -1 : 0} aria-hidden={hidden}>
        <PlayIcon /> Stream {latestRelease.title}
      </button>
    </div>
  )
}
