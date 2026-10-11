import { useEffect } from 'react'
import { HeadContent, Link, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WhatsAppFab } from '@/components/WhatsAppFab'
import { site } from '@/data/site'
import { img } from '@/lib/img'
import { useLanguage } from '@/lib/i18n'
import { trackPageView } from '@/lib/trafficTracker'
import { scrollToSection } from '@/lib/nav'
import { DEFAULT_SEO_SETTINGS, getStoredSeoSettings, useSeoSettings } from '@/lib/seoSettings'
import { getStoredSiteSettings, initialSiteSettings, useSiteSettings } from '@/lib/siteSettings'

import '../styles.css'

const defaultTitle = `${site.name} — ${site.tagline}`

function computeActiveTitle(
  settings: ReturnType<typeof getStoredSiteSettings>,
  seo: ReturnType<typeof getStoredSeoSettings>
): string {
  const siteIdentityChanged =
    (settings.name && settings.name !== initialSiteSettings.name) ||
    (settings.tagline && settings.tagline !== initialSiteSettings.tagline)
  const seoTitleChanged =
    seo.metaTitle &&
    seo.metaTitle !== DEFAULT_SEO_SETTINGS.metaTitle &&
    seo.metaTitle !== defaultTitle

  if (siteIdentityChanged && !seoTitleChanged) {
    return `${settings.name || site.name} — ${settings.tagline || settings.subtitle || site.tagline}`
  }
  if (seoTitleChanged) {
    return seo.metaTitle
  }
  if (settings.name || settings.tagline) {
    return `${settings.name || site.name} — ${settings.tagline || site.tagline}`
  }
  return seo.metaTitle || defaultTitle
}

function computeActiveFavicon(settings: ReturnType<typeof getStoredSiteSettings>): string {
  if (settings.faviconType === 'custom' && settings.faviconUrl) {
    return settings.faviconUrl
  }
  if (settings.faviconType === 'same-as-logo' && settings.customLogoUrl) {
    return settings.customLogoUrl
  }
  return settings.faviconUrl || '/favicon.svg'
}

