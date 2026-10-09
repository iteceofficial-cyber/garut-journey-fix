/**
 * Rules-based itinerary builder. Turns a traveller's choices into a
 * suggested day-by-day plan using the destination catalogue.
 */
import { getDestination } from './destinations'

export type Duration = 1 | 2 | 3 | 4 | 5 | 7
export type Style = 'Family' | 'Couple' | 'Adventure' | 'Culinary' | 'Relaxation' | 'Culture'
export type Budget = 'Budget' | 'Standard' | 'Premium'

export const styles: Style[] = ['Family', 'Couple', 'Adventure', 'Culinary', 'Relaxation', 'Culture']
export const budgets: Budget[] = ['Budget', 'Standard', 'Premium']

export interface Stop {
  time: string
  destination: string
  slug?: string
  activity: string
  duration: string
  food: string
  note: string
}

export interface PlanDay {
  day: number
  title: string
  stops: Stop[]
}

const routes: Record<Style, string[][]> = {
  Family: [
    ['garut-city-square', 'situ-bagendit', 'cipanas-garut'],
    ['candi-cangkuang', 'kampung-sampireun'],
    ['darajat-pass', 'garut-city-square'],
    ['santolo-beach'],
    ['candi-cangkuang', 'situ-bagendit'],
    ['kampung-sampireun', 'cipanas-garut'],
    ['garut-city-square', 'darajat-pass'],
  ],
  Couple: [
    ['candi-cangkuang', 'garut-city-square', 'cipanas-garut'],
    ['kampung-sampireun', 'darajat-pass'],
    ['rancabuaya-beach'],
    ['santolo-beach'],
    ['situ-bagendit', 'kampung-sampireun'],
    ['candi-cangkuang', 'cipanas-garut'],
    ['garut-city-square', 'darajat-pass'],
  ],
  Adventure: [
    ['mount-papandayan', 'darajat-pass', 'cipanas-garut'],
    ['santolo-beach', 'rancabuaya-beach'],
    ['mount-papandayan', 'garut-city-square'],
    ['rancabuaya-beach', 'santolo-beach'],
    ['darajat-pass', 'mount-papandayan'],
    ['candi-cangkuang', 'situ-bagendit'],
    ['garut-city-square', 'cipanas-garut'],
  ],
  Culinary: [
    ['garut-city-square', 'candi-cangkuang', 'cipanas-garut'],
    ['situ-bagendit', 'kampung-sampireun'],
    ['garut-city-square', 'darajat-pass'],
    ['santolo-beach'],
    ['candi-cangkuang', 'situ-bagendit'],
    ['kampung-sampireun', 'cipanas-garut'],
    ['garut-city-square', 'santolo-beach'],
  ],
  Relaxation: [
    ['situ-bagendit', 'cipanas-garut'],
    ['kampung-sampireun', 'darajat-pass'],
    ['garut-city-square', 'cipanas-garut'],
    ['candi-cangkuang', 'kampung-sampireun'],
    ['darajat-pass', 'situ-bagendit'],
    ['santolo-beach'],
    ['garut-city-square', 'cipanas-garut'],
  ],
  Culture: [
    ['candi-cangkuang', 'garut-city-square', 'situ-bagendit'],
    ['kampung-sampireun', 'cipanas-garut'],
    ['mount-papandayan', 'garut-city-square'],
    ['candi-cangkuang', 'situ-bagendit'],
    ['darajat-pass', 'kampung-sampireun'],
    ['santolo-beach'],
    ['garut-city-square', 'candi-cangkuang'],
  ],
}

const foodByStyle: Record<Style, string[]> = {
  Family: ['Sundanese family lunch', 'Dodol tasting', 'Baso aci'],
  Couple: ['Lakeside Sundanese dinner', 'Chocodot & coffee', 'Fresh seafood'],
  Adventure: ['Hearty highland breakfast', 'Packed lunch on the trail', 'Fresh seafood'],
  Culinary: ['Baso aci', 'Traditional Sundanese feast', 'Evening street food crawl'],
  Relaxation: ['Slow Sundanese lunch', 'Warm drinks by the springs', 'Burayot & tea'],
  Culture: ['Traditional Sundanese meal', 'Burayot from local sellers', 'Dodol tasting'],
}

const timeSlots = ['08:30', '11:30', '15:00', '17:30']
const durations = ['2–3 hrs', '2 hrs', '1.5–2 hrs', '1–2 hrs']

const budgetNote: Record<Budget, string> = {
  Budget: 'Shared transport and local eateries keep costs low.',
  Standard: 'Comfortable private transport and well-reviewed local restaurants.',
  Premium: 'Private guide, premium stays and reserved tables throughout.',
}

export function buildItinerary(duration: Duration, style: Style, budget: Budget, travelers: number): PlanDay[] {
  const days = routes[style].slice(0, duration)
  const foods = foodByStyle[style]
  return days.map((slugs, i) => {
    const stops: Stop[] = slugs.map((slug, j) => {
      const d = getDestination(slug)
      return {
        time: timeSlots[j] ?? '16:00',
        destination: d ? d.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
        activity: d?.activities ? d.activities.slice(0, 2).join(' · ') : 'Eksplorasi destinasi & foto',
        duration: durations[j] ?? '1–2 hrs',
        food: foods[(i + j) % foods.length],
        note: d?.travelTips?.[0] ?? 'Kenakan pakaian nyaman untuk cuaca pegunungan.',
      }
    })
    stops.push({
      time: i === days.length - 1 ? '18:00' : '19:00',
      destination: i === days.length - 1 ? 'Souvenirs & return' : 'Dinner & rest',
      activity: i === days.length - 1 ? 'Local shopping for dodol, chocodot & leather goods' : 'Evening at your stay',
      duration: '1–2 hrs',
      food: i === days.length - 1 ? 'Dodol & chocodot to take home' : foods[(i + 1) % foods.length],
      note:
        travelers >= 10
          ? 'Large group — we arrange group-friendly transport and seating.'
          : budgetNote[budget],
    })
    const dayTitles = [
      'Arrive & discover',
      'Highland wonders & crater',
      'Heritage & soothing springs',
      'South coast ocean exploration',
      'Artisanal leather & culinary trail',
      'Geothermal tea estate immersion',
      'Grand farewell to Garut',
    ]
    return {
      day: i + 1,
      title: dayTitles[i] || `Day ${i + 1} Adventure`,
      stops,
    }
  })
}
