import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Compass,
  DollarSign,
  Heart,
  MapPin,
  MessageCircle,
} from 'lucide-react'
import { Img } from '@/components/Img'
import { ShareButtons } from '@/components/ShareButtons'
import { DestinationCard } from '@/components/DestinationCard'
import { COMING_SOON, mapsEmbed, mapsLink, whatsappLink } from '@/data/site'
import { getDestination } from '@/data/destinations'
import { useDestinations } from '@/lib/destinationsStorage'
import { useSavedDestinations } from '@/lib/trip'
import { useLanguage } from '@/lib/i18n'
import { handleNavClick } from '@/lib/nav'

export const Route = createFileRoute('/destinations/$slug')({
  component: DestinationDetailPage,
})

function DestinationDetailPage() {
  const { slug } = Route.useParams()
  const { destinations } = useDestinations()
  const destination = destinations.find((d) => d.slug === slug) ?? getDestination(slug)
  const { isSaved, toggle } = useSavedDestinations()
  const { t } = useLanguage()

  if (!destination) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-cream px-5 py-24 text-center">
        <div className="max-w-md">
          <p className="eyebrow text-ember">Garut Journey</p>
          <h1 className="font-display mt-4 text-4xl font-semibold text-ink">{t.detail.notFoundTitle}</h1>
          <p className="mt-3 text-sm text-ink/70">
            {t.detail.notFoundDesc} ({slug})
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/"
              hash="destinations"
              onClick={() => handleNavClick('destinations')}
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-700 transition"
            >
              {t.detail.allDestinations}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const saved = isSaved(destination.slug)
  const nearbyDests = (destination.nearby || [])
    .map((s) => destinations.find((d) => d.slug === s) ?? getDestination(s))
    .filter(Boolean)

  return (
    <article className="min-h-screen bg-cream pb-24 pt-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        {/* Back Link */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-5">
          <Link
            to="/"
            hash="destinations"
            onClick={() => handleNavClick('destinations')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest hover:text-ember transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.detail.allDestinations}</span>
          </Link>

          <button
            type="button"
            onClick={() => toggle(destination.slug)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              saved
                ? 'bg-ember text-white'
                : 'border border-forest/20 bg-white/70 text-forest hover:bg-forest hover:text-white'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? t.detail.savedInItinerary : t.detail.saveToItinerary}</span>
          </button>
        </div>

        {/* Header */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            {destination.categories.map((c) => (
              <span key={c} className="rounded-full bg-ember/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ember">
                {c}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 text-xs text-ink/60">
              <MapPin className="h-3.5 w-3.5 text-forest" />
              {destination.location}
            </span>
          </div>

          <h1 className="font-display mt-4 text-4xl sm:text-6xl font-light text-ink leading-tight">
            {destination.name}
          </h1>

          <p className="mt-4 text-lg text-ink/75 leading-relaxed">
            {destination.short}
          </p>
        </header>

        {/* Hero Image */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lift aspect-[16/10] sm:aspect-[21/10]">
          <Img
            file={destination.image}
            alt={destination.name}
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Key Info Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-soft border border-ink/5">
            <div className="flex items-center gap-2 text-ink/50 text-xs font-bold uppercase tracking-wider">
              <Clock className="h-4 w-4 text-forest" />
              <span>{t.detail.openingHours}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink">
              {destination.openingHours ?? COMING_SOON}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-soft border border-ink/5">
            <div className="flex items-center gap-2 text-ink/50 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="h-4 w-4 text-ember" />
              <span>{t.detail.ticketPrice}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink">
              {destination.ticketPrice ?? COMING_SOON}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-soft border border-ink/5">
            <div className="flex items-center gap-2 text-ink/50 text-xs font-bold uppercase tracking-wider">
              <Compass className="h-4 w-4 text-leaf" />
              <span>{t.detail.locationOnMap}</span>
            </div>
            <a
              href={mapsLink(destination.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-ember transition"
            >
              <span>{t.detail.openGoogleMaps}</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-10 text-ink leading-relaxed">
            <section>
              <h2 className="font-display text-2xl font-semibold text-forest">{t.detail.overview}</h2>
              <p className="mt-3 text-base sm:text-lg text-ink/80 leading-relaxed">
                {destination.overview}
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-forest">{t.detail.whyVisit}</h2>
              <p className="mt-3 text-base text-ink/80 leading-relaxed border-l-2 border-ember pl-4 italic">
                {destination.whyVisit}
              </p>
            </section>

            {destination.highlights && destination.highlights.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold text-forest">{t.detail.highlights}</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {destination.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 rounded-xl bg-white/70 p-3 text-sm text-ink/85 border border-ink/5">
                      <CheckCircle className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {destination.travelTips && destination.travelTips.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold text-forest">{t.detail.travelTips}</h2>
                <div className="mt-4 space-y-2.5">
                  {destination.travelTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-2xl bg-cream/70 p-4 border border-ink/10 text-sm text-ink/80">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-[0.7rem] font-bold text-cream">
                        {i + 1}
                      </span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Embedded Interactive Map */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-forest">{t.detail.locationOnMap}</h2>
              <div className="mt-4 overflow-hidden rounded-3xl shadow-soft">
                <iframe
                  title={`Map of ${destination.name}`}
                  src={mapsEmbed(destination.mapsQuery)}
                  loading="lazy"
                  className="h-80 w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* WhatsApp Booking CTA */}
            <div className="rounded-3xl bg-forest p-6 text-cream shadow-soft">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ember">
                Garut Journey
              </span>
              <h3 className="font-display mt-2 text-2xl font-semibold leading-snug">
                {t.detail.consultPackage}
              </h3>
              <p className="mt-3 text-xs text-cream/75 leading-relaxed">
                Kami siap mengatur transportasi, pemandu lokal berlisensi, dan jadwal perjalanan menyenangkan ke {destination.name}.
              </p>
              <a
                href={whatsappLink(`Halo Admin Garut Journey! Saya ingin konsultasi paket wisata ke ${destination.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition hover:bg-ember-600"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>

            {/* Quick Share Box */}
            <div className="rounded-3xl bg-white p-5 shadow-soft border border-ink/5">
              <h4 className="font-display text-base font-semibold text-forest">{t.detail.share}</h4>
              <div className="mt-3">
                <ShareButtons title={destination.name} path={`/destinations/${destination.slug}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Destinations */}
        {nearbyDests.length > 0 && (
          <div className="mt-20 border-t border-ink/10 pt-12">
            <h3 className="font-display text-2xl font-semibold text-forest">
              {t.detail.nearbyDestinations}
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyDests.map((d: any) => (
                <DestinationCard key={d.slug} d={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
