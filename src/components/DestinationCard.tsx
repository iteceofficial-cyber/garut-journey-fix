import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { Destination } from '@/data/destinations'
import { Img } from './Img'
import { useLanguage } from '@/lib/i18n'

export function DestinationCard({ d, large = false }: { d: Destination; large?: boolean }) {
  const { t } = useLanguage()

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      <div className={`relative overflow-hidden ${large ? 'aspect-[4/3] lg:aspect-[16/11]' : 'aspect-[4/3]'}`}>
        <Img
          file={d.image}
          alt={d.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-ink/55">
            <MapPin className="h-3.5 w-3.5 text-ember" /> {d.location}
          </p>
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-forest/80 bg-forest/5 px-2.5 py-0.5 rounded-full">
            {d.categories[0]}
          </span>
        </div>
        <h3 className="font-display mt-2 text-2xl text-ink">{d.name}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-ink/65">{d.short}</p>

        {/* Info Badges (Tiket & Jam Operasional) */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-ink/5 text-[0.72rem]">
          {(d.ticketPriceWeekdayLocal || d.ticketPrice) && (
            <span className="rounded-lg bg-forest/10 px-2 py-0.5 font-bold text-forest">
              Tiket: {d.ticketPriceWeekdayLocal || d.ticketPrice}
            </span>
          )}
          {(d.openingHoursWeekday || d.openingHours) && (
            <span className="rounded-lg bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-800">
              {d.openingHoursWeekday || d.openingHours}
            </span>
          )}
        </div>

        <Link
          to="/destinations/$slug"
          params={{ slug: d.slug }}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest after:absolute after:inset-0 after:content-['']"
        >
          {t.destinations.exploreCard}
          <span className="grid h-7 w-7 place-items-center rounded-full bg-forest/10 transition group-hover:bg-ember group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </article>
  )
}