export const Route = createRootRoute({
  head: () => {
    const storedSite = getStoredSiteSettings()
    const storedSeo = getStoredSeoSettings()
    const activeTitle = computeActiveTitle(storedSite, storedSeo)
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: activeTitle },
        { name: 'description', content: storedSeo.metaDescription || site.description },
        { name: 'theme-color', content: '#1F5D42' },
        { property: 'og:site_name', content: storedSite.name || site.name },
        { property: 'og:title', content: storedSeo.ogTitle || activeTitle },
        { property: 'og:description', content: storedSeo.ogDescription || storedSeo.metaDescription || site.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: img(storedSeo.ogImage || 'hero.png', 1200) },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,50;1,9..144,300..700,50&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: storedSite.name || site.name,
            slogan: storedSite.tagline || site.tagline,
            description: storedSeo.metaDescription || site.description,
            areaServed: 'Garut, West Java, Indonesia',
          }),
        },
      ],
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-forest px-6 pt-24 text-center text-cream">
      <div>
        <p className="eyebrow !text-ember">Lost in the highlands</p>
        <h1 className="font-display mt-4 text-5xl sm:text-7xl">This trail doesn’t exist.</h1>
        <p className="mx-auto mt-5 max-w-md text-cream/70">The page you’re looking for has moved or never existed. Let’s get you back on the map.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-ember px-6 py-3.5 text-sm font-semibold text-white">
          Back to Garut
        </Link>
      </div>
    </section>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState()
  const pathname = routerState?.location?.pathname || ''
  const isKwitansi = pathname.startsWith('/kwitansi')
  const isBrowserAdmin =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/wp-admin') ||
    pathname.startsWith('/login')
  const isAdminPage = isKwitansi || Boolean(isBrowserAdmin)
  const { lang, isRtl } = useLanguage()

  const { seo } = useSeoSettings()
  const { settings } = useSiteSettings()

  // Track page views for WP Admin Traffic Analytics
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  // Dynamically synchronize SEO metadata, Schema.org JSON-LD, Tab Title & Favicon from admin settings
  useEffect(() => {
    if (typeof document === 'undefined') return

    // Resolve active favicon from admin settings (works across both public & admin pages)
    const activeFavicon = computeActiveFavicon(settings)

    if (activeFavicon) {
      const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
      existingIcons.forEach((el) => el.parentNode?.removeChild(el))

      const favEl = document.createElement('link')
      favEl.setAttribute('rel', 'icon')
      favEl.setAttribute('href', activeFavicon)
      if (activeFavicon.endsWith('.svg') || activeFavicon.startsWith('data:image/svg+xml')) {
        favEl.setAttribute('type', 'image/svg+xml')
      } else if (activeFavicon.endsWith('.ico')) {
        favEl.setAttribute('type', 'image/x-icon')
      } else {
        favEl.setAttribute('type', 'image/png')
      }
      document.head.appendChild(favEl)
    }

    // Resolve dynamic browser tab title on home, admin, and public pages
    const isDetailRoute = pathname.startsWith('/destinations/') || pathname.startsWith('/guide/')
    if (!isDetailRoute) {
      const resolvedTitle = computeActiveTitle(settings, seo)
      document.title = resolvedTitle
      const titleTags = document.querySelectorAll('head > title')
      titleTags.forEach((tag, idx) => {
        if (idx === 0) {
          tag.textContent = resolvedTitle
        } else {
          tag.parentNode?.removeChild(tag)
        }
      })
    }

    if (isAdminPage) return

    const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      if (!content) return
      const selector = isProperty
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`
      let el = document.querySelector(selector) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        if (isProperty) el.setAttribute('property', nameOrProperty)
        else el.setAttribute('name', nameOrProperty)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const activeTitle = document.title || seo.metaTitle || defaultTitle
    setMeta('description', seo.metaDescription)
    setMeta('keywords', seo.focusKeywords)
    setMeta('author', seo.author)
    setMeta('robots', `${seo.robotsIndex ? 'index' : 'noindex'}, ${seo.robotsFollow ? 'follow' : 'nofollow'}`)
    setMeta('og:site_name', settings.name || site.name, true)
    setMeta('og:title', seo.ogTitle && seo.ogTitle !== defaultTitle ? seo.ogTitle : activeTitle, true)
    setMeta('og:description', seo.ogDescription || seo.metaDescription, true)
    setMeta('og:image', img(seo.ogImage || 'hero.png', 1200), true)
    setMeta('twitter:title', seo.ogTitle && seo.ogTitle !== defaultTitle ? seo.ogTitle : activeTitle)
    setMeta('twitter:description', seo.ogDescription || seo.metaDescription)
    setMeta('twitter:image', img(seo.ogImage || 'hero.png', 1200))

    if (seo.canonicalUrl) {
      let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', seo.canonicalUrl)
    }

    let schemaScript = document.getElementById('garut-schema-jsonld') as HTMLScriptElement | null
    if (!schemaScript) {
      schemaScript = document.createElement('script')
      schemaScript.id = 'garut-schema-jsonld'
      schemaScript.type = 'application/ld+json'
      document.head.appendChild(schemaScript)
    }
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': seo.schemaType || 'TravelAgency',
      name: settings.name || 'Garut Journey',
      url: seo.canonicalUrl || 'https://garutjourney.com',
      description: seo.metaDescription,
      telephone: seo.schemaTelephone || settings.whatsapp,
      priceRange: seo.schemaPriceRange,
      address: {
        '@type': 'PostalAddress',
        addressLocality: seo.schemaAddressLocality || 'Garut',
        addressRegion: seo.schemaAddressRegion || 'Jawa Barat',
        addressCountry: seo.schemaAddressCountry || 'ID',
      },
    })
  }, [seo, settings, pathname, isAdminPage])

  // Smooth scroll to hash on initial load or route transition (e.g. from /destinations/... to /#destinations)
  useEffect(() => {
    const scrollToHash = () => {
      if (typeof window === 'undefined') return
      const hash = window.location.hash
      if (hash) {
        scrollToSection(hash)
      }
    }
    const timer1 = setTimeout(scrollToHash, 60)
    const timer2 = setTimeout(scrollToHash, 250)
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [pathname])

  const isHomePage = pathname === '/'

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body id="top" suppressHydrationWarning>
        {!isAdminPage && <SiteHeader overHero={isHomePage} />}
        <main id="main">{children}</main>
        {!isAdminPage && <SiteFooter />}
        {!isAdminPage && <WhatsAppFab />}
        <Scripts />
      </body>
    </html>
  )
}
