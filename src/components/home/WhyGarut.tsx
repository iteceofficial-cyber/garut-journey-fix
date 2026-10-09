import { Mountain, UtensilsCrossed, Landmark, HeartHandshake } from 'lucide-react'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'

export function WhyGarut() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  const features = [
    { icon: Mountain, title: settings.whyGarutF1Title || t.whyGarut.f1Title, text: settings.whyGarutF1Desc || t.whyGarut.f1Desc },
    { icon: UtensilsCrossed, title: settings.whyGarutF2Title || t.whyGarut.f2Title, text: settings.whyGarutF2Desc || t.whyGarut.f2Desc },
    { icon: Landmark, title: settings.whyGarutF3Title || t.whyGarut.f3Title, text: settings.whyGarutF3Desc || t.whyGarut.f3Desc },
    { icon: HeartHandshake, title: settings.whyGarutF4Title || t.whyGarut.f4Title, text: settings.whyGarutF4Desc || t.whyGarut.f4Desc },
  ]

  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow={settings.whyGarutEyebrow || t.whyGarut.eyebrow}
            title={
              <>
                {settings.whyGarutTitle || t.whyGarut.title} <em className="text-forest">{settings.whyGarutHighlight || t.whyGarut.titleHighlight}</em>
              </>
            }
          />
          <Reveal delay={120}>
            <p className="text-lg leading-relaxed text-ink/70 lg:pb-2">
              {settings.whyGarutIntro || t.whyGarut.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="group relative h-full overflow-hidden rounded-[1.75rem] bg-white p-8 shadow-soft transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="font-display absolute right-6 top-5 text-5xl text-cream-200 transition group-hover:text-ember/25">0{i + 1}</span>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest text-cream transition duration-500 group-hover:rotate-[-6deg] group-hover:bg-ember">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-8 text-2xl text-ink">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/65">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
