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

    const defaultIds = new Set(defaultCityTours.map((t) => t.id))
    const customItems: CityTour[] = []
    const updatedDefaultsMap = new Map<string, CityTour>()

    parsed.forEach((item) => {
      if (defaultIds.has(item.id)) {
        updatedDefaultsMap.set(item.id, item)
      } else {
        customItems.push(item)
      }
    })

    const finalDefaults = defaultCityTours.map((t) => updatedDefaultsMap.get(t.id) || t)
    return [...customItems, ...finalDefaults]
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

  const filtered = current.filter((t) => t.id !== cleanId && t.name !== normalized.name)
  const next = [normalized, ...filtered]

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
        const defaultIds = new Set(defaultCityTours.map((t) => t.id))
        const local = getStoredCityTours()
        const localCustoms = local.filter((t) => !defaultIds.has(t.id))

        const remoteMap = new Map<string, CityTour>()
        snapshot.forEach((snap) => {
          const data = snap.data() as CityTour
          if (data && data.id) {
            remoteMap.set(data.id, data)
          }
        })

        const customMap = new Map<string, CityTour>()
        localCustoms.forEach((c) => customMap.set(c.id, c))
        remoteMap.forEach((r, key) => {
          if (!defaultIds.has(key)) {
            if (!customMap.has(key)) {
              customMap.set(key, r)
            }
          }
        })

        const finalDefaults = defaultCityTours.map((t) => remoteMap.get(t.id) || t)
        const merged = [...Array.from(customMap.values()), ...finalDefaults]

        setList(merged)
        saveLocalCityTours(merged)
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

    const defaultIds = new Set(defaultPackages.map((p) => p.id))
    const customItems: TourPackage[] = []
    const updatedDefaultsMap = new Map<string, TourPackage>()

    parsed.forEach((item) => {
      if (defaultIds.has(item.id)) {
        updatedDefaultsMap.set(item.id, item)
      } else {
        customItems.push(item)
      }
    })

    const finalDefaults = defaultPackages.map((p) => updatedDefaultsMap.get(p.id) || p)
    return [...customItems, ...finalDefaults]
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

  const filtered = current.filter((p) => p.id !== cleanId && p.name !== normalized.name)
  const next = [normalized, ...filtered]

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
        const defaultIds = new Set(defaultPackages.map((p) => p.id))
        const local = getStoredPackages()
        const localCustoms = local.filter((p) => !defaultIds.has(p.id))

        const remoteMap = new Map<string, TourPackage>()
        snapshot.forEach((snap) => {
          const data = snap.data() as TourPackage
          if (data && data.id) {
            remoteMap.set(data.id, data)
          }
        })

        const customMap = new Map<string, TourPackage>()
        localCustoms.forEach((c) => customMap.set(c.id, c))
        remoteMap.forEach((r, key) => {
          if (!defaultIds.has(key)) {
            if (!customMap.has(key)) {
              customMap.set(key, r)
            }
          }
        })

        const finalDefaults = defaultPackages.map((p) => remoteMap.get(p.id) || p)
        const merged = [...Array.from(customMap.values()), ...finalDefaults]

        setList(merged)
        saveLocalPackages(merged)
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
