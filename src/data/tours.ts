/**
 * City tours and packages. Prices are intentionally placeholders
 * ("Rp XXX") until real pricing is confirmed.
 */
export interface ItineraryStop {
  time: string
  title: string
}

export interface TourPriceTier {
  minPax: number
  maxPax: number
  pricePerPax: number
  label: string
  note?: string
}

export function generateDefaultPriceTiers(basePerPax10: number): TourPriceTier[] {
  // Graduated tiered pricing per person from 1 person up to 100 people
  const solo = Math.round((basePerPax10 * 2.1) / 10000) * 10000
  const pair = Math.round((basePerPax10 * 1.5) / 10000) * 10000
  const small = Math.round((basePerPax10 * 1.2) / 10000) * 10000
  const medium = Math.round((basePerPax10 * 1.0) / 10000) * 10000
  const elf = Math.round((basePerPax10 * 0.88) / 10000) * 10000
  const mediumBus = Math.round((basePerPax10 * 0.78) / 10000) * 10000
  const bigBus = Math.round((basePerPax10 * 0.68) / 10000) * 10000
  const gathering = Math.round((basePerPax10 * 0.60) / 10000) * 10000

  return [
    { minPax: 1, maxPax: 1, pricePerPax: solo, label: '1 Orang (Solo Private)', note: 'Kendaraan pribadi + guide khusus 1-on-1' },
    { minPax: 2, maxPax: 2, pricePerPax: pair, label: '2 Orang (Duo / Pasangan)', note: 'Mobil city car / Avanza nyaman ber-AC' },
    { minPax: 3, maxPax: 5, pricePerPax: small, label: '3 – 5 Orang (Keluarga Inti)', note: 'Avanza / Innova Reborn + bagasi luas' },
    { minPax: 6, maxPax: 10, pricePerPax: medium, label: '6 – 10 Orang (Grup Kecil)', note: 'Toyota HiAce Premio / Commuter luxury' },
    { minPax: 11, maxPax: 20, pricePerPax: elf, label: '11 – 20 Orang (Grup Medium)', note: 'Isuzu Elf Long / Coaster eksekutif' },
    { minPax: 21, maxPax: 30, pricePerPax: mediumBus, label: '21 – 30 Orang (Rombongan Medium)', note: 'Medium Bus Pariwisata 31 seats' },
    { minPax: 31, maxPax: 50, pricePerPax: bigBus, label: '31 – 50 Orang (1 Big Bus Pariwisata)', note: 'Big Bus Pariwisata SHD 45–50 seats' },
    { minPax: 51, maxPax: 100, pricePerPax: gathering, label: '51 – 100 Orang (Gathering Akbar / 2 Bus)', note: 'Konvoi 2 Big Bus + sound system & banner' },
  ]
}

