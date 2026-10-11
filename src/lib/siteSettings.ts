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
  logoRemoveBg?: boolean
  // Favicon (Tab Icon) Customization
  faviconType?: 'default' | 'custom' | 'same-as-logo'
  faviconUrl?: string
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
  // Dynamic Headings for All Front Page Sections
  destinationsEyebrow?: string
  destinationsTitle?: string
  destinationsIntro?: string
  cityToursEyebrow?: string
  cityToursTitle?: string
  cityToursIntro?: string
  experienceEyebrow?: string
  experienceTitle?: string
  experienceIntro?: string
  culinaryEyebrow?: string
  culinaryTitle?: string
  culinaryIntro?: string
  itineraryEyebrow?: string
  itineraryTitle?: string
  itineraryIntro?: string
  packagesEyebrow?: string
  packagesTitle?: string
  packagesIntro?: string
  galleryEyebrow?: string
  galleryTitle?: string
  galleryIntro?: string
  teamEyebrow?: string
  teamTitle?: string
  teamIntro?: string
  testimonialsEyebrow?: string
  testimonialsTitle?: string
  testimonialsIntro?: string
  guideEyebrow?: string
  guideTitle?: string
  guideIntro?: string
  contactEyebrow?: string
  contactTitle?: string
  contactIntro?: string
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
  logoRemoveBg: true,
  faviconType: 'default',
  faviconUrl: '/favicon.svg',
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
  // Dynamic Headings Defaults
  destinationsEyebrow: '02 — Destinasi Pilihan',
  destinationsTitle: 'Eksplorasi Alam & Pesona Priangan',
  destinationsIntro: 'Dari puncak gunung berapi legendaris, danau rakit bambu yang syahdu, hingga pesona pantai liar Samudra Hindia.',
  cityToursEyebrow: '03 — Paket City Tour',
  cityToursTitle: 'Pilihan Rute Wisata Terkurasi',
  cityToursIntro: 'Jelajahi Garut tanpa ribet bersama armada bersih dan tour leader berlisensi yang siap mendampingi setiap langkah Anda.',
  experienceEyebrow: '04 — Pengalaman Unik',
  experienceTitle: 'Pilih Gaya Petualangan Anda',
  experienceIntro: 'Temukan cara terbaik menikmati kota intan — mulai dari petualangan gunung, healing air hangat, hingga kuliner otentik.',
  culinaryEyebrow: '05 — Kuliner Otentik',
  culinaryTitle: 'Cita Rasa Khas Dapur Priangan',
  culinaryIntro: 'Nikmati kelezatan melegenda dari dodol manis legit, pedas gurih baso aci, hingga renyahnya burayot gula aren asli.',
  itineraryEyebrow: '06 — Rancang Jadwal',
  itineraryTitle: 'Bangun Itinerary Impian Anda',
  itineraryIntro: 'Pilih durasi, preferensi gaya liburan, dan destinasi favorit. Kami buatkan rincian estimasi biaya dan rundown terbaik.',
  packagesEyebrow: '07 — Paket Wisata Spesial',
  packagesTitle: 'Semua Kebutuhan Perjalanan Dalam Satu Harga',
  packagesIntro: 'Semua sudah termasuk tiket wisata, transportasi, pemandu lokal, dan dokumentasi foto kenangan.',
  galleryEyebrow: '08 — Dokumentasi Visual',
  galleryTitle: 'Koleksi Potret Keindahan Garut',
  galleryIntro: 'Momen-momen magis yang berhasil diabadikan para penjelajah di berbagai sudut Swiss van Java.',
  teamEyebrow: '09 — Tim & Pramuwisata',
  teamTitle: 'Dipandu Putra Daerah Berlisensi HPI & BNSP',
  teamIntro: 'Bukan makelar atau pihak ketiga. Kami menjamin setiap perjalanan Anda didampingi oleh pemandu lokal resmi yang ramah dan tersertifikasi.',
  testimonialsEyebrow: '10 — Ulasan & Cerita Tamu',
  testimonialsTitle: 'Kata Mereka yang Sudah Menjelajah',
  testimonialsIntro: 'Kepercayaan ratusan keluarga, komunitas, dan pelancong solo yang telah mempercayakan perjalanan mereka kepada Garut Journey.',
  guideEyebrow: '11 — Panduan & Artikel',
  guideTitle: 'Catatan Perjalanan & Tips Wisata',
  guideIntro: 'Rangkuman panduan praktis, rute terbaik, dan informasi terpercaya seputar pariwisata Kabupaten Garut.',
  contactEyebrow: '12 — Kontak & Informasi',
  contactTitle: 'Mulai Perjalanan Anda Bersama Kami',
  contactIntro: 'Hubungi tim reservasi kami untuk konsultasi rute, cek ketersediaan tanggal, atau penawaran harga khusus rombongan.',
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
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Synchronize client-stored settings after hydration
    setSettings(getStoredSiteSettings())

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
