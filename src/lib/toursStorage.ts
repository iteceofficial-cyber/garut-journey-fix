import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'
import { cityTours as defaultCityTours, packages as defaultPackages, type CityTour, type TourPackage } from '@/data/tours'

const CITY_TOURS_KEY = 'gj:city-tours:v2'
const PACKAGES_KEY = 'gj:tour-packages:v2'

// --- CITY TOURS ---
export function getStoredCityTours(): CityTour[] {
  if (typeof window === 'undefined') return defaultCityTours
  try {
    const raw = window.localStorage.getItem(CITY_TOURS_KEY)
    if (!raw) return defaultCityTours
    const parsed = JSON.parse(raw) as CityTour[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCityTours
  } catch {
    return defaultCityTours
  }
}

export function saveLocalCityTours(list: CityTour[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CITY_TOURS_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:tours-change'))
  } catch {
    // ignore
  }
}

export async function upsertCityTour(tour: CityTour): Promise<CityTour[]> {
  const current = getStoredCityTours()
  const idx = current.findIndex((t) => t.id === tour.id)
  const next = idx >= 0 ? current.map((t, i) => (i === idx ? tour : t)) : [...current, tour]
  saveLocalCityTours(next)

  try {
    await setDoc(doc(db, 'cityTours', tour.id), tour)
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `cityTours/${tour.id}`)
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
    handleFirestoreError(err, OperationType.DELETE, `cityTours/${id}`)
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

// --- TOUR PACKAGES ---
export function getStoredPackages(): TourPackage[] {
  if (typeof window === 'undefined') return defaultPackages
  try {
    const raw = window.localStorage.getItem(PACKAGES_KEY)
    if (!raw) return defaultPackages
    const parsed = JSON.parse(raw) as TourPackage[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultPackages
  } catch {
    return defaultPackages
  }
}

export function saveLocalPackages(list: TourPackage[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PACKAGES_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:packages-change'))
  } catch {
    // ignore
  }
}

export async function upsertTourPackage(pkg: TourPackage): Promise<TourPackage[]> {
  const current = getStoredPackages()
  const idx = current.findIndex((p) => p.id === pkg.id)
  const next = idx >= 0 ? current.map((p, i) => (i === idx ? pkg : p)) : [...current, pkg]
  saveLocalPackages(next)

  try {
    await setDoc(doc(db, 'tourPackages', pkg.id), pkg)
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `tourPackages/${pkg.id}`)
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
    handleFirestoreError(err, OperationType.DELETE, `tourPackages/${id}`)
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
          const remoteList: CityTour[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as CityTour))
          setList(remoteList)
          saveLocalCityTours(remoteList)
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
          const remoteList: TourPackage[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as TourPackage))
          setList(remoteList)
          saveLocalPackages(remoteList)
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
