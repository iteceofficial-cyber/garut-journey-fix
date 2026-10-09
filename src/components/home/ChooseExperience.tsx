import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { BookLink } from '@/components/BookLink'
import { Img } from '@/components/Img'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { useDestinations } from '@/lib/destinationsStorage'
import { useExperiences } from '@/lib/contentStorage'
import { useTourPackages } from '@/lib/toursStorage'
import { useLanguage } from '@/lib/i18n'

export function ChooseExperience() {
  const experiences = useExperiences()
  const { destinations } = useDestinations()
  const packages = useTourPackages()
  const [active, setActive] = useState(experiences[0]?.id || 'nature')
  const exp = experiences.find((e) => e.id === active) ?? experiences[0]
  const { t } = useLanguage()
  if (!exp) return null
  const dests = exp.destinations.map((s) => destinations.find((d) => d.slug === s)!).filter(Boolean)
  const pkgs = packages.filter((p) => exp.packages.includes(p.id))

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.experience.eyebrow}
          title={t.experience.title}
          intro={t.experience.intro}
        />

        <Reveal delay={100}>
          <div role="radiogroup" aria-label="Choose your experience" className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {experiences.map((e) => {
              const on = e.id === active
              return (
                <button
                  key={e.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setActive(e.id)}
                  className={`group flex items-center gap-3 rounded-2xl p-4 text-left transition duration-300 sm:p-5 ${
                    on ? 'bg-ink text-cream shadow-lift' : 'bg-white text-ink shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <span className={`text-2xl transition duration-300 sm:text-3xl ${on ? 'scale-110' : 'group-hover:scale-110'}`} aria-hidden="true">
                    {e.emoji}
                  </span>
                  <span className="text-sm font-semibold leading-tight sm:text-base">{e.label}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div key={exp.id} aria-live="polite" className="fade-up mt-10 grid gap-6 rounded-[2rem] bg-cream-200/70 p-6 sm:p-8 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-5xl" aria-hidden="true">{exp.emoji}</p>
              <h3 className="font-display mt-4 text-3xl text-ink">{exp.label}</h3>
              <p className="mt-3 leading-relaxed text-ink/70">{exp.blurb}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">{t.experience.recommendedTours}</p>
              <ul className="mt-3 space-y-2">
                {pkgs.map((p) => (
                  <li key={p.id}>
                    <BookLink tour={p.name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-semibold text-forest shadow-soft transition hover:bg-forest hover:text-cream">
                      <span>
                        {p.name} <span className="font-normal opacity-70">· {p.duration}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </BookLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {dests.map((d) => (
              <li key={d.slug}>
                <Link to="/destinations/$slug" params={{ slug: d.slug }} className="group relative block aspect-[3/4] overflow-hidden rounded-3xl">
                  <Img file={d.image} alt={d.name} sizes="(min-width: 1024px) 20vw, 50vw" className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-cream">
                    <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-ember">{d.categories[0]}</span>
                    <span className="font-display mt-1 block text-xl">{d.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
