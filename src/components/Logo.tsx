import { useSiteSettings } from '@/lib/siteSettings'

export function Logo({ light = false }: { light?: boolean }) {
  const { settings } = useSiteSettings()

  // If custom logo image URL is provided and set to custom
  if (settings.logoType === 'custom' && settings.customLogoUrl) {
    const height = settings.logoHeight || 36
    return (
      <span className="flex items-center gap-2.5">
        <img
          src={settings.customLogoUrl}
          alt={settings.name || 'Garut Journey'}
          style={{ height: `${height}px` }}
          className="w-auto object-contain max-w-[200px]"
        />
        {/* Optional text branding if desired alongside custom logo */}
        <span className="hidden sm:flex flex-col">
          <span className={`font-display text-[1rem] font-semibold leading-none tracking-[0.08em] ${light ? 'text-cream' : 'text-ink'}`}>
            {settings.name || 'GARUT JOURNEY'}
          </span>
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-ember mt-0.5">
            {settings.subtitle || 'Explore Swiss van Java'}
          </span>
        </span>
      </span>
    )
  }

  // Default elegant SVG badge logo
  const siteName = settings.name || 'GARUT JOURNEY'
  const siteSubtitle = settings.subtitle || 'Explore Swiss van Java'

  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="16" className="fill-ember" />
        <path d="M5 23 L12.5 12 L17 18 L20 14 L27 23 Z" className={light ? 'fill-cream' : 'fill-forest'} />
        <circle cx="21.5" cy="9.5" r="2.5" className="fill-cream" />
      </svg>
      <span className="flex flex-col">
        <span className={`font-display text-[1.05rem] font-semibold leading-none tracking-[0.12em] ${light ? 'text-cream' : 'text-ink'}`}>
          {siteName.includes(' ') ? (
            <>
              {siteName.split(' ')[0]}
              <span className="text-ember"> {siteName.split(' ').slice(1).join(' ')}</span>
            </>
          ) : (
            siteName
          )}
        </span>
        <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-ember mt-0.5">
          {siteSubtitle}
        </span>
      </span>
    </span>
  )
}
