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

    const defaultIds = new Set(defaultDishes.map((d) => d.id))
    const customItems: Dish[] = []
    const updatedDefaultsMap = new Map<string, Dish>()

    parsed.forEach((item) => {
      const key = item.id || item.name
      if (defaultIds.has(key)) {
        updatedDefaultsMap.set(key, item)
      } else {
        customItems.push(item)
      }
    })

    const finalDefaults = defaultDishes.map((d) => updatedDefaultsMap.get(d.id) || d)
    // Custom dishes are placed at the FRONT so newly uploaded culinary items appear first!
    return [...customItems, ...finalDefaults]
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

  // Prepend so new items are immediately at the top
  const filtered = current.filter((c) => c.id !== cleanId && c.name !== normalized.name)
  const next = [normalized, ...filtered]

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
  const next = current.filter((c) => c.id !== id && c.name !== id)
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
        const defaultIds = new Set(defaultDishes.map((d) => d.id))
        const local = getStoredCulinary()
        const localCustoms = local.filter((d) => !defaultIds.has(d.id))

        const remoteMap = new Map<string, Dish>()
        snapshot.forEach((snap) => {
          const data = snap.data() as Dish
          if (data && data.id) {
            remoteMap.set(data.id, data)
          }
        })

        // Merge: local customs first (preserves immediate uploads), then remote customs
        const customMap = new Map<string, Dish>()
        localCustoms.forEach((c) => customMap.set(c.id, c))
        remoteMap.forEach((r, key) => {
          if (!defaultIds.has(key)) {
            if (!customMap.has(key)) {
              customMap.set(key, r)
            }
          }
        })

        const finalDefaults = defaultDishes.map((d) => remoteMap.get(d.id) || d)
        const merged = [...Array.from(customMap.values()), ...finalDefaults]

        setList(merged)
        saveLocalCulinary(merged)
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

    const defaultIds = new Set(defaults.map((d) => d.id))
    const customItems: GalleryItem[] = []
    const updatedDefaultsMap = new Map<string, GalleryItem>()

    parsed.forEach((item) => {
      const key = item.id || item.title
      if (defaultIds.has(key)) {
        updatedDefaultsMap.set(key, item)
      } else {
        customItems.push(item)
      }
    })

    const finalDefaults = defaults.map((d) => updatedDefaultsMap.get(d.id!) || d)
    // Custom/uploaded items appear FIRST at the beginning of the gallery
    return [...customItems, ...finalDefaults]
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

  // Prepend to front so new photos are instantly visible at the very top of the gallery!
  const filtered = current.filter((g) => g.id !== cleanId && g.title !== normalized.title)
  const next = [normalized, ...filtered]

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
        const defaults = withIds(defaultGallery)
        const defaultIds = new Set(defaults.map((d) => d.id))

        // Preserve local custom uploads so recent uploads are never lost
        const local = getStoredGallery()
        const localCustoms = local.filter((item) => !defaultIds.has(item.id))

        const remoteMap = new Map<string, GalleryItem>()
        snapshot.forEach((snap) => {
          const data = snap.data() as GalleryItem
          if (data) {
            const key = data.id || data.title
            remoteMap.set(key, data)
          }
        })

        // Merge custom items: local first (most immediate), then remote
        const customMap = new Map<string, GalleryItem>()
        localCustoms.forEach((c) => customMap.set(c.id || c.title, c))
        remoteMap.forEach((r, key) => {
          if (!defaultIds.has(key)) {
            if (!customMap.has(key)) {
              customMap.set(key, r)
            }
          }
        })

        const finalDefaults = defaults.map((d) => remoteMap.get(d.id!) || d)
        const merged = [...Array.from(customMap.values()), ...finalDefaults]

        setList(merged)
        saveLocalGallery(merged)
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

    const defaultIds = new Set(defaultExperiences.map((e) => e.id))
    const customItems: Experience[] = []
    const updatedDefaultsMap = new Map<string, Experience>()

    parsed.forEach((item) => {
      if (defaultIds.has(item.id)) {
        updatedDefaultsMap.set(item.id, item)
      } else {
        customItems.push(item)
      }
    })

    const finalDefaults = defaultExperiences.map((e) => updatedDefaultsMap.get(e.id) || e)
    return [...customItems, ...finalDefaults]
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

  const filtered = current.filter((e) => e.id !== cleanId && e.label !== normalized.label)
  const next = [normalized, ...filtered]
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
  const next = current.filter((e) => e.id !== id && e.label !== id)
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
        const defaultIds = new Set(defaultExperiences.map((e) => e.id))
        const local = getStoredExperiences()
        const localCustoms = local.filter((e) => !defaultIds.has(e.id))

        const remoteMap = new Map<string, Experience>()
        snapshot.forEach((snap) => {
          const data = snap.data() as Experience
          if (data && data.id) {
            remoteMap.set(data.id, data)
          }
        })

        const customMap = new Map<string, Experience>()
        localCustoms.forEach((c) => customMap.set(c.id, c))
        remoteMap.forEach((r, key) => {
          if (!defaultIds.has(key)) {
            if (!customMap.has(key)) {
              customMap.set(key, r)
            }
          }
        })

        const finalDefaults = defaultExperiences.map((e) => remoteMap.get(e.id) || e)
        const merged = [...Array.from(customMap.values()), ...finalDefaults]

        setList(merged)
        saveLocalExperiences(merged)
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
