import {
  Calendar,
  Clock,
  CreditCard,
  Mail,
  MapPin,
} from 'lucide-react'
import { useState, type FormEvent, useEffect } from 'react'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { WhatsAppIcon } from '@/components/WhatsAppFab'
import { mapsLink, mapsEmbed, site } from '@/data/site'
import { formToObject, submitNetlifyForm } from '@/lib/forms'
import { readPlanSummary, useSelectedTour } from '@/lib/trip'
import { PaymentModal } from '@/components/PaymentModal'
import { useTourPrices } from '@/lib/destinationsStorage'
import { useCityTours, useTourPackages } from '@/lib/toursStorage'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'

const MEETING_POINTS = [
  'Stasiun Kereta Api Garut (KAI)',
  'Kantor Garut Journey (Jl. Raya Bayongbong - Cikajang No. 103)',
  'Hotel / Villa Tempat Menginap di Garut',
  'Terminal Guntur Garut',
  'Lokasi Penjemputan Lainnya (Tulis di Catatan)',
]

const MEETING_TIMES = [
  '06:00 WIB (Sunrise / Subuh)',
  '07:00 WIB (Pagi Ceria)',
  '07:30 WIB (Pagi)',
  '08:00 WIB (Standar Tour)',
  '08:30 WIB',
  '09:00 WIB',
  '10:00 WIB',
  '13:00 WIB (Siang)',
]

function InquiryForm() {
  const [tour, setTour] = useSelectedTour()
  const { prices } = useTourPrices()
  const cityTours = useCityTours()
  const packages = useTourPackages()
  const { t } = useLanguage()

  const tourOptions = Array.from(
    new Set([
      ...cityTours.map((ct) => ct.name),
      ...packages.map((p) => p.name),
      ...Object.keys(prices),
      'Custom itinerary',
    ]),
  )
  const [plan, setPlan] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Form states
  const today = new Date().toISOString().split('T')[0]
  const [arrivalDate, setArrivalDate] = useState(today)
  const [meetingTime, setMeetingTime] = useState('08:00 WIB (Standar Tour)')
  const [meetingPoint, setMeetingPoint] = useState('Stasiun Kereta Api Garut (KAI)')
  const [travelers, setTravelers] = useState(2)

  const [pendingBookingData, setPendingBookingData] = useState<{
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
    notes?: string
  } | null>(null)

  useEffect(() => {
    if (tour === 'Custom itinerary') setPlan(readPlanSummary())
  }, [tour])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('sending')

    const formData = new FormData(e.currentTarget)
    const fullName = String(formData.get('fullName') || '')
    const email = String(formData.get('email') || '')
    const whatsapp = String(formData.get('whatsapp') || '')
    const preferredTour = String(formData.get('preferredTour') || 'Garut One-Day City Tour')
    const message = String(formData.get('message') || '')

    const basePrice = prices[preferredTour] || 350000
    const count = travelers > 0 ? travelers : 1
    const totalPrice = basePrice * count

    setPendingBookingData({
      fullName,
      email,
      whatsapp,
      arrivalDate,
      travelDate: arrivalDate,
      meetingTime,
      meetingPoint,
      travelers: count,
      packageOrTour: preferredTour,
      totalPrice,
      notes: message,
    })

    try {
      submitNetlifyForm('inquiry', formToObject(e.currentTarget)).catch(() => {})
    } catch {}

    setState('idle')
    setShowPaymentModal(true)
  }

  const field =
    'mt-2 block w-full rounded-2xl bg-cream/70 px-4 py-3.5 text-ink placeholder:text-ink/40 ring-1 ring-ink/10 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest text-sm'
  const labelCls = 'text-xs font-bold uppercase tracking-wider text-ink/70 flex items-center gap-1.5'

  return (
    <>
      <form
        name="inquiry"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        className="rounded-[2rem] bg-white p-7 shadow-soft sm:p-10"
      >
        <input type="hidden" name="form-name" value="inquiry" />
        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>
        <input type="hidden" name="savedItinerary" value={plan} />

        <div className="mb-6 rounded-2xl bg-forest/5 p-4 border border-forest/15 flex items-center justify-between">
          <div className="flex items-center gap-2 text-forest text-xs font-semibold">
            <CreditCard className="h-4 w-4 text-ember" />
            <span>Pemesanan Langsung & Konfirmasi WhatsApp Admin</span>
          </div>
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ember bg-ember/10 px-2 py-0.5 rounded">
            QRIS & Transfer Bank
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <label className="sm:col-span-2">
            <span className={labelCls}>{t.booking.fullName} *</span>
            <input name="fullName" required autoComplete="name" className={field} placeholder="Contoh: Budi Santoso" />
          </label>

          {/* Email */}
          <label>
            <span className={labelCls}>{t.booking.email} *</span>
            <input name="email" type="email" required autoComplete="email" className={field} placeholder="budi@example.com" />
          </label>

          {/* WhatsApp Number */}
          <label>
            <span className={labelCls}>{t.booking.whatsapp} *</span>
            <input name="whatsapp" type="tel" required autoComplete="tel" className={field} placeholder="08xxxxxxxxxx" />
          </label>

          {/* Tour Package Selection */}
          <label className="sm:col-span-2">
            <span className={labelCls}>{t.booking.tourPackage}</span>
            <select name="preferredTour" value={tour} onChange={(e) => setTour(e.target.value)} className={field}>
              {tourOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} (Mulai dari {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(prices[opt] || 350000)}/orang)
                </option>
              ))}
            </select>
          </label>

          {/* Tanggal Kedatangan ke Garut (Kalender Interaktif) */}
          <label>
            <span className={labelCls}>
              <Calendar className="h-3.5 w-3.5 text-forest" />
              <span>{t.booking.arrivalDate} *</span>
            </span>
            <input
              name="arrivalDate"
              type="date"
              required
              min={today}
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className={field}
            />
          </label>

          {/* Jumlah Peserta */}
          <label>
            <span className={labelCls}>{t.booking.travelers}</span>
            <input
              name="travelers"
              type="number"
              min={1}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value) || 1)}
              className={field}
            />
          </label>

          {/* Jam Pertemuan di Meeting Point */}
          <label>
            <span className={labelCls}>
              <Clock className="h-3.5 w-3.5 text-forest" />
              <span>{t.booking.meetingTime} *</span>
            </span>
            <select
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className={field}
            >
              {MEETING_TIMES.map((mt) => (
                <option key={mt} value={mt}>
                  {mt}
                </option>
              ))}
            </select>
          </label>

          {/* Titik Kumpul (Meeting Point) */}
          <label>
            <span className={labelCls}>
              <MapPin className="h-3.5 w-3.5 text-forest" />
              <span>{t.booking.meetingPoint} *</span>
            </span>
            <select
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className={field}
            >
              {MEETING_POINTS.map((mp) => (
                <option key={mp} value={mp}>
                  {mp}
                </option>
              ))}
            </select>
          </label>

          {tour === 'Custom itinerary' && plan && (
            <div className="rounded-2xl bg-forest/5 p-4 text-sm text-forest sm:col-span-2">
              <p className="font-semibold">Itinerary kustom Anda telah dilampirkan:</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-ink/70">{plan}</pre>
            </div>
          )}

          {/* Notes */}
          <label className="sm:col-span-2">
            <span className={labelCls}>{t.booking.notes}</span>
            <textarea
              name="message"
              rows={3}
              className={field}
              placeholder={t.booking.notesPlaceholder}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={state === 'sending'}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-bold uppercase tracking-wider text-cream transition hover:bg-forest-700 disabled:opacity-60 text-sm shadow-soft"
        >
          <CreditCard className="h-4 w-4 text-ember" />
          <span>{t.booking.submit}</span>
        </button>
      </form>

      {/* Payment Modal Component */}
      {pendingBookingData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingData={pendingBookingData}
          onSuccess={() => {}}
        />
      )}
    </>
  )
}

