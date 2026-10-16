const EMAIL = /^\S+@\S+\.\S+$/

export const isEmail = (v) => EMAIL.test(String(v).trim())

/** Today as YYYY-MM-DD in the visitor's own time zone. */
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Returns an object of field -> message. Empty object means the booking request is valid. */
export function validateBooking(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Enter your name.'
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.'
  if (!v.budget.trim()) e.budget = 'Add a budget or range.'
  if (!v.location.trim()) e.location = 'Enter the city and venue.'
  if (!v.date) e.date = 'Pick an event date.'
  else if (v.date < todayISO()) e.date = 'Pick a date that has not passed.'
  return e
}
