import { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, handleFirestoreError, logFirestoreError, OperationType } from '@/lib/firebase'

export interface SeoSettings {
  metaTitle: string
  metaDescription: string
  focusKeywords: string
  author: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonicalUrl: string
  robotsIndex: boolean
  robotsFollow: boolean
  schemaType: 'TravelAgency' | 'TouristInformationCenter' | 'LocalBusiness'
  schemaPriceRange: string
  schemaTelephone: string
  schemaAddressLocality: string
  schemaAddressRegion: string
  schemaAddressCountry: string
  updatedAt?: string
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  metaTitle: 'Garut Journey — Explore Swiss van Java, Destinasi & Paket Tour Garut',
  metaDescription:
    'Satu kota, sejuta cerita. Eksplorasi wisata alam kawah Papandayan, danau Situ Bagendit, pemandian air panas Darajat, kuliner khas Sunda, dan booking paket city tour resmi Garut.',
  focusKeywords:
    'wisata garut, paket tour garut, kawah papandayan, darajat pass, kuliner garut, swiss van java, situ bagendit, hotel garut, liburan garut, trip garut',
  author: 'Garut Journey Official',
  ogTitle: 'Garut Journey — Explore Garut, Feel the Story.',
  ogDescription:
    'Temukan pesona alam pegunungan vulkanik, budaya autentik Priangan, kuliner legendaris, dan pesan pemandu lokal berlisensi di Garut.',
  ogImage: 'hero.png',
  canonicalUrl: 'https://garutjourney.com',
  robotsIndex: true,
  robotsFollow: true,
  schemaType: 'TravelAgency',
  schemaPriceRange: 'Rp 350.000 - Rp 1.500.000',
  schemaTelephone: '+62 851-5645-6791',
  schemaAddressLocality: 'Garut',
  schemaAddressRegion: 'Jawa Barat',
  schemaAddressCountry: 'ID',
}

const STORAGE_KEY = 'garut_journey_seo_settings_v1'
const EVENT_NAME = 'garut_seo_settings_updated'

export function getStoredSeoSettings(): SeoSettings {
  if (typeof window === 'undefined') return DEFAULT_SEO_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_SEO_SETTINGS, ...parsed }
    }
  } catch (err) {
    console.error('Failed to get stored SEO settings:', err)
  }
  return DEFAULT_SEO_SETTINGS
}

export function saveLocalSeoSettings(settings: SeoSettings) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: settings }))
  } catch (err) {
    console.error('Failed to save SEO settings locally:', err)
  }
}

export async function saveSeoSettings(settings: Partial<SeoSettings>): Promise<boolean> {
  const current = getStoredSeoSettings()
  const updated = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  }
  saveLocalSeoSettings(updated)

  try {
    await setDoc(doc(db, 'settings', 'seo'), updated)
    return true
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/seo')
    return false
  }
}

export async function resetSeoSettingsToDefault(): Promise<boolean> {
  return saveSeoSettings(DEFAULT_SEO_SETTINGS)
}

export function useSeoSettings() {
  const [seo, setSeo] = useState<SeoSettings>(() => getStoredSeoSettings())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => setSeo(getStoredSeoSettings())
    window.addEventListener(EVENT_NAME, handler)
    window.addEventListener('storage', handler)

    const unsub = onSnapshot(
      doc(db, 'settings', 'seo'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as Partial<SeoSettings>
          const merged = { ...DEFAULT_SEO_SETTINGS, ...remote }
          setSeo(merged)
          saveLocalSeoSettings(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'settings/seo')
      }
    )

    return () => {
      window.removeEventListener(EVENT_NAME, handler)
      window.removeEventListener('storage', handler)
      unsub()
    }
  }, [])

  return {
    seo,
    saveSeo: saveSeoSettings,
    resetSeo: resetSeoSettingsToDefault,
  }
}

export function generateSitemapXml(canonicalOrigin = 'https://garutjourney.com'): string {
  const today = new Date().toISOString().split('T')[0]
  const routes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/destinations/mount-papandayan', priority: '0.9', changefreq: 'weekly' },
    { path: '/destinations/situ-bagendit', priority: '0.9', changefreq: 'weekly' },
    { path: '/destinations/cipanas-garut', priority: '0.8', changefreq: 'weekly' },
    { path: '/destinations/darajat-pass', priority: '0.8', changefreq: 'weekly' },
    { path: '/destinations/candi-cangkuang', priority: '0.8', changefreq: 'weekly' },
    { path: '/destinations/santolo-beach', priority: '0.8', changefreq: 'weekly' },
    { path: '/destinations/rancabuaya-beach', priority: '0.8', changefreq: 'weekly' },
    { path: '/destinations/kampung-sampireun', priority: '0.8', changefreq: 'weekly' },
    { path: '/destinations/garut-city-square', priority: '0.8', changefreq: 'weekly' },
    { path: '/guide/panduan-website-garut-journey', priority: '0.8', changefreq: 'monthly' },
    { path: '/guide/menelusuri-keindahan-alam-garut', priority: '0.8', changefreq: 'monthly' },
    { path: '/guide/surga-kuliner-otentik-garut', priority: '0.8', changefreq: 'monthly' },
    { path: '/guide/perfect-1-day-garut-itinerary', priority: '0.8', changefreq: 'monthly' },
  ]

  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${cleanOrigin}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`
}

export function generateRobotsTxt(canonicalOrigin = 'https://garutjourney.com'): string {
  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '')
  return `# Robots.txt for Garut Journey
User-agent: *
Allow: /
Disallow: /admin
Disallow: /wp-admin
Disallow: /login

# Sitemap location
Sitemap: ${cleanOrigin}/sitemap.xml
`
}
