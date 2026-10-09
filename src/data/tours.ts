/**
 * City tours and packages. Prices are intentionally placeholders
 * ("Rp XXX") until real pricing is confirmed.
 */
export interface ItineraryStop {
  time: string
  title: string
}

export interface CityTour {
  id: string
  name: string
  duration: string
  image: string
  summary: string
  focus: string[]
  price: string
  category?: 'city' | 'trekking-camping'
  itinerary: ItineraryStop[]
}

export const cityTours: CityTour[] = [
  {
    id: 'one-day-city-tour',
    name: 'Garut One-Day City Tour',
    duration: '1 Day',
    image: 'citysquare.png',
    summary: 'The best of Garut in a single, well-paced day — city sights, heritage, local lunch and souvenirs.',
    focus: ['City', 'Heritage', 'Culinary', 'Souvenirs'],
    price: 'Mulai dari Rp 350.000 / orang',
    category: 'city',
    itinerary: [
      { time: '08:00', title: 'Meeting point' },
      { time: '09:00', title: 'City sightseeing' },
      { time: '10:30', title: 'Cultural or heritage destination' },
      { time: '12:00', title: 'Local lunch experience' },
      { time: '14:00', title: 'Tourist attraction' },
      { time: '16:00', title: 'Local shopping & souvenirs' },
      { time: '17:00', title: 'Return to meeting point' },
    ],
  },
  {
    id: 'garut-experience-2d1n',
    name: 'Garut Experience — 2 Days 1 Night',
    duration: '2 Days 1 Night',
    image: 'sampireun.png',
    summary: 'Slow down and go deeper: highland nature, Sundanese food, culture, local life and a sunrise to remember.',
    focus: ['Nature', 'Culinary', 'Culture', 'Local experiences', 'Souvenirs', 'Sunrise & sunset'],
    price: 'Mulai dari Rp 850.000 / orang',
    category: 'city',
    itinerary: [
      { time: 'Day 1 · Morning', title: 'Arrival & heritage visit' },
      { time: 'Day 1 · Afternoon', title: 'Sundanese lunch & local craft village' },
      { time: 'Day 1 · Evening', title: 'Hot springs & dinner' },
      { time: 'Day 2 · Dawn', title: 'Highland sunrise' },
      { time: 'Day 2 · Morning', title: 'Nature walk & breakfast' },
      { time: 'Day 2 · Afternoon', title: 'Souvenir shopping & return' },
    ],
  },
  {
    id: 'papandayan-trekking-camping',
    name: 'Wisata Trekking & Camping — Gunung Papandayan',
    duration: '2 Days 1 Night · Trekking & Camp',
    image: 'hiking.png',
    summary: 'Petualangan trekking menembus kawah vulkanik aktif, Hutan Mati yang ikonik, dan berkemah malam di Pondok Saladah lengkap dengan peralatan tenda & api unggun.',
    focus: ['Trekking', 'Camping', 'Sunrise', 'Hutan Mati', 'Padang Edelweiss'],
    price: 'Mulai dari Rp 480.000 / orang',
    category: 'trekking-camping',
    itinerary: [
      { time: 'Hari 1 · 08:00', title: 'Titik kumpul di Stasiun Garut & perjalanan menuju Basecamp Camp David Papandayan' },
      { time: 'Hari 1 · 10:00', title: 'Mulai trekking santai melewati Kawah Belerang & Kawah Baru' },
      { time: 'Hari 1 · 13:00', title: 'Tiba di area Camping Ground Pondok Saladah, makan siang & pendirian tenda' },
      { time: 'Hari 1 · 16:30', title: 'Eksplorasi sore di Hutan Mati & menikmati senja pegunungan' },
      { time: 'Hari 1 · 19:30', title: 'Makan malam hangat di camp, api unggun & minuman tradisional' },
      { time: 'Hari 2 · 05:00', title: 'Sunrise trekking di Tebing Gober Hoet & Padang Edelweiss Tegal Alun' },
      { time: 'Hari 2 · 09:00', title: 'Sarapan di tenda, turun ke basecamp & relaksasi kolam air hangat alami' },
      { time: 'Hari 2 · 15:00', title: 'Belanja oleh-oleh khas Garut & pengantaran kembali ke titik kumpul' },
    ],
  },
  {
    id: 'guntur-cikuray-trekking-camp',
    name: 'Sunrise Trekking & Highland Camping — Gunung Guntur / Talaga Bodas',
    duration: '2 Days 1 Night · Adventure Camp',
    image: 'papandayan.png',
    summary: 'Rasakan sensasi berkemah di atas awan dengan panorama sabana Gunung Guntur atau ketenangan tepi kawah hijau toska Talaga Bodas.',
    focus: ['Trekking', 'Sabana Camping', 'Golden Sunrise', 'Hot Springs'],
    price: 'Mulai dari Rp 520.000 / orang',
    category: 'trekking-camping',
    itinerary: [
      { time: 'Hari 1 · 09:00', title: 'Penjemputan peserta & briefing perlengkapan trekking dan camping' },
      { time: 'Hari 1 · 13:00', title: 'Trekking menuju Pos 3 / Area Camp Sabana dengan pemandu gunung resmi' },
      { time: 'Hari 1 · 17:00', title: 'Menikmati golden sunset di atas lanskap kota Garut & mendirikan camp' },
      { time: 'Hari 1 · 19:30', title: 'Makan malam hangat & malam keakraban di bawah bintang' },
      { time: 'Hari 2 · 04:30', title: 'Summit attack mengejar matahari terbit di puncak' },
      { time: 'Hari 2 · 10:00', title: 'Turun gunung & berendam air panas belerang di Cipanas Garut' },
    ],
  },
]

