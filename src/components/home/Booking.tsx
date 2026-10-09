import { ArrowRight } from 'lucide-react'
import { BookLink, btn } from '@/components/BookLink'
import { Img } from '@/components/Img'
import { Reveal } from '@/components/Reveal'
import { WhatsAppIcon } from '@/components/WhatsAppFab'
import { whatsappLink } from '@/data/site'
import { useParallax } from '@/lib/useParallax'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'

export function Booking() {
  const bg = useParallax<HTMLDivElement>(0.2)
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  return (
    <section id="booking" className="px-3 sm:px-5">
      <div className="relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-ink px-6 py-24 text-center text-cream sm:py-32">
        <div ref={bg} className="absolute inset-[-15%_0] -z-10">
          <Img file={settings.bookingImage || 'hiking.png'} alt="" sizes="100vw" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/80 via-ink/60 to-ink/90" />
        <Reveal className="mx-auto max-w-3xl">
          <span className="eyebrow !text-ember">{settings.bookingEyebrow || t.readyBanner.eyebrow}</span>
          <h2 className="font-display mt-5 text-5xl leading-[1] tracking-tight sm:text-7xl">{settings.bookingTitle || t.readyBanner.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">
            {settings.bookingSubtitle || t.readyBanner.subtitle}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <BookLink className={`${btn.primary} !px-8 !py-4 text-base`}>
              {t.readyBanner.bookBtn} <ArrowRight className="h-4 w-4" />
            </BookLink>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${btn.ghost} !px-8 !py-4 text-base text-cream`}>
              <WhatsAppIcon className="h-5 w-5" /> {t.readyBanner.chatBtn}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
