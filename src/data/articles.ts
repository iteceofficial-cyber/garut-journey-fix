/** Travel guide articles. Each renders a card on the home page and a page at /guide/$slug. */
export interface Article {
  slug: string
  title: string
  category: string
  image: string
  date: string // ISO date
  readingTime: string
  excerpt: string
  body: { heading: string; text: string }[]
  related: string[] // destination slugs
}

export const articles: Article[] = [
  {
    slug: 'panduan-website-garut-journey',
    title: 'Panduan Menggunakan Website Garut Journey: Rencanakan Liburan Impian Secara Online',
    category: 'Web Guide',
    image: 'citysquare.png',
    date: '2026-10-02',
    readingTime: '5 min read',
    excerpt: 'Maksimalkan fitur website Garut Journey mulai dari kurasi destinasi, simulasi itinerary interaktif, pemesanan tour langsung, hingga konsultasi WhatsApp tim lokal.',
    body: [
      {
        heading: 'Kemudahan Eksplorasi Destinasi & Kategori Pilihan',
        text: 'Melalui portal Garut Journey, Anda dapat menemukan rekomendasi wisata terlengkap di Garut yang dikelompokkan rapi berdasarkan kategori: Pegunungan & Kawah, Pemandian Air Panas, Danau & Budaya, serta Wisata Bahari Selatan. Fitur pencarian cepat di halaman utama memudahkan Anda menemukan destinasi yang tepat dalam hitungan detik.',
      },
      {
        heading: 'Rancang Jadwal dengan Interactive Itinerary Builder',
        text: 'Tak perlu bingung menyusun jadwal hari demi hari. Gunakan fitur Itinerary Builder interaktif untuk memilih durasi trip (1 hari, 2 hari 1 malam, atau 3 hari 2 malam), memilih preferensi wisata (alam petualangan, santai bersama keluarga, atau wisata kuliner), dan melihat estimasi rute perjalanan paling efisien.',
      },
      {
        heading: 'Konsultasi Cepat & Reservasi via WhatsApp Resmi',
        text: 'Ingin paket custom atau penyesuaian untuk rombongan keluarga dan gathering kantor? Klik tombol WhatsApp admin di pojok layar (0851-5645-6791) untuk langsung terhubung dengan pemandu lokal berlisensi yang siap memberikan penawaran terbaik.',
      },
      {
        heading: 'Dashboard CMS Admin untuk Update Informasi Real-Time',
        text: 'Website Garut Journey kini dilengkapi dengan Admin Dashboard terintegrasi sehingga artikel panduan wisata, tips perjalanan terbaru, dan informasi spot kuliner selalu diperbarui secara berkala oleh tim pengelola.',
      },
    ],
    related: ['garut-city-square', 'mount-papandayan', 'situ-bagendit'],
  },
  {
    slug: 'menelusuri-keindahan-alam-garut',
    title: 'Menelusuri Pesona Alam Garut: Dari Kawah Papandayan hingga Pantai Santolo',
    category: 'Destinations',
    image: 'papandayan.png',
    date: '2026-09-29',
    readingTime: '7 min read',
    excerpt: 'Nikmati kontras lanskap Garut yang luar biasa, mulai dari kawah vulkanik berkabut sejuk di utara hingga bentangan samudra lepas berpasir putih di selatan.',
    body: [
      {
        heading: 'Kemegahan Kawah Aktif Papandayan',
        text: 'Gunung Papandayan merupakan salah satu gunung api paling ramah bagi pendaki pemula. Jalur trekking tertata rapi membawa Anda melewati kawah bergolak, Hutan Mati yang eksotis nan magis, hingga hamparan padang bunga edelweiss abadi di Tegal Alun.',
      },
      {
        heading: 'Relaksasi di Sumber Air Panas Alami Darajat & Cipanas',
        text: 'Setelah trekking di dataran tinggi, hangatkan tubuh di pemandian air panas alami Darajat Pass dan Cipanas Garut. Air kaya mineral alami bersumber langsung dari Gunung Guntur membuat tubuh kembali bugar.',
      },
      {
        heading: 'Pesona Liar Pantai Santolo & Rancabuaya',
        text: 'Meluncur ke Garut Selatan sejauh 3 jam perjalanan, Anda akan disuguhi bentang Samudra Hindia yang memukau. Nikmati matahari terbenam di atas tebing karang Pantai Santolo dan kelezatan hidangan ikan bakar segar langsung dari kapal nelayan.',
      },
    ],
    related: ['mount-papandayan', 'darajat-pass', 'santolo-beach'],
  },
  {
    slug: 'surga-kuliner-otentik-garut',
    title: 'Surga Kuliner Otentik Garut: Dari Baso Aci, Burayot, hingga Nasi Liwet Sunda',
    category: 'Culinary',
    image: 'sundanese.png',
    date: '2026-09-25',
    readingTime: '6 min read',
    excerpt: 'Jelajahi kelezatan kuliner khas Garut yang memanjakan lidah, mulai dari hidangan kuah gurih pedas rempah hingga kudapan manis tradisional warisan leluhur.',
    body: [
      {
        heading: 'Legenda Gurih Kenyal: Baso Aci & Cuanki',
        text: 'Siapa yang tak kenal baso aci khas Garut? Bulatan tapioka kenyal berpadu kuah kaldu rempah gurih, perasan jeruk limau, pilus cikur renyah, dan taburan cabai bubuk menghadirkan kehangatan yang pas di udara dingin Garut.',
      },
      {
        heading: 'Kudapan Manis Tradisional: Burayot & Dodol Garut',
        text: 'Burayot yang terbuat dari tepung beras dan gula aren menghasilkan tekstur renyah di luar dan lembut lumer di dalam. Bersanding dengan dodol Garut legendaris dan inovasi modern Chocodot (cokelat isi dodol), Anda membawa pulang oleh-oleh terbaik.',
      },
      {
        heading: 'Pesta Nasi Liwet di Tepi Danau Sampireun',
        text: 'Menyantap nasi liwet kastrol wangi daun salam dan serai, didampingi ayam goreng kampung, ikan asin peda, tahu tempe goreng, lalapan segar, dan sambal terasi dadak adalah ritual wajib saat berkunjung ke Garut.',
      },
    ],
    related: ['kampung-sampireun', 'garut-city-square'],
  },
  {
    slug: 'perfect-1-day-garut-itinerary',
    title: 'The Perfect 1-Day Garut Itinerary',
    category: 'Itineraries',
    image: 'citysquare.png',
    date: '2026-09-18',
    readingTime: '6 min read',
    excerpt: 'Heritage in the morning, Sundanese lunch at noon, souvenirs by sunset — how to make one day in Garut count.',
    body: [
      { heading: 'Start early', text: 'Garut is at its most beautiful in the cool morning hours. Begin with a city loop before the day warms up, then head out to a heritage site while the light is still soft.' },
      { heading: 'Make lunch the main event', text: 'A long Sundanese lunch — rice, sambal, fresh lalapan and grilled sides — is as much a part of the trip as any destination. Do not rush it.' },
      { heading: 'Finish with something sweet', text: 'Save the late afternoon for souvenirs. Dodol and chocodot are the classics, and Garut’s leather craft makes a lasting keepsake.' },
    ],
    related: ['garut-city-square', 'candi-cangkuang', 'situ-bagendit'],
  },
  {
    slug: '10-places-to-visit-in-garut',
    title: '10 Places You Should Visit in Garut',
    category: 'Destinations',
    image: 'papandayan.png',
    date: '2026-09-04',
    readingTime: '8 min read',
    excerpt: 'Volcanoes, lakes, temples and wild beaches: a starting list for anyone discovering Garut for the first time.',
    body: [
      { heading: 'Mountains and highlands', text: 'Papandayan and the Darajat highlands show Garut’s volcanic side — cool air, tea gardens and steaming craters.' },
      { heading: 'Lakes and heritage', text: 'Situ Bagendit and the island temple of Candi Cangkuang are calm, easy and full of stories.' },
      { heading: 'The south coast', text: 'Santolo and Rancabuaya reward the long drive south with open ocean, fishing boats and cliffs at sunset.' },
    ],
    related: ['mount-papandayan', 'candi-cangkuang', 'santolo-beach'],
  },
  {
    slug: 'local-food-to-try-in-garut',
    title: 'Local Food You Must Try in Garut',
    category: 'Culinary',
    image: 'streetfood.png',
    date: '2026-08-22',
    readingTime: '5 min read',
    excerpt: 'Dodol, burayot, baso aci and a proper Sundanese spread — the flavours that define Garut.',
    body: [
      { heading: 'The sweets', text: 'Dodol is Garut’s signature, and chocodot is its modern cousin. Burayot is a traditional palm-sugar snack worth seeking out.' },
      { heading: 'The savoury', text: 'Baso aci is a local comfort food: chewy tapioca balls in a spicy broth. Sundanese meals bring fresh vegetables and sambal to every table.' },
      { heading: 'Eat in the evening', text: 'The streets around the city centre come alive after dark with grills and food carts.' },
    ],
    related: ['garut-city-square'],
  },
  {
    slug: 'travel-tips-for-visiting-garut',
    title: 'Travel Tips for Visiting Garut',
    category: 'Tips',
    image: 'darajat.png',
    date: '2026-08-08',
    readingTime: '4 min read',
    excerpt: 'What to pack, how to pace your days and the small things that make a Garut trip smoother.',
    body: [
      { heading: 'Pack a warm layer', text: 'The highlands get properly cold, especially in the early morning. A light jacket goes a long way.' },
      { heading: 'Plan around distance', text: 'Garut Regency is large. Mountain and city sights pair well in a day; the south coast deserves its own overnight.' },
      { heading: 'Travel with a local', text: 'A local guide knows the roads, the stories and the best places to eat — and makes everything easier.' },
    ],
    related: ['darajat-pass', 'mount-papandayan'],
  },
  {
    slug: 'best-garut-destinations-for-families',
    title: 'Best Garut Destinations for Families',
    category: 'Family',
    image: 'bagendit.png',
    date: '2026-07-25',
    readingTime: '5 min read',
    excerpt: 'Gentle lakes, warm springs and easy days out that work for every age.',
    body: [
      { heading: 'Lakes first', text: 'Situ Bagendit offers raft rides and open space — a relaxed start for younger travellers.' },
      { heading: 'Warm water', text: 'Cipanas hot springs are a family favourite for ending the day.' },
      { heading: 'Keep it slow', text: 'Fewer stops, longer meals. Families tend to enjoy Garut most at a gentle pace.' },
    ],
    related: ['situ-bagendit', 'cipanas-garut', 'kampung-sampireun'],
  },
  {
    slug: 'explore-garut-like-a-local',
    title: 'A Guide to Exploring Garut Like a Local',
    category: 'Culture',
    image: 'community.png',
    date: '2026-07-10',
    readingTime: '7 min read',
    excerpt: 'Step off the typical route: villages, craft workshops, morning markets and the people who make Garut home.',
    body: [
      { heading: 'Say hello', text: 'A few words of Sundanese or Indonesian open doors. People in Garut are warm and proud of their town.' },
      { heading: 'Visit the makers', text: 'Garut is known for its leather craft. Seeing artisans at work adds depth to any souvenir.' },
      { heading: 'Go where life happens', text: 'Morning markets, the alun-alun at dusk and village paths show the real rhythm of Garut.' },
    ],
    related: ['garut-city-square', 'candi-cangkuang'],
  },
]

export function getArticle(slug: string): Article | undefined {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('garut_journey_articles_v2')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const found = parsed.find((a: Article) => a.slug === slug)
          if (found) return found
        }
      }
    } catch {
      // fallback
    }
  }
  return articles.find((a) => a.slug === slug)
}

export function formatDate(iso: string) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
