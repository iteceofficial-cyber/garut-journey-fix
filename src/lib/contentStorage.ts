import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { dishes as defaultDishes, type Dish } from '@/data/culinary'
import { gallery as defaultGallery, type GalleryItem } from '@/data/gallery'
import { experiences as defaultExperiences, type Experience } from '@/data/experiences'
import { safeLocalStorageSet, persistMedia } from '@/lib/mediaStorage'

const CULINARY_KEY = 'gj:culinary:v1'
const GALLERY_KEY = 'gj:gallery:v1'
const EXPERIENCES_KEY = 'gj:experiences:v1'

function slugifyId(raw: string, prefix = 'item'): string {
  const clean = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return clean || `${prefix}-${Date.now()}`
}

// =========================================================================
// 1. CULINARY STORAGE
// =========================================================================

export function getStoredCulinary(): Dish[] {
  if (typeof window === 'undefined') return defaultDishes
  try {
    const raw = window.localStorage.getItem(CULINARY_KEY)
    if (!raw) return defaultDishes
    const parsed = JSON.parse(raw) as Dish[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultDishes

    // Merge parsed with default dishes to preserve all baseline items
    const map = new Map<string, Dish>()
    defaultDishes.forEach((d) => map.set(d.id, d))
    parsed.forEach((d) => map.set(d.id, d))
    return Array.from(map.values())
  } catch {
    return defaultDishes
  }
}

export function saveLocalCulinary(list: Dish[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(CULINARY_KEY, list, 'gj:culinary-change')
}

export async function upsertCulinaryItem(item: Dish): Promise<Dish[]> {
  const current = getStoredCulinary()
  const cleanId = slugifyId(item.id || item.name, 'dish')
  const normalized: Dish = { ...item, id: cleanId }

  if (normalized.image && normalized.image.startsWith('data:')) {
    persistMedia(`dish-${cleanId}`, normalized.image)
  }

  const idx = current.findIndex((c) => c.id === cleanId)
  const next = idx >= 0
    ? current.map((c, i) => (i === idx ? normalized : c))
    : [normalized, ...current]

  saveLocalCulinary(next)

  try {
    await setDoc(doc(db, 'culinary', cleanId), normalized)
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `culinary/${cleanId}`)
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
    logFirestoreError(err, OperationType.DELETE, `culinary/${id}`)
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
          const map = new Map<string, Dish>()
          // 1. Seed defaults
          defaultDishes.forEach((d) => map.set(d.id, d))
          // 2. Overlay remote Firestore items
          snapshot.forEach((snap) => {
            const data = snap.data() as Dish
            if (data && data.id) {
              map.set(data.id, data)
            }
          })
          const merged = Array.from(map.values())
          setList(merged)
          saveLocalCulinary(merged)
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

// =========================================================================
// 2. GALLERY STORAGE
// =========================================================================

function withIds(items: GalleryItem[]): GalleryItem[] {
  return items.map((item, idx) => ({
    ...item,
    id: item.id || `gal-${idx}-${slugifyId(item.title, 'photo')}`,
  }))
}

export function getStoredGallery(): GalleryItem[] {
  const defaults = withIds(defaultGallery)
  if (typeof window === 'undefined') return defaults
  try {
    const raw = window.localStorage.getItem(GALLERY_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as GalleryItem[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaults

    // Merge: Custom or updated items take precedence, baseline items are kept intact
    const map = new Map<string, GalleryItem>()
    defaults.forEach((g) => map.set(g.id || g.title, g))
    parsed.forEach((g) => {
      const key = g.id || g.title
      map.set(key, g)
    })
    return Array.from(map.values())
  } catch {
    return defaults
  }
}

export function saveLocalGallery(list: GalleryItem[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(GALLERY_KEY, list, 'gj:gallery-change')
}

export async function upsertGalleryItem(item: GalleryItem): Promise<GalleryItem[]> {
  const current = getStoredGallery()
  const cleanId = slugifyId(item.id || item.title || `gal-${Date.now()}`, 'gal')
  const normalized: GalleryItem = { ...item, id: cleanId }

  if (normalized.image && normalized.image.startsWith('data:')) {
    persistMedia(`gallery-${cleanId}`, normalized.image)
  }

  const idx = current.findIndex((g) => g.id === cleanId || g.title === item.title)
  // Newly uploaded photos go straight to the front of the list so they appear immediately on the home page!
  const next = idx >= 0
    ? current.map((g, i) => (i === idx ? normalized : g))
    : [normalized, ...current]

  saveLocalGallery(next)

  try {
    await setDoc(doc(db, 'gallery', cleanId), normalized)
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `gallery/${cleanId}`)
  }

  return next
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem[]> {
  const current = getStoredGallery()
  const next = current.filter((g) => g.id !== id && g.title !== id)
  saveLocalGallery(next)

  try {
    await deleteDoc(doc(db, 'gallery', id))
  } catch (err) {
    logFirestoreError(err, OperationType.DELETE, `gallery/${id}`)
  }
  return next
}

export function resetGalleryToDefault(): GalleryItem[] {
  const defaults = withIds(defaultGallery)
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(GALLERY_KEY)
    window.dispatchEvent(new CustomEvent('gj:gallery-change'))
  }
  return defaults
}

export function useGallery(): GalleryItem[] {
  const [list, setList] = useState<GalleryItem[]>(() => getStoredGallery())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredGallery())
    window.addEventListener('gj:gallery-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'gallery'),
      (snapshot) => {
        if (!snapshot.empty) {
          const map = new Map<string, GalleryItem>()
          const defaults = withIds(defaultGallery)
          // 1. Seed baseline gallery
          defaults.forEach((g) => map.set(g.id || g.title, g))
          // 2. Overlay Firestore documents (custom uploaded photos take priority)
          snapshot.forEach((snap) => {
            const data = snap.data() as GalleryItem
            if (data) {
              const key = data.id || data.title
              map.set(key, data)
            }
          })
          const merged = Array.from(map.values())
          setList(merged)
          saveLocalGallery(merged)
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

// =========================================================================
// 3. EXPERIENCES STORAGE
// =========================================================================

export function getStoredExperiences(): Experience[] {
  if (typeof window === 'undefined') return defaultExperiences
  try {
    const raw = window.localStorage.getItem(EXPERIENCES_KEY)
    if (!raw) return defaultExperiences
    const parsed = JSON.parse(raw) as Experience[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultExperiences

    const map = new Map<string, Experience>()
    defaultExperiences.forEach((e) => map.set(e.id, e))
    parsed.forEach((e) => map.set(e.id, e))
    return Array.from(map.values())
  } catch {
    return defaultExperiences
  }
}

export function saveLocalExperiences(list: Experience[]) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(EXPERIENCES_KEY, list, 'gj:experiences-change')
}

export async function upsertExperienceItem(item: Experience): Promise<Experience[]> {
  const current = getStoredExperiences()
  const cleanId = slugifyId(item.id || item.label, 'exp')
  const normalized: Experience = { ...item, id: cleanId }

  const idx = current.findIndex((e) => e.id === cleanId)
  const next = idx >= 0
    ? current.map((e, i) => (i === idx ? normalized : e))
    : [...current, normalized]

  saveLocalExperiences(next)

  try {
    await setDoc(doc(db, 'experiences', cleanId), normalized)
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, `experiences/${cleanId}`)
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
    logFirestoreError(err, OperationType.DELETE, `experiences/${id}`)
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
          const map = new Map<string, Experience>()
          defaultExperiences.forEach((e) => map.set(e.id, e))
          snapshot.forEach((snap) => {
            const data = snap.data() as Experience
            if (data && data.id) {
              map.set(data.id, data)
            }
          })
          const merged = Array.from(map.values())
          setList(merged)
          saveLocalExperiences(merged)
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
