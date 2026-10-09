import { Link } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowRight,
  MapPin,
  Search,
  UtensilsCrossed,
  Compass,
  BookOpen,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Img } from '@/components/Img'
import { btn } from '@/components/BookLink'
import { useArticles } from '@/lib/articlesStorage'
import { useCulinary, useExperiences } from '@/lib/contentStorage'
import { useDestinations } from '@/lib/destinationsStorage'
import { useParallax } from '@/lib/useParallax'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'
import { handleNavClick } from '@/lib/nav'

type Result =
  | { kind: 'destination'; label: string; meta: string; slug: string }
  | { kind: 'food' | 'activity'; label: string; meta: string; hash: string }
  | { kind: 'guide'; label: string; meta: string; slug: string }

function useSearch(query: string): Result[] {
  const { destinations } = useDestinations()
  const dishes = useCulinary()
  const experiences = useExperiences()
  const { articles } = useArticles()
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const has = (...parts: string[]) => parts.join(' ').toLowerCase().includes(q)
    const out: Result[] = []
    destinations.forEach((d) => {
      if (has(d.name, d.short, d.location, d.categories.join(' '), d.activities.join(' ')))
        out.push({ kind: 'destination', label: d.name, meta: `${d.categories[0]} · ${d.location}`, slug: d.slug })
    })
    dishes.forEach((f) => {
      if (has(f.name, f.description)) out.push({ kind: 'food', label: f.name, meta: 'Culinary', hash: 'culinary' })
    })
    experiences.forEach((e) => {
      if (has(e.label, e.blurb)) out.push({ kind: 'activity', label: `${e.emoji} ${e.label}`, meta: 'Experience', hash: 'experience' })
    })
    articles.forEach((a) => {
      if (has(a.title, a.excerpt, a.category)) out.push({ kind: 'guide', label: a.title, meta: 'Travel guide', slug: a.slug })
    })
    return out.slice(0, 7)
  }, [query, destinations, dishes, experiences, articles])
}

const icons = { destination: MapPin, food: UtensilsCrossed, activity: Compass, guide: BookOpen }

function HeroSearch() {
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const results = useSearch(q)
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const showList = focused && q.trim().length >= 2
  const { t } = useLanguage()

  return (
    <div
      className="relative w-full max-w-2xl"
      onFocus={() => {
        clearTimeout(blurTimer.current)
        setFocused(true)
      }}
      onBlur={() => {
        blurTimer.current = setTimeout(() => setFocused(false), 200)
      }}
    >
      <div className="flex items-center gap-3 rounded-full bg-white/95 px-5 py-3.5 shadow-2xl backdrop-blur-md ring-1 ring-black/10 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-ember">
        <Search className="h-5 w-5 text-forest/70 shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.hero.searchPlaceholder}
          aria-label="Cari destinasi atau kuliner"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none font-medium"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="text-xs font-semibold text-ink/40 hover:text-ink"
          >
            {t.hero.searchClear}
          </button>
        )}
      </div>

      {showList && results.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-40 mt-2 space-y-1 rounded-3xl bg-white p-2.5 shadow-2xl ring-1 ring-black/10 animate-fade-in">
          {results.map((r) => {
            const Icon = icons[r.kind]
            const inner = (
              <>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-forest/10 text-forest shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{r.label}</span>
                  <span className="block text-xs text-ink/55">{r.meta}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-ink/30" />
              </>
            )
            const cls = 'flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-cream'
            return (
              <li key={r.kind + r.label}>
                {r.kind === 'destination' ? (
                  <Link to="/destinations/$slug" params={{ slug: r.slug }} className={cls}>
                    {inner}
                  </Link>
                ) : r.kind === 'guide' ? (
                  <Link to="/guide/$slug" params={{ slug: r.slug }} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <Link
                    to="/"
                    hash={r.hash}
                    className={cls}
                    onClick={() => {
                      setFocused(false)
                      handleNavClick(r.hash)
                    }}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function Hero() {
  const bg = useParallax<HTMLDivElement>(0.35)
  const { t } = useLanguage()
  const { settings } = useSiteSettings()

  const bgImage = settings.heroBackground || 'hero.png'

  // Dynamic darkness overlay chosen by admin
  const overlayClass =
    settings.heroBgDarkness === 'light'
      ? 'bg-gradient-to-b from-ink/40 via-ink/15 to-ink/75'
      : settings.heroBgDarkness === 'dark'
      ? 'bg-gradient-to-b from-ink/80 via-ink/45 to-ink/95'
      : 'bg-gradient-to-b from-ink/65 via-ink/20 to-ink/90'

  return (
    <section id="top" aria-label="Welcome" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-cream">
      <div id="main" className="sr-only" />
      {/* Dynamic Background Image controlled by WP Admin */}
      <div
        ref={bg}
        className={`absolute inset-[-12%_0] -z-10 will-change-transform ${
          settings.heroZoomEffect ? 'scale-105 transition-transform duration-[12000ms] ease-out' : ''
        }`}
      >
        <Img
          file={bgImage}
          alt="Sunrise over the volcanoes and rice terraces of Garut"
          sizes="100vw"
          eager
          fallback="hero.png"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Atmospheric Overlays */}
      <div className={`absolute inset-0 -z-10 ${overlayClass}`} />
      <div className="grain absolute inset-0 -z-10" />

      {/* Main Hero Content */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-36 lg:px-8 lg:pb-28">
        {/* Top Badges */}
        <div className="flex flex-col items-start gap-2.5">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.25em] backdrop-blur text-cream shadow-soft">
            <span className="h-2 w-2 rounded-full bg-ember" />
            <span>{settings.name || 'Garut Journey'}</span>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="font-display text-base sm:text-lg font-semibold uppercase tracking-[0.22em] text-ember drop-shadow-md">
              {settings.subtitle || 'Explore Swiss van Java'}
            </h2>
            <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-cream/40" />
            <span className="hidden sm:inline-block text-xs font-medium text-cream/70 tracking-wider">
              {t.hero.eyebrow}
            </span>
          </div>
        </div>

        <h1 className="font-display mt-5 max-w-5xl text-[3.25rem] font-light leading-[0.95] tracking-tight sm:text-7xl lg:text-[7.5rem]">
          {settings.heroTitleLine1 || t.hero.titleLine1}{' '}
          <em className="font-normal text-ember not-italic">{settings.heroTitleHighlight || t.hero.titleHighlight}</em>
          <br />
          <span className="text-3xl sm:text-5xl lg:text-6xl font-light opacity-90">{settings.heroTitleLine2 || t.hero.titleLine2}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85 sm:text-xl">
          {settings.heroDesc || t.hero.desc}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            hash="destinations"
            onClick={() => handleNavClick('destinations')}
            className={btn.primary}
          >
            {settings.heroCtaPrimary || t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            hash="city-tours"
            onClick={() => handleNavClick('city-tours')}
            className={`${btn.ghost} text-cream`}
          >
            {settings.heroCtaSecondary || t.hero.ctaSecondary}
          </Link>
        </div>

        <div className="mt-9">
          <HeroSearch />
        </div>
      </div>

      <a
        href="#why"
        onClick={(e) => {
          e.preventDefault()
          handleNavClick('why')
        }}
        aria-label="Scroll to discover more"
        className="absolute bottom-7 right-6 hidden flex-col items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cream/70 lg:flex"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-12 w-px bg-white/25">
          <ArrowDown className="scroll-cue absolute -left-[7px] top-0 h-4 w-4" />
        </span>
      </a>
    </section>
  )
}
