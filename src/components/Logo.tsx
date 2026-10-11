import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/lib/siteSettings'
import { removeWhiteBackgroundFromImage } from '@/lib/img'

/** In-memory cache for processed transparent logo data URLs */
const transparentLogoCache = new Map<string, string>()

function TransparentLogoImage({
  src,
  alt,
  height,
  light = false,
  removeBg = true,
}: {
  src: string
  alt: string
  height: number
  light?: boolean
  removeBg?: boolean
}) {
  const [displaySrc, setDisplaySrc] = useState<string>(src)

  useEffect(() => {
    if (!removeBg) {
      setDisplaySrc(src)
      return
    }

    if (transparentLogoCache.has(src)) {
      setDisplaySrc(transparentLogoCache.get(src)!)
      return
    }

    let isMounted = true
    removeWhiteBackgroundFromImage(src, 30).then((cleanTransparent) => {
      if (isMounted) {
        transparentLogoCache.set(src, cleanTransparent)
        setDisplaySrc(cleanTransparent)
      }
    })

    return () => {
      isMounted = false
    }
  }, [src, removeBg])

  return (
    <img
      src={displaySrc}
      alt={alt}
      style={{ height: `${height}px` }}
      className={`w-auto object-contain max-w-[200px] transition-opacity duration-300 ${
        light ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]' : ''
      }`}
    />
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const { settings } = useSiteSettings()
  const siteName = settings.name || 'GARUT JOURNEY'
  const siteSubtitle = settings.subtitle || 'Explore Swiss van Java'

  // If custom logo image URL is provided and set to custom
  if (settings.logoType === 'custom' && settings.customLogoUrl) {
    const height = settings.logoHeight || 36
    const removeBg = settings.logoRemoveBg !== false

    return (
      <span className="flex items-center gap-2.5">
        <TransparentLogoImage
          src={settings.customLogoUrl}
          alt={siteName}
          height={height}
          light={light}
          removeBg={removeBg}
        />
        {/* Text branding alongside custom logo */}
        <span className="hidden sm:flex flex-col">
          <span
            className={`font-display text-[1rem] font-semibold leading-none tracking-[0.08em] ${
              light ? 'text-cream drop-shadow-sm' : 'text-ink'
            }`}
          >
            {siteName}
          </span>
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-ember mt-0.5">
            {siteSubtitle}
          </span>
        </span>
      </span>
    )
  }

  // Default elegant SVG badge logo
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="16" className="fill-ember" />
        <path d="M5 23 L12.5 12 L17 18 L20 14 L27 23 Z" className={light ? 'fill-cream' : 'fill-forest'} />
        <circle cx="21.5" cy="9.5" r="2.5" className="fill-cream" />
      </svg>
      <span className="flex flex-col">
        <span
          className={`font-display text-[1.05rem] font-semibold leading-none tracking-[0.12em] ${
            light ? 'text-cream drop-shadow-sm' : 'text-ink'
          }`}
        >
          {siteName.includes(' ') ? (
            <>
              <span>{siteName.split(' ')[0]}</span>{' '}
              <span className="text-ember">{siteName.split(' ').slice(1).join(' ')}</span>
            </>
          ) : (
            <span>{siteName}</span>
          )}
        </span>
        <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-ember mt-0.5">
          {siteSubtitle}
        </span>
      </span>
    </span>
  )
}
