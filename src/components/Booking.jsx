import { artist } from '../data/site.js'
import BookingForm from './BookingForm.jsx'
import './Booking.css'

export default function Booking({ note }) {
  return (
    <section id="book" className="plane plane--white" data-plane="white" aria-labelledby="book-title">
      <div className="wrap booking">
        <div className="booking__intro">
          <h2 id="book-title" className="display h2">
            Book {artist.name}
          </h2>
          <p className="lede muted">
            Shows, features and brand work. Tell us the date, the place and the budget, and the team replies within 48 hours.
          </p>
        </div>
        <BookingForm note={note} />
      </div>
    </section>
  )
}
