import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'
import { dishes as defaultDishes, type Dish } from '@/data/culinary'
import { gallery as defaultGallery, type GalleryItem } from '@/data/gallery'
import { experiences as defaultExperiences, type Experience } from '@/data/experiences'

const CULINARY_KEY = 'gj:culinary:v1'
const GALLERY_KEY = 'gj:gallery:v1'
const EXPERIENCES_KEY = 'gj:experiences:v1'

// --- Culinary ---
export function getStoredCulinary(): Dish[] {
  if (typeof window === 'undefined') return defaultDishes
  try {
    const raw = window.localStorage.getItem(CULINARY_KEY)
    if (!raw) return defaultDishes
    const parsed = JSON.parse(raw) as Dish[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultDishes
  } catch {
    return defaultDishes
  }
}

export function saveLocalCulinary(list: Dish[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CULINARY_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:culinary-change'))
  } catch {
    // ignore
  }
}

export async function upsertCulinaryItem(item: Dish): Promise<Dish[]> {
  const current = getStoredCulinary()
  const idx = current.findIndex((c) => c.id === item.id)
  const next = idx >= 0 ? current.map((c, i) => (i === idx ? item : c)) : [...current, item]
  saveLocalCulinary(next)

  try {
    await setDoc(doc(db, 'culinary', item.id), item)
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `culinary/${item.id}`)
  }
  return next
}

export async function deleteCulinaryItem(id: string): Promise<Dish[]> {
  const current = getStoredCulinary()
  const next = current.filter((c) => c.id !== id)
  saveLocalCulinary(next)

  try {
    await deleteDoc(doc(db, 'culinary', id))
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `culinary/${id}`)
  }
  return next
}

export function resetCulinaryToDefault(): Dish[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CULINARY_KEY)
    window.dispatchEvent(new CustomEvent('gj:culinary-change'))
  }
  return defaultDishes
}

export function useCulinary(): Dish[] {
  const [list, setList] = useState<Dish[]>(() => getStoredCulinary())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredCulinary())
    window.addEventListener('gj:culinary-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'culinary'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Dish[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as Dish))
          setList(remoteList)
          saveLocalCulinary(remoteList)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'culinary')
      }
    )

    return () => {
      window.removeEventListener('gj:culinary-change', sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}

// --- Gallery ---
function withIds(items: GalleryItem[]): GalleryItem[] {
  return items.map((item, idx) => ({
    ...item,
    id: item.id || `gal-${idx}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  }))
}

export function getStoredGallery(): GalleryItem[] {
  if (typeof window === 'undefined') return withIds(defaultGallery)
  try {
    const raw = window.localStorage.getItem(GALLERY_KEY)
    if (!raw) return withIds(defaultGallery)
    const parsed = JSON.parse(raw) as GalleryItem[]
    return Array.isArray(parsed) && parsed.length > 0 ? withIds(parsed) : withIds(defaultGallery)
  } catch {
    return withIds(defaultGallery)
  }
}

export function saveLocalGallery(list: GalleryItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(GALLERY_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:gallery-change'))
  } catch {
    // ignore
  }
}

export async function upsertGalleryItem(item: GalleryItem): Promise<GalleryItem[]> {
  const current = getStoredGallery()
  const id = item.id || `gal-${Date.now()}`
  const normalized = { ...item, id }
  const idx = current.findIndex((g) => g.id === id)
  const next = idx >= 0 ? current.map((g, i) => (i === idx ? normalized : g)) : [normalized, ...current]
  saveLocalGallery(next)

  try {
    await setDoc(doc(db, 'gallery', id), normalized)
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `gallery/${id}`)
  }
  return next
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem[]> {
  const current = getStoredGallery()
  const next = current.filter((g) => g.id !== id)
  saveLocalGallery(next)

  try {
    await deleteDoc(doc(db, 'gallery', id))
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`)
  }
  return next
}

export function resetGalleryToDefault(): GalleryItem[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(GALLERY_KEY)
    window.dispatchEvent(new CustomEvent('gj:gallery-change'))
  }
  return withIds(defaultGallery)
}

export function useGallery(): GalleryItem[] {
  const [list, setList] = useState<GalleryItem[]>(() => withIds(defaultGallery))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredGallery())
    window.addEventListener('gj:gallery-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'gallery'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: GalleryItem[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as GalleryItem))
          setList(remoteList)
          saveLocalGallery(remoteList)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'gallery')
      }
    )

    return () => {
      window.removeEventListener('gj:gallery-change', sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}

// --- Experiences ---
export function getStoredExperiences(): Experience[] {
  if (typeof window === 'undefined') return defaultExperiences
  try {
    const raw = window.localStorage.getItem(EXPERIENCES_KEY)
    if (!raw) return defaultExperiences
    const parsed = JSON.parse(raw) as Experience[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultExperiences
  } catch {
    return defaultExperiences
  }
}

export function saveLocalExperiences(list: Experience[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:experiences-change'))
  } catch {
    // ignore
  }
}

export async function upsertExperienceItem(item: Experience): Promise<Experience[]> {
  const current = getStoredExperiences()
  const idx = current.findIndex((e) => e.id === item.id)
  const next = idx >= 0 ? current.map((e, i) => (i === idx ? item : e)) : [...current, item]
  saveLocalExperiences(next)

  try {
    await setDoc(doc(db, 'experiences', item.id), item)
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `experiences/${item.id}`)
  }
  return next
}

export async function deleteExperienceItem(id: string): Promise<Experience[]> {
  const current = getStoredExperiences()
  const next = current.filter((e) => e.id !== id)
  saveLocalExperiences(next)

  try {
    await deleteDoc(doc(db, 'experiences', id))
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `experiences/${id}`)
  }
  return next
}

export function resetExperiencesToDefault(): Experience[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(EXPERIENCES_KEY)
    window.dispatchEvent(new CustomEvent('gj:experiences-change'))
  }
  return defaultExperiences
}

export function useExperiences(): Experience[] {
  const [list, setList] = useState<Experience[]>(() => getStoredExperiences())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredExperiences())
    window.addEventListener('gj:experiences-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'experiences'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Experience[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as Experience))
          setList(remoteList)
          saveLocalExperiences(remoteList)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'experiences')
      }
    )

    return () => {
      window.removeEventListener('gj:experiences-change', sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}
