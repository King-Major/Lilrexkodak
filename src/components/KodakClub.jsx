import { useState } from 'react'
import { config } from '../lib/env.js'
import { submitForm } from '../lib/submit.js'
import { isEmail } from '../lib/validate.js'
import './KodakClub.css'

export default function KodakClub() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | unconfigured

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) {
      setError('Enter a valid email address.')
      e.currentTarget.elements.email.focus()
      return
    }
    setError('')
    if (e.currentTarget.elements._gotcha.value) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      await submitForm(config.clubEndpoint, { _subject: 'New Kodak Club member', email: email.trim() })
      setStatus('sent')
    } catch (err) {
      // NOT_CONFIGURED means no sign-up address was set in .env before the build.
      setStatus(err?.message === 'NOT_CONFIGURED' ? 'unconfigured' : 'error')
    }
  }

  return (
    <section id="club" className="plane plane--black club" data-plane="black" aria-labelledby="club-title">
      <div className="club__limb" aria-hidden="true" />
      <div className="wrap club__inner">
        <h2 id="club-title" className="display h2">
          The Kodak Club <span aria-hidden="true">🦖</span>
        </h2>
        <p className="lede muted">Join for early listens, exclusive drops and first access to merch and shows.</p>

        {status === 'sent' ? (
          <p className="club__done" role="status">
            You are in. Check your inbox.
          </p>
        ) : (
          <form className="club__form" onSubmit={onSubmit} noValidate>
            <div className="club__field">
              <label htmlFor="club-email" className="sr-only">
                Email address
              </label>
              <input
                id="club-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'club-error' : undefined}
              />
              {error && (
                <p className="club__error" id="club-error">
                  {error}
                </p>
              )}
            </div>
            <input className="club__trap" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button type="submit" className="btn btn--rex" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining…' : 'Join the club'}
            </button>
            {status === 'error' && (
              <p className="club__error" role="alert">
                We could not add you. Check your connection and try again.
              </p>
            )}
            {status === 'unconfigured' && (
              <p className="club__error" role="alert">
                Sign-ups are not switched on yet. Please try again soon.
              </p>
            )}
          </form>
        )}

        <div className="club__soon">
          <div>
            <h3 className="display">Merch</h3>
            <p className="muted">The store opens soon. Club members get first access.</p>
          </div>
          <div>
            <h3 className="display">Tour dates</h3>
            <p className="muted">Dates will appear here. Club members hear first.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
