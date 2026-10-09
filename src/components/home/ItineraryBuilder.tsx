import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Bookmark,
  Car,
  Clock,
  Compass,
  Hotel,
  Info,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { BookLink, btn } from '@/components/BookLink'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { getDestination } from '@/data/destinations'
import {
  budgets,
  buildItinerary,
  styles,
  type Budget,
  type Duration,
  type PlanDay,
  type Style,
} from '@/data/itinerary'
import { savePlanSummary, useSavedDestinations } from '@/lib/trip'
import { useLanguage } from '@/lib/i18n'
import { whatsappLink } from '@/data/site'

function Group<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = (v) => String(v),
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  format?: (v: T) => string
}) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.2em] text-cream/55">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o === value
          const isCustomLong = typeof o === 'number' && o > 3
          return (
            <label
              key={o}
              className={`cursor-pointer rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold transition relative has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
                on
                  ? 'bg-ember text-white shadow-soft'
                  : isCustomLong
                  ? 'bg-ember/20 text-cream border border-ember/40 hover:bg-ember/30'
                  : 'bg-white/10 text-cream/85 hover:bg-white/20'
              }`}
            >
              <input type="radio" name={label} className="sr-only" checked={on} onChange={() => onChange(o)} />
              <span>{format(o)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function summarize(plan: PlanDay[], meta: string) {
  return [meta, ...plan.map((d) => `Day ${d.day}: ` + d.stops.map((s) => `${s.time} ${s.destination}`).join(' → '))].join('\n')
}

export function ItineraryBuilder() {
  const [duration, setDuration] = useState<Duration>(3)
  const [style, setStyle] = useState<Style>('Family')
  const [budget, setBudget] = useState<Budget>('Standard')
  const [travelers, setTravelers] = useState(4)
  const [customTransport, setCustomTransport] = useState('Toyota HiAce Luxury')
  const [customStay, setCustomStay] = useState('Resor Danau Bintang 4/5 (Kampung Sampireun)')
  const [plan, setPlan] = useState<PlanDay[] | null>(null)
  const { saved, toggle } = useSavedDestinations()
  const resultRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const isLongTrip = duration > 3

  const durationText =
    duration === 1
      ? '1 Hari (Day Trip)'
      : duration === 2
      ? '2 Hari 1 Malam (2D1N)'
      : duration === 3
      ? '3 Hari 2 Malam (3D2N)'
      : duration === 4
      ? '4 Hari 3 Malam (4D3N Custom)'
      : duration === 5
      ? '5 Hari 4 Malam (5D4N Custom)'
      : '7 Hari 6 Malam (Grand Garut Expedition)'

  const meta = `${durationText} · ${style} · ${budget} · ${travelers} ${t.itinerary.travelersLabel}${
    isLongTrip ? ` · Transport: ${customTransport} · Stay: ${customStay}` : ''
  }`

  const build = (customDuration?: Duration) => {
    const durToUse = customDuration ?? duration
    const p = buildItinerary(durToUse, style, budget, travelers)
    setPlan(p)
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const book = () => {
    if (!plan) return
    const extra = saved.length ? `\nSaved places: ${saved.map((s) => getDestination(s)?.name).filter(Boolean).join(', ')}` : ''
    savePlanSummary(summarize(plan, meta) + extra)
  }

  const customWhatsAppMsg = `Halo Admin Garut Journey! Saya tertarik memesan Trip Custom Lebih dari 3 Hari 2 Malam:
- Durasi: ${durationText}
- Tipe Rombongan: ${style} (${travelers} Orang)
- Estimasi Budget: ${budget}
- Pilihan Armada: ${customTransport}
- Pilihan Hotel: ${customStay}
Mohon info penawaran resmi dan penyesuaian jadwalnya. Terima kasih!`

  return (
    <section id="itinerary" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <SectionHeading
              dark
              eyebrow={t.itinerary.eyebrow}
              title={
                <>
                  {t.itinerary.title} <em className="text-ember">Garut Journey</em>
                </>
              }
              intro={t.itinerary.intro}
            />

            {/* Custom Long Trip Callout */}
            <div className="mt-8 rounded-3xl border border-ember/40 bg-gradient-to-br from-ember/15 to-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <Compass className="h-4 w-4" />
                <span>Trip Custom &gt; 3 Hari 2 Malam</span>
              </div>
              <h3 className="font-display mt-2 text-xl font-semibold text-cream">
                Punya rencana liburan panjang di Garut?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                Kami menyediakan perencanaan khusus untuk perjalanan 4D3N hingga 7+ hari. Jelajahi kawah gunung berapi, pemandian air panas tersembunyi, hingga pantai eksotis Samudra Hindia selatan dalam satu rangkaian private tour tanpa terburu-buru.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDuration(4)
                    build(4)
                  }}
                  className="rounded-full bg-ember px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-ember-600 transition"
                >
                  Pilih 4D3N
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuration(5)
                    build(5)
                  }}
                  className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-cream hover:bg-white/25 transition"
                >
                  Pilih 5D4N
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuration(7)
                    build(7)
                  }}
                  className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-cream hover:bg-white/25 transition"
                >
                  Pilih 7D6N Grand
                </button>
              </div>
            </div>

            {saved.length > 0 && (
              <Reveal className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                  <Bookmark className="h-4 w-4" /> {t.itinerary.savedPlacesTitle}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {saved.map((slug) => {
                    const d = getDestination(slug)
                    if (!d) return null
                    return (
                      <li key={slug} className="flex items-center gap-1 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-sm">
                        <Link to="/destinations/$slug" params={{ slug }} className="hover:text-ember">
                          {d.name}
                        </Link>
                        <button type="button" onClick={() => toggle(slug)} aria-label={`Remove ${d.name}`} className="rounded-full p-1 hover:bg-white/15">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-3 text-xs text-cream/50">{t.itinerary.savedPlacesDesc}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={120}>
            <div className="space-y-6 rounded-[2rem] bg-ink/40 p-6 ring-1 ring-white/10 backdrop-blur sm:p-9">
              <Group
                label="Pilihan Durasi Perjalanan"
                options={[1, 2, 3, 4, 5, 7] as const}
                value={duration}
                onChange={setDuration}
                format={(v) =>
                  v === 1
                    ? '1 Hari'
                    : v === 2
                    ? '2H 1M'
                    : v === 3
                    ? '3H 2M'
                    : v === 4
                    ? '4H 3M (Custom)'
                    : v === 5
                    ? '5H 4M (Custom)'
                    : '7H 6M (Grand)'
                }
              />

              <Group label={t.itinerary.styleLabel} options={styles} value={style} onChange={setStyle} />
              <Group label={t.itinerary.budgetLabel} options={budgets} value={budget} onChange={setBudget} />

              {/* Special Controls when Duration > 3 Days */}
              {isLongTrip && (
                <div className="space-y-4 rounded-2xl border border-ember/30 bg-ember/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Preferensi Khusus Trip &gt; 3H2M
                  </p>
                  <div>
                    <label className="text-xs text-cream/80 flex items-center gap-1.5 font-medium mb-1.5">
                      <Car className="h-3.5 w-3.5 text-ember" /> Pilihan Armada Privat
                    </label>
                    <select
                      value={customTransport}
                      onChange={(e) => setCustomTransport(e.target.value)}
                      className="w-full rounded-xl bg-ink/60 border border-white/15 px-3 py-2 text-xs sm:text-sm text-cream focus:outline-none focus:border-ember"
                    >
                      <option value="Toyota HiAce Luxury (10-14 Kursi)">Toyota HiAce Luxury (10-14 Kursi)</option>
                      <option value="All-New Toyota Innova Reborn (4-6 Kursi)">All-New Toyota Innova Reborn (4-6 Kursi)</option>
                      <option value="Armada 4x4 Offroad Jeep Papandayan">Armada 4x4 Offroad Jeep Papandayan</option>
                      <option value="Bus Pariwisata Medium (31 Kursi)">Bus Pariwisata Medium (31 Kursi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-cream/80 flex items-center gap-1.5 font-medium mb-1.5">
                      <Hotel className="h-3.5 w-3.5 text-ember" /> Pilihan Konsep Akomodasi
                    </label>
                    <select
                      value={customStay}
                      onChange={(e) => setCustomStay(e.target.value)}
                      className="w-full rounded-xl bg-ink/60 border border-white/15 px-3 py-2 text-xs sm:text-sm text-cream focus:outline-none focus:border-ember"
                    >
                      <option value="Resor Danau Bintang 4/5 (Kampung Sampireun)">Resor Danau Bintang 4/5 (Kampung Sampireun)</option>
                      <option value="Glamping & Pemandian Air Hangat Darajat Pass">Glamping & Pemandian Air Hangat Darajat Pass</option>
                      <option value="Villa Pribadi Keluarga di Cipanas Garut">Villa Pribadi Keluarga di Cipanas Garut</option>
                      <option value="Hotel Bintang 3 Pusat Kota Garut">Hotel Bintang 3 Pusat Kota Garut</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="travelers" className="text-xs font-bold uppercase tracking-[0.2em] text-cream/55">
                  {t.itinerary.travelersLabel}
                </label>
                <div className="mt-3 inline-flex items-center rounded-full bg-white/10 p-1">
                  <button type="button" aria-label="Fewer travelers" onClick={() => setTravelers((tr) => Math.max(1, tr - 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    id="travelers"
                    type="number"
                    min={1}
                    max={100}
                    value={travelers}
                    onChange={(e) => setTravelers(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-14 bg-transparent text-center text-lg font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button type="button" aria-label="More travelers" onClick={() => setTravelers((tr) => Math.min(100, tr + 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15">
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="pl-2 pr-4 text-sm text-cream/60">{travelers} {t.itinerary.travelersLabel}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => build()} className={`${btn.primary} flex-1 !py-3.5 text-sm sm:text-base`}>
                  <Sparkles className="h-5 w-5" /> Buat Rencana Perjalanan
                </button>
                {isLongTrip && (
                  <a
                    href={whatsappLink(customWhatsAppMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-[#1ebd59] transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Konsultasi WA Langsung</span>
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <div ref={resultRef} className="scroll-mt-24">
          {plan && (
            <div className="fade-up mt-16 rounded-[2rem] bg-cream p-6 text-ink sm:p-10 shadow-lift">
              <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="eyebrow">{t.itinerary.eyebrow}</p>
                    {isLongTrip && (
                      <span className="rounded-full bg-ember/15 px-3 py-0.5 text-xs font-bold text-ember">
                        Trip Custom Panjang
                      </span>
                    )}
                  </div>
                  <h3 className="font-display mt-3 text-3xl sm:text-4xl">{t.itinerary.title}</h3>
                  <p className="mt-2 text-ink/70 font-medium">{meta}</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={whatsappLink(customWhatsAppMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-[#1ebd59] transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Kirim ke WhatsApp</span>
                  </a>
                  <BookLink tour={`Custom Itinerary (${durationText})`} onNavigate={book} className={btn.primary}>
                    {t.itinerary.bookCustom} <ArrowRight className="h-4 w-4" />
                  </BookLink>
                </div>
              </div>

              <div className="mt-8 space-y-10">
                {plan.map((day) => (
                  <div key={day.day}>
                    <h4 className="flex items-baseline gap-3">
                      <span className="font-display text-4xl text-ember">{t.itinerary.dayHeading} {day.day}</span>
                      <span className="text-sm font-semibold uppercase tracking-widest text-ink/50">{day.title}</span>
                    </h4>
                    <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {day.stops.map((s) => (
                        <li key={s.time + s.destination} className="flex flex-col rounded-3xl bg-white p-5 shadow-soft border border-ink/5">
                          <span className="text-sm font-bold text-forest">{s.time}</span>
                          {s.slug ? (
                            <Link to="/destinations/$slug" params={{ slug: s.slug }} className="font-display mt-1 text-xl hover:text-forest">
                              {s.destination}
                            </Link>
                          ) : (
                            <span className="font-display mt-1 text-xl">{s.destination}</span>
                          )}
                          <p className="mt-1 text-sm text-ink/65">{s.activity}</p>
                          <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
                            <div className="flex items-start gap-2">
                              <dt><Clock className="mt-0.5 h-4 w-4 text-ember" aria-label="Duration" /></dt>
                              <dd>{s.duration}</dd>
                            </div>
                            <div className="flex items-start gap-2">
                              <dt><Utensils className="mt-0.5 h-4 w-4 text-ember" aria-label="Food" /></dt>
                              <dd>{s.food}</dd>
                            </div>
                            <div className="flex items-start gap-2 text-ink/60">
                              <dt><Info className="mt-0.5 h-4 w-4 text-ember" aria-label="Note" /></dt>
                              <dd>{s.note}</dd>
                            </div>
                          </dl>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-ink/50">
                Jadwal trip di atas dapat disesuaikan 100% fleksibel sesuai jam kedatangan tiket kereta/pesawat Anda dan dikonfirmasi langsung bersama tour specialist Garut Journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
