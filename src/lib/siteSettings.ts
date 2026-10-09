import { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, logFirestoreError, OperationType } from '@/lib/firebase'
import { site as defaultSite } from '@/data/site'
import type { LanguageCode } from '@/lib/i18n'
import { safeLocalStorageSet } from '@/lib/mediaStorage'

const SETTINGS_KEY = 'garut_journey_site_settings_v2'
const SETTINGS_EVENT = 'garut_site_settings_updated'

export type HeaderAnimationType = 'none' | 'subtle-glow' | 'floating-particles' | 'gradient-shimmer'
export type FooterAnimationType = 'none' | 'subtle-glow' | 'floating-particles' | 'wave-motion'
export type HeroDarkness = 'light' | 'medium' | 'dark'

export interface SiteSettings {
  name: string
  tagline: string
  subtitle: string
  address: string
  whatsapp: string
  whatsappDigits: string
  email: string
  mapsQuery: string
  // Logo Customization
  customLogoUrl?: string
  logoType?: 'default' | 'custom'
  logoHeight?: number
  // Social Links
  socialInstagram: string
  socialTikTok: string
  socialFacebook: string
  socialYouTube: string
  // Hero section
  heroBackground: string
  heroBgDarkness: HeroDarkness
  heroZoomEffect: boolean
  heroTitleLine1?: string
  heroTitleHighlight?: string
  heroTitleLine2?: string
  heroDesc?: string
  heroCtaPrimary?: string
  heroCtaSecondary?: string
  // Why Garut section
  whyGarutEyebrow?: string
  whyGarutTitle?: string
  whyGarutHighlight?: string
  whyGarutIntro?: string
  whyGarutF1Title?: string
  whyGarutF1Desc?: string
  whyGarutF2Title?: string
  whyGarutF2Desc?: string
  whyGarutF3Title?: string
  whyGarutF3Desc?: string
  whyGarutF4Title?: string
  whyGarutF4Desc?: string
  // Brand Story section
  storyEyebrow?: string
  storyTitle?: string
  storyQuote?: string
  storyP1?: string
  storyP2?: string
  storyP3?: string
  storyWelcome?: string
  storyImage?: string
  storySecondaryImage?: string
  // Booking Banner section
  bookingEyebrow?: string
  bookingTitle?: string
  bookingSubtitle?: string
  bookingImage?: string
  // Footer & Theme
  footerTagline?: string
  defaultLanguage: LanguageCode
  headerAnimation: HeaderAnimationType
  footerAnimation: FooterAnimationType
  // WhatsApp Chat Settings
  whatsappCsName?: string
  whatsappCsRole?: string
  whatsappCsAvatar?: string
  whatsappWorkingHours?: string
  whatsappGreeting?: string
  whatsappDefaultMessage?: string
  whatsappQuickReplies?: string[]
  whatsappShowFab?: boolean
  whatsappFabPosition?: 'right' | 'left'
  whatsappPulseEffect?: boolean
}

