import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  Home,
  Loader2,
  MessageCircle,
  Printer,
  QrCode,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  formatRupiah,
  getStoredBookings,
  INITIAL_BOOKINGS,
  type Booking,
} from '@/lib/bookingsStorage'
import { COMPANY_PROFILE } from '@/data/company'
import { angkaKeTerbilang } from '@/lib/terbilang'
import { whatsappLink } from '@/data/site'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const Route = createFileRoute('/kwitansi/$id')({
  component: KwitansiDetailPage,
})

function KwitansiDetailPage() {
  const { id } = Route.useParams()
  const cleanId = id.trim()
  const rawId = cleanId.replace(/^KW-/i, '')

  const [booking, setBooking] = useState<Booking | null>(() => {
    const list = getStoredBookings()
    return (
      list.find((b) => b.id.toLowerCase() === rawId.toLowerCase() || b.id.toLowerCase() === cleanId.toLowerCase()) ||
      INITIAL_BOOKINGS.find((b) => b.id.toLowerCase() === rawId.toLowerCase() || b.id.toLowerCase() === cleanId.toLowerCase()) ||
      null
    )
  })
  const [loading, setLoading] = useState(() => !booking)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchId, setSearchId] = useState('')
  const [allBookings, setAllBookings] = useState<Booking[]>(() => getStoredBookings())

  useEffect(() => {
    let isMounted = true

    async function loadBooking() {
      setLoading(true)
      const cleanId = id.trim()
      const rawId = cleanId.replace(/^KW-/i, '')

      // 1. Check local cache first for instant initial display
      const list = getStoredBookings()
      setAllBookings(list)
      const localFound =
        list.find((b) => b.id.toLowerCase() === rawId.toLowerCase() || b.id.toLowerCase() === cleanId.toLowerCase()) ||
        INITIAL_BOOKINGS.find((b) => b.id.toLowerCase() === rawId.toLowerCase() || b.id.toLowerCase() === cleanId.toLowerCase())
      
      if (localFound && isMounted) {
        setBooking(localFound)
      }

      // 2. Query Firestore directly (accessible by any client without login)
      try {
        // Direct document lookup with rawId
        const docRef = doc(db, 'bookings', rawId)
        const snap = await getDoc(docRef)
        if (snap.exists() && isMounted) {
          setBooking(snap.data() as Booking)
          setLoading(false)
          return
        }

        // Direct document lookup with cleanId
        if (cleanId !== rawId) {
          const docRefClean = doc(db, 'bookings', cleanId)
          const snapClean = await getDoc(docRefClean)
          if (snapClean.exists() && isMounted) {
            setBooking(snapClean.data() as Booking)
            setLoading(false)
            return
          }
        }

        // Fallback: search all bookings collection (case-insensitive or partial match)
        const colSnap = await getDocs(collection(db, 'bookings'))
        if (!colSnap.empty && isMounted) {
          let matched: Booking | null = null
          colSnap.forEach((d) => {
            const data = d.data() as Booking
            if (
              data.id?.toLowerCase() === rawId.toLowerCase() ||
              data.id?.toLowerCase() === cleanId.toLowerCase() ||
              data.id?.toLowerCase().includes(rawId.toLowerCase())
            ) {
              matched = data
            }
          })
          if (matched) {
            setBooking(matched)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Firestore fetch notice:', err)
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    loadBooking()

    return () => {
      isMounted = false
    }
  }, [id])

  const p = COMPANY_PROFILE

  const handleDownloadPdf = async () => {
    if (typeof window === 'undefined' || !booking) return
    setDownloadingPdf(true)
    try {
      const element = document.getElementById('kwitansi-print-area')
      if (!element) throw new Error('Elemen kwitansi tidak ditemukan')

      // Capture at 2x scale for sharp, high-res text
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth() // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight() // 297mm
      const margin = 10
      const maxContentWidth = pageWidth - margin * 2
      const maxContentHeight = pageHeight - margin * 2

      const imgWidth = maxContentWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (imgHeight <= maxContentHeight) {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST')
      } else {
        const scale = maxContentHeight / imgHeight
        const fitWidth = imgWidth * scale
        const fitHeight = imgHeight * scale
        const xOffset = margin + (maxContentWidth - fitWidth) / 2
        pdf.addImage(imgData, 'PNG', xOffset, margin, fitWidth, fitHeight, undefined, 'FAST')
      }

      pdf.save(`Kwitansi-${booking.id}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
      // Fallback to print if canvas generation fails
      window.print()
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (loading && !booking) {
    return (
      <div className="min-h-screen bg-cream py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lift text-center border border-ink/5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-forest/10 text-forest mx-auto mb-4 animate-spin">
            <Loader2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Memuat Kwitansi Resmi...</h1>
          <p className="mt-2 text-xs text-ink/65">
            Menghubungkan ke sistem reservasi Garut Journey untuk kode booking <strong className="font-mono text-ember">#{id}</strong>.
          </p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-cream py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lift text-center border border-ink/5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-forest/10 text-forest mx-auto mb-4">
            <FileCheck className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Kwitansi Tidak Ditemukan</h1>
          <p className="mt-2 text-xs sm:text-sm text-ink/65">
            Nomor booking/kwitansi <strong className="font-mono text-ember">#{id}</strong> belum terdaftar atau telah diarsipkan.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchId.trim()) {
                window.location.href = `/kwitansi/${encodeURIComponent(searchId.trim())}`
              }
            }}
            className="mt-6 flex items-center gap-2"
          >
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Masukkan kode booking (mis: GJ-2610-8451)"
              className="flex-1 rounded-xl border border-ink/15 px-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
            />
            <button
              type="submit"
              className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest-700 transition"
            >
              Cari
            </button>
          </form>

          {allBookings.length > 0 && (
            <div className="mt-6 pt-6 border-t border-ink/10 text-left">
              <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">
                Atau lihat contoh kwitansi terdaftar:
              </p>
              <div className="space-y-1.5">
                {allBookings.slice(0, 3).map((b) => (
                  <Link
                    key={b.id}
                    to="/kwitansi/$id"
                    params={{ id: b.id }}
                    className="block rounded-lg bg-cream/60 p-2 text-xs hover:bg-cream transition font-medium text-ink flex items-center justify-between"
                  >
                    <span>{b.id} — {b.fullName}</span>
                    <span className="font-bold text-forest">{formatRupiah(b.totalPrice)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-ember transition"
            >
              <Home className="h-4 w-4" /> Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const receiptNo = `KW-${booking.id}`
  const formattedDate = new Date(booking.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const terbilangRupiah = angkaKeTerbilang(booking.totalPrice)
  const isPaid = booking.paymentStatus === 'Lunas' || booking.paymentStatus === 'Selesai'

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 px-3 sm:px-6">
      {/* Top Action Bar (Hidden on Print & PDF Export) */}
      <div className="mx-auto max-w-3xl mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-forest shadow-soft hover:bg-cream-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Real PDF Button */}
          <button
            type="button"
            disabled={downloadingPdf}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-forest-700 transition disabled:opacity-60 cursor-pointer"
            title="Unduh kwitansi resmi sebagai file PDF"
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyiapkan PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-soft hover:bg-cream-200 transition"
            title="Cetak langsung ke printer atau dialog print browser"
          >
            <Printer className="h-3.5 w-3.5 text-forest" />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-soft hover:bg-cream-200 transition"
            title="Salin link kwitansi untuk dibagikan ke client (tanpa login)"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
          </button>

          <a
            href={whatsappLink(
              `Halo Admin Garut Journey! Saya telah mengunduh kwitansi bukti pembayaran resmi dengan no: ${receiptNo} atas nama ${booking.fullName}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-soft hover:bg-[#1ebd59] transition"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Konfirmasi Admin WA</span>
          </a>
        </div>
      </div>

      {/* Main Kwitansi Document (No bulky header, clean receipt document) */}
      <main
        id="kwitansi-print-area"
        className="mx-auto max-w-3xl bg-white rounded-3xl p-6 sm:p-10 shadow-lift border border-ink/10 relative overflow-hidden text-ink print:border-none print:shadow-none print:p-0 print:rounded-none"
      >
        {/* Security Watermark for Paid */}
        {isPaid && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center select-none opacity-[0.035] -rotate-12 z-0">
            <span className="font-display text-[10rem] font-black uppercase text-emerald-800">
              LUNAS
            </span>
          </div>
        )}

        <div className="relative z-10">
          {/* Kwitansi Title & Meta (Header removed per request, replaced with clean brand badge & receipt meta) */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-forest px-2 py-0.5 font-display text-xs font-black text-cream">GJ</span>
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-forest">Garut Journey</span>
                <span className="text-ink/30">•</span>
                <span className="text-[0.68rem] text-ink/50 uppercase tracking-wider">{p.legalName}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1.5 tracking-tight">
                KWITANSI PEMBAYARAN LUNAS
              </h1>
              <p className="text-xs text-ink/50 mt-0.5">Official Payment Receipt &bull; Garut City Tour</p>
            </div>

            <div className="rounded-2xl bg-cream/70 p-3.5 sm:p-4 border border-ink/5 sm:text-right shrink-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-ink/50">Nomor Kwitansi</p>
              <p className="font-mono text-base sm:text-lg font-bold text-forest">{receiptNo}</p>
              <p className="text-[0.7rem] text-ink/60 mt-0.5">Tanggal: {formattedDate}</p>
            </div>
          </div>

          {/* Verification Stamp Banner */}
          <div className="mb-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white shrink-0 shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-950 uppercase tracking-wide">
                    Status: {booking.paymentStatus}
                  </span>
                  <span className="rounded bg-emerald-200 px-2 py-0.5 text-[0.65rem] font-black text-emerald-800 uppercase">
                    Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  Pembayaran telah sah diterima dan dialokasikan untuk pemesanan paket wisata Anda.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[0.7rem] text-emerald-900/60 font-semibold uppercase">Metode Pembayaran</span>
              <p className="text-xs font-bold text-emerald-950">{booking.paymentMethod}</p>
            </div>
          </div>

          {/* Details Table Grid */}
          <div className="space-y-4 rounded-2xl bg-white border border-ink/10 p-5 sm:p-6 shadow-soft">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-baseline border-b border-ink/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Telah Diterima Dari</span>
              <div>
                <p className="text-base font-bold text-ink">{booking.fullName}</p>
                <p className="text-xs text-ink/60">{booking.whatsapp} · {booking.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-baseline border-b border-ink/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Uang Sejumlah</span>
              <div>
                <p className="font-display text-2xl font-bold text-forest">
                  {formatRupiah(booking.totalPrice)}
                </p>
                <div className="mt-1 rounded-xl bg-cream px-3 py-1.5 border border-ink/5 text-xs font-semibold italic text-ink/80">
                  &ldquo;{terbilangRupiah}&rdquo;
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-baseline border-b border-ink/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Untuk Pembayaran</span>
              <div>
                <p className="text-sm font-bold text-ink">{booking.packageOrTour}</p>
                <p className="text-xs text-ink/65 mt-0.5">
                  Jumlah Peserta: <strong className="text-ink">{booking.travelers} Orang</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-baseline border-b border-ink/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Tanggal Pelaksanaan</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink/50">Tanggal Trip:</span>
                  <p className="font-bold text-ink">{booking.travelDate || booking.arrivalDate}</p>
                </div>
                <div>
                  <span className="text-ink/50">Waktu &amp; Titik Kumpul:</span>
                  <p className="font-bold text-ink">
                    {booking.meetingTime} @ {booking.meetingPoint}
                  </p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Catatan Khusus</span>
                <p className="text-xs text-ink/75 italic bg-cream/40 p-2.5 rounded-xl border border-ink/5">
                  &ldquo;{booking.notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Footer Signatures & QR Code Verification */}
          <footer className="mt-8 pt-6 border-t border-ink/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* QR Code Security Stamp */}
            <div className="flex items-center gap-3">
              <div className="grid h-20 w-20 place-items-center rounded-xl bg-ink/5 border border-ink/10 p-2 shrink-0">
                <QrCode className="h-16 w-16 text-forest" />
              </div>
              <div className="text-[0.68rem] text-ink/60 leading-tight">
                <span className="font-bold text-ink block mb-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest" /> Validasi QR
                </span>
                Scan untuk memverifikasi keaslian kwitansi di sistem online Garut Journey.
              </div>
            </div>

            {/* Terms note */}
            <div className="text-[0.68rem] text-ink/50 leading-relaxed sm:text-center">
              Dokumen ini diterbitkan secara sah dan otomatis oleh sistem reservasi Garut Journey. Tidak memerlukan stempel fisik tambahan.
            </div>

            {/* Official Signature Box */}
            <div className="text-left sm:text-right">
              <p className="text-[0.7rem] text-ink/60">Garut, {formattedDate}</p>
              <p className="text-[0.72rem] font-bold text-forest mt-0.5">
                {p.legalName}
              </p>

              {/* Digital Stamp Simulation */}
              <div className="my-2 inline-flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-600/40 bg-emerald-50/50 px-4 py-2">
                <span className="text-[0.65rem] font-black tracking-widest text-emerald-800 uppercase">
                  VERIFIED DIGITAL SIGNATURE
                </span>
                <span className="font-mono text-[0.6rem] text-emerald-700/80">
                  REF: {booking.id}-SEC-VAL
                </span>
              </div>

              <p className="text-xs font-bold text-ink underline">Bagian Keuangan &amp; Kasir</p>
              <p className="text-[0.65rem] text-ink/50">Finance Directorate Garut Journey</p>
            </div>
          </footer>
        </div>
      </main>

      {/* Download Info Banner */}
      <div className="mx-auto max-w-3xl mt-6 rounded-2xl bg-white/80 p-4 border border-ink/10 text-center text-xs text-ink/60 print:hidden">
        📄 <strong className="text-ink">Informasi Kwitansi:</strong> Anda dapat mengunduh kwitansi resmi sebagai file PDF secara instan dengan mengklik tombol <strong>&ldquo;Download PDF&rdquo;</strong> di atas tanpa perlu login ke akun apapun.
      </div>
    </div>
  )
}
