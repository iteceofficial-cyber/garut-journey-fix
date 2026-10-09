import { Img } from '@/components/Img'
import { Reveal } from '@/components/Reveal'
import { useParallax } from '@/lib/useParallax'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'

export function BrandStory() {
  const img = useParallax<HTMLDivElement>(0.12)
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  return (
    <section id="story" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift">
            <div ref={img} className="absolute inset-[-8%_0]">
              <Img file={settings.storyImage || 'community.png'} alt="A local farmer walking along the rice terraces of Garut at sunrise" sizes="(min-width: 1024px) 45vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-8 -right-3 w-44 overflow-hidden rounded-3xl border-[6px] border-cream shadow-lift sm:-right-8 sm:w-56">
            <Img file={settings.storySecondaryImage || 'craft.png'} alt="A Garut artisan crafting leather by hand" sizes="224px" width={600} className="aspect-square w-full object-cover" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">{settings.storyEyebrow || t.story.eyebrow}</span>
            <h2 className="font-display mt-4 text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              {settings.storyTitle || t.story.title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/75">
              <p className="border-l-2 border-ember pl-4 italic text-ink/90 font-medium">
                "{settings.storyQuote || t.story.quote}"
              </p>
              <p>
                {settings.storyP1 || t.story.p1}
              </p>
              <p>
                {settings.storyP2 || t.story.p2}
              </p>
              <p>
                {settings.storyP3 || t.story.p3}
              </p>
            </div>
            <p className="font-display mt-8 text-2xl italic text-ember">{settings.storyWelcome || t.story.welcome}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