export const initialSiteSettings: SiteSettings = {
  name: defaultSite.name,
  tagline: defaultSite.tagline,
  subtitle: 'Explore Swiss van Java',
  address: defaultSite.address,
  whatsapp: defaultSite.whatsapp,
  whatsappDigits: defaultSite.whatsappDigits,
  email: defaultSite.email,
  mapsQuery: defaultSite.mapsQuery,
  customLogoUrl: '',
  logoType: 'default',
  logoHeight: 36,
  socialInstagram: defaultSite.socials.instagram,
  socialTikTok: defaultSite.socials.tiktok,
  socialFacebook: defaultSite.socials.facebook,
  socialYouTube: defaultSite.socials.youtube,
  defaultLanguage: 'id',
  heroBackground: 'hero.png',
  heroBgDarkness: 'medium',
  heroZoomEffect: false,
  heroTitleLine1: 'Temukan Keindahan',
  heroTitleHighlight: 'Garut',
  heroTitleLine2: 'Kota Sejuta Cerita',
  heroDesc: 'Jelajahi surga tersembunyi Jawa Barat — dari kawah vulkanik megah, danau tenang, kuliner legendaris, hingga keramahan khas Priangan.',
  heroCtaPrimary: 'Eksplor Destinasi',
  heroCtaSecondary: 'Paket City Tour',
  whyGarutEyebrow: '01 — Mengapa Garut',
  whyGarutTitle: 'Swiss van Java,',
  whyGarutHighlight: 'Dekat & Memikat',
  whyGarutIntro: 'Hanya beberapa jam dari Bandung dan Jakarta, Garut memadukan bentang alam dramatis dengan budaya Sunda yang hangat.',
  whyGarutF1Title: 'Gunung & Alam Vulkanik',
  whyGarutF1Desc: 'Papandayan, Guntur, dan Cikuray menawarkan trek pendakian, padang edelweiss, dan kawah belerang yang eksotis.',
  whyGarutF2Title: 'Kuliner Legendaris',
  whyGarutF2Desc: 'Dari dodol legit, chocodot modern, baso aci kuah pedas gurih, hingga burayot gula aren autentik.',
  whyGarutF3Title: 'Warisan & Budaya',
  whyGarutF3Desc: 'Candi Cangkuang abad ke-8, kerajinan kulit Sukaregang berkualitas dunia, dan musik tradisional Sunda.',
  whyGarutF4Title: 'Keramahan Priangan',
  whyGarutF4Desc: 'Senyum tulus warga lokal, homestay nyaman, dan keramahan khas bumi Parahyangan yang menenangkan jiwa.',
  storyEyebrow: 'Cerita Kami',
  storyTitle: 'Bukan Sekadar Wisata, Ini Tentang Perjalanan Rasa',
  storyQuote: 'Garut bukan hanya tentang gunung dan danau. Ini tentang aroma rempah dapur Sunda, kabut pagi di perkebunan teh, dan kehangatan senyum warga.',
  storyP1: 'Lahir dari kecintaan mendalam terhadap tanah kelahiran kami di Priangan Timur, Garut Journey didirikan untuk memperkenalkan keindahan autentik Garut kepada para pelancong dari seluruh Nusantara dan mancanegara.',
  storyP2: 'Kami percaya setiap sudut Garut menyimpan cerita berharga — dari penenun sutra alam di pedesaan, perajin jaket kulit di Sukaregang, hingga petani kopi di lereng Gunung Cikuray.',
  storyP3: 'Melalui paket tour yang terkurasi dan pemandu lokal berlisensi, kami mengajak Anda bukan sekadar berkunjung, tetapi merasakan dan menjadi bagian dari kisah manis Swiss van Java.',
  storyWelcome: 'Sampurasun. Selamat datang di Garut.',
  footerTagline: 'Swiss van Java — Portal pariwisata, destinasi eksotis, panduan kuliner, dan pemesanan city tour resmi Garut.',
  headerAnimation: 'subtle-glow',
  footerAnimation: 'floating-particles',
  // WhatsApp defaults
  whatsappCsName: 'Kang Fahmi',
  whatsappCsRole: 'Senior Tour Specialist Garut',
  whatsappCsAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  whatsappWorkingHours: '07:30 - 21:00 WIB (Online)',
  whatsappGreeting: 'Sampurasun! Ada yang bisa kami bantu seputar destinasi atau custom tour di Garut?',
  whatsappDefaultMessage: 'Halo Garut Journey! Saya ingin konsultasi jadwal dan pilihan paket wisata Garut.',
  whatsappQuickReplies: [
    'Tanya Rekomendasi Tour 1 Hari',
    'Custom Trip > 3 Hari 2 Malam',
    'Cek Tanggal & Ketersediaan Guide',
    'Konfirmasi Pembayaran / Kwitansi',
  ],
  whatsappShowFab: true,
  whatsappFabPosition: 'right',
  whatsappPulseEffect: true,
}

export function getStoredSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return initialSiteSettings
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      return { ...initialSiteSettings, ...JSON.parse(raw) }
    }
  } catch (err) {
    console.error('Failed to parse site settings:', err)
  }
  return initialSiteSettings
}

export function saveLocalSiteSettings(settings: SiteSettings) {
  if (typeof window === 'undefined') return
  safeLocalStorageSet(SETTINGS_KEY, settings, SETTINGS_EVENT, settings)
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  const current = getStoredSiteSettings()
  const updated = { ...current, ...settings }
  saveLocalSiteSettings(updated)

  try {
    await setDoc(doc(db, 'settings', 'default'), {
      ...updated,
      updatedAt: new Date().toISOString(),
    })
    return true
  } catch (err) {
    logFirestoreError(err, OperationType.WRITE, 'settings/default')
    return true
  }
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => getStoredSiteSettings())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => setSettings(getStoredSiteSettings())
    window.addEventListener(SETTINGS_EVENT, handler)
    window.addEventListener('storage', handler)

    const unsub = onSnapshot(
      doc(db, 'settings', 'default'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as Partial<SiteSettings>
          const merged = { ...initialSiteSettings, ...remote }
          setSettings(merged)
          saveLocalSiteSettings(merged)
        }
      },
      (error) => {
        logFirestoreError(error, OperationType.GET, 'settings/default')
      }
    )

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handler)
      window.removeEventListener('storage', handler)
      unsub()
    }
  }, [])

  return { settings, saveSiteSettings }
}
