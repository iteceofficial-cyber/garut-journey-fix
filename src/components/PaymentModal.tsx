import { useState } from 'react'
import {
  BadgePercent,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  CreditCard,
  FileText,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react'
import { site, whatsappLink } from '@/data/site'
import {
  formatRupiah,
  saveBooking,
  type Booking,
  type PaymentMethod,
  type PaymentType,
} from '@/lib/bookingsStorage'
import { usePaymentSettings } from '@/lib/paymentSettings'
import { useCompanyProfile } from '@/lib/companyStorage'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  bookingData: {
    fullName: string
    email: string
    whatsapp: string
    arrivalDate: string
    travelDate: string
    meetingTime: string
    meetingPoint: string
    travelers: number
    packageOrTour: string
    totalPrice: number
    paymentType?: PaymentType
    notes?: string
  }
  onSuccess?: (booking: Booking) => void
}

export function PaymentModal({ isOpen, onClose, bookingData, onSuccess }: PaymentModalProps) {
  const { config } = usePaymentSettings()
  const { profile } = useCompanyProfile()
  const dpPct = profile.downPaymentPercentage ?? 30
  const dpEnabled = profile.enableDownPayment !== false
  const termsList = profile.termsAndConditions || []

  const [paymentType, setPaymentType] = useState<PaymentType>(
    bookingData.paymentType || (dpEnabled ? 'dp' : 'full')
  )
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('QRIS')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [agreedTerms, setAgreedTerms] = useState(true)
  const [showTermsDetail, setShowTermsDetail] = useState(false)
  const [termsError, setTermsError] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)

  if (!isOpen) return null

  const totalTripPrice = bookingData.totalPrice || 700000
  const dpAmount = Math.round((totalTripPrice * dpPct) / 100)
  const activePayAmount = paymentType === 'dp' ? dpAmount : totalTripPrice
  const remainingAmount = paymentType === 'dp' ? Math.max(0, totalTripPrice - dpAmount) : 0

  // Generate unique booking code
  const bookingCode =
    createdBooking?.id ||
    `GJ-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2500)
  }

  const handleConfirmPayment = () => {
    if (!agreedTerms) {
      setTermsError('Mohon centang persetujuan Syarat & Ketentuan Trip terlebih dahulu sebelum melanjutkan.')
      return
    }
    setTermsError('')

    const arrival = bookingData.arrivalDate || new Date().toISOString().split('T')[0]
    const mTime = bookingData.meetingTime || '08:00 WIB'
    const mPoint = bookingData.meetingPoint || 'Stasiun Kereta Api Garut (KAI)'

    const schemeNote =
      paymentType === 'dp'
        ? `[Skema: Down Payment DP ${dpPct}% = ${formatRupiah(activePayAmount)} | Sisa Pelunasan: ${formatRupiah(remainingAmount)}]`
        : `[Skema: Pembayaran Lunas 100% = ${formatRupiah(totalTripPrice)}]`

    const combinedNotes = [bookingData.notes?.trim(), schemeNote].filter(Boolean).join(' • ')

    const newBooking: Booking = {
      id: bookingCode,
      createdAt: new Date().toISOString(),
      fullName: bookingData.fullName,
      email: bookingData.email,
      whatsapp: bookingData.whatsapp,
      arrivalDate: arrival,
      travelDate: bookingData.travelDate || arrival,
      meetingTime: mTime,
      meetingPoint: mPoint,
      travelers: bookingData.travelers || 2,
      packageOrTour: bookingData.packageOrTour || 'Garut One-Day City Tour',
      totalPrice: totalTripPrice,
      paymentType,
      dpPercentage: paymentType === 'dp' ? dpPct : 100,
      paidAmount: activePayAmount,
      remainingAmount,
      paymentMethod: selectedMethod,
      paymentStatus: 'Menunggu Konfirmasi',
      notes: combinedNotes,
    }

    // Save to localStorage & Firestore -> enters Admin Dashboard
    saveBooking(newBooking)
    setCreatedBooking(newBooking)
    setIsCompleted(true)
    onSuccess?.(newBooking)

    // Build WhatsApp Confirmation Message with Down Payment / Full Payment details
    const paymentSchemeLabel =
      paymentType === 'dp'
        ? `Down Payment (DP ${dpPct}%)`
        : 'Pembayaran Penuh (Lunas 100%)'

    const message = `Halo Admin Garut Journey!

