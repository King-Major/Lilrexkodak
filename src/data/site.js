// All the words, links and releases on the site live here.
// Edit this file to update the site. No other file needs to change.

export const artist = {
  name: 'Lil Rex Kodak',
  realName: 'BasseyRex Imoh',
  tagline: 'Afro-fusion and Afro-R&B from BasseyRex Imoh. New single out now.',
  year: 2026,
  // Shown in the press kit with a "Copy bio" button.
  bio:
    "Lil Rex Kodak (BasseyRex Imoh) is an Afro-fusion and Afro R&B artist. His debut EP, Who's L.R.K ?, is out now, alongside a growing run of singles including Zombie (feat. Boi_Zema Dtb), Balenciaga, Gucci and Kulay, and collaborations such as Tornado and Holiday.",
}

// The four streaming profiles. The order here is the order shown on the site.
export const platforms = [
  { id: 'spotify', name: 'Spotify', href: 'https://open.spotify.com/artist/6wm55xdsasFgIu84QAVbIy' },
  { id: 'apple', name: 'Apple Music', href: 'https://music.apple.com/us/artist/1805231717' },
  { id: 'audiomack', name: 'Audiomack', href: 'https://audiomack.com/Lilrexkodak' },
  { id: 'tidal', name: 'Tidal', href: 'https://tidal.com/album/515630512' },
]

// Spotify player shown in the latest-release section (loads only when tapped).
export const spotifyEmbed =
  'https://open.spotify.com/embed/artist/6wm55xdsasFgIu84QAVbIy?utm_source=generator&theme=0'

// type: 'EP' | 'Single' | 'Collab'
// world: 'ink' draws the planet in black/white, 'rex' draws it in dino green.
// links (optional): direct links for one release, e.g. links: { spotify: 'https://open.spotify.com/track/…' }.
//   Any platform not listed falls back to the artist profile above.
export const releases = [
  { id: 'whos-lrk', title: "Who's L.R.K ?", type: 'EP', note: 'Debut EP', world: 'ink' },
  { id: 'zombie', title: 'Zombie', type: 'Single', feat: 'Boi_Zema Dtb', latest: true, world: 'rex' },
  { id: 'experimental', title: 'Experimental', type: 'Single', world: 'ink' },
  { id: 'balenciaga', title: 'Balenciaga', type: 'Single', world: 'ink' },
  { id: 'kulay', title: 'Kulay', type: 'Single', world: 'rex' },
  { id: 'gucci', title: 'Gucci', type: 'Single', world: 'ink' },
  { id: 'low-2', title: 'Low 2', type: 'Single', world: 'ink' },
  { id: 'manya', title: 'Manya', type: 'Single', world: 'rex' },
  { id: 'dtb', title: 'Dtb', type: 'Single', world: 'ink' },
  { id: 'tornado', title: 'Tornado', type: 'Collab', world: 'rex' },
  { id: 'holiday', title: 'Holiday', type: 'Collab', world: 'ink' },
]

// Tabs on the music list. `types` says which release types each tab shows.
export const catalogTabs = [
  { id: 'all', label: 'All', types: ['EP', 'Single', 'Collab'] },
  { id: 'ep', label: 'EP', types: ['EP'] },
  { id: 'singles', label: 'Singles', types: ['Single'] },
  { id: 'collabs', label: 'Collabs', types: ['Collab'] },
]

// Press kit downloads. Put the file in public/press/ and set `file` to its path.
// While `file` is null the row says "Request" and takes the visitor to the booking form.
export const downloads = [
  { id: 'bio', label: 'Artist bio', format: 'PDF', file: null },
  { id: 'photos', label: 'High-res press photos', format: 'ZIP', file: null },
  { id: 'rider', label: 'Technical rider', format: 'PDF', file: null },
]

export const nav = [
  { label: 'Music', href: '#music' },
  { label: 'Press kit', href: '#epk' },
  { label: 'Book', href: '#book' },
  { label: 'Kodak Club', href: '#club' },
]

export const latestRelease = releases.find((r) => r.latest) ?? releases[0]

export function linkFor(release, platform) {
  return release?.links?.[platform.id] ?? platform.href
}
