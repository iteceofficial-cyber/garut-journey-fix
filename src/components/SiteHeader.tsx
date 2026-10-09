import { Link } from '@tanstack/react-router'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navLinks } from '@/data/site'
import { BookLink, btn } from './BookLink'
import { Logo } from './Logo'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/lib/siteSettings'
import { handleNavClick } from '@/lib/nav'

function getTranslatedLabel(label: string, t: any): string {
  switch (label.toLowerCase()) {
    case 'home':
      return t.nav.home
    case 'destinations':
      return t.nav.destinations
    case 'city tours':
      return t.nav.cityTours
    case 'culinary':
      return t.nav.culinary
    case 'itinerary':
      return t.nav.itinerary
    case 'team guide':
      return 'Tim & Guide'
    case 'tentang kami':
      return 'Tentang Kami'
    case 'gallery':
      return t.nav.gallery
    case 'reviews':
      return t.nav.reviews || 'Ulasan'
    case 'login admin':
      return t.nav.loginAdmin
    case 'travel guide':
      return t.nav.travelGuide
    case 'contact':
      return t.nav.contact
    default:
      return label
  }
}

function LanguageSelector({ solid }: { solid: boolean }) {
  const { lang, switchLanguage, supportedLanguages } = useLanguage()
  const [openDropdown, setOpenDropdown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const currentOpt = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpenDropdown(!openDropdown)}
        aria-label="Select Language"
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
          solid
            ? 'bg-ink/5 text-ink hover:bg-ink/10 ring-1 ring-ink/10'
            : 'bg-white/10 text-cream hover:bg-white/20 ring-1 ring-white/20'
        }`}
      >
        <Globe className="h-3.5 w-3.5 opacity-80" />
        <span className="text-sm">{currentOpt.flag}</span>
        <span className="uppercase tracking-wider">{currentOpt.code}</span>
      </button>

      {openDropdown && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white p-1.5 shadow-2xl ring-1 ring-ink/10 z-50 animate-fade-in text-ink">
          {supportedLanguages.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                switchLanguage(opt.code)
                setOpenDropdown(false)
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                lang === opt.code
                  ? 'bg-forest text-cream'
                  : 'text-ink/80 hover:bg-cream/60 hover:text-ink'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{opt.flag}</span>
                <span>{opt.label}</span>
              </span>
              {lang === opt.code && <span className="h-1.5 w-1.5 rounded-full bg-ember" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MoreDropdown({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const moreLinks = [
    { label: 'Team Guide', hash: 'team' },
    { label: 'Tentang Kami', hash: 'company-profile' },
    { label: 'Gallery', hash: 'gallery' },
    { label: 'Reviews', hash: 'testimonials' },
    { label: 'Contact', hash: 'contact' },
  ]

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Menu lainnya"
        className={`whitespace-nowrap rounded-full px-2.5 2xl:px-3 py-1.5 text-[0.78rem] 2xl:text-[0.82rem] font-medium transition inline-flex items-center gap-1 ${
          solid
            ? 'text-ink/80 hover:bg-forest/10 hover:text-forest'
            : 'text-cream/90 hover:bg-white/15 hover:text-white'
        }`}
      >
        <span>{t.nav?.more || 'Lainnya'}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-ink/10 z-50 animate-fade-in text-ink">
          {moreLinks.map((l) => {
            const labelText = getTranslatedLabel(l.label, t)
            return (
              <Link
                key={l.label}
                to="/"
                hash={l.hash}
                onClick={() => {
                  setOpen(false)
                  handleNavClick(l.hash)
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-ink/80 hover:bg-cream/70 hover:text-forest transition"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-forest/40 shrink-0" />
                <span>{labelText}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Sticky navigation with dynamic language, animation and mobile drawer. */
export function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/admin') || path.startsWith('/wp-admin') || path.startsWith('/login')) {
      return null
    }
  }

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { lang, switchLanguage, supportedLanguages, t } = useLanguage()
  const { settings } = useSiteSettings()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || !overHero
  const headerAnim = settings.headerAnimation || 'subtle-glow'

  return (
    <>
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault()
          handleNavClick('top')
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ember focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? 'bg-cream/90 shadow-[0_1px_0_rgb(23_35_29/0.08)] backdrop-blur-xl'
            : 'bg-transparent'
        } ${headerAnim === 'subtle-glow' && solid ? 'shadow-[0_4px_20px_rgba(206,108,63,0.12)]' : ''}`}
      >
        {/* Animated top shimmer or accent line when selected by admin */}
        {headerAnim === 'gradient-shimmer' && (
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-forest via-ember to-forest animate-pulse" />
        )}

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            hash="top"
            onClick={() => handleNavClick('top')}
            aria-label="Garut Journey — home"
            className="shrink-0"
          >
            <Logo light={!solid} />
          </Link>

          <nav aria-label="Main" className="hidden lg:flex lg:items-center lg:justify-center flex-1 min-w-0 px-2">
            <ul
              className={`flex items-center gap-0.5 2xl:gap-1 rounded-full px-2 py-1 transition ${
                solid
                  ? 'bg-ink/[0.03] ring-1 ring-ink/[0.06]'
                  : 'bg-black/20 backdrop-blur-md ring-1 ring-white/15'
              }`}
            >
              {[
                { label: 'Destinations', hash: 'destinations' },
                { label: 'City Tours', hash: 'city-tours' },
                { label: 'Culinary', hash: 'culinary' },
                { label: 'Itinerary', hash: 'itinerary' },
                { label: 'Travel Guide', hash: 'guide' },
              ].map((l) => {
                const labelText = getTranslatedLabel(l.label, t)
                return (
                  <li key={l.label} className="shrink-0">
                    <Link
                      to="/"
                      hash={l.hash}
                      onClick={() => handleNavClick(l.hash)}
                      className={`whitespace-nowrap block rounded-full px-2.5 2xl:px-3 py-1.5 text-[0.78rem] 2xl:text-[0.82rem] font-medium transition ${
                        solid
                          ? 'text-ink/80 hover:bg-forest/10 hover:text-forest'
                          : 'text-cream/90 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {labelText}
                    </Link>
                  </li>
                )
              })}
              {/* More dropdown for secondary links */}
              <li>
                <MoreDropdown solid={solid} />
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Header Language Switcher */}
            <LanguageSelector solid={solid} />

            <BookLink className={`${btn.primary} hidden !px-4 !py-2 sm:inline-flex text-xs whitespace-nowrap`}>
              {t.nav.bookTour}
            </BookLink>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={`rounded-full p-2.5 transition lg:hidden ${
                solid ? 'text-ink hover:bg-ink/5' : 'text-cream hover:bg-white/10'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] overflow-y-auto bg-forest text-cream transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? '[clip-path:circle(150%_at_100%_0)]' : 'pointer-events-none [clip-path:circle(0%_at_100%_0)]'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-forest/95 backdrop-blur-md z-10 border-b border-white/5">
          <Logo light />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2.5 hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav aria-label="Mobile" className="px-6 py-4 pb-12">
          {/* Mobile Language Switcher Bar */}
          <div className="mb-6 rounded-2xl bg-white/10 p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-cream/70">
              <Globe className="h-4 w-4 text-ember" />
              <span>Pilih Bahasa:</span>
            </div>
            <div className="flex items-center gap-1">
              {supportedLanguages.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => switchLanguage(opt.code)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                    lang === opt.code
                      ? 'bg-ember text-white shadow-sm'
                      : 'bg-white/5 text-cream/70 hover:bg-white/15'
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span className="uppercase">{opt.code}</span>
                </button>
              ))}
            </div>
          </div>

          <ul className="space-y-1">
            {navLinks.map((l, i) => {
              const labelText = getTranslatedLabel(l.label, t)
              return (
                <li
                  key={l.label}
                  className={`transition-all duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
                  style={{ transitionDelay: open ? `${70 + i * 30}ms` : '0ms' }}
                >
                  {l.to ? (
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="font-display flex items-baseline gap-4 py-1.5 text-2xl sm:text-3xl text-ember hover:text-white transition group"
                    >
                      <span className="text-xs tracking-widest text-cream/40 group-hover:text-cream/80">0{i + 1}</span>
                      <span className="flex items-center gap-2.5">
                        <span>{labelText}</span>
                        <span className="rounded-full bg-ember/20 border border-ember/40 px-2 py-0.5 text-[0.65rem] font-sans font-bold text-ember uppercase tracking-wider">
                          WP-Admin
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to="/"
                      hash={l.hash}
                      onClick={() => {
                        setOpen(false)
                        handleNavClick(l.hash)
                      }}
                      className="font-display flex items-baseline gap-4 py-1.5 text-2xl sm:text-3xl hover:text-ember transition"
                    >
                      <span className="text-xs tracking-widest text-cream/40">0{i + 1}</span>
                      <span>{labelText}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          <BookLink className={`${btn.primary} mt-8 w-full`} onNavigate={() => setOpen(false)}>
            {t.nav.bookTour}
          </BookLink>
        </nav>
      </div>
    </>
  )
}
