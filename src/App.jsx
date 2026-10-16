import { useCallback, useState } from 'react'
import { latestRelease } from './data/site.js'
import Starfield from './components/Starfield.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import LatestRelease from './components/LatestRelease.jsx'
import Discography from './components/Discography.jsx'
import PressKit from './components/PressKit.jsx'
import Booking from './components/Booking.jsx'
import KodakClub from './components/KodakClub.jsx'
import Footer from './components/Footer.jsx'
import ListenSheet from './components/ListenSheet.jsx'
import StickyListen from './components/StickyListen.jsx'

export default function App() {
  const [sheetRelease, setSheetRelease] = useState(null) // the release shown in the listen sheet
  const [bookingNote, setBookingNote] = useState(null) // text the press kit drops into the booking form

  const closeSheet = useCallback(() => setSheetRelease(null), [])
  const listenLatest = useCallback(() => setSheetRelease(latestRelease), [])
  const requestFromPressKit = useCallback((text) => setBookingNote({ text, at: Date.now() }), [])

  return (
    <>
      <Starfield />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header onListen={listenLatest} />
      <main id="main">
        <Hero />
        <Marquee />
        <LatestRelease />
        <Discography onOpen={setSheetRelease} />
        <PressKit onRequest={requestFromPressKit} />
        <Booking note={bookingNote} />
        <KodakClub />
      </main>
      <Footer />
      <StickyListen onListen={listenLatest} />
      <ListenSheet release={sheetRelease} onClose={closeSheet} />
    </>
  )
}
