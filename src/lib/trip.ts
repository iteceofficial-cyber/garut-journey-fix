/**
 * Lightweight client-side state shared across sections:
 * - the tour a visitor wants to book (pre-fills the inquiry form)
 * - destinations saved with "Add to My Itinerary"
 * Both live in browser storage until real accounts exist.
 */
import { useEffect, useState } from 'react'

const TOUR_KEY = 'gct:tour'
const SAVED_KEY = 'gct:saved'
const TOUR_EVENT = 'gct:tour'
const SAVED_EVENT = 'gct:saved'

export function selectTour(tour: string) {
  try {
    sessionStorage.setItem(TOUR_KEY, tour)
  } catch {}
  window.dispatchEvent(new CustomEvent(TOUR_EVENT, { detail: tour }))
}

export function useSelectedTour() {
  const [tour, setTour] = useState('')
  useEffect(() => {
    try {
      setTour(sessionStorage.getItem(TOUR_KEY) ?? '')
    } catch {}
    const on = (e: Event) => setTour((e as CustomEvent<string>).detail)
    window.addEventListener(TOUR_EVENT, on)
    return () => window.removeEventListener(TOUR_EVENT, on)
  }, [])
  return [tour, setTour] as const
}

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useSavedDestinations() {
  const [saved, setSaved] = useState<string[]>([])
  useEffect(() => {
    setSaved(readSaved())
    const on = () => setSaved(readSaved())
    window.addEventListener(SAVED_EVENT, on)
    return () => window.removeEventListener(SAVED_EVENT, on)
  }, [])
  const toggle = (slug: string) => {
    const cur = readSaved()
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]
    localStorage.setItem(SAVED_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(SAVED_EVENT))
  }
  const isSaved = (slug: string) => saved.includes(slug)
  return { saved, toggle, isSaved }
}

const PLAN_KEY = 'gct:plan'

/** Store a plain-text summary of a built itinerary so the inquiry form can include it. */
export function savePlanSummary(summary: string) {
  try {
    sessionStorage.setItem(PLAN_KEY, summary)
  } catch {}
}

export function readPlanSummary() {
  try {
    return sessionStorage.getItem(PLAN_KEY) ?? ''
  } catch {
    return ''
  }
}
