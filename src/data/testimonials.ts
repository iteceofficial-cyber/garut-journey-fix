/**
 * PLACEHOLDER testimonials. These are sample entries for layout only and are
 * labelled as such on the site. Replace with real, permissioned reviews.
 */
export interface Testimonial {
  id?: string
  name: string
  from: string
  rating: number
  review: string
  initials: string
  tone: string
  tourName?: string
  date?: string
}

export const testimonialsArePlaceholders = true

export const testimonials: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Rizky Pratama',
    from: 'Jakarta, Indonesia',
    rating: 5,
    initials: 'RP',
    tone: 'bg-forest',
    tourName: 'Garut One-Day City Tour',
    date: '2026-09-15',
    review: 'Perjalanan sehari yang sangat berkesan! Rute dari Candi Cangkuang hingga kulineran sore di pusat kota diatur sangat rapi oleh tim Garut Journey.',
  },
  {
    id: 'rev-2',
    name: 'Keluarga Hendra Wijaya',
    from: 'Bandung, Indonesia',
    rating: 5,
    initials: 'HW',
    tone: 'bg-ember',
    tourName: 'Garut Discovery',
    date: '2026-09-20',
    review: 'Anak-anak dan orang tua sangat menikmati berendam air panas di Cipanas serta makan nasi liwet hangat di tepi danau. Pemandunya ramah dan sabar.',
  },
  {
    id: 'rev-3',
    name: 'Sarah & Daniel Lim',
    from: 'Singapore',
    rating: 5,
    initials: 'SL',
    tone: 'bg-leaf',
    tourName: 'Premium Experience',
    date: '2026-09-25',
    review: 'Melihat matahari terbit di Gunung Papandayan dan menginap di tepi danau Kampung Sampireun adalah pengalaman terbaik kami di Jawa Barat.',
  },
  {
    id: 'rev-4',
    name: 'Tim Kreatif Nusantara',
    from: 'Surabaya, Indonesia',
    rating: 5,
    initials: 'TK',
    tone: 'bg-ink',
    tourName: 'Garut Experience — 2 Days 1 Night',
    date: '2026-09-28',
    review: 'Acara outing kantor berjalan lancar tanpa kendala. Transportasi nyaman, dokumentasi keren, dan oleh-oleh kulit Sukaregangnya asli berkualitas.',
  },
]
