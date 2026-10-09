import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'
import { testimonials as defaultTestimonials, type Testimonial } from '@/data/testimonials'

const STORAGE_KEY = 'gj:testimonials:v1'

const TONES = [
  'bg-forest text-cream',
  'bg-ember text-white',
  'bg-leaf text-cream',
  'bg-ink text-cream',
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'GJ'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getRandomTone(seed = 0): string {
  return TONES[Math.abs(seed) % TONES.length]
}

export function getStoredTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') return defaultTestimonials
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultTestimonials
    const parsed = JSON.parse(raw) as Testimonial[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultTestimonials
  } catch {
    return defaultTestimonials
  }
}

export function saveLocalTestimonials(list: Testimonial[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:testimonials-change'))
  } catch {
    // ignore
  }
}

export async function upsertTestimonial(item: Testimonial): Promise<Testimonial[]> {
  const current = getStoredTestimonials()
  const id = item.id || `rev-${Date.now()}`
  const normalized: Testimonial = {
    ...item,
    id,
    initials: item.initials?.trim() || getInitials(item.name),
    tone: item.tone?.trim() || getRandomTone(current.length),
  }
  const idx = current.findIndex((t) => t.id === id)
  const next = idx >= 0 ? current.map((t, i) => (i === idx ? normalized : t)) : [normalized, ...current]
  saveLocalTestimonials(next)

  try {
    await setDoc(doc(db, 'testimonials', id), normalized)
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `testimonials/${id}`)
  }
  return next
}

export async function deleteTestimonial(id: string): Promise<Testimonial[]> {
  const current = getStoredTestimonials()
  const next = current.filter((t, idx) => (t.id || `rev-${idx}`) !== id)
  saveLocalTestimonials(next)

  try {
    await deleteDoc(doc(db, 'testimonials', id))
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `testimonials/${id}`)
  }
  return next
}

export function resetTestimonialsToDefault(): Testimonial[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('gj:testimonials-change'))
  }
  return defaultTestimonials
}

export function useTestimonials(): Testimonial[] {
  const [list, setList] = useState<Testimonial[]>(() => getStoredTestimonials())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sync = () => setList(getStoredTestimonials())
    window.addEventListener('gj:testimonials-change', sync)
    window.addEventListener('storage', sync)

    const unsub = onSnapshot(
      collection(db, 'testimonials'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Testimonial[] = []
          snapshot.forEach((snap) => remoteList.push(snap.data() as Testimonial))
          setList(remoteList)
          saveLocalTestimonials(remoteList)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'testimonials')
      }
    )

    return () => {
      window.removeEventListener('gj:testimonials-change', sync)
      window.removeEventListener('storage', sync)
      unsub()
    }
  }, [])

  return list
}
