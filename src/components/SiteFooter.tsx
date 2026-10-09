import { Link } from '@tanstack/react-router'
import { ArrowRight, Facebook, Instagram, Lock, Mail, MapPin, Youtube } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { mapsLink, site, whatsappLink } from '@/data/site'
import { formToObject, submitNetlifyForm } from '@/lib/forms'
import { Logo } from './Logo'
import { WhatsAppIcon } from './WhatsAppFab'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'
import { handleNavClick } from '@/lib/nav'

const footerNav = [
  { key: 'story', label: 'About', hash: 'story' },
  { key: 'destinations', label: 'Destinations', hash: 'destinations' },
  { key: 'cityTours', label: 'City Tours', hash: 'city-tours' },
  { key: 'culinary', label: 'Culinary', hash: 'culinary' },
  { key: 'itinerary', label: 'Itinerary', hash: 'itinerary' },
  { key: 'guide', label: 'Travel Guide', hash: 'guide' },
  { key: 'contact', label: 'Contact', hash: 'contact' },
]

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
    </svg>
  )
}

function Newsletter() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('sending')
    try {
      await submitNetlifyForm('newsletter', formToObject(e.currentTarget))
      setState('done')
    } catch {
      setState('error')
    }
  }
  if (state === 'done') {
    return (
      <p role="status" className="rounded-2xl bg-white/10 px-5 py-4 text-cream">
        Terima kasih! You’re on the list — Garut stories are on their way.
      </p>
    )
  }
  return (
    <form name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="newsletter" />
      <p className="hidden">
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-ember">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Your email address"
          className="min-w-0 flex-1 bg-transparent px-4 text-cream placeholder:text-cream/45 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember-600 disabled:opacity-60"
        >
          {state === 'sending' ? 'Joining…' : 'Subscribe'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {state === 'error' && <p className="mt-2 text-sm text-ember">Something went wrong. Please try again.</p>}
      <p className="mt-3 text-xs text-cream/45">Monthly travel stories, new tours and local tips. Unsubscribe anytime.</p>
    </form>
  )
}

export function SiteFooter() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  const socials = [
    { label: 'Instagram', href: settings.socialInstagram || site.socials.instagram, icon: <Instagram className="h-4 w-4" /> },
    { label: 'TikTok', href: settings.socialTikTok || site.socials.tiktok, icon: <TikTok className="h-4 w-4" /> },
    { label: 'Facebook', href: settings.socialFacebook || site.socials.facebook, icon: <Facebook className="h-4 w-4" /> },
    { label: 'YouTube', href: settings.socialYouTube || site.socials.youtube, icon: <Youtube className="h-4 w-4" /> },
  ]

  const anim = settings.footerAnimation || 'floating-particles'

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      {/* Dynamic Animated Accents configured in WP Admin */}
      {anim === 'floating-particles' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-[15%] h-2 w-2 rounded-full bg-ember/60 animate-ping" />
          <div className="absolute top-32 right-[20%] h-1.5 w-1.5 rounded-full bg-leaf/70 animate-pulse duration-1000" />
          <div className="absolute bottom-20 left-[25%] h-2.5 w-2.5 rounded-full bg-amber-400/50 animate-bounce duration-[3000ms]" />
          <div className="absolute bottom-12 right-[10%] h-2 w-2 rounded-full bg-ember/50 animate-ping duration-[4000ms]" />
        </div>
      )}

      {anim === 'wave-motion' && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden opacity-25">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-emerald-800 animate-pulse">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,0 L0,0 Z" />
          </svg>
        </div>
      )}

      {anim === 'subtle-glow' && (
        <div className="pointer-events-none absolute -top-40 inset-x-0 h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ember/15 via-forest/10 to-transparent blur-3xl" />
      )}

      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 lg:px-8 relative z-10">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display max-w-md text-4xl leading-tight sm:text-5xl">
              Get Garut in your inbox.
            </h2>
            <p className="mt-4 max-w-md text-cream/65">
              Join the newsletter for seasonal itineraries, new city tours and the local food we can’t stop talking about.
            </p>
          </div>
          <div className="lg:pt-4">
            <Newsletter />
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="font-display mt-5 text-xl italic text-cream/80">
              {settings.subtitle || 'Explore Swiss van Java'}
            </p>
            <p className="mt-2 text-xs text-cream/60 max-w-sm">
              {t.footer.tagline}
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-cream/75 transition hover:border-ember hover:bg-ember hover:text-white"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cream/45">{t.footer.quickLinks}</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {footerNav.map((l) => {
                const label =
                  l.key === 'story'
                    ? (t.nav?.home ? 'About' : l.label)
                    : l.key === 'destinations'
                    ? t.nav.destinations
                    : l.key === 'cityTours'
                    ? t.nav.cityTours
                    : l.key === 'culinary'
                    ? t.nav.culinary
                    : l.key === 'itinerary'
                    ? t.nav.itinerary
                    : l.key === 'guide'
                    ? t.nav.travelGuide
                    : l.key === 'contact'
                    ? t.nav.contact
                    : l.label

                return (
                  <li key={l.hash}>
                    <Link
                      to="/"
                      hash={l.hash}
                      onClick={() => handleNavClick(l.hash)}
                      className="text-cream/75 transition hover:text-ember"
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cream/45">{t.footer.contactUs}</h3>
            <ul className="mt-5 space-y-3.5 text-sm text-cream/75">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-ember">
                  <WhatsAppIcon className="h-4 w-4 shrink-0" /> {settings.whatsapp || site.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email || site.email}`} className="flex items-center gap-3 hover:text-ember">
                  <Mail className="h-4 w-4 shrink-0" /> {settings.email || site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {settings.address || site.address}
              </li>
              <li>
                <a href={mapsLink(settings.mapsQuery || site.mapsQuery)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ember hover:underline">
                  Open in Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-cream/45 sm:flex-row sm:justify-between sm:items-center">
          <p>© 2026 {settings.name || 'Garut Journey'}. {t.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-cream/90 hover:bg-forest hover:text-white transition shadow-sm border border-white/10"
              title="Masuk ke Dashboard Pengelola Website (WP Admin)"
            >
              <Lock className="h-3.5 w-3.5 text-ember" />
              <span>Login WP-Admin</span>
            </Link>
            <span>•</span>
            <p>Made with love in Garut, West Java.</p>
          </div>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="font-display pointer-events-none select-none whitespace-nowrap text-center text-[18vw] leading-[0.8] text-white/[0.035]"
      >
        GARUT
      </p>
    </footer>
  )
}
