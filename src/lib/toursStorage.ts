import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { cityTours as defaultCityTours, packages as defaultPackages, type CityTour, type TourPackage } from '@/data/tours'
import { safeLocalStorageSet, persistMedia } from '@/lib/mediaStorage'

const CITY_TOURS_KEY = 'gj:city-tours:v2'
const PACKAGES_KEY = 'gj:tour-packages:v2'

function slugifyId(raw: string, prefix = 'tour'): string {
  const clean = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return clean || `${prefix}-${Date.now()}`
}

// -------------------------------------------------------------
// 1. CITY TOURS
// -------------------------------------------------------------
export function getStoredCityTours(): CityTour[] {
  if (typeof window === 'undefined') return defaultCityTours
  try {
    const raw = window.localStorage.getItem(CITY_TOURS_KEY)
    if (!raw) return defaultCityTours
    const parsed = JSON.parse(raw) as CityTour[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultCityTours

    const map = new Map<string, CityTour>()
    defaultCityTours.forEach((t) => map.set(t.id, t))
    parsed.forEach((t) => map.set(t.id, t))
    return Array.from(map.values())
  } catch {
    return defaultCityTours
  }
}

export function saveLocalCityTours(list: CityTour[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(CITY_TOURS_KEY, list, 'gj:tours-change')
}

export async function upsertCityTour(tour: CityTour): Promise<CityTour[]> {
  const current = getStoredCityTours()
  const cleanId = slugifyId(tour.id || tour.name, 'tour')
  const normalized: CityTour = { ...tour, id: cleanId }

  if (normalized.image && normalized.image.startsWith('data:')) {
    persistMedia(`tour-${cleanId}`, normalized.image)
  }

  const idx = current.findIndex((t) => t.id === cleanId)
  const next = idx >= 0
    ? current.map((t, i) => (i === idx ? normalized : t))
    : [normalized, ...current]

  saveLocalCityTours(next)

  try {
    await setDoc(doc(db, 'cityTours', cleanId), normalized)
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `cityTours/${cleanId}`)
  }
  return next
}

export async function deleteCityTour(id: string): Promise<CityTour[]> {
  const current = getStoredCityTours()
  const next = current.filter((t) => t.id !== id)
  saveLocalCityTours(next)

  try {
    await deleteDoc(doc(db, 'cityTours', id))
  } catch (err) {
    logFirestoreError(err, OperationType.DELETE, `cityTours/${id}`)
  }
  return next
}

export function resetCityToursToDefault(): CityTour[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CITY_TOURS_KEY)
    window.dispatchEvent(new CustomEvent('gj:tours-change'))
  }
  return defaultCityTours
}

export function useCityTours(): CityTour[] {
  const [list, setList] = useState<CityTour[]>(() => getStoredCityTours())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredCityTours())
    window.addEventListener('gj:tours-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'cityTours'),
      (snapshot) => {
        if (!snapshot.empty) {
          const map = new Map<string, CityTour>()
          defaultCityTours.forEach((t) => map.set(t.id, t))
          snapshot.forEach((snap) => {
            const data = snap.data() as CityTour
            if (data && data.id) {
              map.set(data.id, data)
            }
          })
          const merged = Array.from(map.values())
          setList(merged)
          saveLocalCityTours(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'cityTours')
      }
    )

    return () => {
      window.removeEventListener('gj:tours-change', sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}

// -------------------------------------------------------------
// 2. TOUR PACKAGES
// -------------------------------------------------------------
export function getStoredPackages(): TourPackage[] {
  if (typeof window === 'undefined') return defaultPackages
  try {
    const raw = window.localStorage.getItem(PACKAGES_KEY)
    if (!raw) return defaultPackages
    const parsed = JSON.parse(raw) as TourPackage[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultPackages

    const map = new Map<string, TourPackage>()
    defaultPackages.forEach((p) => map.set(p.id, p))
    parsed.forEach((p) => map.set(p.id, p))
    return Array.from(map.values())
  } catch {
    return defaultPackages
  }
}

export function saveLocalPackages(list: TourPackage[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(PACKAGES_KEY, list, 'gj:packages-change')
}

export async function upsertTourPackage(pkg: TourPackage): Promise<TourPackage[]> {
  const current = getStoredPackages()
  const cleanId = slugifyId(pkg.id || pkg.name, 'pkg')
  const normalized: TourPackage = { ...pkg, id: cleanId }

  const idx = current.findIndex((p) => p.id === cleanId)
  const next = idx >= 0
    ? current.map((p, i) => (i === idx ? normalized : p))
    : [normalized, ...current]

  saveLocalPackages(next)

  try {
    await setDoc(doc(db, 'tourPackages', cleanId), normalized)
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `tourPackages/${cleanId}`)
  }
  return next
}

export async function deleteTourPackage(id: string): Promise<TourPackage[]> {
  const current = getStoredPackages()
  const next = current.filter((p) => p.id !== id)
  saveLocalPackages(next)

  try {
    await deleteDoc(doc(db, 'tourPackages', id))
  } catch (err) {
    logFirestoreError(err, OperationType.DELETE, `tourPackages/${id}`)
  }
  return next
}

export function resetPackagesToDefault(): TourPackage[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PACKAGES_KEY)
    window.dispatchEvent(new CustomEvent('gj:packages-change'))
  }
  return defaultPackages
}

export function useTourPackages(): TourPackage[] {
  const [list, setList] = useState<TourPackage[]>(() => getStoredPackages())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredPackages())
    window.addEventListener('gj:packages-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'tourPackages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const map = new Map<string, TourPackage>()
          defaultPackages.forEach((p) => map.set(p.id, p))
          snapshot.forEach((snap) => {
            const data = snap.data() as TourPackage
            if (data && data.id) {
              map.set(data.id, data)
            }
          })
          const merged = Array.from(map.values())
          setList(merged)
          saveLocalPackages(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'tourPackages')
      }
    )

    return () => {
      window.removeEventListener('gj:packages-change', sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}
