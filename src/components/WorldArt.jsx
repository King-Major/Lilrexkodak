import { useId, useMemo } from 'react'
import { buildWorld } from '../lib/world.js'
import './WorldArt.css'

/**
 * A halftone planet. Colour comes from CSS `color`, so a parent can flip it
 * (for example, to its photographic negative on hover).
 *
 * light: optional [x, y, z] direction the light comes from (y is negative towards the top).
 * solid: paints a disc behind the dots in var(--world-bg) so rings pass behind it cleanly.
 * ring:  adds a tilted ring that passes behind and in front of the planet.
 */
export default function WorldArt({
  seed,
  grid = 14,
  mode = 'onWhite',
  bands,
  light,
  craters,
  ring = false,
  solid = false,
  className = '',
}) {
  const uid = useId()
  const world = useMemo(() => buildWorld(seed, { grid, mode, bands, light, craters }), [seed, grid, mode, bands, light, craters])
  const clipId = `world-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}-back`

  return (
    <svg
      className={`world ${className}`}
      viewBox="-135 -135 270 270"
      aria-hidden="true"
      focusable="false"
    >
      {ring && (
        <defs>
          <clipPath id={clipId}>
            <path clipRule="evenodd" d="M-140 -140H140V140H-140Z M0 -100a100 100 0 1 0 0 200a100 100 0 1 0 0 -200Z" />
          </clipPath>
        </defs>
      )}

      {ring && (
        <g clipPath={`url(#${clipId})`}>
          <g transform="rotate(-18)">
            <path className="world__ring world__ring--back" d="M-128 0A128 30 0 0 1 128 0" />
          </g>
        </g>
      )}

      {solid && <circle r="101" style={{ fill: 'var(--world-bg, #000)' }} />}
      <circle className="world__limb" r="100" />

      <g className="world__dots">
        {world.groups.map((g) => (
          <path key={g.width} d={g.d} strokeWidth={g.width} />
        ))}
      </g>

      {ring && (
        <g transform="rotate(-18)">
          <path className="world__ring" d="M-128 0A128 30 0 0 0 128 0" />
        </g>
      )}
    </svg>
  )
}
