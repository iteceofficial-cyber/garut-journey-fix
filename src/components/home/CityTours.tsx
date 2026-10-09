import { ArrowRight, Clock, ChevronDown, Compass, Tent } from 'lucide-react'
import { useState } from 'react'
import { BookLink, btn } from '@/components/BookLink'
import { Img } from '@/components/Img'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { type CityTour } from '@/data/tours'
import { useCityTours } from '@/lib/toursStorage'
import { useLanguage } from '@/lib/i18n'

function isTrekkingOrCamping(tour: CityTour): boolean {
  if (tour.category === 'trekking-camping') return true
  const hay = `${tour.name} ${tour.summary} ${tour.focus.join(' ')}`.toLowerCase()
  return hay.includes('trek') || hay.includes('camp') || hay.includes('pendaki') || hay.includes('gunung')
}

function TourCard({ tour, index }: { tour: CityTour; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const isDay = tour.id === 'one-day-city-tour'
  const isTrekCamp = isTrekkingOrCamping(tour)
  const { t } = useLanguage()

  return (
    <article className="grid overflow-hidden rounded-[2rem] bg-forest-700 ring-1 ring-white/10 lg:grid-cols-[1fr_1.1fr]">
      <div className="relative min-h-72 overflow-hidden lg:min-h-full">
        <Img file={tour.image} alt={tour.name} sizes="(min-width: 1024px) 45vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition duration-[1.4s] hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        {isTrekCamp && (
          <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-ink/80 backdrop-blur-md px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-ember ring-1 ring-ember/40">
            <Tent className="h-3.5 w-3.5" /> Wisata Trekking & Camping
          </span>
        )}
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-ember px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          <Clock className="h-3.5 w-3.5" /> {tour.duration}
        </span>
      </div>
      <div className="p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember">
          {isTrekCamp ? 'Adventure & Camping' : t.cityTours.signatureTour} 0{index + 1}
        </p>
        <h3 className="font-display mt-3 text-3xl text-cream sm:text-4xl">{tour.name}</h3>
        <p className="mt-4 leading-relaxed text-cream/75">{tour.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {tour.focus.map((f) => (
            <li key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cream/85">
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`itinerary-${tour.id}`}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cream hover:text-ember"
        >
          {open ? t.cityTours.hideItinerary : t.cityTours.viewItinerary}
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        <div id={`itinerary-${tour.id}`} className={`grid transition-all duration-500 ${open ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <ol className="overflow-hidden border-l border-white/15 pl-6">
            {tour.itinerary.map((s) => (
              <li key={s.time} className="relative pb-4 last:pb-0">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-ember ring-4 ring-forest-700" />
                <span className="block text-xs font-bold tracking-wider text-ember">{s.time}</span>
                <span className="text-cream/90">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="block text-xs uppercase tracking-widest text-cream/50">{t.cityTours.priceFrom}</span>
            <span className="font-display text-xl text-cream">{tour.price}</span>
          </p>
          <BookLink tour={tour.name} className={btn.primary}>
            {isDay ? t.cityTours.bookThisTour : t.cityTours.explorePackage} <ArrowRight className="h-4 w-4" />
          </BookLink>
        </div>
      </div>
    </article>
  )
}

export function CityTours() {
  const { t } = useLanguage()
  const cityTours = useCityTours()
  const [activeFilter, setActiveFilter] = useState<'all' | 'city' | 'trekking-camping'>('all')

  const filteredTours = cityTours.filter((tItem) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'trekking-camping') return isTrekkingOrCamping(tItem)
    return !isTrekkingOrCamping(tItem)
  })

  return (
    <section id="city-tours" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div aria-hidden="true" className="font-display pointer-events-none absolute -right-10 top-10 select-none text-[22vw] leading-none text-white/[0.04]">
        Tour
      </div>
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            dark
            eyebrow={t.cityTours.eyebrow}
            title={
              <>
                {t.cityTours.title} <em className="text-ember">Garut Journey</em>
              </>
            }
            intro={t.cityTours.intro}
          />

          {/* Category Filter Menu for Paket Tour */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeFilter === 'all'
                  ? 'bg-ember text-white shadow-soft'
                  : 'bg-white/10 text-cream/80 hover:bg-white/20'
              }`}
            >
              <span>Semua Paket ({cityTours.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('city')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeFilter === 'city'
                  ? 'bg-ember text-white shadow-soft'
                  : 'bg-white/10 text-cream/80 hover:bg-white/20'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>City & Heritage Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('trekking-camping')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeFilter === 'trekking-camping'
                  ? 'bg-ember text-white shadow-soft'
                  : 'bg-white/10 text-cream/80 hover:bg-white/20'
              }`}
            >
              <Tent className="h-3.5 w-3.5" />
              <span>Wisata Trekking & Camping</span>
            </button>
          </div>
        </div>

        <div className="mt-14 space-y-8">
          {filteredTours.map((tItem, i) => (
            <Reveal key={tItem.id} delay={i * 100}>
              <TourCard tour={tItem} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
