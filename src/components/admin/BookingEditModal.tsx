import { useState, useEffect } from 'react'
import { Check, User, X, ShoppingBag, Phone, Mail } from 'lucide-react'
import {
  type Booking,
  type PaymentMethod,
  type PaymentStatus,
  type PaymentType,
  formatRupiah,
} from '@/lib/bookingsStorage'

interface BookingEditModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  booking: Booking | null
  tourOptions: string[]
  onSave: (booking: Booking) => void
  onClose: () => void
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'Transfer Bank BCA',
  'Transfer Bank Mandiri',
  'Transfer Bank BRI',
  'QRIS',
  'GoPay',
  'Dana',
  'OVO',
]

const PAYMENT_STATUSES: PaymentStatus[] = [
  'Menunggu Konfirmasi',
  'DP 30%',
  'Lunas',
  'Selesai',
  'Dibatalkan',
]

export function BookingEditModal({
  isOpen,
  mode,
  booking,
  tourOptions,
  onSave,
  onClose,
}: BookingEditModalProps) {
  const [formData, setFormData] = useState<Partial<Booking>>({
    fullName: '',
    email: '',
    whatsapp: '',
    arrivalDate: '',
    travelDate: '',
    meetingTime: '08:00 WIB',
    meetingPoint: 'Stasiun Garut (KAI)',
    travelers: 2,
    packageOrTour: tourOptions[0] || 'Garut One-Day City Tour',
    totalPrice: 700000,
    paymentType: 'full',
    dpPercentage: 30,
    paidAmount: 700000,
    remainingAmount: 0,
    paymentMethod: 'Transfer Bank BCA',
    paymentStatus: 'Menunggu Konfirmasi',
    notes: '',
  })

  useEffect(() => {
    if (booking && mode === 'edit') {
      setFormData({ ...booking })
    } else {
      const today = new Date().toISOString().split('T')[0]
      const randomId = `GJ-${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
      setFormData({
        id: randomId,
        createdAt: new Date().toISOString(),
        fullName: '',
        email: '',
        whatsapp: '',
        arrivalDate: today,
        travelDate: today,
        meetingTime: '08:00 WIB',
        meetingPoint: 'Stasiun Garut (KAI)',
        travelers: 2,
        packageOrTour: tourOptions[0] || 'Garut One-Day City Tour',
        totalPrice: 700000,
        paymentType: 'full',
        dpPercentage: 30,
        paidAmount: 700000,
        remainingAmount: 0,
        paymentMethod: 'Transfer Bank BCA',
        paymentStatus: 'Menunggu Konfirmasi',
        notes: '',
      })
    }
  }, [booking, mode, tourOptions])

  if (!isOpen) return null

  const handlePriceChange = (val: number) => {
    const total = Math.max(0, val)
    const isDp = formData.paymentType === 'dp'
    const pct = formData.dpPercentage || 30
    const dp = isDp ? Math.round((total * pct) / 100) : total
    const rem = isDp ? total - dp : 0
    setFormData((prev) => ({
      ...prev,
      totalPrice: total,
      paidAmount: dp,
      remainingAmount: rem,
    }))
  }

  const handlePaymentTypeChange = (type: PaymentType) => {
    const total = formData.totalPrice || 0
    const pct = formData.dpPercentage || 30
    const dp = type === 'dp' ? Math.round((total * pct) / 100) : total
    const rem = type === 'dp' ? total - dp : 0
    setFormData((prev) => ({
      ...prev,
      paymentType: type,
      paidAmount: dp,
      remainingAmount: rem,
      paymentStatus: type === 'dp' ? 'DP 30%' : (prev.paymentStatus || 'Menunggu Konfirmasi'),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.whatsapp) return

    const completeBooking: Booking = {
      id: formData.id || `GJ-${Date.now().toString().slice(-6)}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      fullName: formData.fullName.trim(),
      email: formData.email?.trim() || 'tamu@garutjourney.com',
      whatsapp: formData.whatsapp.trim(),
      arrivalDate: formData.arrivalDate || formData.travelDate || new Date().toISOString().split('T')[0],
      travelDate: formData.travelDate || formData.arrivalDate || new Date().toISOString().split('T')[0],
      meetingTime: formData.meetingTime || '08:00 WIB',
      meetingPoint: formData.meetingPoint || 'Stasiun Garut',
      travelers: Number(formData.travelers) || 1,
      packageOrTour: formData.packageOrTour || 'Garut One-Day City Tour',
      totalPrice: Number(formData.totalPrice) || 0,
      paymentType: formData.paymentType || 'full',
      dpPercentage: Number(formData.dpPercentage) || 30,
      paidAmount: Number(formData.paidAmount) || 0,
      remainingAmount: Number(formData.remainingAmount) || 0,
      paymentMethod: formData.paymentMethod || 'Transfer Bank BCA',
      paymentStatus: formData.paymentStatus || 'Menunggu Konfirmasi',
      notes: formData.notes?.trim() || '',
    }

    onSave(completeBooking)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white p-6 sm:p-8 shadow-lift border border-ink/10 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-ember">
              {mode === 'create' ? 'Tambah Booking Manual' : `Edit Booking #${formData.id}`}
            </span>
            <h3 className="font-display text-2xl font-bold text-forest mt-0.5">
              {mode === 'create' ? 'Formulir Pemesanan Baru' : 'Edit Rincian Pemesanan'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Data Pelanggan */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Nama Lengkap Tamu *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  type="text"
                  required
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Rian Hidayat"
                  className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                No. WhatsApp / HP *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                <input
                  type="text"
                  required
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Pilihan Paket / Tour
              </label>
              <div className="relative">
                <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  type="text"
                  list="tours-list-datalist"
                  value={formData.packageOrTour || ''}
                  onChange={(e) => setFormData({ ...formData, packageOrTour: e.target.value })}
                  className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
                />
                <datalist id="tours-list-datalist">
                  {tourOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Tanggal & Titik Kumpul */}
          <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t border-ink/10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Tanggal Kedatangan
              </label>
              <input
                type="date"
                value={formData.arrivalDate || ''}
                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value, travelDate: e.target.value })}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Jam Pertemuan
              </label>
              <input
                type="text"
                value={formData.meetingTime || ''}
                onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                placeholder="08:00 WIB"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Jumlah Peserta
              </label>
              <input
                type="number"
                min={1}
                value={formData.travelers || 1}
                onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) || 1 })}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Titik Kumpul (Meeting Point)
              </label>
              <input
                type="text"
                value={formData.meetingPoint || ''}
                onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                placeholder="Contoh: Stasiun Garut (KAI), Hotel Harmoni, atau Kantor Garut Journey"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Keuangan & Status Pembayaran */}
          <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-ink/10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Total Biaya Trip (Rp)
              </label>
              <input
                type="number"
                step={50000}
                value={formData.totalPrice || 0}
                onChange={(e) => handlePriceChange(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-bold text-ember focus:border-forest focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-[0.68rem] text-ink/50">
                Format: {formatRupiah(formData.totalPrice || 0)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Skema Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('full')}
                  className={`rounded-xl py-2 px-3 text-xs font-bold border transition ${
                    formData.paymentType === 'full'
                      ? 'bg-forest text-white border-forest'
                      : 'bg-cream/40 text-ink/70 border-ink/15 hover:bg-cream'
                  }`}
                >
                  Bayar Lunas (100%)
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('dp')}
                  className={`rounded-xl py-2 px-3 text-xs font-bold border transition ${
                    formData.paymentType === 'dp'
                      ? 'bg-ember text-white border-ember'
                      : 'bg-cream/40 text-ink/70 border-ink/15 hover:bg-cream'
                  }`}
                >
                  Booking DP (30%)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Metode Pembayaran
              </label>
              <select
                value={formData.paymentMethod || 'Transfer Bank BCA'}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Status Pembayaran
              </label>
              <select
                value={formData.paymentStatus || 'Menunggu Konfirmasi'}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-bold text-forest focus:border-forest focus:bg-white focus:outline-none"
              >
                {PAYMENT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Catatan Khusus */}
          <div className="pt-2 border-t border-ink/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
              Catatan Permintaan Khusus / Catatan Tim
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan tambahan (contoh: minta jemput di pintu barat stasiun, butuh kursi roda, dll)"
              className="w-full rounded-xl border border-ink/15 bg-cream/30 p-3 text-xs text-ink focus:border-forest focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-xs font-semibold text-ink/60 hover:bg-ink/5"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-forest-700 transition"
            >
              <Check className="h-4 w-4" />
              <span>{mode === 'create' ? 'Terbitkan Booking' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
