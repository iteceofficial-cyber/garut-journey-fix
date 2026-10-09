/**
 * Destination catalogue. Add, remove or reorder entries here — every card,
 * filter, search result and /destinations/$slug page is generated from this list.
 *
 * Only add `openingHours` / `ticketPrice` / `facilities` once they are verified.
 * Anything left `null` renders as "Information coming soon." on the site.
 */
export type Category =
  | 'Nature'
  | 'City'
  | 'Culture'
  | 'Heritage'
  | 'Culinary'
  | 'Family'
  | 'Adventure'

export const categories: Category[] = [
  'Nature',
  'City',
  'Culture',
  'Heritage',
  'Culinary',
  'Family',
  'Adventure',
]

export interface Destination {
  slug: string
  name: string
  categories: Category[]
  image: string
  /** Area within Garut Regency. */
  location: string
  mapsQuery: string
  short: string
  overview: string
  whyVisit: string
  highlights: string[]
  activities: string[]
  travelTips: string[]
  facilities: string[] | null
  openingHours: string | null
  ticketPrice: string | null
  gallery: string[]
  nearby: string[]
}

export const destinations: Destination[] = [
  {
    slug: 'mount-papandayan',
    name: 'Mount Papandayan',
    categories: ['Nature', 'Adventure'],
    image: 'papandayan.png',
    location: 'Cisurupan, Garut',
    mapsQuery: 'Gunung Papandayan, Garut',
    short: 'An active volcano with a walkable crater, steaming vents and highland trails.',
    overview:
      'Papandayan is one of the most approachable volcanoes in West Java. Trails lead past a pale, steaming crater and into cool highland forest — a favourite for first-time hikers and sunrise chasers alike.',
    whyVisit:
      'Few places let you stand this close to a living volcano without a technical climb. The landscape changes every hour as the light and mist move across the crater.',
    highlights: ['Volcanic crater and steam vents', 'Highland forest trails', 'Sunrise over the Garut valley'],
    activities: ['Hiking', 'Photography', 'Camping', 'Nature walks'],
    travelTips: [
      'Start early — mornings are clearer and cooler.',
      'Bring a warm layer; the highlands get cold.',
      'Wear proper walking shoes for loose volcanic ground.',
    ],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['papandayan.png', 'hiking.png', 'darajat.png'],
    nearby: ['darajat-pass', 'cipanas-garut'],
  },
  {
    slug: 'situ-bagendit',
    name: 'Situ Bagendit',
    categories: ['Nature', 'Family'],
    image: 'bagendit.png',
    location: 'Banyuresmi, Garut',
    mapsQuery: 'Situ Bagendit, Garut',
    short: 'A calm lake framed by hills, known for its bamboo rafts and local legend.',
    overview:
      'Situ Bagendit is a wide, quiet lake on the edge of town. Bamboo rafts drift across the water while the hills of Garut rise in the distance — an easy, gentle stop for families and slow travellers.',
    whyVisit:
      'It is one of the simplest ways to slow down in Garut, and the lake carries a well-loved Sundanese folk legend that local guides enjoy retelling.',
    highlights: ['Bamboo raft rides', 'Lakeside views of the hills', 'Local folklore'],
    activities: ['Raft rides', 'Picnics', 'Photography'],
    travelTips: ['Late afternoon light is the most beautiful here.', 'Ask your guide for the legend of Bagendit.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['bagendit.png', 'cangkuang.png', 'sampireun.png'],
    nearby: ['candi-cangkuang', 'garut-city-square'],
  },
  {
    slug: 'cipanas-garut',
    name: 'Cipanas Garut',
    categories: ['Nature', 'Family'],
    image: 'cipanas.png',
    location: 'Tarogong Kaler, Garut',
    mapsQuery: 'Cipanas Garut',
    short: 'Garut’s hot-spring area at the foot of the mountains — made for slow evenings.',
    overview:
      'Cipanas is the hot-spring heart of Garut. Natural warm water from the volcanic highlands feeds pools across the area, making it the classic place to unwind after a day outdoors.',
    whyVisit: 'After a hike or a long day in the city, nothing in Garut feels better than a warm soak with the mountains around you.',
    highlights: ['Natural hot-spring pools', 'Mountain backdrop', 'Relaxed evening atmosphere'],
    activities: ['Hot-spring soaking', 'Relaxation', 'Overnight stays'],
    travelTips: ['Pair it with a Papandayan or Darajat day trip.', 'Bring a change of clothes.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['cipanas.png', 'darajat.png', 'hero.png'],
    nearby: ['mount-papandayan', 'garut-city-square'],
  },
  {
    slug: 'garut-city-square',
    name: 'Garut City Square',
    categories: ['City', 'Culinary', 'Family'],
    image: 'citysquare.png',
    location: 'Garut Kota, Garut',
    mapsQuery: 'Alun-alun Garut',
    short: 'The alun-alun — the everyday heart of the city, best in the early evening.',
    overview:
      'Like every Sundanese town, Garut gathers around its alun-alun. The square is where locals meet, children play and food carts appear as the sun goes down.',
    whyVisit: 'This is where you feel the rhythm of daily life in Garut — and it is the easiest place to start a street-food crawl.',
    highlights: ['Evening atmosphere', 'Street food nearby', 'Local city life'],
    activities: ['City walk', 'Street food', 'People watching'],
    travelTips: ['Come around sunset when the square comes alive.', 'Bring small cash for street snacks.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['citysquare.png', 'streetfood.png', 'basoaci.png'],
    nearby: ['situ-bagendit', 'cipanas-garut'],
  },
  {
    slug: 'candi-cangkuang',
    name: 'Candi Cangkuang',
    categories: ['Heritage', 'Culture'],
    image: 'cangkuang.png',
    location: 'Leles, Garut',
    mapsQuery: 'Candi Cangkuang, Garut',
    short: 'An ancient Hindu temple on a lake island, reached by a short raft crossing.',
    overview:
      'Candi Cangkuang sits on a small island in a lake, reached by a short bamboo raft ride. Beside it lies Kampung Pulo, a traditional settlement with its own long-standing customs.',
    whyVisit: 'The crossing, the temple and the village together make one of the most atmospheric heritage visits in West Java.',
    highlights: ['Raft crossing to the island', 'Historic temple', 'Traditional village of Kampung Pulo'],
    activities: ['Heritage walk', 'Raft crossing', 'Cultural visit'],
    travelTips: ['Dress modestly and respect village customs.', 'A local guide brings the history to life.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['cangkuang.png', 'culture.png', 'bagendit.png'],
    nearby: ['situ-bagendit', 'kampung-sampireun'],
  },
  {
    slug: 'kampung-sampireun',
    name: 'Kampung Sampireun',
    categories: ['Nature', 'Family'],
    image: 'sampireun.png',
    location: 'Samarang, Garut',
    mapsQuery: 'Kampung Sampireun, Garut',
    short: 'Traditional-style cottages set over a clear green lake in the forest.',
    overview:
      'Kampung Sampireun is a lakeside resort built in a traditional Sundanese style, with wooden cottages, boats and forest all around. It is a calm retreat for couples and families.',
    whyVisit: 'For a romantic or restorative overnight, this is the picture-perfect Garut stay.',
    highlights: ['Cottages over the water', 'Misty mornings on the lake', 'Sundanese architecture'],
    activities: ['Boat rides', 'Overnight stay', 'Photography'],
    travelTips: ['Book well in advance on weekends and holidays.', 'Mornings are the most magical.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['sampireun.png', 'bagendit.png', 'community.png'],
    nearby: ['darajat-pass', 'candi-cangkuang'],
  },
  {
    slug: 'darajat-pass',
    name: 'Darajat Pass',
    categories: ['Nature', 'Adventure'],
    image: 'darajat.png',
    location: 'Pasirwangi, Garut',
    mapsQuery: 'Darajat, Pasirwangi, Garut',
    short: 'A highland route of tea gardens, pine forest and geothermal mist.',
    overview:
      'The road up to Darajat climbs through tea plantations and pine forest into the cool highlands, with geothermal steam drifting across the hills.',
    whyVisit: 'It is one of Garut’s most scenic drives — and the highlands feel a world away from the city below.',
    highlights: ['Tea garden views', 'Pine forest', 'Cool highland air'],
    activities: ['Scenic drive', 'Hot-spring stops', 'Photography'],
    travelTips: ['Bring a jacket — it gets cold up here.', 'Roads wind a lot; take it slow.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['darajat.png', 'papandayan.png', 'hiking.png'],
    nearby: ['mount-papandayan', 'kampung-sampireun'],
  },
  {
    slug: 'santolo-beach',
    name: 'Santolo Beach',
    categories: ['Nature', 'Adventure', 'Family'],
    image: 'santolo.png',
    location: 'Cikelet, South Garut',
    mapsQuery: 'Pantai Santolo, Garut',
    short: 'A south-coast beach of golden sand, fishing boats and Indian Ocean waves.',
    overview:
      'On Garut’s southern coast, Santolo is a working fishing beach with golden sand, colourful boats and the open Indian Ocean. The journey there crosses some of the region’s most dramatic countryside.',
    whyVisit: 'Garut is not only mountains — Santolo shows the wild, sunny side of the regency.',
    highlights: ['Colourful fishing boats', 'Golden sand', 'Fresh seafood nearby'],
    activities: ['Beach walks', 'Seafood', 'Sunset watching'],
    travelTips: ['The drive is long — plan an overnight.', 'South-coast waves can be strong; swim with care.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['santolo.png', 'rancabuaya.png', 'streetfood.png'],
    nearby: ['rancabuaya-beach'],
  },
  {
    slug: 'rancabuaya-beach',
    name: 'Rancabuaya Beach',
    categories: ['Nature', 'Adventure'],
    image: 'rancabuaya.png',
    location: 'Caringin, South Garut',
    mapsQuery: 'Pantai Rancabuaya, Garut',
    short: 'Rocky cliffs and crashing waves on the wild southern coastline.',
    overview:
      'Rancabuaya is a rugged stretch of coast where coral rocks and cliffs meet powerful ocean waves. It is a dramatic spot for sunsets and coastal photography.',
    whyVisit: 'For photographers and adventurers, the cliffs at golden hour are unforgettable.',
    highlights: ['Coastal cliffs', 'Dramatic sunsets', 'Rock formations'],
    activities: ['Photography', 'Coastal walks', 'Sunset watching'],
    travelTips: ['Combine with Santolo on a south-coast trip.', 'Stay well back from the rocks at high tide.'],
    facilities: null,
    openingHours: null,
    ticketPrice: null,
    gallery: ['rancabuaya.png', 'santolo.png', 'hiking.png'],
    nearby: ['santolo-beach'],
  },
]

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug)
}