export type PackageTier = string

export interface TourPackage {
  id: string
  name: string
  tagline: string
  duration: string
  durationDays: 1 | 2 | 3
  styles: string[]
  destinations: string[]
  activities: string[]
  included: string[]
  groupSize: string
  price: string
  featured?: boolean
}

export const packages: TourPackage[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    tagline: 'Essential Garut, perfectly paced.',
    duration: '1 Day',
    durationDays: 1,
    styles: ['City', 'Culinary', 'Culture'],
    destinations: ['Garut City Square', 'Candi Cangkuang', 'Situ Bagendit'],
    activities: ['City sightseeing', 'Heritage visit', 'Local lunch', 'Souvenir stop'],
    included: ['Local guide', 'Transport during tour', 'Details coming soon'],
    groupSize: 'Group size to be confirmed',
    price: 'Starting from Rp XXX / person',
  },
  {
    id: 'garut-discovery',
    name: 'Garut Discovery',
    tagline: 'Our most-loved way to see Garut.',
    duration: '2 Days 1 Night',
    durationDays: 2,
    styles: ['Nature', 'Culinary', 'Culture', 'Family'],
    destinations: ['Candi Cangkuang', 'Cipanas Garut', 'Mount Papandayan', 'Garut City Square'],
    activities: ['Heritage visit', 'Hot springs', 'Sunrise hike', 'Culinary tour'],
    included: ['Local guide', 'Transport during tour', 'Accommodation (details coming soon)'],
    groupSize: 'Group size to be confirmed',
    price: 'Starting from Rp XXX / person',
    featured: true,
  },
  {
    id: 'trekking-camping-adventure',
    name: 'Trekking & Camping',
    tagline: 'Petualangan mendaki gunung & berkemah di alam terbuka Garut.',
    duration: '2 Days 1 Night',
    durationDays: 2,
    styles: ['Trekking & Camping', 'Adventure', 'Nature'],
    destinations: ['Mount Papandayan', 'Pondok Saladah Camp', 'Hutan Mati', 'Darajat / Cipanas Hot Springs'],
    activities: ['Guided volcano trekking', 'Overnight tent camping', 'Campfire & warm mountain dinner', 'Sunrise view & hot-spring soak'],
    included: ['Pemandu gunung berlisensi & porter grup', 'Tenda dome, matras & sleeping bag bersih', 'Makan 3x + kopi/teh hangat di camp', 'Tiket masuk & izin berkemah resmi'],
    groupSize: '2–12 peserta (private atau small group)',
    price: 'Mulai dari Rp 480.000 / orang',
  },
  {
    id: 'premium-experience',
    name: 'Premium Experience',
    tagline: 'Private, unhurried and tailored to you.',
    duration: '3 Days 2 Nights',
    durationDays: 3,
    styles: ['Nature', 'Adventure', 'Romantic', 'Culture'],
    destinations: ['Kampung Sampireun', 'Darajat Pass', 'Mount Papandayan', 'Santolo Beach'],
    activities: ['Private guide', 'Highland drive', 'Lakeside stay', 'South-coast sunset'],
    included: ['Private guide', 'Private transport', 'Premium stays (details coming soon)'],
    groupSize: 'Private group — size to be confirmed',
    price: 'Starting from Rp XXX / person',
  },
]

export const tourOptions = [...cityTours.map((t) => t.name), ...packages.map((p) => p.name), 'Custom itinerary']
