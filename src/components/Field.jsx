import { useId } from 'react'
import './Field.css'

/** A labelled input with its error message wired up for screen readers. */
export default function Field({ label, error, hint, as = 'input', wide = false, className = '', ...props }) {
  const id = useId()
  const errId = `${id}-err`
  const Tag = as
  return (
    <div className={`field ${wide ? 'field--wide' : ''} ${error ? 'field--error' : ''} ${className}`}>
      <label htmlFor={id}>
        {label}
        {hint && <span className="field__hint"> {hint}</span>}
      </label>
      <Tag id={id} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? errId : undefined} {...props} />
      {error && (
        <p className="field__error" id={errId}>
          {error}
        </p>
      )}
    </div>
  )
}
