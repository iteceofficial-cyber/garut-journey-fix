/**
 * Business details. Values marked PLACEHOLDER must be replaced with the real
 * details before launch — nothing here has been verified.
 */
export const site = {
  name: 'Garut Journey',
  tagline: 'Explore Garut, Feel the Story.',
  description:
    'One city, countless stories. Discover nature, culture, culinary experiences, and authentic local adventures in Garut with Garut Journey.',
  url: 'https://garutjourney.com',
  whatsapp: '+62 851-5645-6791',
  /** Digits only, used to build wa.me links. */
  whatsappDigits: '6285156456791',
  email: 'hello@garutjourney.com',
  address: 'Jl. Raya Bayongbong - Cikajang No. 103 Garut, Jawa Barat',
  mapsQuery: 'Jl. Raya Bayongbong - Cikajang No. 103, Garut, Jawa Barat',
  socials: {
    instagram: 'https://instagram.com/garutjourney',
    tiktok: 'https://tiktok.com/@garutjourney',
    facebook: 'https://facebook.com/garutjourney',
    youtube: 'https://youtube.com/@garutjourney',
  },
}

export function whatsappLink(message = 'Hi Garut Journey! I would like to plan a trip to Garut.') {
  return `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(message)}`
}

export function mapsEmbed(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`
}

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export const COMING_SOON = 'Information coming soon.'

export const navLinks: Array<{ label: string; hash?: string; to?: string }> = [
  { label: 'Home', hash: 'top' },
  { label: 'Destinations', hash: 'destinations' },
  { label: 'City Tours', hash: 'city-tours' },
  { label: 'Culinary', hash: 'culinary' },
  { label: 'Itinerary', hash: 'itinerary' },
  { label: 'Team Guide', hash: 'team' },
  { label: 'Tentang Kami', hash: 'company-profile' },
  { label: 'Gallery', hash: 'gallery' },
  { label: 'Reviews', hash: 'testimonials' },
  { label: 'Travel Guide', hash: 'guide' },
  { label: 'Contact', hash: 'contact' },
]