export function calculatePriceForPax(tiers: TourPriceTier[] | undefined, pax: number, defaultPrice: number): {
  pricePerPax: number
  totalPrice: number
  tier: TourPriceTier | null
} {
  const safePax = Math.max(1, Math.min(100, pax))
  if (!tiers || tiers.length === 0) {
    return {
      pricePerPax: defaultPrice,
      totalPrice: defaultPrice * safePax,
      tier: null,
    }
  }

  const matched = tiers.find((t) => safePax >= t.minPax && safePax <= t.maxPax)
  if (matched) {
    return {
      pricePerPax: matched.pricePerPax,
      totalPrice: matched.pricePerPax * safePax,
      tier: matched,
    }
  }

  // If over 100 or higher than max tier
  const lastTier = tiers[tiers.length - 1]
  const price = lastTier ? lastTier.pricePerPax : defaultPrice
  return {
    pricePerPax: price,
    totalPrice: price * safePax,
    tier: lastTier || null,
  }
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
  facilities?: string[]
  excluded?: string[]
  priceTiers?: TourPriceTier[]
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
    facilities: [
      'Transportasi AC Pariwisata Nyaman + Driver + BBM',
      'Pemandu Lokal Berlisensi HPI Garut',
      'Tiket Masuk Semua Objek Wisata Kota & Candi',
      'Makan Siang Khas Sunda Nasi Liwet',
      'Air Mineral 600ml & Snack Lokal',
      'Sewa Rakit Tradisional Situ Cangkuang',
      'Asuransi Perjalanan Resmi',
    ],
    excluded: [
      'Pengeluaran pribadi peserta (belanja oleh-oleh)',
      'Tips sukarela guide / driver',
    ],
    priceTiers: generateDefaultPriceTiers(350000),
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
    facilities: [
      'Akomodasi Hotel Bintang 3 / Resort 1 Malam',
      'Transportasi AC Pariwisata 2 Hari',
      'Pemandu Lokal Berlisensi HPI Garut',
      'Tiket Masuk Semua Destinasi & Kolam Air Panas',
      'Makan 4x (Breakfast, 2x Lunch, Dinner)',
      'Dokumentasi Foto Selama Tour',
      'Air Mineral & Snack Perjalanan',
      'Asuransi Perjalanan Resmi',
    ],
    excluded: [
      'Pengeluaran pribadi & belanja oleh-oleh',
      'Laundry / room service hotel',
      'Tips sukarela driver & guide',
    ],
    priceTiers: generateDefaultPriceTiers(850000),
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
    facilities: [
      'Tenda Dome Waterproof + Matras + Sleeping Bag',
      'Pemandu Gunung Berlisensi APGI / HPI',
      'Porter Tim Logistik & Tenda',
      'Makan 3x di Camp + Free Kopi/Teh Hangat',
      'Tiket Simaksi Pendakian & Izin Camping',
      'Relaksasi Kolam Air Panas Setelah Turun',
      'Dokumentasi Foto di Hutan Mati & Kawah',
      'Perlengkapan P3K Gunung Standar',
    ],
    excluded: [
      'Carrier & perlengkapan pakaian pribadi',
      'Porter pribadi untuk ransel pribadi peserta',
      'Tips sukarela guide & porter',
    ],
    priceTiers: generateDefaultPriceTiers(480000),
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
    facilities: [
      'Tenda Dome Dome + Matras Busa Tebal + Sleeping Bag',
      'Guide Gunung Senior Berlisensi Resmi',
      'Porter Kelompok Angkut Tenda & Alat Masak',
      'Makan 3x Menu Segar Camp + Wedang Jahe',
      'Tiket Masuk Kawasan Konservasi & Camping',
      'Tiket Masuk Pemandian Air Panas Alami Cipanas',
      'Dokumentasi Sunrise & Lanskap',
    ],
    excluded: [
      'Perlengkapan pakaian pribadi pendaki',
      'Pengeluaran belanja pribadi',
      'Tips sukarela guide',
    ],
    priceTiers: generateDefaultPriceTiers(520000),
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
  facilities?: string[]
  excluded?: string[]
  groupSize: string
  price: string
  featured?: boolean
  priceTiers?: TourPriceTier[]
}

