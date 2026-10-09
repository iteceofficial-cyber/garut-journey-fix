import { useState } from 'react'
import { DestinationCard } from '@/components/DestinationCard'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { categories, type Category } from '@/data/destinations'
import { useDestinations } from '@/lib/destinationsStorage'
import { useLanguage } from '@/lib/i18n'

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        active ? 'bg-forest text-cream shadow-soft' : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-forest hover:ring-forest/40'
      }`}
    >
      {children}
    </button>
  )
}

export function Destinations() {
  const { destinations } = useDestinations()
  const { t } = useLanguage()
  const [cat, setCat] = useState<'All' | Category>('All')
  const list = cat === 'All' ? destinations : destinations.filter((d) => d.categories.includes(cat))

  return (
    <section id="destinations" className="bg-cream-200/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.destinations.eyebrow}
          title={t.destinations.title}
          intro={t.destinations.intro}
        />

        <Reveal delay={100} className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2">
          <div role="group" aria-label="Filter destinations by category" className="flex gap-2">
            {(['All', ...categories] as const).map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c === 'All' ? t.destinations.catAll : c}
              </Chip>
            ))}
          </div>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          Showing {list.length} destinations
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 80}>
              <DestinationCard d={d} />
            </Reveal>
          ))}
          {list.length === 0 && (
            <p className="col-span-full rounded-3xl bg-white p-10 text-center text-ink/60">
              New {cat.toLowerCase()} destinations are coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
