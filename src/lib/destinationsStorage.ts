import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { destinations as defaultDestinations, type Destination } from '@/data/destinations'
import { safeLocalStorageSet, persistMedia } from '@/lib/mediaStorage'

const DESTINATIONS_KEY = 'garut_journey_custom_destinations_v1'
const DESTINATIONS_EVENT = 'garut_destinations_updated'

const PRICES_KEY = 'garut_journey_tour_prices_v1'
const PRICES_EVENT = 'garut_tour_prices_updated'

export const DEFAULT_TOUR_PRICES: Record<string, number> = {
  'Garut One-Day City Tour': 350000,
  'Papandayan Volcano & Highland Trek': 450000,
  'Wisata Trekking & Camping — Gunung Papandayan': 480000,
  'Sunrise Trekking & Highland Camping — Gunung Guntur / Talaga Bodas': 520000,
  'Trekking & Camping': 480000,
  'Garut Heritage & Lake Experience': 375000,
  'Garut South Coast Explorer (Santolo & Rancabuaya)': 550000,
  'Custom itinerary': 400000,
}

// -------------------------------------------------------------
// TOUR PRICES MANAGEMENT (Synced to Firestore)
// -------------------------------------------------------------
export function getStoredTourPrices(): Record<string, number> {
  if (typeof window === 'undefined') return DEFAULT_TOUR_PRICES
  try {
    const raw = localStorage.getItem(PRICES_KEY)
    if (raw) return { ...DEFAULT_TOUR_PRICES, ...JSON.parse(raw) }
  } catch (err) {
    console.error('Failed to get tour prices:', err)
  }
  return DEFAULT_TOUR_PRICES
}

export function saveLocalTourPrices(prices: Record<string, number>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PRICES_KEY, JSON.stringify(prices))
    window.dispatchEvent(new CustomEvent(PRICES_EVENT, { detail: prices }))
  } catch (err) {
    console.error('Failed to save tour prices to localStorage:', err)
  }
}

export async function saveTourPrice(tourName: string, price: number): Promise<boolean> {
  const current = getStoredTourPrices()
  const updated = { ...current, [tourName]: price }
  saveLocalTourPrices(updated)

  try {
    await setDoc(doc(db, 'tourPrices', 'default'), { prices: updated, updatedAt: new Date().toISOString() })
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, 'tourPrices/default')
    return true
  }
}

export function useTourPrices() {
  const [prices, setPrices] = useState<Record<string, number>>(() => getStoredTourPrices())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => setPrices(getStoredTourPrices())
    window.addEventListener(PRICES_EVENT, handler)
    window.addEventListener('storage', handler)

    // Firestore real-time listener
    const unsub = onSnapshot(
      doc(db, 'tourPrices', 'default'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data && data.prices) {
            const merged = { ...DEFAULT_TOUR_PRICES, ...data.prices }
            setPrices(merged)
            saveLocalTourPrices(merged)
          }
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'tourPrices/default')
      }
    )

    return () => {
      window.removeEventListener(PRICES_EVENT, handler)
      window.removeEventListener('storage', handler)
      unsub()
    }
  }, [])

  return { prices, updatePrice: saveTourPrice }
}

// -------------------------------------------------------------
// DESTINATIONS MANAGEMENT (Synced to Firestore)
// -------------------------------------------------------------
export function getStoredDestinations(): Destination[] {
  if (typeof window === 'undefined') return defaultDestinations
  try {
    const raw = localStorage.getItem(DESTINATIONS_KEY)
    if (raw) {
      const custom: Destination[] = JSON.parse(raw)
      const base = [...defaultDestinations]
      custom.forEach((c) => {
        const idx = base.findIndex((b) => b.slug === c.slug)
        if (idx >= 0) {
          base[idx] = c
        } else {
          base.push(c)
        }
      })
      return base
    }
  } catch (err) {
    console.error('Failed to get custom destinations:', err)
  }
  return defaultDestinations
}

export function saveLocalDestinations(list: Destination[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(DESTINATIONS_KEY, list, DESTINATIONS_EVENT, list)
}

export async function saveCustomDestination(dest: Destination): Promise<boolean> {
  const current = getStoredDestinations()
  const cleanSlug = dest.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `dest-${Date.now()}`

  const normalized: Destination = { ...dest, slug: cleanSlug }

  if (normalized.image && normalized.image.startsWith('data:')) {
    persistMedia(`dest-${cleanSlug}`, normalized.image)
  }

  const updated = [normalized, ...current.filter((d) => d.slug !== cleanSlug)]
  saveLocalDestinations(updated)

  try {
    await setDoc(doc(db, 'destinations', cleanSlug), normalized)
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `destinations/${cleanSlug}`)
    return true
  }
}

export async function deleteDestination(slug: string): Promise<boolean> {
  const current = getStoredDestinations()
  const updated = current.filter((d) => d.slug !== slug)
  saveLocalDestinations(updated)

  try {
    await deleteDoc(doc(db, 'destinations', slug))
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.DELETE, `destinations/${slug}`)
    return false
  }
}

export function useDestinations() {
  const [destinationsList, setDestinationsList] = useState<Destination[]>(() => getStoredDestinations())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => setDestinationsList(getStoredDestinations())
    window.addEventListener(DESTINATIONS_EVENT, handler)
    window.addEventListener('storage', handler)

    // Firestore real-time listener
    const unsub = onSnapshot(
      collection(db, 'destinations'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteMap = new Map<string, Destination>()
          snapshot.forEach((snap) => {
            const data = snap.data() as Destination
            remoteMap.set(data.slug, data)
          })

          const merged = [...defaultDestinations]
          remoteMap.forEach((dest, slug) => {
            const idx = merged.findIndex((d) => d.slug === slug)
            if (idx >= 0) {
              merged[idx] = dest
            } else {
              merged.push(dest)
            }
          })
          setDestinationsList(merged)
          saveLocalDestinations(Array.from(remoteMap.values()))
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'destinations')
      }
    )

    return () => {
      window.removeEventListener(DESTINATIONS_EVENT, handler)
      window.removeEventListener('storage', handler)
      unsub()
    }
  }, [])

  return {
    destinations: destinationsList,
    saveDestination: saveCustomDestination,
    removeDestination: deleteDestination,
  }
}
