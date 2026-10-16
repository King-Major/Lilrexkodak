import { useEffect, useRef, useState } from 'react'
import { artist } from '../data/site.js'
import { config } from '../lib/env.js'
import { submitForm } from '../lib/submit.js'
import { todayISO, validateBooking } from '../lib/validate.js'
import Field from './Field.jsx'
import './BookingForm.css'

const EMPTY = { name: '', email: '', budget: '', location: '', date: '', notes: '' }
const ORDER = ['name', 'email', 'budget', 'location', 'date']

export default function BookingForm({ note }) {
  const formRef = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | unconfigured

  // The press kit can prefill the message, for example "Please send the technical rider".
  useEffect(() => {
    if (note?.text) setValues((v) => ({ ...v, notes: note.text }))
  }, [note])

  const errors = validateBooking(values)
  const show = (k) => (touched[k] ? errors[k] : undefined)

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = formRef.current
    const firstBad = ORDER.find((k) => errors[k])
    if (firstBad) {
      setTouched(Object.fromEntries(ORDER.map((k) => [k, true])))
      form.elements[firstBad]?.focus()
      return
    }

    // Spam trap: real visitors never see or fill this field.
    if (form.elements._gotcha?.value) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      await submitForm(config.bookingEndpoint, {
        _subject: `Booking request from ${values.name}`,
        ...values,
      })
      setStatus('sent')
    } catch (err) {
      // NOT_CONFIGURED means no form address was set in .env before the build.
      setStatus(err?.message === 'NOT_CONFIGURED' ? 'unconfigured' : 'error')
    }
  }

  const reset = () => {
    setValues(EMPTY)
    setTouched({})
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div className="book-done" role="status">
        <span className="book-done__dino" aria-hidden="true">🦖</span>
        <p className="book-done__title display">Request sent</p>
        <p>The team replies within 48 hours.</p>
        <button type="button" className="btn btn--ink" onClick={reset}>
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="book-form" onSubmit={onSubmit} noValidate aria-label={`Book ${artist.name}`}>
      <Field label="Name" name="name" autoComplete="name" value={values.name} onChange={onChange} onBlur={onBlur} error={show('name')} />
      <Field label="Email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={onChange} onBlur={onBlur} error={show('email')} />
      <Field label="Budget or range" name="budget" placeholder="For example, $3,000 to $5,000" value={values.budget} onChange={onChange} onBlur={onBlur} error={show('budget')} />
      <Field label="City and venue" name="location" autoComplete="off" value={values.location} onChange={onChange} onBlur={onBlur} error={show('location')} />
      <Field label="Event date" name="date" type="date" min={todayISO()} wide value={values.date} onChange={onChange} onBlur={onBlur} error={show('date')} />
      <Field label="Anything else?" hint="Optional" name="notes" as="textarea" wide value={values.notes} onChange={onChange} />

      <input className="book-form__trap" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {status === 'error' && (
        <p className="book-form__error" role="alert">
          We could not send your request. Check your connection and try again.
        </p>
      )}
      {status === 'unconfigured' && (
        <p className="book-form__error" role="alert">
          Booking requests are not switched on yet. Please try again soon.
        </p>
      )}

      <button type="submit" className="btn btn--ink book-form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send booking request'}
      </button>
    </form>
  )
}