export function Contact() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const currentWhatsapp = settings.whatsapp || site.whatsapp
  const currentEmail = settings.email || site.email
  const currentAddress = settings.address || site.address
  const currentMaps = settings.mapsQuery || site.mapsQuery
  const currentWaDigits = settings.whatsappDigits || site.whatsappDigits

  const items = [
    {
      icon: <WhatsAppIcon className="h-5 w-5" />,
      label: 'WhatsApp Admin',
      value: currentWhatsapp,
      href: `https://wa.me/${currentWaDigits}?text=${encodeURIComponent('Hi Garut Journey! I would like to plan a trip to Garut.')}`,
    },
    { icon: <Mail className="h-5 w-5" />, label: 'Email', value: currentEmail, href: `mailto:${currentEmail}` },
    { icon: <MapPin className="h-5 w-5" />, label: 'Office', value: currentAddress, href: mapsLink(currentMaps) },
  ]
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.25fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow={t.nav.contact}
            title={t.booking.title}
            intro={t.booking.subtitle}
          />
          <Reveal delay={100}>
            <ul className="mt-10 space-y-3">
              {items.map((i) => (
                <li key={i.label}>
                  <a href={i.href} target={i.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft transition hover:-translate-y-0.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest text-cream transition group-hover:bg-ember">{i.icon}</span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-widest text-ink/45">{i.label}</span>
                      <span className="block font-semibold text-ink">{i.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 overflow-hidden rounded-3xl shadow-soft">
              <iframe
                title="Map of Garut Office"
                src={mapsEmbed(currentMaps)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 grayscale-[20%]"
              />
            </div>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  )
}
