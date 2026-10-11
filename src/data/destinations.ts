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
  // Rincian Jam Operasional
  openingHoursWeekday?: string | null
  openingHoursWeekend?: string | null
  // Rincian Harga Tiket
  ticketPriceWeekdayLocal?: string | null
  ticketPriceWeekendLocal?: string | null
  ticketPriceWeekdayForeigner?: string | null
  ticketPriceWeekendForeigner?: string | null
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
    highlights: ['Kawah Emas & Hutan Mati', 'Padang Bunga Edelweiss Tegal Alun', 'Panorama Sunrise Lembah Garut'],
    activities: ['Hiking', 'Fotografi', 'Camping', 'Eksplorasi Geotermal'],
    travelTips: [
      'Mulai mendaki dini hari atau pagi hari agar cuaca cerah dan sejuk.',
      'Kenakan sepatu outdoor dengan grip kuat untuk jalur kerikil vulkanik.',
      'Bawa jaket hangat tahan angin karena suhu di puncak bisa mencapai 10-14°C.',
    ],
    facilities: ['Area Parkir 24 Jam', 'Toilet & Kamar Bilas Bersih', 'Mushola', 'Warung Makan & Kopi', 'Pos Pemandu Resmi HPI'],
    openingHours: '07.00 - 18.00 WIB (Buka Setiap Hari)',
    ticketPrice: 'Mulai Rp 30.000 / orang',
    openingHoursWeekday: '07.00 - 17.00 WIB (Senin – Jumat)',
    openingHoursWeekend: '06.00 - 18.00 WIB (Sabtu, Minggu & Hari Libur)',
    ticketPriceWeekdayLocal: 'Rp 30.000 / orang',
    ticketPriceWeekendLocal: 'Rp 35.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 150.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 250.000 / orang',
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
    highlights: ['Wisata Rakit Bambu Legendaris', 'Panorama Danau Berlatar Gunung Guntur', 'Spot Senja & Kuliner Pinggir Danau'],
    activities: ['Naik Rakit', 'Sepeda Air', 'Piknik Keluarga', 'Fotografi Senja'],
    travelTips: [
      'Waktu terbaik berkunjung adalah pukul 15.30 - 17.30 untuk menangkap momen matahari terbenam.',
      'Sewa rakit tradisional beratap untuk pengalaman Sunda yang otentik.',
    ],
    facilities: ['Dermaga Rakit Wisata', 'Plaza Danau & Gazebo', 'Taman Bermain Anak', 'Area Parkir Luas', 'Mushola'],
    openingHours: '08.00 - 17.00 WIB',
    ticketPrice: 'Mulai Rp 10.000 / orang',
    openingHoursWeekday: '08.00 - 17.00 WIB (Senin – Jumat)',
    openingHoursWeekend: '07.30 - 17.30 WIB (Sabtu, Minggu & Libur Nasional)',
    ticketPriceWeekdayLocal: 'Rp 10.000 / orang',
    ticketPriceWeekendLocal: 'Rp 15.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 50.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 75.000 / orang',
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
    highlights: ['Pemandian Air Panas Alami Vulkanik', 'Pemandangan Kaki Gunung Guntur', 'Pusat Penginapan & Relaksasi Keluarga'],
    activities: ['Berendam Air Hangat Alami', 'Relaksasi Tubuh', 'Wisata Kuliner Malam'],
    travelTips: [
      'Sangat cocok dikunjungi sore atau malam hari setelah seharian tour keliling Garut.',
      'Bawa pakaian ganti dan handuk pribadi.',
    ],
    facilities: ['Kolam Rendam Privat & Umum', 'Waterpark Air Hangat Anak', 'Hotel & Penginapan', 'Sentra Kuliner Oleh-oleh'],
    openingHours: '24 Jam (Setiap Hari)',
    ticketPrice: 'Mulai Rp 20.000 / orang',
    openingHoursWeekday: '24 Jam Non-Stop (Senin – Jumat)',
    openingHoursWeekend: '24 Jam Non-Stop (Sabtu, Minggu & Libur)',
    ticketPriceWeekdayLocal: 'Rp 20.000 / orang',
    ticketPriceWeekendLocal: 'Rp 25.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 75.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 100.000 / orang',
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
    highlights: ['Masjid Agung Garut Bersejarah', 'Gedung Babancong Cagar Budaya', 'Pusat Jajanan Street Food Legendaris'],
    activities: ['City Walk Santai', 'Wisata Kuliner Jajanan Pasar', 'Foto Arsitektur Sejarah'],
    travelTips: [
      'Datang saat sore menjelang magrib untuk menikmati suasana syahdu lampu kota.',
      'Bawa uang tunai pecahan kecil untuk mencoba jajanan kaki lima otentik.',
    ],
    facilities: ['Area Terbuka Hijau', 'Masjid Agung', 'Toilet Umum', 'Sentra Kuliner Kaki Lima'],
    openingHours: '24 Jam (Terbuka Umum)',
    ticketPrice: 'Gratis (Rp 0)',
    openingHoursWeekday: 'Buka 24 Jam Bebas Kunjung',
    openingHoursWeekend: 'Buka 24 Jam Bebas Kunjung',
    ticketPriceWeekdayLocal: 'Gratis (Rp 0)',
    ticketPriceWeekendLocal: 'Gratis (Rp 0)',
    ticketPriceWeekdayForeigner: 'Gratis (Rp 0)',
    ticketPriceWeekendForeigner: 'Gratis (Rp 0)',
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
    highlights: ['Candi Hindu Abad ke-8 Satu-satunya di Tanah Sunda', 'Kampung Adat Pulo 6 Rumah & 1 Masjid', 'Menyeberang Danau dengan Rakit Tradisional'],
    activities: ['Wisata Sejarah & Arkeologi', 'Naik Rakit Bambu', 'Edukasi Budaya Kampung Adat'],
    travelTips: [
      'Hormati adat istiadat warga Kampung Pulo yang masih memegang teguh tradisi leluhur.',
      'Gunakan jasa pemandu lokal agar cerita sejarah tatar Garut tersampaikan dengan mendalam.',
    ],
    facilities: ['Museum Situs Cangkuang', 'Rakit Tradisional', 'Toilet', 'Toko Cinderamata & Kerajinan', 'Warung Makan'],
    openingHours: '07.30 - 16.30 WIB',
    ticketPrice: 'Mulai Rp 10.000 / orang',
    openingHoursWeekday: '07.30 - 16.30 WIB (Senin – Jumat)',
    openingHoursWeekend: '07.00 - 17.00 WIB (Sabtu, Minggu & Libur Nasional)',
    ticketPriceWeekdayLocal: 'Rp 10.000 / orang',
    ticketPriceWeekendLocal: 'Rp 12.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 40.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 60.000 / orang',
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
    highlights: ['Cottage di Atas Danau Air Jernih', 'Suasana Tenang Khas Pedesaan Sunda', 'Kano Pribadi Menuju Kamar'],
    activities: ['Dayung Sampan', 'Relaksasi Spa Tradisional', 'Makan Romantis Tepi Danau'],
    travelTips: [
      'Pesan kamar jauh-jauh hari terutama saat akhir pekan atau musim liburan panjang.',
      'Pagi hari sebelum kabut menghilang adalah saat terbaik untuk mengabadikan foto.',
    ],
    facilities: ['Restoran Seruling Bambu', 'Spa & Kolam Renang', 'Kano Wisata', 'Ruang Pertemuan / Gathering'],
    openingHours: '08.00 - 21.00 WIB',
    ticketPrice: 'Mulai Rp 50.000 (Day Visit) / Kamar',
    openingHoursWeekday: '08.00 - 20.00 WIB (Kunjungan Wisata)',
    openingHoursWeekend: '08.00 - 21.00 WIB (Kunjungan Wisata)',
    ticketPriceWeekdayLocal: 'Rp 50.000 / orang (Termasuk Welcome Drink)',
    ticketPriceWeekendLocal: 'Rp 65.000 / orang (Termasuk Welcome Drink)',
    ticketPriceWeekdayForeigner: 'Rp 100.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 125.000 / orang',
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
    highlights: ['Pemandian Air Hangat di Dataran Tinggi Dingin', 'Waterboom Air Hangat Raksasa', 'Hamparan Kebun Teh & Uap Geotermal'],
    activities: ['Berenang Air Panas Pegunungan', 'Flying Fox & Outbound', 'Eksplorasi Kebun Teh'],
    travelTips: [
      'Bawa jaket tebal karena angin pegunungan di Darajat cukup kencang dan dingin.',
      'Jalur menanjak dan berkelok, pastikan kondisi rem kendaraan dalam keadaan prima.',
    ],
    facilities: ['Waterpark Air Panas', 'Restoran & Kafetaria', 'Gazebo Keluarga', 'Penginapan & Villa', 'Area Parkir'],
    openingHours: '24 Jam Non-Stop',
    ticketPrice: 'Mulai Rp 30.000 / orang',
    openingHoursWeekday: '24 Jam (Senin – Jumat)',
    openingHoursWeekend: '24 Jam (Sabtu, Minggu & Hari Libur)',
    ticketPriceWeekdayLocal: 'Rp 30.000 / orang',
    ticketPriceWeekendLocal: 'Rp 35.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 80.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 100.000 / orang',
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
    highlights: ['Pasir Putih Bersih Samudra Hindia', 'Jembatan Gantung & Pulau Santolo', 'Pasar Ikan Laut Segar Langsung Nelayan'],
    activities: ['Bermain Pasir Pantai', 'Naik Perahu Nelayan Keliling Pulau', 'Bakar Ikan Laut Segar'],
    travelTips: [
      'Perjalanan dari kota Garut sekitar 3.5 jam, sangat disarankan mengambil paket 2 Hari 1 Malam.',
      'Perhatikan tanda pasang surut ombak Samudra Hindia.',
    ],
    facilities: ['Penginapan Tepi Pantai', 'Pelelangan & Warung Ikan Bakar', 'Perahu Wisata', 'Area Parkir'],
    openingHours: '24 Jam Setiap Hari',
    ticketPrice: 'Mulai Rp 10.000 / orang',
    openingHoursWeekday: '24 Jam Buka (Senin – Jumat)',
    openingHoursWeekend: '24 Jam Buka (Sabtu, Minggu & Libur)',
    ticketPriceWeekdayLocal: 'Rp 10.000 / orang',
    ticketPriceWeekendLocal: 'Rp 15.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 50.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 75.000 / orang',
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
    highlights: ['Tebing Karang Megah Menghadap Samudra', 'Spot Sunset Paling Dramatis di Jawa Barat', 'Batu Karang Berlumut Alami'],
    activities: ['Hunting Foto Sunset', 'Menikmati Ikan Bakar Khas Pesisir', 'Jelajah Karang Saat Surut'],
    travelTips: [
      'Datang saat sore hari untuk menikmati senja yang memukau.',
      'Kombinasikan kunjungan ke Rancabuaya dan Santolo dalam satu rangkaian tur jalur pesisir selatan.',
    ],
    facilities: ['Gazebo Tepi Tebing', 'Warung Seafood Segar', 'Homestay', 'Area Parkir'],
    openingHours: '24 Jam Setiap Hari',
    ticketPrice: 'Mulai Rp 10.000 / orang',
    openingHoursWeekday: '24 Jam Buka (Senin – Jumat)',
    openingHoursWeekend: '24 Jam Buka (Sabtu, Minggu & Libur)',
    ticketPriceWeekdayLocal: 'Rp 10.000 / orang',
    ticketPriceWeekendLocal: 'Rp 15.000 / orang',
    ticketPriceWeekdayForeigner: 'Rp 50.000 / orang',
    ticketPriceWeekendForeigner: 'Rp 75.000 / orang',
    gallery: ['rancabuaya.png', 'santolo.png', 'hiking.png'],
    nearby: ['santolo-beach'],
  },
]

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug)
}