export const packages: TourPackage[] = [
  {
    id: 'explorer',
    name: 'Explorer — Garut 1 Day',
    tagline: 'Essential Garut, perfectly paced — heritage, kuliner, dan pesona alam.',
    duration: '1 Day',
    durationDays: 1,
    styles: ['City', 'Culinary', 'Culture'],
    destinations: ['Garut City Square', 'Candi Cangkuang', 'Situ Bagendit', 'Pusat Oleh-oleh Dodol & Sukaregang'],
    activities: ['City sightseeing', 'Heritage visit rakit Situ Cangkuang', 'Local lunch khas Sunda', 'Souvenir leather stop'],
    included: [
      'Transportasi AC Pariwisata nyaman & BBM',
      'Driver ramah & profesional',
      'Pemandu lokal berlisensi HPI Garut',
      'Tiket masuk seluruh objek wisata & sewa rakit bambu',
      'Makan siang kuliner khas Sunda nasi liwet komplit',
      'Air mineral 600ml & snack lokal khas Garut',
      'P3K standar pariwisata & asuransi trip resmi',
    ],
    facilities: [
      'Transportasi AC + Driver + BBM',
      'Tiket Masuk Semua Objek Wisata',
      'Sewa Rakit Bambu Situ Cangkuang',
      'Makan Siang Nasi Liwet Gurih Komplit',
      'Pemandu Lokal Berlisensi HPI',
      'Air Mineral & Welcome Snack',
      'Dokumentasi Foto Selama Trip',
      'Asuransi Perjalanan Resmi',
    ],
    excluded: [
      'Pengeluaran pribadi & belanja oleh-oleh oleh peserta',
      'Wahana permainan berbayar opsional di Situ Bagendit',
      'Tips sukarela untuk guide / driver (tidak wajib)',
    ],
    groupSize: '1 s/d 100 peserta (disesuaikan jenis armada)',
    price: 'Mulai dari Rp 350.000 / orang',
    priceTiers: generateDefaultPriceTiers(350000),
  },
  {
    id: 'garut-discovery',
    name: 'Garut Discovery — 2D1N',
    tagline: 'Our most-loved way to see Garut — kawah vulkanik, air panas, & danau legendaris.',
    duration: '2 Days 1 Night',
    durationDays: 2,
    styles: ['Nature', 'Culinary', 'Culture', 'Family'],
    destinations: ['Candi Cangkuang', 'Cipanas Garut', 'Mount Papandayan', 'Garut City Square'],
    activities: ['Heritage visit', 'Hot springs soak relaksasi', 'Sunrise crater walk', 'Culinary tour dodol & liwet'],
    included: [
      'Transportasi AC Pariwisata selama 2 hari',
      'Akomodasi Hotel Bintang 3 / Resort terpilih 1 malam (twin share)',
      'Makan 4x (2x Makan Siang, 1x Makan Malam, 1x Sarapan)',
      'Tiket masuk Kawah Papandayan, Kolam Air Panas & Candi Cangkuang',
      'Pemandu wisata bersertifikasi HPI pendamping 2 hari',
      'Dokumentasi foto perjalanan berkualitas tinggi',
      'Air mineral bebas isi ulang & snack khas Priangan',
      'Asuransi perjalanan pariwisata resmi',
    ],
    facilities: [
      'Hotel / Resort Nyaman 1 Malam',
      'Transportasi AC Pariwisata 2 Hari Penuh',
      'Tiket Masuk Kawah Papandayan & Cipanas',
      'Makan 4x Termasuk Restoran Khas Sunda',
      'Tiket Masuk Candi & Rakit Tradisional',
      'Guide Resmi HPI & Standby Crew',
      'Dokumentasi Foto / Kamera DSLR',
      'Banner Rombongan (Khusus Group > 15 Pax)',
      'Asuransi Perjalanan Resmi',
    ],
    excluded: [
      'Pengeluaran belanja pribadi di luar program',
      'Laundry & minibar hotel',
      'Tips sukarela guide / driver',
    ],
    groupSize: '1 s/d 100 peserta (private atau rombongan)',
    price: 'Mulai dari Rp 780.000 / orang',
    featured: true,
    priceTiers: generateDefaultPriceTiers(780000),
  },
  {
    id: 'trekking-camping-adventure',
    name: 'Trekking & Camping Papandayan — 2D1N',
    tagline: 'Petualangan mendaki kawah aktif, Hutan Mati & bermalam di tenda Pondok Saladah.',
    duration: '2 Days 1 Night',
    durationDays: 2,
    styles: ['Trekking & Camping', 'Adventure', 'Nature'],
    destinations: ['Mount Papandayan', 'Pondok Saladah Camp', 'Hutan Mati', 'Tegal Alun Padang Edelweiss', 'Darajat Hot Springs'],
    activities: ['Guided volcano trekking', 'Overnight tent camping di bawah bintang', 'Campfire & warm mountain dinner', 'Sunrise view & hot-spring soak'],
    included: [
      'Pemandu gunung berlisensi resmi APGI / HPI & porter tim',
      'Tenda dome kapasitas 3-4 (isi 2-3 orang) + matras tebal + sleeping bag steril',
      'Lampu tenda + peralatan masak camping lengkap',
      'Makan 3x di area camp + teh, kopi & jahe hangat tanpa batas',
      'Tiket simaksi pendakian resmi Papandayan & izin camping',
      'Tiket relaksasi kolam air panas alami setelah turun gunung',
      'Perlengkapan P3K gunung & evakuasi darurat',
    ],
    facilities: [
      'Tenda Dome Waterproof + Matras + Sleeping Bag Bersih',
      'Porter Tim untuk Membawa Tenda & Logistik Camp',
      'Makan 3x Menu Hangat Gunung + Barbeque / Api Unggun',
      'Free Flow Kopi, Teh & Wedang Jahe Hangat',
      'Pemandu Gunung Berlisensi Khusus Vulkanologi',
      'Tiket Simaksi Pendakian & Retribusi Camping Resmi',
      'Relaksasi Kolam Air Panas Belerang Alami',
      'Dokumentasi Foto Pendakian & Hutan Mati',
    ],
    excluded: [
      'Carrier / tas pribadi peserta (porter pribadi opsional)',
      'Pakaian hangat pribadi (jaket gunung, sarung tangan)',
      'Tips sukarela pemandu & porter',
    ],
    groupSize: '1 s/d 100 peserta (disediakan porter proporsional)',
    price: 'Mulai dari Rp 480.000 / orang',
    priceTiers: generateDefaultPriceTiers(480000),
  },
  {
    id: 'premium-experience',
    name: 'Premium Garut Experience — 3D2N',
    tagline: 'Private, unhurried, luxury highland stays and tailored exploration.',
    duration: '3 Days 2 Nights',
    durationDays: 3,
    styles: ['Nature', 'Adventure', 'Romantic', 'Culture'],
    destinations: ['Kampung Sampireun', 'Darajat Pass', 'Mount Papandayan', 'Santolo Beach & Pantai Karang Paranje'],
    activities: ['Private guide', 'Highland scenic drive', 'Lakeside bungalow stay', 'South-coast golden sunset', 'Private BBQ dinner'],
    included: [
      'Kendaraan VIP (Innova Zenix / HiAce Luxury Premio) + Driver & BBM',
      'Resort Premium Kampung Sampireun / Kamojang Resort 2 Malam',
      'Makan Lengkap 7x (Breakfast resort, lunch & gourmet dinner)',
      'Tiket VIP seluruh destinasi wisata tanpa antre',
      'Private Senior Tour Leader & Guide HPI bilingual',
      'Dokumentasi Fotografer Profesional + Video Cinematic / Drone',
      'Welcome pack souvenir tenun Garut & dodol premium',
      'Asuransi perjalanan komprehensif',
    ],
    facilities: [
      'Akomodasi Resort Mewah Tepi Danau / Villa Air Panas (2 Malam)',
      'Armada Kendaraan Luxury VIP Ber-AC Full Trip',
      'Seluruh Tiket Wisata Jalur Prioritas VIP',
      'Makan 7x Sajian Restoran Terbaik & Private BBQ',
      'Fotografer & Drone Videografer Berpengalaman',
      'Senior Tour Leader Standby 24 Jam',
      'Bingkisan Eksklusif Oleh-oleh Khas Garut Pilihan',
      'Asuransi Perjalanan Komprehensif',
    ],
    excluded: [
      'Tiket perjalanan dari kota asal ke Garut (pesawat/kereta)',
      'Pengeluaran pribadi & belanja tambahan di luar paket',
      'Tipping opsional untuk tim pemandu',
    ],
    groupSize: '1 s/d 100 peserta (disesuaikan format rombongan VIP)',
    price: 'Mulai dari Rp 1.450.000 / orang',
    priceTiers: generateDefaultPriceTiers(1450000),
  },
]

export const tourOptions = [...cityTours.map((t) => t.name), ...packages.map((p) => p.name), 'Custom itinerary']
