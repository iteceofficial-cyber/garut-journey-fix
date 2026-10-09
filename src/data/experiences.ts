/** "Choose your experience" — maps a traveller mood to destinations and packages. */
export interface Experience {
  id: string
  emoji: string
  label: string
  blurb: string
  destinations: string[]
  packages: string[]
}

export const experiences: Experience[] = [
  {
    id: 'nature',
    emoji: '🌿',
    label: 'Nature & Healing',
    blurb: 'Cool highland air, quiet lakes and warm springs to reset body and mind.',
    destinations: ['cipanas-garut', 'situ-bagendit', 'darajat-pass'],
    packages: ['garut-discovery'],
  },
  {
    id: 'culinary',
    emoji: '🍜',
    label: 'Culinary Adventure',
    blurb: 'From dodol to baso aci — eat your way through Garut like a local.',
    destinations: ['garut-city-square', 'cipanas-garut'],
    packages: ['explorer', 'garut-discovery'],
  },
  {
    id: 'photography',
    emoji: '📸',
    label: 'Photography',
    blurb: 'Volcanic craters, misty lakes and wild coastline at golden hour.',
    destinations: ['mount-papandayan', 'kampung-sampireun', 'rancabuaya-beach'],
    packages: ['premium-experience'],
  },
  {
    id: 'history',
    emoji: '🏛️',
    label: 'History & Culture',
    blurb: 'Ancient temples, traditional villages and living Sundanese craft.',
    destinations: ['candi-cangkuang', 'garut-city-square'],
    packages: ['explorer'],
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    label: 'Family Trip',
    blurb: 'Easy, safe and fun days out for every age.',
    destinations: ['situ-bagendit', 'cipanas-garut', 'santolo-beach'],
    packages: ['garut-discovery'],
  },
  {
    id: 'romantic',
    emoji: '💑',
    label: 'Romantic Getaway',
    blurb: 'Lakeside cottages, sunsets and slow mornings for two.',
    destinations: ['kampung-sampireun', 'cipanas-garut'],
    packages: ['premium-experience'],
  },
  {
    id: 'adventure',
    emoji: '🧗',
    label: 'Adventure',
    blurb: 'Crater hikes, highland roads and the untamed south coast.',
    destinations: ['mount-papandayan', 'darajat-pass', 'santolo-beach'],
    packages: ['premium-experience'],
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    label: 'Shopping & Souvenirs',
    blurb: 'Garut leather, local crafts and sweets to take home.',
    destinations: ['garut-city-square'],
    packages: ['explorer'],
  },
]
