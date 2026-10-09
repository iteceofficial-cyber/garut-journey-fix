import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Img } from '@/components/Img'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { useCulinary } from '@/lib/contentStorage'
import { useLanguage } from '@/lib/i18n'

export function Culinary() {
  const { t } = useLanguage()
  const dishes = useCulinary()

  return (
    <section id="culinary" className="bg-ink py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            dark
            eyebrow={t.culinary.eyebrow}
            title={t.culinary.title}
            intro={t.culinary.intro}
          />
          <Reveal delay={100}>
            <Link to="/guide/$slug" params={{ slug: 'surga-kuliner-otentik-garut' }} className="inline-flex items-center gap-2 text-sm font-semibold text-ember hover:underline">
              {t.culinary.exploreAllFood} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
          {dishes.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 90} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
              <article className="group h-full overflow-hidden rounded-[1.75rem] bg-white/[0.04] ring-1 ring-white/10 transition duration-500 hover:bg-white/[0.08]">
                <div className="aspect-[4/3] overflow-hidden">
                  <Img file={d.image} alt={d.name} sizes="(min-width: 1024px) 33vw, 80vw" className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-[1.07]" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{d.name}</h3>
                  <p className="mt-2 leading-relaxed text-cream/70">{d.description}</p>
                  <dl className="mt-5 space-y-1.5 text-sm text-cream/60">
                    <div className="flex gap-2">
                      <dt className="sr-only">{t.culinary.priceRange}</dt>
                      <dd className="font-semibold text-ember">{d.priceRange}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{t.culinary.whereToFind}</dt>
                      <MapPin className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
                      <dd>{d.location}</dd>
                    </div>
                  </dl>
                  <Link
                    to="/guide/$slug"
                    params={{ slug: 'surga-kuliner-otentik-garut' }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-ember hover:bg-ember"
                  >
                    {t.culinary.discoverFood} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
