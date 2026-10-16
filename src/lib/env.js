// Settings that come from the .env file at build time (see .env.example).
export const config = {
  bookingEndpoint: import.meta.env.VITE_BOOKING_ENDPOINT || '',
  clubEndpoint: import.meta.env.VITE_CLUB_ENDPOINT || '',
  isDev: import.meta.env.DEV === true,
  baseUrl: import.meta.env.BASE_URL || './',
}
