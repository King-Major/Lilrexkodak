import { Fragment, useEffect, useRef } from 'react'
import './FitText.css'

/**
 * A heading that always fits its container, whatever font is loaded.
 *
 * Default (shrink only): keeps the CSS font-size and only scales it down when the longest word
 * would not fit. Use `wrap` to let the title break between words, so only a single very long
 * word ever shrinks. Without `wrap` the whole title stays on one line.
 *
 * `grow`: scales the text up or down so one line exactly fills the container,
 * between `min` and `max` px. The CSS font-size is the fallback until the first measurement.
 *
 * It re-fits on resize and when web fonts finish loading.
 */
export default function FitText({ as: Tag = 'span', wrap = false, grow = false, min = 18, max = 192, className = '', children, ...rest }) {
  const boxRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return undefined

    // Widest thing that must not be cut: the longest word when wrapping, the whole line otherwise.
    const widest = () => {
      let w = 0
      box.querySelectorAll(wrap ? '.fit__word' : '.fit__text').forEach((n) => {
        w = Math.max(w, n.getBoundingClientRect().width)
      })
      return w
    }

    const fit = () => {
      const available = box.clientWidth
      if (!available) return
      if (grow) {
        box.style.fontSize = '100px'
        const natural = widest()
        if (!natural) return
        const size = Math.max(min, Math.min(max, (available / natural) * 100))
        box.style.fontSize = `${size.toFixed(1)}px`
        return
      }
      box.style.fontSize = '' // back to the size the stylesheet asks for at this screen width
      const base = parseFloat(getComputedStyle(box).fontSize)
      const natural = widest()
      if (natural > available) box.style.fontSize = `${Math.max(min, (base * available) / natural - 0.5).toFixed(1)}px`
    }

    let lastWidth = -1
    const onResize = () => {
      const w = box.clientWidth
      if (w === lastWidth) return
      lastWidth = w
      fit()
    }

    fit()
    const ro = new ResizeObserver(onResize)
    ro.observe(box)
    document.fonts?.ready.then(fit)
    document.fonts?.addEventListener?.('loadingdone', fit)
    return () => {
      ro.disconnect()
      document.fonts?.removeEventListener?.('loadingdone', fit)
    }
  }, [wrap, grow, min, max, children])

  const words = wrap && typeof children === 'string' ? children.split(' ') : null

  return (
    <Tag ref={boxRef} className={`fit ${wrap ? 'fit--wrap' : 'fit--line'} ${className}`.trim()} {...rest}>
      {words ? (
        words.map((word, i) => (
          <Fragment key={i}>
            <span className="fit__word">{word}</span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))
      ) : (
        <span className="fit__text">{children}</span>
      )}
    </Tag>
  )
}
