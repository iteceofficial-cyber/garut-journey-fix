import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'

export type PaymentStatus = 'Menunggu Konfirmasi' | 'Lunas' | 'Selesai' | 'Dibatalkan'

export type PaymentMethod =
  | 'QRIS'
  | 'Transfer Bank BCA'
  | 'Transfer Bank Mandiri'
  | 'Transfer Bank BRI'
  | 'GoPay'
  | 'Dana'
  | 'OVO'

export interface Booking {
  id: string // e.g. GJ-2610-8492
  createdAt: string // ISO date
  fullName: string
  email: string
  whatsapp: string
  arrivalDate: string // Tanggal kedatangan ke Garut
  travelDate: string // Tanggal pelaksanaan trip
  meetingTime: string // Pilihan jam pertemuan di meeting point
  meetingPoint: string // Lokasi titik kumpul
  travelers: number
  packageOrTour: string
  totalPrice: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  notes?: string
}

const STORAGE_KEY = 'garut_journey_bookings_v2'
const CHANGE_EVENT = 'garut_bookings_updated'

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'GJ-2610-9182',
    createdAt: '2026-10-02T14:30:00Z',
    fullName: 'Rizky Pratama',
    email: 'rizky.p@gmail.com',
    whatsapp: '081289172635',
    arrivalDate: '2026-10-18',
    travelDate: '2026-10-18',
    meetingTime: '07:30 WIB',
    meetingPoint: 'Stasiun Kereta Api Garut (KAI)',
    travelers: 4,
    packageOrTour: 'Garut One-Day City Tour',
    totalPrice: 1400000,
    paymentMethod: 'Transfer Bank BCA',
    paymentStatus: 'Menunggu Konfirmasi',
    notes: 'Mohon jemput di pintu barat Stasiun Garut.',
  },
  {
    id: 'GJ-2610-8451',
    createdAt: '2026-10-01T09:15:00Z',
    fullName: 'Siti Nurhaliza',
    email: 'siti.nur@yahoo.com',
    whatsapp: '085718293041',
    arrivalDate: '2026-10-24',
    travelDate: '2026-10-24',
    meetingTime: '06:00 WIB',
    meetingPoint: 'Hotel / Villa Penginapan Garut',
    travelers: 2,
    packageOrTour: 'Papandayan Volcano & Highland Trek',
    totalPrice: 900000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    notes: 'Paket termasuk guide pendakian ke Hutan Mati.',
  },
]

export function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Failed to get stored bookings:', err)
  }
  return INITIAL_BOOKINGS
}

export function saveLocalBookings(bookings: Booking[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: bookings }))
  } catch (err) {
    console.error('Failed to update local cache:', err)
  }
}

export async function saveBooking(booking: Booking): Promise<boolean> {
  // 1. Immediately update local cache for instant UI feedback
  const current = getStoredBookings()
  const updated = [booking, ...current.filter((b) => b.id !== booking.id)]
  saveLocalBookings(updated)

  // 2. Persist to Firestore
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking)
    return true
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `bookings/${booking.id}`)
    return false
  }
}

export async function updateBookingStatus(id: string, status: PaymentStatus): Promise<boolean> {
  const current = getStoredBookings()
  const updated = current.map((b) => (b.id === id ? { ...b, paymentStatus: status } : b))
  saveLocalBookings(updated)

  try {
    await updateDoc(doc(db, 'bookings', id), { paymentStatus: status })
    return true
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `bookings/${id}`)
    return false
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  const current = getStoredBookings()
  const updated = current.filter((b) => b.id !== id)
  saveLocalBookings(updated)

  try {
    await deleteDoc(doc(db, 'bookings', id))
    return true
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `bookings/${id}`)
    return false
  }
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings())

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Listen for local events
    const localHandler = () => setBookings(getStoredBookings())
    window.addEventListener(CHANGE_EVENT, localHandler)
    window.addEventListener('storage', localHandler)

    // 2. Listen for real-time Firestore sync across all devices & links
    const unsub = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Booking[] = []
          snapshot.forEach((docSnap) => {
            remoteList.push(docSnap.data() as Booking)
          })
          // Sort by creation date descending
          remoteList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          setBookings(remoteList)
          saveLocalBookings(remoteList)
        } else {
          // If Firestore is completely fresh, seed with default bookings
          INITIAL_BOOKINGS.forEach((b) => {
            setDoc(doc(db, 'bookings', b.id), b).catch(() => {})
          })
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'bookings')
      }
    )

    return () => {
      window.removeEventListener(CHANGE_EVENT, localHandler)
      window.removeEventListener('storage', localHandler)
      unsub()
    }
  }, [])

  return {
    bookings,
    addBooking: saveBooking,
    updateStatus: updateBookingStatus,
    removeBooking: deleteBooking,
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}
