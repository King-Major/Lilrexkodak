import { useEffect, useState } from 'react'

/**
 * The page alternates between black and white sections (each marked data-plane="black" | "white").
 * This reports which one sits under the header, so the header can flip to match.
 */
export function useHeaderTone(probeY = 32) {
  const [tone, setTone] = useState('black')

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const planes = document.querySelectorAll('[data-plane]')
      let next = 'black'
      for (const el of planes) {
        const r = el.getBoundingClientRect()
        if (r.top <= probeY && r.bottom > probeY) {
          next = el.dataset.plane
          break
        }
      }
      setTone(next)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [probeY])

  return tone
}