Saya sudah melakukan pembayaran untuk pemesanan tour:
• Kode Booking: *${newBooking.id}*
• Nama: *${newBooking.fullName}*
• WhatsApp: ${newBooking.whatsapp}
• Paket: *${newBooking.packageOrTour}*
• Tanggal Kedatangan: *${newBooking.arrivalDate}*
• Jam Pertemuan: *${newBooking.meetingTime}*
• Titik Kumpul (Meeting Point): *${newBooking.meetingPoint}*
• Jumlah Peserta: ${newBooking.travelers} Orang
• Total Biaya Trip: *${formatRupiah(totalTripPrice)}*
• Jenis Pembayaran: *${paymentSchemeLabel}*
• Nominal Dibayar Sekarang: *${formatRupiah(activePayAmount)}*${
      remainingAmount > 0 ? `\n• Sisa Pelunasan (${100 - dpPct}%): *${formatRupiah(remainingAmount)}*` : ''
    }
• Metode Pembayaran: ${newBooking.paymentMethod}
• Syarat & Ketentuan Trip: *Telah Disetujui*

Berikut saya kirimkan bukti transfer pembayaran. Mohon segera diverifikasi dan dicatat di dashboard. Terima kasih!`

    const waUrl = whatsappLink(message)
    const link = document.createElement('a')
    link.href = waUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white text-ink shadow-2xl overflow-hidden my-auto border border-ink/10">
        {/* Top Header */}
        <div className="bg-forest px-6 py-5 text-cream flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-ember">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold leading-tight">Metode Pembayaran & Konfirmasi</h3>
              <p className="text-xs text-cream/70">Garut Journey Official Payment Gateway</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-cream/60 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isCompleted ? (
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Order Summary Card */}
            <div className="rounded-2xl bg-cream/60 p-4 border border-ink/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink/60">Kode Booking</span>
                <span className="font-mono font-bold text-forest">{bookingCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60">Paket Wisata</span>
                <span className="font-semibold text-ink text-right">{bookingData.packageOrTour}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-forest" />
                  <span>Tanggal Kedatangan</span>
                </span>
                <span className="font-bold text-ink">{bookingData.arrivalDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-forest" />
                  <span>Jam & Titik Temu</span>
                </span>
                <span className="font-medium text-ink text-right">
                  {bookingData.meetingTime} &bull; {bookingData.meetingPoint}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60">Nama & Jumlah</span>
                <span className="font-medium text-ink">
                  {bookingData.fullName} ({bookingData.travelers} Peserta)
                </span>
              </div>
              <div className="border-t border-ink/10 pt-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/75">Total Biaya Trip (100%)</span>
                <span className="font-display text-base font-bold text-ink">
                  {formatRupiah(totalTripPrice)}
                </span>
              </div>
              {paymentType === 'dp' && (
                <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-amber-900 block">
                      Tagihan Down Payment (DP {dpPct}%)
                    </span>
                    <span className="text-[0.65rem] text-amber-800">
                      Sisa pelunasan {100 - dpPct}%: <strong>{formatRupiah(remainingAmount)}</strong> (H-1 / Meeting Point)
                    </span>
                  </div>
                  <span className="font-display text-lg font-bold text-ember">
                    {formatRupiah(activePayAmount)}
                  </span>
                </div>
              )}
              {paymentType === 'full' && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-2.5 flex items-center justify-between">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-emerald-900">
                    Tagihan Pembayaran Lunas (100%)
                  </span>
                  <span className="font-display text-lg font-bold text-forest">
                    {formatRupiah(activePayAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Down Payment (30%) vs Full Payment (100%) Selector */}
            {dpEnabled && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2.5">
                  Pilih Skema Pembayaran Trip
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentType('dp')}
                    className={`rounded-2xl p-3.5 text-left border transition flex flex-col justify-between ${
                      paymentType === 'dp'
                        ? 'border-ember bg-ember/10 text-ink shadow-sm ring-2 ring-ember'
                        : 'border-ink/15 bg-white text-ink/75 hover:bg-cream/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest">
                        <BadgePercent className="h-4 w-4 text-ember" />
                        <span>Down Payment (DP {dpPct}%)</span>
                      </span>
                      <span className="rounded-full bg-ember px-2 py-0.5 text-[0.6rem] font-bold uppercase text-white">
                        Populer
                      </span>
                    </div>
                    <p className="font-display text-lg font-bold text-ember mt-1.5">
                      {formatRupiah(dpAmount)}
                    </p>
                    <p className="text-[0.68rem] text-ink/60 mt-0.5">
                      Amankan jadwal sekarang, sisa {formatRupiah(remainingAmount)} dilunasi H-1 / saat penjemputan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('full')}
                    className={`rounded-2xl p-3.5 text-left border transition flex flex-col justify-between ${
                      paymentType === 'full'
                        ? 'border-forest bg-forest/10 text-ink shadow-sm ring-2 ring-forest'
                        : 'border-ink/15 bg-white text-ink/75 hover:bg-cream/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest">
                        <ShieldCheck className="h-4 w-4 text-forest" />
                        <span>Bayar Lunas (100%)</span>
                      </span>
                      <span className="rounded-full bg-forest/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-forest">
                        Full Payment
                      </span>
                    </div>
                    <p className="font-display text-lg font-bold text-forest mt-1.5">
                      {formatRupiah(totalTripPrice)}
                    </p>
                    <p className="text-[0.68rem] text-ink/60 mt-0.5">
                      Pembayaran penuh 100% di awal tanpa sisa tagihan saat keberangkatan.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-3">
                Pilih Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'QRIS', label: 'QRIS Instant', icon: <QrCode className="h-4 w-4" />, enabled: config.qris.enabled },
                  { id: 'Transfer Bank BCA', label: 'Bank BCA', icon: <CreditCard className="h-4 w-4" />, enabled: config.bca.enabled },
                  { id: 'Transfer Bank Mandiri', label: 'Bank Mandiri', icon: <CreditCard className="h-4 w-4" />, enabled: config.mandiri.enabled },
                  { id: 'Transfer Bank BRI', label: 'Bank BRI', icon: <CreditCard className="h-4 w-4" />, enabled: config.bri.enabled },
                  { id: 'Dana', label: 'DANA', icon: <Smartphone className="h-4 w-4" />, enabled: config.dana.enabled },
                  { id: 'GoPay', label: 'GoPay', icon: <Smartphone className="h-4 w-4" />, enabled: config.gopay.enabled },
                  { id: 'OVO', label: 'OVO', icon: <Smartphone className="h-4 w-4" />, enabled: config.ovo.enabled },
                ]
                  .filter((m) => m.enabled !== false)
                  .map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                      className={`rounded-xl p-2.5 text-xs font-semibold text-center border transition flex flex-col items-center gap-1 ${
                        selectedMethod === m.id
                          ? 'border-forest bg-forest/10 text-forest shadow-sm ring-1 ring-forest'
                          : 'border-ink/15 bg-white text-ink/70 hover:bg-cream/50'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span className="truncate w-full">{m.label}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Payment Details Container */}
            <div className="rounded-2xl border border-ink/15 bg-cream/30 p-5 space-y-4">
              {selectedMethod === 'QRIS' && (
                <div className="text-center space-y-3">
                  <div className="inline-block rounded-xl border border-ink/15 bg-white p-3 shadow-soft">
                    {config.qris.customQrUrl ? (
                      <img
                        src={config.qris.customQrUrl}
                        alt="QRIS Code"
                        className="h-44 w-44 mx-auto object-contain"
                      />
                    ) : (
                      <svg viewBox="0 0 160 160" className="h-44 w-44 mx-auto" aria-label="QRIS Code">
                        <rect width="160" height="160" fill="#ffffff" />
                        <rect x="15" y="15" width="40" height="40" fill="#000000" rx="4" />
                        <rect x="23" y="23" width="24" height="24" fill="#ffffff" rx="2" />
                        <rect x="29" y="29" width="12" height="12" fill="#000000" rx="1" />
                        <rect x="105" y="15" width="40" height="40" fill="#000000" rx="4" />
                        <rect x="113" y="23" width="24" height="24" fill="#ffffff" rx="2" />
                        <rect x="119" y="29" width="12" height="12" fill="#000000" rx="1" />
                        <rect x="15" y="105" width="40" height="40" fill="#000000" rx="4" />
                        <rect x="23" y="113" width="24" height="24" fill="#ffffff" rx="2" />
                        <rect x="29" y="119" width="12" height="12" fill="#000000" rx="1" />
                        <rect x="65" y="65" width="30" height="30" fill="#17231D" rx="6" />
                        <text x="80" y="83" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                          GJ
                        </text>
                        <rect x="65" y="20" width="8" height="25" fill="#000000" />
                        <rect x="80" y="30" width="15" height="8" fill="#000000" />
                        <rect x="20" y="65" width="25" height="8" fill="#000000" />
                        <rect x="30" y="80" width="8" height="15" fill="#000000" />
                        <rect x="110" y="65" width="25" height="8" fill="#000000" />
                        <rect x="125" y="80" width="8" height="15" fill="#000000" />
                        <rect x="65" y="110" width="8" height="25" fill="#000000" />
                        <rect x="80" y="125" width="15" height="8" fill="#000000" />
                      </svg>
                    )}
                    <p className="mt-1 text-[0.65rem] font-bold text-ink/60 uppercase tracking-widest">
                      {config.qris.qrisName}
                    </p>
                  </div>
                  <p className="text-xs text-ink/70">
                    {config.qris.instructions}
                  </p>
                </div>
              )}

              {selectedMethod === 'Transfer Bank BCA' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink/60">Bank Penerima</span>
                    <span className="font-bold text-ink">{config.bca.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-ink/10">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/40">Nomor Rekening</span>
                      <p className="font-mono text-base font-bold text-forest">{config.bca.accountNumber}</p>
                      <span className="text-xs text-ink/60">a.n. {config.bca.accountHolder}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.bca.accountNumber.replace(/\D/g, ''), 'bca')}
                      className="inline-flex items-center gap-1 rounded-lg bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
                    >
                      {copiedField === 'bca' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'bca' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'Transfer Bank Mandiri' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink/60">Bank Penerima</span>
                    <span className="font-bold text-ink">{config.mandiri.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-ink/10">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/40">Nomor Rekening</span>
                      <p className="font-mono text-base font-bold text-forest">{config.mandiri.accountNumber}</p>
                      <span className="text-xs text-ink/60">a.n. {config.mandiri.accountHolder}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.mandiri.accountNumber.replace(/\D/g, ''), 'mandiri')}
                      className="inline-flex items-center gap-1 rounded-lg bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
                    >
                      {copiedField === 'mandiri' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'mandiri' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'Transfer Bank BRI' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink/60">Bank Penerima</span>
                    <span className="font-bold text-ink">{config.bri.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-ink/10">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/40">Nomor Rekening</span>
                      <p className="font-mono text-base font-bold text-forest">{config.bri.accountNumber}</p>
                      <span className="text-xs text-ink/60">a.n. {config.bri.accountHolder}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.bri.accountNumber.replace(/\D/g, ''), 'bri')}
                      className="inline-flex items-center gap-1 rounded-lg bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
                    >
                      {copiedField === 'bri' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'bri' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {(selectedMethod === 'Dana' || selectedMethod === 'GoPay' || selectedMethod === 'OVO') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink/60">E-Wallet Target</span>
                    <span className="font-bold text-ink">{selectedMethod}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-ink/10">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/40">Nomor Ponsel E-Wallet</span>
                      <p className="font-mono text-base font-bold text-forest">
                        {selectedMethod === 'Dana'
                          ? config.dana.phoneNumber
                          : selectedMethod === 'GoPay'
                          ? config.gopay.phoneNumber
                          : config.ovo.phoneNumber}
                      </p>
                      <span className="text-xs text-ink/60">
                        a.n.{' '}
                        {selectedMethod === 'Dana'
                          ? config.dana.accountHolder
                          : selectedMethod === 'GoPay'
                          ? config.gopay.accountHolder
                          : config.ovo.accountHolder}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const num =
                          selectedMethod === 'Dana'
                            ? config.dana.phoneNumber
                            : selectedMethod === 'GoPay'
                            ? config.gopay.phoneNumber
                            : config.ovo.phoneNumber
                        handleCopy(num.replace(/\D/g, ''), 'ewallet')
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
                    >
                      {copiedField === 'ewallet' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'ewallet' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Amount to transfer copyable */}
              <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-xs">
                <div>
                  <span className="text-ink/60">
                    {paymentType === 'dp'
                      ? `Nominal Transfer Saat Ini (DP ${dpPct}%):`
                      : 'Nominal Transfer Saat Ini (Lunas 100%):'}
                  </span>
                  <p className="font-mono font-bold text-base text-ember">{formatRupiah(activePayAmount)}</p>
                  {paymentType === 'dp' && (
                    <span className="text-[0.68rem] text-ink/55">
                      Total Trip: {formatRupiah(totalTripPrice)} &bull; Sisa Pelunasan: {formatRupiah(remainingAmount)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(String(activePayAmount), 'nominal')}
                  className="inline-flex items-center gap-1 rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/75 hover:bg-ink/10 transition"
                >
                  {copiedField === 'nominal' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedField === 'nominal' ? 'Tersalin' : 'Salin Nominal'}</span>
                </button>
              </div>
            </div>

            {/* Syarat & Ketentuan Trip (Editable by Admin) */}
            {termsList.length > 0 && (
              <div className="rounded-2xl border border-ink/15 bg-cream/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-forest">
                    <FileText className="h-4 w-4 text-ember" />
                    <span>Syarat &amp; Ketentuan Trip Garut Journey</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTermsDetail((v) => !v)}
                    className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-ember hover:underline"
                  >
                    <span>{showTermsDetail ? 'Sembunyikan' : 'Baca Lengkap'}</span>
                    {showTermsDetail ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {showTermsDetail ? (
                  <ol className="list-decimal pl-4 space-y-1.5 text-[0.72rem] text-ink/75 leading-relaxed max-h-40 overflow-y-auto pr-1">
                    {termsList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-[0.7rem] text-ink/65 line-clamp-2">
                    1. {termsList[0]} {termsList[1] ? `2. ${termsList[1]}` : ''}
                  </p>
                )}

                <label className="flex items-start gap-2.5 pt-2 border-t border-ink/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked)
                      if (e.target.checked) setTermsError('')
                    }}
                    className="mt-0.5 h-4 w-4 rounded text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-ink/85">
                    Saya telah membaca dan menyetujui <strong>Syarat &amp; Ketentuan Trip</strong> serta kebijakan pembayaran{' '}
                    {paymentType === 'dp' ? `Down Payment (DP ${dpPct}%)` : 'Full Payment (100%)'}.
                  </span>
                </label>

                {termsError && (
                  <p className="text-xs font-semibold text-rose-600">{termsError}</p>
                )}
              </div>
            )}

            {/* Instruction Notice */}
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900">
              <Clock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <p>
                Setelah melakukan transfer atau scan QRIS sebesar <strong>{formatRupiah(activePayAmount)}</strong>, klik tombol di bawah untuk diarahkan ke <strong>WhatsApp Admin ({site.whatsapp})</strong> untuk mengirimkan bukti transfer pembayaran.
              </p>
            </div>

            {/* Main CTA */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 px-6 text-sm font-bold uppercase tracking-wider text-white shadow-soft hover:bg-[#1ebd59] transition"
            >
              <MessageCircle className="h-5 w-5" />
              <span>
                Konfirmasi {paymentType === 'dp' ? `DP ${dpPct}% (${formatRupiah(activePayAmount)})` : `Lunas (${formatRupiah(activePayAmount)})`} ke WhatsApp
              </span>
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Pemesanan Berhasil Dicatat!
              </span>
              <h3 className="font-display text-2xl font-bold text-forest mt-1">Data Booking Masuk ke Dashboard</h3>
              <p className="mt-2 text-xs text-ink/65 max-w-md mx-auto">
                Data booking Anda telah tersimpan di sistem dengan Kode Booking:{' '}
                <strong className="text-ink font-mono">{createdBooking?.id}</strong>.
              </p>
            </div>

            <div className="rounded-2xl bg-cream/70 p-4 border border-ink/10 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-ink/60">Tanggal Kedatangan:</span>
                <span className="font-bold text-forest">{createdBooking?.arrivalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Jam Pertemuan:</span>
                <span className="font-bold text-ink">{createdBooking?.meetingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Meeting Point:</span>
                <span className="font-medium text-ink">{createdBooking?.meetingPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Skema Pembayaran:</span>
                <span className="font-bold text-forest">
                  {createdBooking?.paymentType === 'dp'
                    ? `Down Payment (DP ${createdBooking.dpPercentage || dpPct}%)`
                    : 'Pembayaran Penuh (100%)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Total Biaya Trip:</span>
                <span className="font-semibold text-ink">{formatRupiah(createdBooking?.totalPrice || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Nominal Dibayar Sekarang:</span>
                <span className="font-bold text-ember">
                  {formatRupiah(createdBooking?.paidAmount || createdBooking?.totalPrice || 0)}
                </span>
              </div>
              {(createdBooking?.remainingAmount || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-ink/60">Sisa Pelunasan:</span>
                  <span className="font-bold text-amber-700">
                    {formatRupiah(createdBooking?.remainingAmount || 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink/60">Status Pembayaran:</span>
                <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Menunggu Konfirmasi</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(
                  `Halo Admin Garut Journey! Saya ingin konfirmasi pembayaran untuk booking kode ${createdBooking?.id} (${createdBooking?.fullName} - ${createdBooking?.packageOrTour} - Kedatangan: ${createdBooking?.arrivalDate} jam ${createdBooking?.meetingTime}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-[#1ebd59] transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Buka WhatsApp Admin ({site.whatsapp})</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-ink/20 px-6 py-3.5 text-xs font-semibold text-ink/75 hover:bg-ink/5 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
