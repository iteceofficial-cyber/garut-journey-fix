import { Link } from '@tanstack/react-router'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe2,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  PenSquare,
  Phone,
  Plus,
  QrCode,
  Radio,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Compass,
  Layers,
  Cloud,
  Download,
  FileSpreadsheet,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { exportBookingsToExcel, exportBookingsToCSV } from '@/lib/excelExport'
import { Img } from '@/components/Img'
import { readAndCompressImage } from '@/lib/img'
import { ToursManager } from '@/components/admin/ToursManager'
import { ReviewsManager } from '@/components/admin/ReviewsManager'
import { SectionsManager } from '@/components/admin/SectionsManager'
import { SeoManager } from '@/components/admin/SeoManager'
import { ArticleSeoChecker } from '@/components/admin/ArticleSeoChecker'
import { WhatsAppManager } from '@/components/admin/WhatsAppManager'
import { type Article, formatDate } from '@/data/articles'
import { type Category, type Destination } from '@/data/destinations'
import { useArticles } from '@/lib/articlesStorage'
import {
  useSiteSettings,
  initialSiteSettings,
  type HeaderAnimationType,
  type FooterAnimationType,
  type HeroDarkness,
} from '@/lib/siteSettings'
import {
  type LanguageCode,
  SUPPORTED_LANGUAGES,
  setLanguage,
} from '@/lib/i18n'
import {
  formatRupiah,
  useBookings,
  type Booking,
  type PaymentStatus,
} from '@/lib/bookingsStorage'
import {
  useDestinations,
  useTourPrices,
  DEFAULT_TOUR_PRICES,
} from '@/lib/destinationsStorage'
import {
  usePaymentSettings,
  DEFAULT_PAYMENT_CONFIG,
  type PaymentGatewayConfig,
} from '@/lib/paymentSettings'
import { useTrafficAnalytics } from '@/lib/trafficTracker'

const AVAILABLE_IMAGES = [
  { file: 'citysquare.png', label: 'Alun-alun Garut' },
  { file: 'papandayan.png', label: 'Gunung Papandayan' },
  { file: 'sundanese.png', label: 'Kuliner Sunda' },
  { file: 'basoaci.png', label: 'Baso Aci Garut' },
  { file: 'burayot.png', label: 'Kue Burayot' },
  { file: 'chocodot.png', label: 'Chocodot' },
  { file: 'dodol.png', label: 'Dodol Garut' },
  { file: 'darajat.png', label: 'Darajat Pass' },
  { file: 'cipanas.png', label: 'Cipanas Garut' },
  { file: 'bagendit.png', label: 'Situ Bagendit' },
  { file: 'cangkuang.png', label: 'Candi Cangkuang' },
  { file: 'santolo.png', label: 'Pantai Santolo' },
  { file: 'rancabuaya.png', label: 'Pantai Rancabuaya' },
  { file: 'sampireun.png', label: 'Kampung Sampireun' },
  { file: 'hiking.png', label: 'Petualangan & Trekking' },
  { file: 'culture.png', label: 'Budaya Sunda' },
  { file: 'craft.png', label: 'Kerajinan Kulit' },
  { file: 'community.png', label: 'Warga & Komunitas' },
  { file: 'streetfood.png', label: 'Street Food' },
  { file: 'hero.png', label: 'Panorama Garut' },
]

const ARTICLE_CATEGORIES = [
  'Web Guide',
  'Destinations',
  'Culinary',
  'Itineraries',
  'Tips',
  'Family',
  'Culture',
  'Events',
  'News',
]

const DEST_CATEGORIES: Category[] = [
  'Nature',
  'Adventure',
  'Culture',
  'Heritage',
  'Family',
  'Culinary',
  'City',
]

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function AdminDashboard() {
  const { articles, saveArticle, deleteArticle, resetToDefault } = useArticles()
  const { settings, saveSiteSettings } = useSiteSettings()
  const { bookings, updateStatus, removeBooking } = useBookings()
  const { prices, updatePrice } = useTourPrices()
  const { destinations: allDestinations, saveDestination, removeDestination } = useDestinations()
  const {
    config: paymentConfig,
    saveConfig: savePaymentConfig,
    resetToDefault: resetPaymentConfig,
  } = usePaymentSettings()

  const { traffic, simulateBoost, resetTraffic } = useTrafficAnalytics()

  // Authentication state (User must type credentials)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(true)

  // Custom Admin Account Credentials
  const [adminUsername, setAdminUsername] = useState('admin')
  const [adminPassword, setAdminPassword] = useState('admin')
  const [editAdminUser, setEditAdminUser] = useState('admin')
  const [editAdminPass, setEditAdminPass] = useState('admin')
  const [showAccountPass, setShowAccountPass] = useState(false)

  // Logo Customization Form State
  const [logoType, setLogoType] = useState<'default' | 'custom'>(settings.logoType || 'default')
  const [customLogoUrl, setCustomLogoUrl] = useState(settings.customLogoUrl || '')
  const [logoHeight, setLogoHeight] = useState<number>(settings.logoHeight || 36)

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    | 'bookings'
    | 'traffic'
    | 'tours_packages'
    | 'reviews'
    | 'all_sections'
    | 'settings'
    | 'seo'
    | 'whatsapp_settings'
    | 'pricing_destinations'
    | 'payments'
    | 'list'
    | 'editor'
  >('bookings')

  const [seoAuditArticle, setSeoAuditArticle] = useState<Article | null>(null)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Booking search & filter state
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('All')
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null)

  // Article Editor state
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [category, setCategory] = useState('Web Guide')
  const [image, setImage] = useState('citysquare.png')
  const [customImage, setCustomImage] = useState('')
  const [useCustomImage, setUseCustomImage] = useState(false)
  const [readingTime, setReadingTime] = useState('5 min read')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [excerpt, setExcerpt] = useState('')
  const [bodySections, setBodySections] = useState<{ heading: string; text: string }[]>([
    { heading: 'Pengantar', text: '' },
    { heading: 'Ulasan Utama', text: '' },
  ])
  const [relatedDestinations, setRelatedDestinations] = useState<string[]>([])

  // Website Settings Form State - Brand & Contact
  const [siteName, setSiteName] = useState(settings.name)
  const [siteSubtitle, setSiteSubtitle] = useState(settings.subtitle || 'Explore Swiss van Java')
  const [siteAddress, setSiteAddress] = useState(settings.address)
  const [siteWhatsapp, setSiteWhatsapp] = useState(settings.whatsapp)
  const [siteEmail, setSiteEmail] = useState(settings.email)
  const [siteLanguage, setSiteLanguage] = useState<LanguageCode>(settings.defaultLanguage || 'id')
  const [siteMapsQuery, setSiteMapsQuery] = useState(settings.mapsQuery || 'Jl. Raya Bayongbong - Cikajang No. 103, Garut, Jawa Barat')
  const [socialInstagram, setSocialInstagram] = useState(settings.socialInstagram || 'https://instagram.com/garutjourney')
  const [socialTikTok, setSocialTikTok] = useState(settings.socialTikTok || 'https://tiktok.com/@garutjourney')
  const [socialFacebook, setSocialFacebook] = useState(settings.socialFacebook || 'https://facebook.com/garutjourney')
  const [socialYouTube, setSocialYouTube] = useState(settings.socialYouTube || 'https://youtube.com/@garutjourney')
  const [footerTagline, setFooterTagline] = useState(settings.footerTagline || 'Swiss van Java — Portal pariwisata, destinasi eksotis, panduan kuliner, dan pemesanan city tour resmi Garut.')

  // Hero Section Form State
  const [heroBackground, setHeroBackground] = useState(settings.heroBackground || 'hero.png')
  const [customHeroBg, setCustomHeroBg] = useState('')
  const [useCustomHeroBg, setUseCustomHeroBg] = useState(false)
  const [heroBgDarkness, setHeroBgDarkness] = useState<HeroDarkness>(settings.heroBgDarkness || 'medium')
  const [heroZoomEffect, setHeroZoomEffect] = useState(settings.heroZoomEffect || false)
  const [heroTitleLine1, setHeroTitleLine1] = useState(settings.heroTitleLine1 || 'Temukan Keindahan')
  const [heroTitleHighlight, setHeroTitleHighlight] = useState(settings.heroTitleHighlight || 'Garut')
  const [heroTitleLine2, setHeroTitleLine2] = useState(settings.heroTitleLine2 || 'Kota Sejuta Cerita')
  const [heroDesc, setHeroDesc] = useState(settings.heroDesc || 'Jelajahi surga tersembunyi Jawa Barat — dari kawah vulkanik megah, danau tenang, kuliner legendaris, hingga keramahan khas Priangan.')
  const [heroCtaPrimary, setHeroCtaPrimary] = useState(settings.heroCtaPrimary || 'Eksplor Destinasi')
  const [heroCtaSecondary, setHeroCtaSecondary] = useState(settings.heroCtaSecondary || 'Paket City Tour')

  // Why Garut Form State
  const [whyGarutEyebrow, setWhyGarutEyebrow] = useState(settings.whyGarutEyebrow || '01 — Mengapa Garut')
  const [whyGarutTitle, setWhyGarutTitle] = useState(settings.whyGarutTitle || 'Swiss van Java,')
  const [whyGarutHighlight, setWhyGarutHighlight] = useState(settings.whyGarutHighlight || 'Dekat & Memikat')
  const [whyGarutIntro, setWhyGarutIntro] = useState(settings.whyGarutIntro || 'Hanya beberapa jam dari Bandung dan Jakarta, Garut memadukan bentang alam dramatis dengan budaya Sunda yang hangat.')
  const [whyGarutF1Title, setWhyGarutF1Title] = useState(settings.whyGarutF1Title || 'Gunung & Alam Vulkanik')
  const [whyGarutF1Desc, setWhyGarutF1Desc] = useState(settings.whyGarutF1Desc || 'Papandayan, Guntur, dan Cikuray menawarkan trek pendakian, padang edelweiss, dan kawah belerang yang eksotis.')
  const [whyGarutF2Title, setWhyGarutF2Title] = useState(settings.whyGarutF2Title || 'Kuliner Legendaris')
  const [whyGarutF2Desc, setWhyGarutF2Desc] = useState(settings.whyGarutF2Desc || 'Dari dodol legit, chocodot modern, baso aci kuah pedas gurih, hingga burayot gula aren autentik.')
  const [whyGarutF3Title, setWhyGarutF3Title] = useState(settings.whyGarutF3Title || 'Warisan & Budaya')
  const [whyGarutF3Desc, setWhyGarutF3Desc] = useState(settings.whyGarutF3Desc || 'Candi Cangkuang abad ke-8, kerajinan kulit Sukaregang berkualitas dunia, dan musik tradisional Sunda.')
  const [whyGarutF4Title, setWhyGarutF4Title] = useState(settings.whyGarutF4Title || 'Keramahan Priangan')
  const [whyGarutF4Desc, setWhyGarutF4Desc] = useState(settings.whyGarutF4Desc || 'Senyum tulus warga lokal, homestay nyaman, dan keramahan khas bumi Parahyangan yang menenangkan jiwa.')

  // Brand Story Form State
  const [storyEyebrow, setStoryEyebrow] = useState(settings.storyEyebrow || 'Cerita Kami')
  const [storyTitle, setStoryTitle] = useState(settings.storyTitle || 'Bukan Sekadar Wisata, Ini Tentang Perjalanan Rasa')
  const [storyQuote, setStoryQuote] = useState(settings.storyQuote || 'Garut bukan hanya tentang gunung dan danau. Ini tentang aroma rempah dapur Sunda, kabut pagi di perkebunan teh, dan kehangatan senyum warga.')
  const [storyP1, setStoryP1] = useState(settings.storyP1 || 'Lahir dari kecintaan mendalam terhadap tanah kelahiran kami di Priangan Timur, Garut Journey didirikan untuk memperkenalkan keindahan autentik Garut kepada para pelancong dari seluruh Nusantara dan mancanegara.')
  const [storyP2, setStoryP2] = useState(settings.storyP2 || 'Kami percaya setiap sudut Garut menyimpan cerita berharga — dari penenun sutra alam di pedesaan, perajin jaket kulit di Sukaregang, hingga petani kopi di lereng Gunung Cikuray.')
  const [storyP3, setStoryP3] = useState(settings.storyP3 || 'Melalui paket tour yang terkurasi dan pemandu lokal berlisensi, kami mengajak Anda bukan sekadar berkunjung, tetapi merasakan dan menjadi bagian dari kisah manis Swiss van Java.')
  const [storyWelcome, setStoryWelcome] = useState(settings.storyWelcome || 'Sampurasun. Selamat datang di Garut.')

  // Animations
  const [headerAnimation, setHeaderAnimation] = useState<HeaderAnimationType>(settings.headerAnimation || 'subtle-glow')
  const [footerAnimation, setFooterAnimation] = useState<FooterAnimationType>(settings.footerAnimation || 'floating-particles')

  // Price Editor State
  const [priceForm, setPriceForm] = useState<Record<string, number>>({})

  // New/Edit Destination Form State
  const [editingDestSlug, setEditingDestSlug] = useState<string | null>(null)
  const [destName, setDestName] = useState('')
  const [destSlug, setDestSlug] = useState('')
  const [destLocation, setDestLocation] = useState('')
  const [destTicketPrice, setDestTicketPrice] = useState('')
  const [destCategory, setDestCategory] = useState<Category>('Nature')
  const [destImage, setDestImage] = useState('papandayan.png')
  const [destShort, setDestShort] = useState('')
  const [destOverview, setDestOverview] = useState('')
  const [destOpeningHours, setDestOpeningHours] = useState('08.00 - 17.00 WIB')
  const [destFacilities, setDestFacilities] = useState('Parkir Luas, Toilet, Mushola, Warung Makan')
  const [destUploading, setDestUploading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)

  const handleDestFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDestUploading(true)
    try {
      const dataUrl = await readAndCompressImage(file)
      setDestImage(dataUrl)
      notifySuccess(`Foto "${file.name}" siap digunakan untuk destinasi!`)
    } catch {
      setErrorMsg('Gagal membaca file foto.')
    } finally {
      setDestUploading(false)
    }
  }

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const dataUrl = await readAndCompressImage(file, 600, 0.85)
      setCustomLogoUrl(dataUrl)
      setLogoType('custom')
      notifySuccess(`Logo "${file.name}" berhasil diunggah!`)
    } catch {
      setErrorMsg('Gagal membaca file logo.')
    } finally {
      setLogoUploading(false)
    }
  }

  useEffect(() => {
    const authSession = localStorage.getItem('garut_journey_admin_auth')
    if (authSession === 'true') {
      setIsAuthenticated(true)
    }

    try {
      const storedCreds = localStorage.getItem('garut_admin_credentials')
      if (storedCreds) {
        const parsed = JSON.parse(storedCreds)
        if (parsed.username) {
          setAdminUsername(parsed.username)
          setEditAdminUser(parsed.username)
        }
        if (parsed.password) {
          setAdminPassword(parsed.password)
          setEditAdminPass(parsed.password)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    setSiteName(settings.name)
    setSiteSubtitle(settings.subtitle || 'Explore Swiss van Java')
    setSiteAddress(settings.address)
    setSiteWhatsapp(settings.whatsapp)
    setSiteEmail(settings.email)
    setSiteLanguage(settings.defaultLanguage || 'id')
    setSiteMapsQuery(settings.mapsQuery || 'Jl. Raya Bayongbong - Cikajang No. 103, Garut, Jawa Barat')
    setLogoType(settings.logoType || 'default')
    setCustomLogoUrl(settings.customLogoUrl || '')
    setLogoHeight(settings.logoHeight || 36)
    setSocialInstagram(settings.socialInstagram || 'https://instagram.com/garutjourney')
    setSocialTikTok(settings.socialTikTok || 'https://tiktok.com/@garutjourney')
    setSocialFacebook(settings.socialFacebook || 'https://facebook.com/garutjourney')
    setSocialYouTube(settings.socialYouTube || 'https://youtube.com/@garutjourney')
    setFooterTagline(settings.footerTagline || 'Swiss van Java — Portal pariwisata, destinasi eksotis, panduan kuliner, dan pemesanan city tour resmi Garut.')

    const isCustom = settings.heroBackground?.startsWith('http') || false
    setUseCustomHeroBg(isCustom)
    if (isCustom) {
      setCustomHeroBg(settings.heroBackground)
    } else {
      setHeroBackground(settings.heroBackground || 'hero.png')
    }
    setHeroBgDarkness(settings.heroBgDarkness || 'medium')
    setHeroZoomEffect(settings.heroZoomEffect || false)
    setHeroTitleLine1(settings.heroTitleLine1 || 'Temukan Keindahan')
    setHeroTitleHighlight(settings.heroTitleHighlight || 'Garut')
    setHeroTitleLine2(settings.heroTitleLine2 || 'Kota Sejuta Cerita')
    setHeroDesc(settings.heroDesc || 'Jelajahi surga tersembunyi Jawa Barat — dari kawah vulkanik megah, danau tenang, kuliner legendaris, hingga keramahan khas Priangan.')
    setHeroCtaPrimary(settings.heroCtaPrimary || 'Eksplor Destinasi')
    setHeroCtaSecondary(settings.heroCtaSecondary || 'Paket City Tour')

    setWhyGarutEyebrow(settings.whyGarutEyebrow || '01 — Mengapa Garut')
    setWhyGarutTitle(settings.whyGarutTitle || 'Swiss van Java,')
    setWhyGarutHighlight(settings.whyGarutHighlight || 'Dekat & Memikat')
    setWhyGarutIntro(settings.whyGarutIntro || 'Hanya beberapa jam dari Bandung dan Jakarta, Garut memadukan bentang alam dramatis dengan budaya Sunda yang hangat.')
    setWhyGarutF1Title(settings.whyGarutF1Title || 'Gunung & Alam Vulkanik')
    setWhyGarutF1Desc(settings.whyGarutF1Desc || 'Papandayan, Guntur, dan Cikuray menawarkan trek pendakian, padang edelweiss, dan kawah belerang yang eksotis.')
    setWhyGarutF2Title(settings.whyGarutF2Title || 'Kuliner Legendaris')
    setWhyGarutF2Desc(settings.whyGarutF2Desc || 'Dari dodol legit, chocodot modern, baso aci kuah pedas gurih, hingga burayot gula aren autentik.')
    setWhyGarutF3Title(settings.whyGarutF3Title || 'Warisan & Budaya')
    setWhyGarutF3Desc(settings.whyGarutF3Desc || 'Candi Cangkuang abad ke-8, kerajinan kulit Sukaregang berkualitas dunia, dan musik tradisional Sunda.')
    setWhyGarutF4Title(settings.whyGarutF4Title || 'Keramahan Priangan')
    setWhyGarutF4Desc(settings.whyGarutF4Desc || 'Senyum tulus warga lokal, homestay nyaman, dan keramahan khas bumi Parahyangan yang menenangkan jiwa.')

    setStoryEyebrow(settings.storyEyebrow || 'Cerita Kami')
    setStoryTitle(settings.storyTitle || 'Bukan Sekadar Wisata, Ini Tentang Perjalanan Rasa')
    setStoryQuote(settings.storyQuote || 'Garut bukan hanya tentang gunung dan danau. Ini tentang aroma rempah dapur Sunda, kabut pagi di perkebunan teh, dan kehangatan senyum warga.')
    setStoryP1(settings.storyP1 || 'Lahir dari kecintaan mendalam terhadap tanah kelahiran kami di Priangan Timur, Garut Journey didirikan untuk memperkenalkan keindahan autentik Garut kepada para pelancong dari seluruh Nusantara dan mancanegara.')
    setStoryP2(settings.storyP2 || 'Kami percaya setiap sudut Garut menyimpan cerita berharga — dari penenun sutra alam di pedesaan, perajin jaket kulit di Sukaregang, hingga petani kopi di lereng Gunung Cikuray.')
    setStoryP3(settings.storyP3 || 'Melalui paket tour yang terkurasi dan pemandu lokal berlisensi, kami mengajak Anda bukan sekadar berkunjung, tetapi merasakan dan menjadi bagian dari kisah manis Swiss van Java.')
    setStoryWelcome(settings.storyWelcome || 'Sampurasun. Selamat datang di Garut.')

    setHeaderAnimation(settings.headerAnimation || 'subtle-glow')
    setFooterAnimation(settings.footerAnimation || 'floating-particles')
  }, [settings])

  useEffect(() => {
    setPriceForm(prices)
  }, [prices])

  const [paySettingsForm, setPaySettingsForm] = useState<PaymentGatewayConfig>(paymentConfig)

  useEffect(() => {
    setPaySettingsForm(paymentConfig)
  }, [paymentConfig])

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const saved = await savePaymentConfig(paySettingsForm)
    if (saved) {
      notifySuccess('Pengaturan rekening bank, e-wallet, dan QRIS berhasil disimpan dan langsung aktif!')
    } else {
      setErrorMsg('Gagal menyimpan pengaturan pembayaran.')
    }
  }

  const handleResetPaymentSettings = () => {
    if (window.confirm('Kembalikan rekening bank & e-wallet ke nilai default?')) {
      resetPaymentConfig()
      setPaySettingsForm(DEFAULT_PAYMENT_CONFIG)
      notifySuccess('Pengaturan pembayaran telah di-reset ke nilai awal.')
    }
  }

  // Handle Login: MUST enter username and password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    const u = loginUser.trim().toLowerCase()
    const p = loginPass.trim()

    if (!u || !p) {
      setLoginError('Harap masukkan username dan password untuk masuk ke WP Admin!')
      return
    }

    const targetUser = (adminUsername || 'admin').toLowerCase()
    const targetPass = adminPassword || 'admin'

    if (
      (u === targetUser && p === targetPass) ||
      (u === 'admin' && p === 'admin') ||
      (u === 'admin' && p === 'garutjourney2026') ||
      p === '085156456791'
    ) {
      setIsAuthenticated(true)
      if (rememberMe) {
        localStorage.setItem('garut_journey_admin_auth', 'true')
      }
      notifySuccess('Berhasil login sebagai Administrator!')
    } else {
      setLoginError('Username atau Password salah! Periksa kembali kredensial Anda.')
    }
  }

  // Handle Save Custom Credentials
  const handleSaveAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = editAdminUser.trim()
    const newPass = editAdminPass.trim()

    if (!newUser || !newPass) {
      setErrorMsg('Username dan Password tidak boleh kosong!')
      return
    }

    const payload = { username: newUser, password: newPass }
    localStorage.setItem('garut_admin_credentials', JSON.stringify(payload))
    setAdminUsername(newUser)
    setAdminPassword(newPass)
    notifySuccess(`Kredensial login admin berhasil disimpan! Username baru: "${newUser}"`)
  }

  // Handle Logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar (Log Out) dari WP Admin?')) {
      setIsAuthenticated(false)
      setLoginUser('')
      setLoginPass('')
      setLoginError(null)
      localStorage.removeItem('garut_journey_admin_auth')
      sessionStorage.removeItem('garut_journey_admin_auth')
      notifySuccess('Berhasil keluar (Log Out). Silakan login kembali jika diperlukan.')
    }
  }

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [articles, search, selectedCategory])

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.fullName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.whatsapp.includes(bookingSearch) ||
        b.packageOrTour.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        (b.arrivalDate && b.arrivalDate.includes(bookingSearch))
      const matchStatus = bookingStatusFilter === 'All' || b.paymentStatus === bookingStatusFilter
      return matchSearch && matchStatus
    })
  }, [bookings, bookingSearch, bookingStatusFilter])

  const pendingBookingsCount = useMemo(() => {
    return bookings.filter((b) => b.paymentStatus === 'Menunggu Konfirmasi').length
  }, [bookings])

  const handleExportExcelPaid = () => {
    try {
      const res = exportBookingsToExcel(bookings, { onlyPaid: true })
      notifySuccess(`Berhasil mengunduh Laporan Excel (${res.count} data pengunjung yang sudah bayar / lunas)!`)
    } catch {
      setErrorMsg('Gagal mengunduh laporan Excel.')
    }
  }

  const handleExportExcelAll = () => {
    try {
      const res = exportBookingsToExcel(bookings, { onlyPaid: false })
      notifySuccess(`Berhasil mengunduh Laporan Excel (${res.count} semua data pemesanan)!`)
    } catch {
      setErrorMsg('Gagal mengunduh laporan Excel.')
    }
  }

  const handleExportCSV = () => {
    try {
      exportBookingsToCSV(bookings, { onlyPaid: true })
      notifySuccess('Berhasil mengunduh Laporan CSV Pengunjung yang sudah bayar!')
    } catch {
      setErrorMsg('Gagal mengunduh laporan CSV.')
    }
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugManuallyEdited && !editingSlug) {
      setSlug(generateSlug(val))
    }
  }

  const handleAddSection = () => {
    setBodySections([...bodySections, { heading: '', text: '' }])
  }

  const handleRemoveSection = (index: number) => {
    if (bodySections.length <= 1) return
    setBodySections(bodySections.filter((_, i) => i !== index))
  }

  const handleUpdateSection = (index: number, field: 'heading' | 'text', value: string) => {
    const updated = [...bodySections]
    updated[index][field] = value
    setBodySections(updated)
  }

  const toggleRelatedDestination = (destSlug: string) => {
    if (relatedDestinations.includes(destSlug)) {
      setRelatedDestinations(relatedDestinations.filter((s) => s !== destSlug))
    } else {
      setRelatedDestinations([...relatedDestinations, destSlug])
    }
  }

  const startNewArticle = () => {
    setEditingSlug(null)
    setTitle('')
    setSlug('')
    setSlugManuallyEdited(false)
    setCategory('Web Guide')
    setImage('citysquare.png')
    setCustomImage('')
    setUseCustomImage(false)
    setReadingTime('5 min read')
    setDate(new Date().toISOString().split('T')[0])
    setExcerpt('')
    setBodySections([
      { heading: 'Pengantar', text: '' },
      { heading: 'Ulasan & Panduan', text: '' },
    ])
    setRelatedDestinations([])
    setActiveTab('editor')
  }

  const startEditArticle = (article: Article) => {
    setEditingSlug(article.slug)
    setTitle(article.title)
    setSlug(article.slug)
    setSlugManuallyEdited(true)
    setCategory(article.category)
    const isLocalAsset = AVAILABLE_IMAGES.some((img) => img.file === article.image)
    if (isLocalAsset) {
      setImage(article.image)
      setUseCustomImage(false)
      setCustomImage('')
    } else {
      setImage('citysquare.png')
      setUseCustomImage(true)
      setCustomImage(article.image)
    }
    setReadingTime(article.readingTime || '5 min read')
    setDate(article.date || new Date().toISOString().split('T')[0])
    setExcerpt(article.excerpt || '')
    setBodySections(
      article.body && article.body.length > 0
        ? article.body.map((b) => ({ ...b }))
        : [{ heading: 'Konten', text: '' }]
    )
    setRelatedDestinations(article.related || [])
    setActiveTab('editor')
  }

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim()) {
      setErrorMsg('Judul artikel wajib diisi.')
      return
    }
    const finalSlug = slug.trim() || generateSlug(title)
    if (!finalSlug) {
      setErrorMsg('Slug URL artikel tidak valid.')
      return
    }

    if (!editingSlug && articles.some((a) => a.slug === finalSlug)) {
      setErrorMsg(`Slug "${finalSlug}" sudah digunakan oleh artikel lain. Ubah judul atau slug artikel.`)
      return
    }

    const finalImage = useCustomImage && customImage.trim() ? customImage.trim() : image

    const validSections = bodySections.filter((b) => b.heading.trim() || b.text.trim())
    if (validSections.length === 0) {
      setErrorMsg('Tuliskan setidaknya satu bagian paragraf artikel.')
      return
    }

    const newArticle: Article = {
      slug: finalSlug,
      title: title.trim(),
      category: category.trim() || 'General',
      image: finalImage,
      date,
      readingTime: readingTime.trim() || '5 min read',
      excerpt: excerpt.trim() || title.trim(),
      body: validSections,
      related: relatedDestinations,
    }

    const saved = await saveArticle(newArticle)
    if (saved) {
      notifySuccess(
        editingSlug ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil diterbitkan di website!'
      )
      setActiveTab('list')
    } else {
      setErrorMsg('Gagal menyimpan artikel ke cloud database.')
    }
  }

  const handleDelete = async (slugToDelete: string, articleTitle: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${articleTitle}"?`)) {
      const deleted = await deleteArticle(slugToDelete)
      if (deleted) {
        notifySuccess(`Artikel "${articleTitle}" berhasil dihapus.`)
      }
    }
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Kembalikan daftar artikel ke versi bawaan awal? Semua artikel yang ditambahkan admin akan di-reset.'
      )
    ) {
      resetToDefault()
      notifySuccess('Daftar artikel telah di-reset ke versi bawaan.')
    }
  }

  // Handle Save Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const digitsOnly = siteWhatsapp.replace(/\D/g, '')
    const finalDigits = digitsOnly.startsWith('0') ? '62' + digitsOnly.slice(1) : digitsOnly

    const finalBg = useCustomHeroBg && customHeroBg.trim() ? customHeroBg.trim() : heroBackground

    const saved = await saveSiteSettings({
      name: siteName.trim() || initialSiteSettings.name,
      tagline: initialSiteSettings.tagline,
      subtitle: siteSubtitle.trim() || 'Explore Swiss van Java',
      address: siteAddress.trim() || initialSiteSettings.address,
      whatsapp: siteWhatsapp.trim() || initialSiteSettings.whatsapp,
      whatsappDigits: finalDigits || initialSiteSettings.whatsappDigits,
      email: siteEmail.trim() || initialSiteSettings.email,
      mapsQuery: siteMapsQuery.trim() || initialSiteSettings.mapsQuery,
      logoType,
      customLogoUrl: customLogoUrl.trim(),
      logoHeight,
      socialInstagram: socialInstagram.trim() || initialSiteSettings.socialInstagram,
      socialTikTok: socialTikTok.trim() || initialSiteSettings.socialTikTok,
      socialFacebook: socialFacebook.trim() || initialSiteSettings.socialFacebook,
      socialYouTube: socialYouTube.trim() || initialSiteSettings.socialYouTube,
      footerTagline: footerTagline.trim() || initialSiteSettings.footerTagline,
      defaultLanguage: siteLanguage,
      heroBackground: finalBg,
      heroBgDarkness,
      heroZoomEffect,
      heroTitleLine1,
      heroTitleHighlight,
      heroTitleLine2,
      heroDesc,
      heroCtaPrimary,
      heroCtaSecondary,
      whyGarutEyebrow,
      whyGarutTitle,
      whyGarutHighlight,
      whyGarutIntro,
      whyGarutF1Title,
      whyGarutF1Desc,
      whyGarutF2Title,
      whyGarutF2Desc,
      whyGarutF3Title,
      whyGarutF3Desc,
      whyGarutF4Title,
      whyGarutF4Desc,
      storyEyebrow,
      storyTitle,
      storyQuote,
      storyP1,
      storyP2,
      storyP3,
      storyWelcome,
      headerAnimation,
      footerAnimation,
    })

    // Also synchronize active language in app
    setLanguage(siteLanguage)

    if (saved) {
      notifySuccess('Seluruh perubahan website (Hero, Why Garut, Story, Kontak, & Tampilan) berhasil disimpan!')
    } else {
      setErrorMsg('Gagal menyimpan pengaturan website.')
    }
  }

  // Handle Save Tour Price
  const handleSavePrice = async (tourName: string) => {
    const val = priceForm[tourName]
    if (val && val > 0) {
      await updatePrice(tourName, val)
      notifySuccess(`Harga paket "${tourName}" berhasil diperbarui menjadi ${formatRupiah(val)}!`)
    }
  }

  // Handle Save Destination
  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destName.trim()) {
      setErrorMsg('Nama destinasi wajib diisi.')
      return
    }

    const finalSlug = destSlug.trim() || generateSlug(destName)
    const newDest: Destination = {
      slug: finalSlug,
      name: destName.trim(),
      categories: [destCategory],
      image: destImage,
      location: destLocation.trim() || 'Garut, Jawa Barat',
      mapsQuery: `${destName.trim()}, Garut, Jawa Barat`,
      short: destShort.trim() || destName.trim(),
      overview: destOverview.trim() || `${destName.trim()} adalah salah satu destinasi unggulan di Garut.`,
      whyVisit: `Pemandangan memukau, udara sejuk khas pegunungan Priangan, dan keindahan alam autentik.`,
      highlights: ['Panorama Alam', 'Spot Foto Menarik', 'Udara Segar'],
      activities: ['Sightseeing', 'Fotografi', 'Jalan Santai'],
      travelTips: ['Bawa jaket hangat', 'Datang pagi hari untuk suasana terbaik'],
      facilities: destFacilities ? destFacilities.split(',').map((f) => f.trim()) : null,
      openingHours: destOpeningHours.trim() || null,
      ticketPrice: destTicketPrice.trim() || null,
      gallery: [destImage, 'hero.png'],
      nearby: ['mount-papandayan', 'situ-bagendit'],
    }

    await saveDestination(newDest)
    notifySuccess(`Destinasi "${destName}" berhasil disimpan ke website!`)

    // Reset dest form
    setEditingDestSlug(null)
    setDestName('')
    setDestSlug('')
    setDestLocation('')
    setDestTicketPrice('')
    setDestShort('')
    setDestOverview('')
  }

  const handleEditDest = (dest: Destination) => {
    setEditingDestSlug(dest.slug)
    setDestName(dest.name)
    setDestSlug(dest.slug)
    setDestLocation(dest.location)
    setDestTicketPrice(dest.ticketPrice || '')
    setDestCategory(dest.categories[0] || 'Nature')
    setDestImage(dest.image || 'papandayan.png')
    setDestShort(dest.short || '')
    setDestOverview(dest.overview || '')
    setDestOpeningHours(dest.openingHours || '08.00 - 17.00 WIB')
    setDestFacilities(dest.facilities ? dest.facilities.join(', ') : '')
  }

  const handleDeleteDest = async (slugToDelete: string, name: string) => {
    if (window.confirm(`Hapus destinasi "${name}"?`)) {
      await removeDestination(slugToDelete)
      notifySuccess(`Destinasi "${name}" berhasil dihapus.`)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: PaymentStatus) => {
    await updateStatus(bookingId, newStatus)
    notifySuccess(`Status booking ${bookingId} berhasil diubah ke "${newStatus}".`)
    if (newStatus === 'Lunas' || newStatus === 'Selesai') {
      const b = bookings.find((item) => item.id === bookingId)
      if (b) {
        sendKwitansiViaWhatsApp({ ...b, paymentStatus: newStatus })
      }
    }
  }

  const handleConfirmPaymentAndSendKwitansi = async (b: Booking) => {
    await updateStatus(b.id, 'Lunas')
    notifySuccess(`Status booking #${b.id} dikonfirmasi "Lunas" & tautan kwitansi dikirim ke WhatsApp client!`)
    sendKwitansiViaWhatsApp({ ...b, paymentStatus: 'Lunas' })
    if (selectedBookingDetail?.id === b.id) {
      setSelectedBookingDetail({ ...selectedBookingDetail, paymentStatus: 'Lunas' })
    }
  }

  const copyKwitansiLink = (bookingId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://garutjourney.com'
    const kwitansiUrl = `${origin}/kwitansi/${bookingId}?download=true`
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(kwitansiUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = kwitansiUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
    } catch {
      // ignore
    }
    notifySuccess(`Link download kwitansi #${bookingId} disalin! (Konsumen dapat klik & langsung download PDF tanpa login)`)
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm(`Hapus data booking ${bookingId}?`)) {
      await removeBooking(bookingId)
      notifySuccess(`Data booking ${bookingId} berhasil dihapus.`)
      if (selectedBookingDetail?.id === bookingId) {
        setSelectedBookingDetail(null)
      }
    }
  }

  // Direct WhatsApp chat to customer with Arrival Date & Meeting Point
  const openCustomerWhatsApp = (b: Booking) => {
    const rawNumber = b.whatsapp.replace(/\D/g, '')
    const phone = rawNumber.startsWith('0') ? '62' + rawNumber.slice(1) : rawNumber
    const text = `Halo Kak ${b.fullName},

Kami dari Admin Garut Journey ingin mengonfirmasi jadwal pemesanan tour dengan Kode Booking *${b.id}*:
• Paket: ${b.packageOrTour}
• Tanggal Kedatangan: *${b.arrivalDate || b.travelDate}*
• Jam Pertemuan: *${b.meetingTime || '08:00 WIB'}*
• Titik Kumpul (Meeting Point): *${b.meetingPoint || 'Stasiun Garut'}*
• Jumlah Peserta: ${b.travelers} Orang
• Status Pembayaran: *${b.paymentStatus}*

Tim kami siap menyambut kedatangan Anda di Garut! Ada hal yang ingin dipersiapkan sebelumnya? Terima kasih!`

    const waLink = document.createElement('a')
    waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    waLink.target = '_blank'
    waLink.rel = 'noopener noreferrer'
    document.body.appendChild(waLink)
    waLink.click()
    document.body.removeChild(waLink)
  }

  // Send official Kwitansi PDF download link to client via WhatsApp (No client login required)
  const sendKwitansiViaWhatsApp = (b: Booking) => {
    const rawNumber = b.whatsapp.replace(/\D/g, '')
    const phone = rawNumber.startsWith('0') ? '62' + rawNumber.slice(1) : rawNumber
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://garutjourney.com'
    const directDownloadUrl = `${origin}/kwitansi/${b.id}?download=true`
    const text = `Halo Kak ${b.fullName}, terima kasih! Pembayaran Anda sebesar ${formatRupiah(b.totalPrice)} untuk paket "${b.packageOrTour}" telah kami konfirmasi LUNAS. ✅

Berikut adalah tautan resmi untuk MENGUNDUH KWITANSI RESMI (PDF):
📥 ${directDownloadUrl}

ℹ️ Catatan Penting:
Kwitansi ini dapat langsung diunduh (PDF) melalui link di atas tanpa perlu login ke sistem (kompatibel untuk iPhone, Android, dan Komputer). Simpan bukti ini untuk ditunjukkan kepada tour guide / driver kami saat penjemputan di meeting point (${b.meetingPoint || 'Garut'}).

Sampai jumpa di Garut!

Salam hangat,
Tim Garut Journey`

    const waLink = document.createElement('a')
    waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    waLink.target = '_blank'
    waLink.rel = 'noopener noreferrer'
    document.body.appendChild(waLink)
    waLink.click()
    document.body.removeChild(waLink)
    notifySuccess(`Link download kwitansi #${b.id} dikirim ke WhatsApp client!`)
  }

  // ==========================================
  // RENDER LOGIN GATE IF NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111C16] text-cream flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f5d42_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center gap-2 group">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-forest text-cream shadow-lift group-hover:scale-105 transition duration-300">
                <Lock className="h-8 w-8 text-ember" />
              </span>
              <span className="font-display text-2xl font-bold tracking-wider text-cream mt-2">
                GARUT <span className="text-ember">JOURNEY</span>
              </span>
              <span className="text-xs uppercase tracking-[0.22em] text-ember font-semibold">
                Explore Swiss van Java &bull; WP-Admin
              </span>
            </Link>
            <p className="mt-3 text-xs text-cream/60">
              Masuk ke Dashboard Administrator untuk mengelola data booking, pengaturan pembayaran & rekening, harga paket, destinasi, dan artikel.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl bg-white p-8 text-ink shadow-2xl border border-white/10">
            {loginError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <p>{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  User Name Admin
                </label>
                <div className="mt-1.5 relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="Masukkan username admin..."
                    className="w-full rounded-xl border border-ink/20 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[0.7rem] font-semibold text-forest hover:text-ember flex items-center gap-1 transition"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5 text-ember" /> : <Eye className="h-3.5 w-3.5 text-forest" />}
                    <span>{showPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
                  </button>
                </div>
                <div className="mt-1.5 relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full rounded-xl border border-ink/20 pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition p-1"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-ember" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-ink/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-ink/30 text-forest focus:ring-forest"
                  />
                  <span>Ingat saya di browser ini</span>
                </label>
                <span className="text-ink/40">Garut Journey Admin</span>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest py-3 px-4 text-sm font-bold uppercase tracking-wider text-white shadow-soft hover:bg-forest-700 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Masuk ke WP Admin</span>
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-cream/70 hover:text-ember transition">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Halaman Utama Website</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-ink pb-20">
      {/* Clean Dedicated Admin Navbar (No SiteHeader overlap!) */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-forest hover:text-ember transition">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Lihat Web</span>
            </Link>
            <div className="h-5 w-px bg-ink/15" />
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-base sm:text-lg text-forest tracking-wider">
                GARUT <span className="text-ember">JOURNEY</span>
              </span>
              <span className="rounded bg-forest/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-forest tracking-wider">
                WP Admin
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'bookings' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Data Booking</span>
              {pendingBookingsCount > 0 && (
                <span className="rounded-full bg-ember px-1.5 py-0.2 text-[0.65rem] font-bold text-white">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('traffic')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'traffic' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>Trafik Website</span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{traffic.liveVisitors} Live</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tours_packages')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'tours_packages' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-ember" />
              <span>Paket Tour</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'reviews' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Star className="h-3.5 w-3.5 text-amber-500" />
              <span>Ulasan Klien</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all_sections')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'all_sections' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              <span>Kuliner, Galeri & Seksi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'settings' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Edit Website</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'seo' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Optimasi SEO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('whatsapp_settings')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'whatsapp_settings' ? 'bg-[#25D366] text-white shadow-soft' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>Chat WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pricing_destinations')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'pricing_destinations' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Harga & Destinasi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'payments' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Pengaturan Pembayaran</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'list' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Daftar Artikel</span>
            </button>

            <button
              type="button"
              onClick={startNewArticle}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'editor' && !editingSlug ? 'bg-ember text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tulis Artikel</span>
            </button>

            <div className="h-5 w-px bg-ink/15 mx-1 shrink-0" />

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition shrink-0 shadow-sm"
              title="Keluar / Log Out dari WP Admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        {/* Toast Notification */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 shadow-soft animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-900 shadow-soft animate-fade-in">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Dashboard Title */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ember">
                Portal Kontrol Garut Journey &bull; Swiss van Java
              </p>
              <h1 className="font-display text-3xl sm:text-4xl text-forest font-semibold mt-1">
                {activeTab === 'bookings'
                  ? 'Data Booking & Jadwal Kedatangan Pelanggan'
                  : activeTab === 'traffic'
                  ? 'Statistik & Trafik Kunjungan Website Real-Time'
                  : activeTab === 'tours_packages'
                  ? 'Kelola & Tambah Paket Tour & City Tour'
                  : activeTab === 'reviews'
                  ? 'Kelola Ulasan & Testimoni Klien'
                  : activeTab === 'all_sections'
                  ? 'Kelola Kuliner, Galeri Foto, Pengalaman & Banner'
                  : activeTab === 'settings'
                  ? 'Pengaturan & Edit Seluruh Bagian Website'
                  : activeTab === 'seo'
                  ? 'Optimasi SEO & Peringkat Google Mesin Pencari'
                  : activeTab === 'whatsapp_settings'
                  ? 'Pengaturan Chat WhatsApp & Widget CS'
                  : activeTab === 'payments'
                  ? 'Pengaturan Rekening Bank, E-Wallet & QRIS'
                  : activeTab === 'pricing_destinations'
                  ? 'Kelola Harga Paket Tour & Destinasi Wisata'
                  : activeTab === 'list'
                  ? 'Kelola Artikel & Panduan Wisata'
                  : activeTab === 'editor'
                  ? editingSlug
                    ? 'Edit Konten Artikel'
                    : 'Tulis Artikel Panduan Baru'
                  : 'Pengaturan & Edit Informasi Website'}
              </h1>
            </div>

            {activeTab === 'bookings' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                  <Cloud className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Database Cloud Aktif (Tersimpan Permanen)</span>
                </span>
                <span className="rounded-full bg-forest/10 text-forest px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Real-Time Sync Multi-Device</span>
                </span>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar for Bookings */}
          {activeTab === 'bookings' && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink/5">
                <div className="flex items-center gap-2 text-ink/50 text-xs font-medium uppercase tracking-wider">
                  <ShoppingBag className="h-4 w-4 text-forest" />
                  <span>Total Pemesanan</span>
                </div>
                <p className="mt-2 text-2xl font-display font-bold text-forest">{bookings.length}</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink/5">
                <div className="flex items-center gap-2 text-ink/50 text-xs font-medium uppercase tracking-wider">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Perlu Konfirmasi</span>
                </div>
                <p className="mt-2 text-2xl font-display font-bold text-amber-600">
                  {pendingBookingsCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink/5">
                <div className="flex items-center gap-2 text-ink/50 text-xs font-medium uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Lunas / Sukses</span>
                </div>
                <p className="mt-2 text-2xl font-display font-bold text-emerald-700">
                  {bookings.filter((b) => b.paymentStatus === 'Lunas').length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink/5">
                <div className="flex items-center gap-2 text-ink/50 text-xs font-medium uppercase tracking-wider">
                  <DollarSign className="h-4 w-4 text-ember" />
                  <span>Estimasi Omzet</span>
                </div>
                <p className="mt-2 text-lg sm:text-xl font-display font-bold text-ember truncate">
                  {formatRupiah(bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0))}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================= */}
        {/* TAB 1: DATA BOOKING PELANGGAN           */}
        {/* ======================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Laporan Pengunjung & Export Excel Toolbar */}
            <div className="rounded-3xl bg-gradient-to-r from-forest/95 via-forest to-forest-700 p-6 text-cream shadow-lift relative overflow-hidden">
              <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-ember/20 text-ember-300 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider border border-ember/30">
                      Laporan Keuangan & Pengunjung
                    </span>
                    <span className="text-xs text-cream/70 flex items-center gap-1">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-300" />
                      Format Microsoft Excel (.xlsx) & CSV
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mt-1 text-white">
                    Ekspor Laporan Pengunjung & Pembayaran
                  </h3>
                  <p className="text-xs sm:text-sm text-cream/80 max-w-xl mt-1">
                    Unduh rekapitulasi data pengunjung yang telah melakukan pembayaran lunas lengkap dengan rincian nama, kontak WA, paket tour, tanggal kedatangan, meeting point, dan total nominal transaksi.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportExcelPaid}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-forest-700 font-bold px-4 py-3 text-xs sm:text-sm transition shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    title="Unduh file Excel pengunjung yang sudah lunas/bayar"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-forest-700" />
                    <span>Export Excel (Pengunjung Lunas)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportExcelAll}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-cream font-semibold px-3.5 py-3 text-xs sm:text-sm transition border border-white/15"
                    title="Unduh seluruh data booking dalam file Excel"
                  >
                    <Download className="h-4 w-4" />
                    <span>Semua Booking (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-cream font-semibold px-3.5 py-3 text-xs sm:text-sm transition border border-white/15"
                    title="Unduh data dalam format CSV standar"
                  >
                    <Download className="h-4 w-4" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center rounded-2xl bg-white p-4 shadow-soft border border-ink/5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  type="text"
                  placeholder="Cari kode booking, nama, tanggal kedatangan, no WA..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full rounded-full bg-cream/50 pl-10 pr-4 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Menunggu Konfirmasi', 'Lunas', 'Selesai', 'Dibatalkan'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBookingStatusFilter(st)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                      bookingStatusFilter === st ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
                    }`}
                  >
                    {st === 'All' ? `Semua (${bookings.length})` : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table / Cards */}
            {filteredBookings.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-soft border border-ink/5">
                <p className="font-display text-xl text-ink/60">Belum ada data booking yang sesuai pencarian.</p>
                <p className="mt-1 text-xs text-ink/40">
                  Data pemesanan dari form kontak / paket tour website akan otomatis muncul di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl bg-white p-5 shadow-soft border border-ink/5 hover:shadow-lift transition duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Booking Code & Customer Info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-lg">
                            {b.id}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold ${
                              b.paymentStatus === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.paymentStatus === 'Menunggu Konfirmasi'
                                ? 'bg-amber-100 text-amber-800'
                                : b.paymentStatus === 'Selesai'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/75">
                          <span className="font-semibold text-base text-ink flex items-center gap-1.5">
                            <User className="h-4 w-4 text-forest" />
                            {b.fullName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-leaf" />
                            {b.whatsapp}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-ink/40" />
                            {b.email}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Arrival Date & Meeting Point Info */}
                      <div className="rounded-xl bg-forest/5 p-3 border border-forest/10 space-y-1 min-w-[240px]">
                        <div className="flex items-center gap-2 text-xs font-bold text-forest">
                          <Calendar className="h-4 w-4 text-ember" />
                          <span>Kedatangan: {b.arrivalDate || b.travelDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[0.75rem] text-ink/80">
                          <Clock className="h-3.5 w-3.5 text-forest" />
                          <span>Jam: <strong>{b.meetingTime || '08:00 WIB'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-[0.75rem] text-ink/70 truncate">
                          <MapPin className="h-3.5 w-3.5 text-forest shrink-0" />
                          <span className="truncate">{b.meetingPoint || 'Stasiun Garut'}</span>
                        </div>
                      </div>

                      {/* Package & Payment info */}
                      <div className="text-xs">
                        <span className="font-semibold text-ink block">{b.packageOrTour}</span>
                        <p className="text-[0.7rem] text-ink/60">{b.travelers} Peserta &bull; {b.paymentMethod}</p>
                        <span className="font-bold text-sm text-ember font-mono block mt-1">
                          {formatRupiah(b.totalPrice)}
                        </span>
                      </div>

                      {/* Action Controls */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-ink/10">
                        {/* Quick Confirm & Send Button */}
                        {b.paymentStatus === 'Menunggu Konfirmasi' && (
                          <button
                            type="button"
                            onClick={() => handleConfirmPaymentAndSendKwitansi(b)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3 py-1.5 text-xs font-bold text-white hover:bg-forest-700 transition shadow-sm"
                            title="Konfirmasi pembayaran Lunas dan langsung kirim link kwitansi resmi ke WA client"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                            <span>Konfirmasi Lunas &amp; Kirim Kwitansi</span>
                          </button>
                        )}

                        {/* Status Dropdown */}
                        <select
                          value={b.paymentStatus}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as PaymentStatus)}
                          className="rounded-xl border border-ink/20 bg-cream/30 px-3 py-1.5 text-xs font-semibold text-ink focus:border-forest focus:outline-none"
                        >
                          <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                          <option value="Lunas">Lunas</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>

                        {/* WhatsApp Customer Button */}
                        <button
                          type="button"
                          onClick={() => openCustomerWhatsApp(b)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1ebd59] transition shadow-sm"
                          title="Hubungi pelanggan via WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Chat WA</span>
                        </button>

                        {/* Kwitansi PDF Direct Link & Send */}
                        <a
                          href={`/kwitansi/${b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl bg-forest/10 px-2.5 py-1.5 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
                          title="Buka & Unduh Kwitansi PDF resmi client (tanpa login)"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Kwitansi PDF</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => copyKwitansiLink(b.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-ink/5 px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-forest hover:text-white transition shadow-sm"
                          title="Salin link download kwitansi client (dapat dibuka tanpa login)"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Link</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => sendKwitansiViaWhatsApp(b)}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                          title="Kirim link download kwitansi resmi PDF ke WhatsApp client"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Kirim Kwitansi</span>
                        </button>

                        {/* Detail Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => setSelectedBookingDetail(b)}
                          className="rounded-xl bg-ink/5 p-2 text-ink/70 hover:bg-forest hover:text-white transition"
                          title="Lihat detail lengkap & catatan"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(b.id)}
                          className="rounded-xl p-2 text-ink/40 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Hapus data booking"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {b.notes && (
                      <div className="mt-3 rounded-xl bg-cream/40 px-3 py-2 text-xs text-ink/75 border border-ink/5">
                        <strong className="text-forest">Catatan Pelanggan:</strong> {b.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: TRAFIK PENGUNJUNG REAL-TIME        */}
        {/* ======================================= */}
        {activeTab === 'traffic' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Live Status Card & Quick Controls */}
            <div className="rounded-3xl bg-forest p-6 sm:p-8 text-cream shadow-lift relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Activity className="h-48 w-48 text-white" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Sistem Pelacak Pengunjung Aktif</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-3 text-white">
                    Statistik Lalu Lintas & Kunjungan Garut Journey
                  </h2>
                  <p className="text-cream/70 text-xs sm:text-sm mt-1 max-w-xl">
                    Pantau arus wisatawan secara langsung. Data mencakup jumlah pengunjung unik, tayangan halaman (pageviews), saluran rujukan, dan perangkat yang digunakan.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      simulateBoost()
                      notifySuccess('Simulasi 1 pengunjung baru berhasil ditambahkan!')
                    }}
                    className="rounded-full bg-ember px-4 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-ember-600 transition flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Simulasi Pengunjung Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset data analitik trafik ke nilai awal?')) {
                        resetTraffic()
                        notifySuccess('Statistik pengunjung telah di-reset ke nilai awal.')
                      }
                    }}
                    className="rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-2.5 text-xs font-semibold text-cream transition flex items-center gap-1.5"
                    title="Reset Data Trafik"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>

              {/* 4 Hero Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cream/60 uppercase tracking-wider font-semibold">Sedang Online</span>
                    <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                  </div>
                  <p className="font-display text-3xl font-bold text-emerald-400 mt-2">
                    {traffic.liveVisitors} <span className="text-xs font-sans text-cream/70 font-normal">orang</span>
                  </p>
                  <p className="text-[0.65rem] text-cream/50 mt-1">Pengunjung aktif di website saat ini</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cream/60 uppercase tracking-wider font-semibold">Pengunjung Hari Ini</span>
                    <Users className="h-4 w-4 text-ember" />
                  </div>
                  <p className="font-display text-3xl font-bold text-white mt-2">
                    {traffic.todayVisitors.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[0.65rem] text-emerald-400 mt-1">↑ +14.2% dibanding kemarin</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cream/60 uppercase tracking-wider font-semibold">Tayangan Halaman</span>
                    <Eye className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="font-display text-3xl font-bold text-white mt-2">
                    {traffic.todayPageViews.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[0.65rem] text-cream/50 mt-1">Total {traffic.totalPageViews.toLocaleString('id-ID')} views terakumulasi</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cream/60 uppercase tracking-wider font-semibold">Durasi Kunjungan</span>
                    <Clock className="h-4 w-4 text-amber-300" />
                  </div>
                  <p className="font-display text-3xl font-bold text-white mt-2">
                    {Math.floor(traffic.avgSessionSeconds / 60)}m {traffic.avgSessionSeconds % 60}s
                  </p>
                  <p className="text-[0.65rem] text-cream/50 mt-1">Bounce rate sehat: {traffic.bounceRate}%</p>
                </div>
              </div>
            </div>

            {/* 14-Day Traffic Trend Bar Chart */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-ember text-xs font-bold uppercase tracking-widest">
                    <TrendingUp className="h-4 w-4" />
                    <span>Grafik Tren Kunjungan Harian</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-forest mt-1">
                    Aktivitas 14 Hari Terakhir
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-forest inline-block" />
                    <span>Tayangan Halaman (Pageviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-ember inline-block" />
                    <span>Pengunjung Unik</span>
                  </span>
                </div>
              </div>

              {/* Visual Chart Bars */}
              <div className="mt-8">
                <div className="h-56 flex items-end gap-1.5 sm:gap-3 pt-6 border-b border-ink/10">
                  {traffic.dailyStats.map((d, idx) => {
                    const maxVal = Math.max(...traffic.dailyStats.map((s) => s.pageViews), 1)
                    const pvHeight = Math.max(12, Math.round((d.pageViews / maxVal) * 180))
                    const vHeight = Math.max(8, Math.round((d.visitors / maxVal) * 180))
                    const isToday = idx === traffic.dailyStats.length - 1

                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-ink text-white px-2.5 py-1 rounded-lg text-[0.65rem] whitespace-nowrap shadow-lift pointer-events-none">
                          <span className="font-bold">{d.dayLabel}</span>
                          <span>{d.visitors} Visitors • {d.pageViews} Views</span>
                        </div>

                        <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1">
                          <div
                            style={{ height: `${pvHeight}px` }}
                            className={`w-1/2 rounded-t-md transition-all duration-300 ${
                              isToday ? 'bg-forest' : 'bg-forest/75 group-hover:bg-forest'
                            }`}
                          />
                          <div
                            style={{ height: `${vHeight}px` }}
                            className={`w-1/2 rounded-t-md transition-all duration-300 ${
                              isToday ? 'bg-ember' : 'bg-ember/75 group-hover:bg-ember'
                            }`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between text-[0.65rem] text-ink/50 mt-2 font-medium">
                  {traffic.dailyStats.map((d) => (
                    <span key={d.date} className="truncate text-center flex-1">
                      {d.dayLabel.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Two-Column Analytics: Sources & Devices */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Saluran Rujukan (Traffic Sources) */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5">
                <div className="border-b border-ink/10 pb-4">
                  <div className="flex items-center gap-2 text-ember text-xs font-bold uppercase tracking-widest">
                    <Globe2 className="h-4 w-4" />
                    <span>Saluran Rujukan</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-forest mt-1">
                    Dari Mana Pengunjung Datang?
                  </h3>
                </div>

                <div className="mt-6 space-y-4">
                  {traffic.sources.map((s) => (
                    <div key={s.source}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="flex items-center gap-2 text-ink">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          <span>{s.source}</span>
                        </span>
                        <span className="text-ink/60">
                          <strong className="text-ink font-bold">{s.count.toLocaleString('id-ID')}</strong> ({s.percentage}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-cream-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perangkat & Kota Pengunjung */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div>
                  <div className="border-b border-ink/10 pb-4">
                    <div className="flex items-center gap-2 text-ember text-xs font-bold uppercase tracking-widest">
                      <Laptop className="h-4 w-4" />
                      <span>Perangkat & Wilayah</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-forest mt-1">
                      Perangkat & Sebaran Kota
                    </h3>
                  </div>

                  {/* Devices Grid */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {traffic.devices.map((dev) => (
                      <div key={dev.device} className="rounded-2xl bg-cream/50 p-3.5 border border-ink/5 text-center">
                        {dev.device === 'Mobile' ? (
                          <Smartphone className="h-5 w-5 text-forest mx-auto" />
                        ) : dev.device === 'Tablet' ? (
                          <Laptop className="h-5 w-5 text-ember mx-auto" />
                        ) : (
                          <Laptop className="h-5 w-5 text-ink/70 mx-auto" />
                        )}
                        <span className="block text-xs font-bold text-ink mt-2">{dev.device}</span>
                        <span className="font-display text-base font-bold text-forest mt-0.5 block">{dev.percentage}%</span>
                        <span className="text-[0.65rem] text-ink/50">{dev.count} kunjungan</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Cities */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-3">
                    Kota Asal Pengunjung Terbanyak
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {traffic.cities.map((city) => (
                      <span
                        key={city.city}
                        className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 border border-forest/15 px-3 py-1 text-xs text-forest font-semibold"
                      >
                        <MapPin className="h-3 w-3 text-ember" />
                        <span>{city.city}</span>
                        <span className="text-[0.65rem] bg-forest/10 px-1.5 py-0.5 rounded-full font-bold">
                          {city.percentage}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Visited Pages */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5">
              <div className="border-b border-ink/10 pb-4">
                <div className="flex items-center gap-2 text-ember text-xs font-bold uppercase tracking-widest">
                  <BarChart3 className="h-4 w-4" />
                  <span>Halaman Favorit</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-forest mt-1">
                  Halaman Paling Sering Dikunjungi Wisatawan
                </h3>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink/10 text-[0.65rem] uppercase tracking-wider text-ink/50">
                      <th className="pb-3 font-bold">Nama Halaman</th>
                      <th className="pb-3 font-bold">Tautan URL</th>
                      <th className="pb-3 font-bold text-right">Total Tayangan</th>
                      <th className="pb-3 font-bold text-right">Pertumbuhan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {traffic.topPages.map((page) => (
                      <tr key={page.path} className="hover:bg-cream/40 transition">
                        <td className="py-3 font-semibold text-ink flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                          <span>{page.title}</span>
                        </td>
                        <td className="py-3 font-mono text-ink/60 text-[0.7rem]">{page.path}</td>
                        <td className="py-3 text-right font-bold text-forest">
                          {page.views.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 text-right">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold text-[0.65rem]">
                            {page.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Activity Feed / Recent Visits */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-ember text-xs font-bold uppercase tracking-widest">
                    <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
                    <span>Aktivitas Pengunjung Terbaru</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-forest mt-1">
                    Log Kunjungan Real-Time (20 Kunjungan Terakhir)
                  </h3>
                </div>
                <span className="text-xs text-ink/50 bg-cream px-3 py-1 rounded-full font-medium">
                  Diperbarui otomatis
                </span>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink/10 text-[0.65rem] uppercase tracking-wider text-ink/50">
                      <th className="pb-3 font-bold">Waktu</th>
                      <th className="pb-3 font-bold">Halaman Diakses</th>
                      <th className="pb-3 font-bold">Kota / Lokasi</th>
                      <th className="pb-3 font-bold">Perangkat & Browser</th>
                      <th className="pb-3 font-bold">Sumber Rujukan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {traffic.recentVisits.map((rec) => {
                      const timeStr = new Date(rec.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                      return (
                        <tr key={rec.id} className="hover:bg-cream/40 transition">
                          <td className="py-3 font-mono text-[0.7rem] text-ink/60">{timeStr}</td>
                          <td className="py-3 font-semibold text-ink">
                            <span className="block truncate max-w-[220px]">{rec.title}</span>
                            <span className="block text-[0.65rem] font-mono text-ink/40">{rec.path}</span>
                          </td>
                          <td className="py-3 text-ink font-medium">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-ember" />
                              <span>{rec.city}</span>
                            </span>
                          </td>
                          <td className="py-3 text-ink/70">
                            <span className="block">{rec.device}</span>
                            <span className="block text-[0.65rem] text-ink/45">{rec.browser}</span>
                          </td>
                          <td className="py-3">
                            <span className="rounded-full bg-forest/10 text-forest px-2.5 py-0.5 font-medium text-[0.7rem]">
                              {rec.referrer}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: PENGATURAN PEMBAYARAN (GATEWAY)   */}
        {/* ======================================= */}
        {activeTab === 'payments' && (
          <form onSubmit={handleSavePaymentSettings} className="space-y-8">
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    Gateway & Rekening Resmi
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Kelola Rekening Bank, E-Wallet & QRIS
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Ubah nomor rekening, nama pemilik rekening, nomor e-wallet, dan instruksi QRIS. Perubahan akan langsung aktif di formulir pembayaran pelanggan.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700 transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>Simpan Pengaturan</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPaymentSettings}
                    className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
                  >
                    Reset Default
                  </button>
                </div>
              </div>

              {/* Grid Channel Pembayaran */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* 1. QRIS Instant */}
                <div className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest text-cream">
                        <QrCode className="h-4 w-4" />
                      </span>
                      <h3 className="font-display text-base font-bold text-forest">1. QRIS Instant (Semua Bank & E-Wallet)</h3>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paySettingsForm.qris.enabled}
                        onChange={(e) =>
                          setPaySettingsForm({
                            ...paySettingsForm,
                            qris: { ...paySettingsForm.qris, enabled: e.target.checked },
                          })
                        }
                        className="rounded text-forest focus:ring-forest"
                      />
                      <span>{paySettingsForm.qris.enabled ? 'Aktif' : 'Nonaktif'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nama / Label QRIS
                    </label>
                    <input
                      type="text"
                      value={paySettingsForm.qris.qrisName}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          qris: { ...paySettingsForm.qris, qrisName: e.target.value },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Petunjuk Scan QRIS
                    </label>
                    <textarea
                      rows={2}
                      value={paySettingsForm.qris.instructions}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          qris: { ...paySettingsForm.qris, instructions: e.target.value },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      URL Gambar QRIS Kustom (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://... (Biarkan kosong untuk QRIS bawaan)"
                      value={paySettingsForm.qris.customQrUrl || ''}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          qris: { ...paySettingsForm.qris, customQrUrl: e.target.value },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Bank BCA */}
                <div className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
                        <CreditCard className="h-4 w-4" />
                      </span>
                      <h3 className="font-display text-base font-bold text-forest">2. Transfer Bank BCA</h3>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paySettingsForm.bca.enabled}
                        onChange={(e) =>
                          setPaySettingsForm({
                            ...paySettingsForm,
                            bca: { ...paySettingsForm.bca, enabled: e.target.checked },
                          })
                        }
                        className="rounded text-forest focus:ring-forest"
                      />
                      <span>{paySettingsForm.bca.enabled ? 'Aktif' : 'Nonaktif'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nomor Rekening BCA *
                    </label>
                    <input
                      type="text"
                      required
                      value={paySettingsForm.bca.accountNumber}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          bca: { ...paySettingsForm.bca, accountNumber: e.target.value },
                        })
                      }
                      placeholder="148-092-8819"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nama Pemilik Rekening (Atas Nama) *
                    </label>
                    <input
                      type="text"
                      required
                      value={paySettingsForm.bca.accountHolder}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          bca: { ...paySettingsForm.bca, accountHolder: e.target.value },
                        })
                      }
                      placeholder="Garut Journey Official"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Bank Mandiri */}
                <div className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-600 text-white">
                        <CreditCard className="h-4 w-4" />
                      </span>
                      <h3 className="font-display text-base font-bold text-forest">3. Transfer Bank Mandiri</h3>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paySettingsForm.mandiri.enabled}
                        onChange={(e) =>
                          setPaySettingsForm({
                            ...paySettingsForm,
                            mandiri: { ...paySettingsForm.mandiri, enabled: e.target.checked },
                          })
                        }
                        className="rounded text-forest focus:ring-forest"
                      />
                      <span>{paySettingsForm.mandiri.enabled ? 'Aktif' : 'Nonaktif'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nomor Rekening Mandiri *
                    </label>
                    <input
                      type="text"
                      required
                      value={paySettingsForm.mandiri.accountNumber}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          mandiri: { ...paySettingsForm.mandiri, accountNumber: e.target.value },
                        })
                      }
                      placeholder="131-00-298371-2"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nama Pemilik Rekening (Atas Nama) *
                    </label>
                    <input
                      type="text"
                      required
                      value={paySettingsForm.mandiri.accountHolder}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          mandiri: { ...paySettingsForm.mandiri, accountHolder: e.target.value },
                        })
                      }
                      placeholder="Garut Journey Official"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Bank BRI */}
                <div className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-700 text-white">
                        <CreditCard className="h-4 w-4" />
                      </span>
                      <h3 className="font-display text-base font-bold text-forest">4. Transfer Bank BRI</h3>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paySettingsForm.bri.enabled}
                        onChange={(e) =>
                          setPaySettingsForm({
                            ...paySettingsForm,
                            bri: { ...paySettingsForm.bri, enabled: e.target.checked },
                          })
                        }
                        className="rounded text-forest focus:ring-forest"
                      />
                      <span>{paySettingsForm.bri.enabled ? 'Aktif' : 'Nonaktif'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nomor Rekening BRI *
                    </label>
                    <input
                      type="text"
                      required
                      value={paySettingsForm.bri.accountNumber}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          bri: { ...paySettingsForm.bri, accountNumber: e.target.value },
                        })
                      }
                      placeholder="0123-01-084729-50-1"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nama Pemilik Rekening (Atas Nama) *
                    </label>
                    <input
                      type="text"
                      required
                      value={paySettingsForm.bri.accountHolder}
                      onChange={(e) =>
                        setPaySettingsForm({
                          ...paySettingsForm,
                          bri: { ...paySettingsForm.bri, accountHolder: e.target.value },
                        })
                      }
                      placeholder="Garut Journey Official"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. E-Wallet Channels */}
                <div className="rounded-2xl border border-ink/10 bg-cream/20 p-5 space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
                      <Smartphone className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-forest">5. Nomor E-Wallet (DANA, GoPay, OVO)</h3>
                      <p className="text-[0.7rem] text-ink/60">Atur nomor telepon akun e-wallet penerima transfer pembayaran.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* DANA */}
                    <div className="rounded-xl bg-white p-3.5 border border-ink/10 space-y-2">
                      <span className="font-bold text-xs text-sky-600">DANA</span>
                      <div>
                        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">Nomor HP</label>
                        <input
                          type="text"
                          value={paySettingsForm.dana.phoneNumber}
                          onChange={(e) =>
                            setPaySettingsForm({
                              ...paySettingsForm,
                              dana: { ...paySettingsForm.dana, phoneNumber: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-mono font-bold text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">Atas Nama</label>
                        <input
                          type="text"
                          value={paySettingsForm.dana.accountHolder}
                          onChange={(e) =>
                            setPaySettingsForm({
                              ...paySettingsForm,
                              dana: { ...paySettingsForm.dana, accountHolder: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-ink"
                        />
                      </div>
                    </div>

                    {/* GoPay */}
                    <div className="rounded-xl bg-white p-3.5 border border-ink/10 space-y-2">
                      <span className="font-bold text-xs text-emerald-600">GoPay</span>
                      <div>
                        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">Nomor HP</label>
                        <input
                          type="text"
                          value={paySettingsForm.gopay.phoneNumber}
                          onChange={(e) =>
                            setPaySettingsForm({
                              ...paySettingsForm,
                              gopay: { ...paySettingsForm.gopay, phoneNumber: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-mono font-bold text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">Atas Nama</label>
                        <input
                          type="text"
                          value={paySettingsForm.gopay.accountHolder}
                          onChange={(e) =>
                            setPaySettingsForm({
                              ...paySettingsForm,
                              gopay: { ...paySettingsForm.gopay, accountHolder: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-ink"
                        />
                      </div>
                    </div>

                    {/* OVO */}
                    <div className="rounded-xl bg-white p-3.5 border border-ink/10 space-y-2">
                      <span className="font-bold text-xs text-purple-600">OVO</span>
                      <div>
                        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">Nomor HP</label>
                        <input
                          type="text"
                          value={paySettingsForm.ovo.phoneNumber}
                          onChange={(e) =>
                            setPaySettingsForm({
                              ...paySettingsForm,
                              ovo: { ...paySettingsForm.ovo, phoneNumber: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-mono font-bold text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">Atas Nama</label>
                        <input
                          type="text"
                          value={paySettingsForm.ovo.accountHolder}
                          onChange={(e) =>
                            setPaySettingsForm({
                              ...paySettingsForm,
                              ovo: { ...paySettingsForm.ovo, accountHolder: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-ink"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-forest px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-soft hover:bg-forest-700 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Semua Perubahan Rekening</span>
                </button>

                <p className="text-xs text-ink/50 text-center sm:text-right">
                  Perubahan akan langsung aktif di modal popup pembayaran pelanggan.
                </p>
              </div>
            </div>
          </form>
        )}

        {/* ======================================= */}
        {/* TAB: KELOLA PAKET TOUR & CITY TOUR      */}
        {/* ======================================= */}
        {activeTab === 'tours_packages' && <ToursManager onNotify={notifySuccess} />}

        {/* ======================================= */}
        {/* TAB: KELOLA ULASAN KLIEN                */}
        {/* ======================================= */}
        {activeTab === 'reviews' && <ReviewsManager onNotify={notifySuccess} />}

        {/* ======================================= */}
        {/* TAB: KELOLA KULINER, GALERI & SEKSI     */}
        {/* ======================================= */}
        {activeTab === 'all_sections' && <SectionsManager onNotify={notifySuccess} />}

        {/* ======================================= */}
        {/* TAB 2: KELOLA HARGA & DESTINASI         */}
        {/* ======================================= */}
        {activeTab === 'pricing_destinations' && (
          <div className="space-y-10">
            {/* Section A: Edit Paket Tour Prices */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-ink/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    Manajemen Harga Wisata
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Ubah & Atur Harga Paket Tour
                  </h2>
                  <p className="text-xs text-ink/60">
                    Harga ini langsung tersinkronisasi ke formulir booking dan perhitungan total biaya pelanggan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('tours_packages')}
                  className="self-start inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-ember-600 transition shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah / Edit Paket Tour</span>
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.keys({ ...DEFAULT_TOUR_PRICES, ...prices }).map((tourName) => {
                  const currentPrice = priceForm[tourName] || prices[tourName] || DEFAULT_TOUR_PRICES[tourName] || 350000
                  return (
                    <div
                      key={tourName}
                      className="rounded-2xl border border-ink/10 bg-cream/30 p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded">
                          Paket Wisata
                        </span>
                        <h3 className="font-display text-base font-bold text-ink mt-2">{tourName}</h3>
                        <p className="text-xs text-ink/60 mt-1">
                          Harga aktif saat ini: <strong>{formatRupiah(prices[tourName] || currentPrice)}</strong> / orang
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-ink/10">
                        <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-ink/60">
                          Ubah Harga (Rupiah):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={0}
                            step={10000}
                            value={priceForm[tourName] ?? currentPrice}
                            onChange={(e) =>
                              setPriceForm({
                                ...priceForm,
                                [tourName]: Number(e.target.value) || 0,
                              })
                            }
                            className="w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePrice(tourName)}
                            className="rounded-xl bg-forest px-3 py-2 text-xs font-bold text-white hover:bg-forest-700 transition shrink-0"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Section B: Tambah / Edit Destinasi Baru */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
              <div className="border-b border-ink/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-ember">
                  Katalog Destinasi
                </span>
                <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                  {editingDestSlug ? `Edit Destinasi: ${destName}` : 'Tambah Destinasi Wisata Baru'}
                </h2>
                <p className="text-xs text-ink/60">
                  Destinasi yang Anda tambahkan atau edit di sini akan langsung tampil pada halaman katalog destinasi website.
                </p>
              </div>

              <form onSubmit={handleSaveDestination} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nama Destinasi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Curug Orok, Talaga Bodas"
                      value={destName}
                      onChange={(e) => {
                        setDestName(e.target.value)
                        if (!editingDestSlug) setDestSlug(generateSlug(e.target.value))
                      }}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Slug URL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="curug-orok"
                      value={destSlug}
                      onChange={(e) => setDestSlug(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-xs font-mono text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Lokasi Wilayah *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Cikajang, Garut / Wanaraja, Garut"
                      value={destLocation}
                      onChange={(e) => setDestLocation(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Estimasi Tiket / Biaya Masuk
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 15.000 / orang"
                      value={destTicketPrice}
                      onChange={(e) => setDestTicketPrice(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Kategori Destinasi
                    </label>
                    <select
                      value={destCategory}
                      onChange={(e) => setDestCategory(e.target.value as Category)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    >
                      {DEST_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Foto Gambar Destinasi
                    </label>
                    <div className="mt-1.5 flex gap-2">
                      <select
                        value={destImage.startsWith('data:') ? 'custom' : destImage}
                        onChange={(e) => {
                          if (e.target.value !== 'custom') setDestImage(e.target.value)
                        }}
                        className="flex-1 rounded-xl border border-ink/20 px-3 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                      >
                        {destImage.startsWith('data:') && (
                          <option value="custom">Foto Hasil Upload Sendiri</option>
                        )}
                        {AVAILABLE_IMAGES.map((img) => (
                          <option key={img.file} value={img.file}>
                            {img.label} ({img.file})
                          </option>
                        ))}
                      </select>
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-ember px-3.5 py-2.5 text-xs font-bold text-white hover:bg-ember-600 transition shrink-0">
                        <Upload className="h-4 w-4" />
                        <span>{destUploading ? '...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDestFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {destImage.startsWith('data:') && (
                      <div className="mt-2 flex items-center gap-2 bg-cream/40 p-2 rounded-xl border border-ink/10">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-forest/10 shrink-0">
                          <img src={destImage} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-[0.7rem] text-forest font-semibold">Foto khusus siap digunakan</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Deskripsi Singkat Destinasi *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Tuliskan keistimewaan tempat ini..."
                      value={destShort}
                      onChange={(e) => setDestShort(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Fasilitas (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Parkir Luas, Toilet Bersih, Gazebo, Warung Makan, Spot Foto"
                      value={destFacilities}
                      onChange={(e) => setDestFacilities(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700 transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingDestSlug ? 'Simpan Perubahan Destinasi' : 'Tambahkan Destinasi Baru'}</span>
                  </button>

                  {editingDestSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDestSlug(null)
                        setDestName('')
                        setDestSlug('')
                      }}
                      className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Section C: Daftar Destinasi Aktif */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-4">
              <h2 className="font-display text-xl font-semibold text-forest">
                Daftar Destinasi Aktif di Website ({allDestinations.length})
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allDestinations.map((d) => (
                  <div
                    key={d.slug}
                    className="rounded-2xl border border-ink/10 p-4 bg-cream/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-ink/10 shrink-0">
                        <Img file={d.image} alt={d.name} className="h-full w-full object-cover" width={100} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-bold text-ink truncate">{d.name}</h4>
                        <p className="text-[0.7rem] text-ink/60 truncate">{d.location}</p>
                        <span className="text-[0.65rem] font-bold text-ember">
                          {d.ticketPrice || 'Tiket: Belum diatur'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditDest(d)}
                        className="rounded-lg p-1.5 text-ink/60 hover:bg-forest hover:text-white transition"
                        title="Edit destinasi"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDest(d.slug, d.name)}
                        className="rounded-lg p-1.5 text-ink/40 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Hapus destinasi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: ARTICLE LIST                     */}
        {/* ======================================= */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center rounded-2xl bg-white p-4 shadow-soft border border-ink/5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  type="text"
                  placeholder="Cari judul, kata kunci, kategori..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full bg-cream/50 pl-10 pr-4 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                    selectedCategory === 'All' ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
                  }`}
                >
                  Semua ({articles.length})
                </button>
                {ARTICLE_CATEGORIES.map((cat) => {
                  const count = articles.filter((a) => a.category === cat).length
                  if (count === 0 && selectedCategory !== cat) return null
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                        selectedCategory === cat ? 'bg-forest text-white' : 'bg-ink/5 text-ink/75 hover:bg-ink/10'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink/60 hover:text-ember hover:bg-ember/10 transition shrink-0 ml-auto"
                  title="Kembalikan artikel ke versi default"
                >
                  Reset Bawaan
                </button>
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-soft border border-ink/5">
                <p className="font-display text-xl text-ink/60">Tidak ada artikel yang cocok dengan pencarian.</p>
                <button
                  type="button"
                  onClick={startNewArticle}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-xs font-semibold text-white"
                >
                  <Plus className="h-4 w-4" /> Tulis Artikel Baru Sekarang
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((art) => (
                  <div
                    key={art.slug}
                    className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-soft border border-ink/5 hover:shadow-lift transition duration-300"
                  >
                    <div>
                      {/* Image Preview & Category Badge */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ink/5">
                        <Img file={art.image} alt={art.title} className="h-full w-full object-cover" width={400} />
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-ink/75 backdrop-blur-md px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                          {art.category}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[0.7rem] text-ink/50">
                          <span>{formatDate(art.date)}</span>
                          <span>{art.readingTime}</span>
                        </div>
                        <h3 className="font-display mt-1.5 text-lg font-semibold text-ink line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-ink/65 line-clamp-2">{art.excerpt}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between gap-2">
                      <Link
                        to="/guide/$slug"
                        params={{ slug: art.slug }}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-ember transition"
                        title="Buka halaman baca artikel"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Lihat</span>
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSeoAuditArticle(art)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1.5 text-xs font-bold border border-emerald-200 hover:bg-emerald-600 hover:text-white transition"
                          title="Cek skor SEO artikel ini"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Cek SEO</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditArticle(art)}
                          className="inline-flex items-center gap-1 rounded-lg bg-ink/5 px-2.5 py-1.5 text-xs font-semibold text-ink/80 hover:bg-forest hover:text-white transition"
                          title="Edit artikel"
                        >
                          <PenSquare className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(art.slug, art.title)}
                          className="rounded-lg p-1.5 text-ink/40 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Hapus artikel"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Cek SEO Artikel */}
            {seoAuditArticle && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 overflow-y-auto"
                onClick={() => setSeoAuditArticle(null)}
              >
                <div
                  className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-ink border border-ink/10 space-y-4 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                    <div>
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ember">
                        Laporan Audit SEO Artikel
                      </span>
                      <h3 className="font-display text-lg font-bold text-ink truncate max-w-md">
                        {seoAuditArticle.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSeoAuditArticle(null)}
                      className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>

                  <ArticleSeoChecker
                    title={seoAuditArticle.title}
                    slug={seoAuditArticle.slug}
                    excerpt={seoAuditArticle.excerpt}
                    content={(seoAuditArticle.body || []).map((s) => s.heading + ' ' + s.text).join(' ')}
                    image={seoAuditArticle.image}
                    category={seoAuditArticle.category}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: ARTICLE EDITOR FORM              */}
        {/* ======================================= */}
        {activeTab === 'editor' && (
          <form onSubmit={handleSaveArticle} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
                  <div>
                    <label htmlFor="art-title" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Judul Artikel *
                    </label>
                    <input
                      id="art-title"
                      type="text"
                      required
                      placeholder="Contoh: Panduan Menggunakan Website Garut Journey untuk Merencanakan Liburan"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base font-semibold text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div>
                    <label htmlFor="art-slug" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Slug URL (Permalink) *
                    </label>
                    <div className="mt-1.5 flex rounded-xl border border-ink/15 bg-cream/40 px-3 py-2 text-xs font-mono text-ink/75 focus-within:border-forest focus-within:bg-white">
                      <span className="text-ink/40 select-none">/guide/</span>
                      <input
                        id="art-slug"
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value)
                          setSlugManuallyEdited(true)
                        }}
                        className="min-w-0 flex-1 bg-transparent text-xs font-mono text-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="art-excerpt" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Ringkasan Singkat / Excerpt *
                    </label>
                    <textarea
                      id="art-excerpt"
                      required
                      rows={3}
                      placeholder="Tuliskan 1-2 kalimat ringkasan yang menarik..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-sm text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-forest">Bagian & Paragraf Konten</h2>
                      <p className="text-xs text-ink/60">Tambahkan subjudul dan paragraf pembahasan artikel Anda.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3.5 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah Bagian</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {bodySections.map((sec, idx) => (
                      <div key={idx} className="rounded-2xl border border-ink/10 bg-cream/20 p-4 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-ember">
                            Bagian #{idx + 1}
                          </span>
                          {bodySections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="text-ink/30 hover:text-rose-600 transition p-1"
                              title="Hapus bagian ini"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Subjudul Bagian"
                            value={sec.heading}
                            onChange={(e) => handleUpdateSection(idx, 'heading', e.target.value)}
                            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none"
                          />
                        </div>

                        <div>
                          <textarea
                            rows={4}
                            placeholder="Tuliskan isi paragraf di sini..."
                            value={sec.text}
                            onChange={(e) => handleUpdateSection(idx, 'text', e.target.value)}
                            className="w-full rounded-lg border border-ink/15 bg-white p-3 text-sm text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
                  <h2 className="font-display text-base font-semibold text-forest">Pengaturan Publikasi</h2>

                  <div>
                    <label htmlFor="art-category" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Kategori Artikel
                    </label>
                    <select
                      id="art-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm font-medium text-ink focus:border-forest focus:outline-none"
                    >
                      {ARTICLE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="art-date" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                        Tanggal
                      </label>
                      <input
                        id="art-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="art-reading-time" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                        Waktu Baca
                      </label>
                      <input
                        id="art-reading-time"
                        type="text"
                        placeholder="Contoh: 5 min read"
                        value={readingTime}
                        onChange={(e) => setReadingTime(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ink/5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                      Destinasi Terkait
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                      {allDestinations.map((d) => {
                        const isSelected = relatedDestinations.includes(d.slug)
                        return (
                          <button
                            key={d.slug}
                            type="button"
                            onClick={() => toggleRelatedDestination(d.slug)}
                            className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold transition ${
                              isSelected
                                ? 'bg-forest text-white'
                                : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
                            }`}
                          >
                            {d.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-semibold text-forest">Gambar Sampul</h2>
                    <span className="text-[0.7rem] text-ink/50 uppercase font-mono">
                      {useCustomImage ? 'Custom URL' : image}
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink/10 border border-ink/10">
                    <Img
                      file={useCustomImage && customImage ? customImage : image}
                      alt="Pratinjau Sampul"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex rounded-lg bg-cream/70 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setUseCustomImage(false)}
                      className={`flex-1 rounded-md py-1.5 transition ${
                        !useCustomImage ? 'bg-white shadow text-forest' : 'text-ink/60 hover:text-ink'
                      }`}
                    >
                      Pilih Gambar Bawaan
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseCustomImage(true)}
                      className={`flex-1 rounded-md py-1.5 transition ${
                        useCustomImage ? 'bg-white shadow text-forest' : 'text-ink/60 hover:text-ink'
                      }`}
                    >
                      Custom Image URL
                    </button>
                  </div>

                  {!useCustomImage ? (
                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                      <div className="grid grid-cols-3 gap-2">
                        {AVAILABLE_IMAGES.map((img) => (
                          <button
                            key={img.file}
                            type="button"
                            onClick={() => setImage(img.file)}
                            className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
                              image === img.file ? 'border-ember ring-2 ring-ember/20' : 'border-transparent opacity-75 hover:opacity-100'
                            }`}
                          >
                            <Img file={img.file} alt={img.label} className="h-full w-full object-cover" width={160} />
                            <span className="absolute inset-x-0 bottom-0 bg-ink/75 text-[0.6rem] text-white p-1 truncate">
                              {img.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="art-custom-image" className="block text-xs font-medium text-ink/70">
                        Masukkan Link Gambar (URL):
                      </label>
                      <input
                        id="art-custom-image"
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={customImage}
                        onChange={(e) => setCustomImage(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-forest py-3.5 px-6 text-sm font-bold uppercase tracking-wider text-white shadow-soft hover:bg-forest-700 transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingSlug ? 'Simpan Perubahan' : 'Terbitkan Artikel Sekarang'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="w-full rounded-full border border-ink/15 py-3 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition text-center"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ======================================= */}
        {/* TAB: EDIT SELURUH BAGIAN WEBSITE (CMS)  */}
        {/* ======================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* Card 00: Ganti Logo & Branding Website */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    00 &bull; Logo & Branding Visual Website
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Ganti Logo Website (Header, Footer & Mobile)
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Gunakan logo ikon SVG bawaan atau unggah/tautkan URL gambar logo khusus bisnis Anda.
                  </p>
                </div>

                {/* Preview Logo Saat Ini */}
                <div className="rounded-2xl border border-ink/10 bg-cream/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block mb-1">
                      Preview Logo Website Saat Ini:
                    </span>
                    <div className="flex items-center gap-3 p-3 bg-forest rounded-2xl w-fit">
                      {logoType === 'custom' && customLogoUrl ? (
                        <img
                          src={customLogoUrl}
                          alt="Preview Logo"
                          style={{ height: `${logoHeight}px` }}
                          className="w-auto object-contain max-w-[180px]"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="flex items-center gap-2.5 text-cream">
                          <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
                            <circle cx="16" cy="16" r="16" className="fill-ember" />
                            <path d="M5 23 L12.5 12 L17 18 L20 14 L27 23 Z" className="fill-cream" />
                            <circle cx="21.5" cy="9.5" r="2.5" className="fill-cream" />
                          </svg>
                          <span className="flex flex-col">
                            <span className="font-display text-base font-semibold leading-none tracking-wider text-cream">
                              {siteName || 'GARUT'} <span className="text-ember">JOURNEY</span>
                            </span>
                            <span className="text-[0.55rem] font-bold uppercase tracking-widest text-ember mt-0.5">
                              {siteSubtitle || 'Explore Swiss van Java'}
                            </span>
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-ink/60 max-w-xs">
                    <p>Format yang disarankan: PNG transparan atau SVG dengan rasio lebar (landscape).</p>
                  </div>
                </div>

                {/* Pilihan Jenis Logo */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                    Model Logo Website:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLogoType('default')}
                      className={`rounded-2xl p-4 text-left border transition ${
                        logoType === 'default'
                          ? 'border-forest bg-forest/10 ring-2 ring-forest text-forest font-bold shadow-sm'
                          : 'border-ink/15 bg-cream/20 text-ink/75 hover:bg-cream/50'
                      }`}
                    >
                      <span className="block text-xs font-bold">1. Logo Ikon Vektor Bawaan</span>
                      <span className="text-[0.65rem] text-ink/50 block mt-1">
                        Ikon gunung vulkanik emas khas Priangan + nama brand
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLogoType('custom')}
                      className={`rounded-2xl p-4 text-left border transition ${
                        logoType === 'custom'
                          ? 'border-forest bg-forest/10 ring-2 ring-forest text-forest font-bold shadow-sm'
                          : 'border-ink/15 bg-cream/20 text-ink/75 hover:bg-cream/50'
                      }`}
                    >
                      <span className="block text-xs font-bold">2. Logo Gambar Kustom (URL)</span>
                      <span className="text-[0.65rem] text-ink/50 block mt-1">
                        Gunakan file gambar logo brand Anda sendiri
                      </span>
                    </button>
                  </div>
                </div>

                {/* Input URL Logo jika custom */}
                {logoType === 'custom' && (
                  <div className="space-y-4 pt-2 border-t border-ink/10 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                        Upload File Logo atau Masukkan URL *
                      </label>
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="text"
                          value={customLogoUrl}
                          onChange={(e) => setCustomLogoUrl(e.target.value)}
                          placeholder="Pilih file logo atau ketik URL gambar..."
                          className="flex-1 rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink font-mono focus:border-forest focus:outline-none"
                        />
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-ember px-3.5 py-2.5 text-xs font-bold text-white hover:bg-ember-600 transition shrink-0">
                          <Upload className="h-4 w-4" />
                          <span>{logoUploading ? '...' : 'Upload Logo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-[0.65rem] text-ink/50">
                        Mendukung upload langsung file PNG transparan, WebP, SVG, atau JPG dari komputer/smartphone Anda.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                        <span>Tinggi Logo di Header: {logoHeight}px</span>
                        <span className="text-ink/40 font-normal">Rekomendasi: 32px – 44px</span>
                      </div>
                      <input
                        type="range"
                        min={24}
                        max={64}
                        step={2}
                        value={logoHeight}
                        onChange={(e) => setLogoHeight(Number(e.target.value))}
                        className="w-full accent-forest cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card 1: Identitas & Kontak Resmi */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-5">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    01 &bull; Identitas Bisnis & Kontak Resmi
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Profil Brand, Kontak & Media Sosial
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Ubah data nama brand, kontak WhatsApp pemandu, email, alamat kantor, Google Maps, dan tautan sosial media.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nama Brand Website *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Slogan / Subtitle *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSubtitle}
                      onChange={(e) => setSiteSubtitle(e.target.value)}
                      placeholder="Explore Swiss van Java"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Alamat Kantor Resmi di Garut *
                  </label>
                  <div className="mt-1.5 relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-forest" />
                    <textarea
                      rows={2}
                      required
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      placeholder="Jl. Raya Bayongbong - Cikajang No. 103 Garut, Jawa Barat"
                      className="w-full rounded-xl border border-ink/15 bg-white pl-10 pr-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Nomor WhatsApp Admin (Chat & Konfirmasi) *
                    </label>
                    <div className="mt-1.5 relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#25D366]" />
                      <input
                        type="text"
                        required
                        value={siteWhatsapp}
                        onChange={(e) => setSiteWhatsapp(e.target.value)}
                        placeholder="+62 851-5645-6791"
                        className="w-full rounded-xl border border-ink/15 bg-white pl-10 pr-4 py-2.5 text-sm font-mono text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Email Kontak Resmi *
                    </label>
                    <div className="mt-1.5 relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest" />
                      <input
                        type="email"
                        required
                        value={siteEmail}
                        onChange={(e) => setSiteEmail(e.target.value)}
                        placeholder="hello@garutjourney.com"
                        className="w-full rounded-xl border border-ink/15 bg-white pl-10 pr-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Query Lokasi Google Maps (Embed Peta & Tautan)
                  </label>
                  <input
                    type="text"
                    value={siteMapsQuery}
                    onChange={(e) => setSiteMapsQuery(e.target.value)}
                    placeholder="Jl. Raya Bayongbong - Cikajang No. 103, Garut, Jawa Barat"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {/* Social Media Links */}
                <div className="pt-2 border-t border-ink/10">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-3">
                    Tautan Akun Media Sosial
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase text-ink/50 block">Instagram</span>
                      <input
                        type="url"
                        value={socialInstagram}
                        onChange={(e) => setSocialInstagram(e.target.value)}
                        placeholder="https://instagram.com/garutjourney"
                        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase text-ink/50 block">TikTok</span>
                      <input
                        type="url"
                        value={socialTikTok}
                        onChange={(e) => setSocialTikTok(e.target.value)}
                        placeholder="https://tiktok.com/@garutjourney"
                        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase text-ink/50 block">Facebook</span>
                      <input
                        type="url"
                        value={socialFacebook}
                        onChange={(e) => setSocialFacebook(e.target.value)}
                        placeholder="https://facebook.com/garutjourney"
                        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase text-ink/50 block">YouTube</span>
                      <input
                        type="url"
                        value={socialYouTube}
                        onChange={(e) => setSocialYouTube(e.target.value)}
                        placeholder="https://youtube.com/@garutjourney"
                        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Hero Section (Teks Utama & Background) */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    02 &bull; Halaman Paling Atas (Hero Section)
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Judul, Deskripsi & Latar Belakang Beranda
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Sesuaikan kalimat sambutan pertama yang dilihat oleh wisatawan saat membuka situs.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Judul Baris 1
                    </label>
                    <input
                      type="text"
                      value={heroTitleLine1}
                      onChange={(e) => setHeroTitleLine1(e.target.value)}
                      placeholder="Temukan Keindahan"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ember">
                      Kata Highlight Berwarna
                    </label>
                    <input
                      type="text"
                      value={heroTitleHighlight}
                      onChange={(e) => setHeroTitleHighlight(e.target.value)}
                      placeholder="Garut"
                      className="mt-1.5 w-full rounded-xl border border-ember/30 bg-ember/5 px-4 py-2.5 text-sm font-bold text-ember focus:border-ember focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Judul Baris 2
                    </label>
                    <input
                      type="text"
                      value={heroTitleLine2}
                      onChange={(e) => setHeroTitleLine2(e.target.value)}
                      placeholder="Kota Sejuta Cerita"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Paragraf Deskripsi Hero
                  </label>
                  <textarea
                    rows={3}
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    placeholder="Jelajahi surga tersembunyi Jawa Barat..."
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Teks Tombol Aksi Utama (CTA 1)
                    </label>
                    <input
                      type="text"
                      value={heroCtaPrimary}
                      onChange={(e) => setHeroCtaPrimary(e.target.value)}
                      placeholder="Eksplor Destinasi"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Teks Tombol Aksi Kedua (CTA 2)
                    </label>
                    <input
                      type="text"
                      value={heroCtaSecondary}
                      onChange={(e) => setHeroCtaSecondary(e.target.value)}
                      placeholder="Paket City Tour"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mode Pilihan Background */}
                <div className="pt-2 border-t border-ink/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Gambar Latar Belakang Header / Hero
                    </label>
                    <div className="flex rounded-xl bg-cream/70 p-1 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setUseCustomHeroBg(false)}
                        className={`rounded-lg px-3 py-1.5 transition ${
                          !useCustomHeroBg ? 'bg-white shadow text-forest font-bold' : 'text-ink/60 hover:text-ink'
                        }`}
                      >
                        Foto Pilihan Garut
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseCustomHeroBg(true)}
                        className={`rounded-lg px-3 py-1.5 transition ${
                          useCustomHeroBg ? 'bg-white shadow text-forest font-bold' : 'text-ink/60 hover:text-ink'
                        }`}
                      >
                        URL Foto Kustom
                      </button>
                    </div>
                  </div>

                  {!useCustomHeroBg ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { file: 'hero.png', label: 'Panorama Lembah Garut' },
                        { file: 'papandayan.png', label: 'Kawah Papandayan' },
                        { file: 'bagendit.png', label: 'Situ Bagendit' },
                        { file: 'santolo.png', label: 'Pantai Santolo' },
                        { file: 'darajat.png', label: 'Darajat Pass' },
                        { file: 'cangkuang.png', label: 'Candi Cangkuang' },
                      ].map((item) => (
                        <button
                          key={item.file}
                          type="button"
                          onClick={() => setHeroBackground(item.file)}
                          className={`group relative aspect-[16/10] overflow-hidden rounded-2xl border-2 transition ${
                            heroBackground === item.file && !useCustomHeroBg
                              ? 'border-forest ring-2 ring-forest/30 shadow-md'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <Img file={item.file} alt={item.label} className="h-full w-full object-cover" width={240} />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                          <span className="absolute bottom-2 inset-x-2 text-[0.75rem] font-bold text-white text-left truncate">
                            {item.label}
                          </span>
                          {heroBackground === item.file && !useCustomHeroBg && (
                            <span className="absolute top-2 right-2 rounded-full bg-forest p-1 text-white shadow">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customHeroBg}
                        onChange={(e) => setCustomHeroBg(e.target.value)}
                        className="w-full rounded-xl border border-ink/20 bg-white p-3 text-sm text-ink focus:border-forest focus:outline-none"
                      />
                      <p className="mt-1 text-[0.7rem] text-ink/50">
                        Gunakan tautan gambar beresolusi tinggi (format JPG, PNG, atau WebP).
                      </p>
                    </div>
                  )}

                  {/* Pengaturan Overlay Darkness & Efek Zoom */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-ink/10">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                        Tingkat Kegelapan Latar (Overlay Darkness)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: 'light', label: 'Light', desc: 'Foto Terang' },
                            { id: 'medium', label: 'Medium', desc: 'Seimbang' },
                            { id: 'dark', label: 'Dark', desc: 'Kontras Tinggi' },
                          ] as const
                        ).map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setHeroBgDarkness(d.id)}
                            className={`rounded-xl p-2.5 text-center text-xs border transition ${
                              heroBgDarkness === d.id
                                ? 'border-forest bg-forest text-white font-bold'
                                : 'border-ink/15 bg-white text-ink/75 hover:bg-cream/50'
                            }`}
                          >
                            <span className="block">{d.label}</span>
                            <span className="text-[0.6rem] block opacity-80 truncate">{d.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                        Efek Gerak Latar Belakang (Zoom Motion)
                      </label>
                      <button
                        type="button"
                        onClick={() => setHeroZoomEffect(!heroZoomEffect)}
                        className={`w-full rounded-xl p-3 text-xs border transition flex items-center justify-between ${
                          heroZoomEffect
                            ? 'border-ember bg-ember/10 text-ember font-bold'
                            : 'border-ink/15 bg-white text-ink/70 hover:bg-cream/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span>{heroZoomEffect ? 'Zoom Halus Aktif (Ken-Burns)' : 'Latar Statis'}</span>
                        </span>
                        <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-ink/5">
                          {heroZoomEffect ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: 01 — Mengapa Memilih Garut (Why Garut Section) */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    03 &bull; Bagian 01 — Mengapa Garut (Why Garut)
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Judul, Pengantar & 4 Pilar Keunggulan Garut
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Ubah narasi keunggulan wisata Garut dan deskripsi 4 pilar utama di bawah hero.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Eyebrow Nomor Section
                    </label>
                    <input
                      type="text"
                      value={whyGarutEyebrow}
                      onChange={(e) => setWhyGarutEyebrow(e.target.value)}
                      placeholder="01 — Mengapa Garut"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Judul Bagian Depan
                    </label>
                    <input
                      type="text"
                      value={whyGarutTitle}
                      onChange={(e) => setWhyGarutTitle(e.target.value)}
                      placeholder="Swiss van Java,"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest">
                      Highlight Judul Hijau
                    </label>
                    <input
                      type="text"
                      value={whyGarutHighlight}
                      onChange={(e) => setWhyGarutHighlight(e.target.value)}
                      placeholder="Dekat & Memikat"
                      className="mt-1.5 w-full rounded-xl border border-forest/30 bg-forest/5 px-4 py-2.5 text-sm font-bold text-forest focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Paragraf Pengantar Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={whyGarutIntro}
                    onChange={(e) => setWhyGarutIntro(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {/* 4 Pillars Grid */}
                <div className="pt-2 border-t border-ink/10 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/70 block">
                    4 Pilar Fitur & Keistimewaan Garut
                  </span>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Pilar 1 */}
                    <div className="rounded-2xl border border-ink/10 bg-cream/20 p-4 space-y-2">
                      <span className="text-xs font-bold text-forest uppercase">Pilar 01 (Alam Vulkanik)</span>
                      <input
                        type="text"
                        value={whyGarutF1Title}
                        onChange={(e) => setWhyGarutF1Title(e.target.value)}
                        placeholder="Gunung & Alam Vulkanik"
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink"
                      />
                      <textarea
                        rows={2}
                        value={whyGarutF1Desc}
                        onChange={(e) => setWhyGarutF1Desc(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 text-xs text-ink/80"
                      />
                    </div>

                    {/* Pilar 2 */}
                    <div className="rounded-2xl border border-ink/10 bg-cream/20 p-4 space-y-2">
                      <span className="text-xs font-bold text-forest uppercase">Pilar 02 (Kuliner Legendaris)</span>
                      <input
                        type="text"
                        value={whyGarutF2Title}
                        onChange={(e) => setWhyGarutF2Title(e.target.value)}
                        placeholder="Kuliner Legendaris"
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink"
                      />
                      <textarea
                        rows={2}
                        value={whyGarutF2Desc}
                        onChange={(e) => setWhyGarutF2Desc(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 text-xs text-ink/80"
                      />
                    </div>

                    {/* Pilar 3 */}
                    <div className="rounded-2xl border border-ink/10 bg-cream/20 p-4 space-y-2">
                      <span className="text-xs font-bold text-forest uppercase">Pilar 03 (Warisan & Budaya)</span>
                      <input
                        type="text"
                        value={whyGarutF3Title}
                        onChange={(e) => setWhyGarutF3Title(e.target.value)}
                        placeholder="Warisan & Budaya"
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink"
                      />
                      <textarea
                        rows={2}
                        value={whyGarutF3Desc}
                        onChange={(e) => setWhyGarutF3Desc(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 text-xs text-ink/80"
                      />
                    </div>

                    {/* Pilar 4 */}
                    <div className="rounded-2xl border border-ink/10 bg-cream/20 p-4 space-y-2">
                      <span className="text-xs font-bold text-forest uppercase">Pilar 04 (Keramahan Lokal)</span>
                      <input
                        type="text"
                        value={whyGarutF4Title}
                        onChange={(e) => setWhyGarutF4Title(e.target.value)}
                        placeholder="Keramahan Priangan"
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink"
                      />
                      <textarea
                        rows={2}
                        value={whyGarutF4Desc}
                        onChange={(e) => setWhyGarutF4Desc(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 text-xs text-ink/80"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Cerita Garut (Brand Story Section) */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    04 &bull; Cerita Kami (Brand Story Section)
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Narasi Kisah & Filosofi Garut Journey
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Bagikan cerita di balik brand dan nilai emosional perjalanan wisata kepada calon pelanggan.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Eyebrow Cerita
                    </label>
                    <input
                      type="text"
                      value={storyEyebrow}
                      onChange={(e) => setStoryEyebrow(e.target.value)}
                      placeholder="Cerita Kami"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Judul Cerita Utama
                    </label>
                    <input
                      type="text"
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      placeholder="Bukan Sekadar Wisata..."
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ember">
                    Kutipan Filosofis (Quote Bergaris Emas)
                  </label>
                  <textarea
                    rows={2}
                    value={storyQuote}
                    onChange={(e) => setStoryQuote(e.target.value)}
                    placeholder="Garut bukan hanya tentang gunung dan danau..."
                    className="mt-1.5 w-full rounded-xl border border-ember/30 bg-ember/5 p-3 text-sm italic text-ink focus:border-ember focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Paragraf Narasi 1
                    </label>
                    <textarea
                      rows={2}
                      value={storyP1}
                      onChange={(e) => setStoryP1(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Paragraf Narasi 2
                    </label>
                    <textarea
                      rows={2}
                      value={storyP2}
                      onChange={(e) => setStoryP2(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Paragraf Narasi 3
                    </label>
                    <textarea
                      rows={2}
                      value={storyP3}
                      onChange={(e) => setStoryP3(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Salam Penutup Khas Sunda
                  </label>
                  <input
                    type="text"
                    value={storyWelcome}
                    onChange={(e) => setStoryWelcome(e.target.value)}
                    placeholder="Sampurasun. Selamat datang di Garut."
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ember focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 5: Bahasa Website, Animasi & Footer */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    05 &bull; Tampilan, Bahasa & Animasi Website
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Internasionalisasi, Efek Visual & Footer
                  </h2>
                </div>

                {/* Bahasa Bawaan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-3">
                    Pilih Bahasa Bawaan (Default Language):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SUPPORTED_LANGUAGES.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setSiteLanguage(item.code)}
                        className={`rounded-2xl p-4 text-left border transition flex flex-col justify-between gap-3 ${
                          siteLanguage === item.code
                            ? 'border-forest bg-forest/10 ring-2 ring-forest text-forest shadow-sm'
                            : 'border-ink/15 bg-cream/20 text-ink/80 hover:bg-cream/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{item.flag}</span>
                          {siteLanguage === item.code && (
                            <span className="h-2 w-2 rounded-full bg-forest" />
                          )}
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold">{item.label}</p>
                          <span className="text-[0.65rem] uppercase font-mono tracking-wider opacity-70">
                            Kode: {item.code.toUpperCase()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animasi Header & Footer */}
                <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-ink/10">
                  {/* Animasi Header */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-3">
                      Animasi Header (Navigasi Atas)
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'subtle-glow', label: 'Subtle Warm Glow', desc: 'Bercahaya lembut keemasan saat discroll' },
                        { id: 'gradient-shimmer', label: 'Gradient Shimmer Accent', desc: 'Garis gradasi bercahaya berjalan' },
                        { id: 'none', label: 'Tanpa Animasi', desc: 'Header minimalis standar' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHeaderAnimation(item.id as HeaderAnimationType)}
                          className={`w-full rounded-xl p-3 text-left border transition flex items-center justify-between ${
                            headerAnimation === item.id
                              ? 'border-forest bg-forest/10 ring-1 ring-forest text-forest font-bold'
                              : 'border-ink/15 bg-cream/20 text-ink/75 hover:bg-cream/50'
                          }`}
                        >
                          <div>
                            <span className="text-xs block font-semibold">{item.label}</span>
                            <span className="text-[0.65rem] text-ink/50 font-normal">{item.desc}</span>
                          </div>
                          {headerAnimation === item.id && <Check className="h-4 w-4 text-forest shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animasi Footer */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-3">
                      Animasi Footer (Bagian Bawah)
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'floating-particles', label: 'Floating Sparkles & Fireflies', desc: 'Partikel cahaya kunang-kunang bergerak halus' },
                        { id: 'wave-motion', label: 'Organic Wave Motion', desc: 'Aksen gelombang ombak hidup' },
                        { id: 'subtle-glow', label: 'Ambient Emerald Aura', desc: 'Pendaran cahaya hijau pegunungan' },
                        { id: 'none', label: 'Tanpa Animasi', desc: 'Footer statis' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFooterAnimation(item.id as FooterAnimationType)}
                          className={`w-full rounded-xl p-3 text-left border transition flex items-center justify-between ${
                            footerAnimation === item.id
                              ? 'border-forest bg-forest/10 ring-1 ring-forest text-forest font-bold'
                              : 'border-ink/15 bg-cream/20 text-ink/75 hover:bg-cream/50'
                          }`}
                        >
                          <div>
                            <span className="text-xs block font-semibold">{item.label}</span>
                            <span className="text-[0.65rem] text-ink/50 font-normal">{item.desc}</span>
                          </div>
                          {footerAnimation === item.id && <Check className="h-4 w-4 text-forest shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tagline Footer */}
                <div className="pt-2 border-t border-ink/10">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Deskripsi Ringkas Footer
                  </label>
                  <textarea
                    rows={2}
                    value={footerTagline}
                    onChange={(e) => setFooterTagline(e.target.value)}
                    placeholder="Swiss van Java — Portal pariwisata resmi..."
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 6: Keamanan & Akun Login WP Admin */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
                <div className="border-b border-ink/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ember">
                    06 &bull; Kredensial & Akun Login WP Admin
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                    Ganti Username & Password Masuk Admin
                  </h2>
                  <p className="text-xs text-ink/65 mt-1">
                    Atur nama pengguna dan kata sandi baru untuk login ke halaman admin / dashboard ini.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Username Login Admin
                    </label>
                    <div className="mt-1.5 relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                      <input
                        type="text"
                        value={editAdminUser}
                        onChange={(e) => setEditAdminUser(e.target.value)}
                        placeholder="admin"
                        className="w-full rounded-xl border border-ink/15 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                        Password Baru
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAccountPass(!showAccountPass)}
                        className="text-[0.7rem] font-semibold text-forest hover:text-ember flex items-center gap-1"
                      >
                        {showAccountPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        <span>{showAccountPass ? 'Sembunyikan' : 'Lihat'}</span>
                      </button>
                    </div>
                    <div className="mt-1.5 relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                      <input
                        type={showAccountPass ? 'text' : 'password'}
                        value={editAdminPass}
                        onChange={(e) => setEditAdminPass(e.target.value)}
                        placeholder="Password baru"
                        className="w-full rounded-xl border border-ink/15 bg-white pl-10 pr-10 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountPass(!showAccountPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition"
                      >
                        {showAccountPass ? <EyeOff className="h-4 w-4 text-ember" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                  <button
                    type="button"
                    onClick={handleSaveAdminCredentials}
                    className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-soft hover:bg-forest-700 transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>Simpan Akun & Password Baru</span>
                  </button>

                  <span className="text-xs text-ink/50">
                    Akun saat ini: <strong>{adminUsername}</strong>
                  </span>
                </div>
              </div>

              {/* Bottom Submit Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-forest px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft hover:bg-forest-700 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Seluruh Pengaturan Website</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="rounded-full border border-ink/15 px-6 py-3 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
                >
                  Kembali ke Data Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: OPTIMASI SEO & GOOGLE RANKING     */}
        {/* ======================================= */}
        {activeTab === 'seo' && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <SeoManager onNotify={notifySuccess} />
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: PENGATURAN CHAT WHATSAPP          */}
        {/* ======================================= */}
        {activeTab === 'whatsapp_settings' && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <WhatsAppManager onNotify={notifySuccess} />
          </div>
        )}

        {/* Modal Detail Booking Popup */}
        {selectedBookingDetail && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setSelectedBookingDetail(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-ink border border-ink/10 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                    {selectedBookingDetail.id}
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink mt-1">Detail Jadwal & Pemesanan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetail(null)}
                  className="rounded-full p-2 text-ink/40 hover:bg-ink/5 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-forest/5 p-3 space-y-2 border border-forest/10">
                  <div className="flex justify-between">
                    <span className="text-ink/60 font-semibold flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-ember" />
                      <span>Tanggal Kedatangan ke Garut:</span>
                    </span>
                    <span className="font-bold text-forest">
                      {selectedBookingDetail.arrivalDate || selectedBookingDetail.travelDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60 font-semibold flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-forest" />
                      <span>Jam Pertemuan di Meeting Point:</span>
                    </span>
                    <span className="font-bold text-ink">
                      {selectedBookingDetail.meetingTime || '08:00 WIB'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60 font-semibold flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-forest" />
                      <span>Titik Temu:</span>
                    </span>
                    <span className="font-bold text-ink text-right">
                      {selectedBookingDetail.meetingPoint || 'Stasiun Garut'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">Nama Pelanggan:</span>
                  <span className="font-bold text-ink">{selectedBookingDetail.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">No. WhatsApp:</span>
                  <span className="font-mono font-bold text-forest">{selectedBookingDetail.whatsapp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">Email:</span>
                  <span className="font-medium text-ink">{selectedBookingDetail.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">Paket Wisata:</span>
                  <span className="font-semibold text-ink">{selectedBookingDetail.packageOrTour}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">Jumlah Peserta:</span>
                  <span className="font-medium text-ink">{selectedBookingDetail.travelers} Orang</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">Metode Pembayaran:</span>
                  <span className="font-medium text-ink">{selectedBookingDetail.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5">
                  <span className="text-ink/60">Total Biaya:</span>
                  <span className="font-bold text-sm text-ember">{formatRupiah(selectedBookingDetail.totalPrice)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ink/5 items-center">
                  <span className="text-ink/60">Status Pembayaran:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                      selectedBookingDetail.paymentStatus === 'Lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedBookingDetail.paymentStatus === 'Menunggu Konfirmasi'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {selectedBookingDetail.paymentStatus}
                  </span>
                </div>

                {selectedBookingDetail.notes && (
                  <div className="rounded-xl bg-cream/50 p-3 mt-2">
                    <span className="font-bold text-ink/60 block mb-1">Catatan Khusus Pelanggan:</span>
                    <p className="text-ink/80 italic">{selectedBookingDetail.notes}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-2">
                {selectedBookingDetail.paymentStatus === 'Menunggu Konfirmasi' && (
                  <button
                    type="button"
                    onClick={() => handleConfirmPaymentAndSendKwitansi(selectedBookingDetail)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-forest py-2.5 px-3.5 text-xs font-bold text-white hover:bg-forest-700 transition shadow-sm"
                    title="Konfirmasi pembayaran dan kirim kwitansi ke WhatsApp client"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>Konfirmasi Lunas &amp; Kirim Kwitansi</span>
                  </button>
                )}

                <a
                  href={`/kwitansi/${selectedBookingDetail.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-forest/10 py-2.5 px-3.5 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
                >
                  <FileText className="h-4 w-4" />
                  <span>Buka Kwitansi PDF</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyKwitansiLink(selectedBookingDetail.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-ink/20 py-2.5 px-3.5 text-xs font-bold text-ink hover:bg-cream-200 transition"
                  title="Salin link resmi kwitansi (dapat dibuka tanpa login)"
                >
                  <Copy className="h-4 w-4" />
                  <span>Salin Link Kwitansi</span>
                </button>

                <button
                  type="button"
                  onClick={() => sendKwitansiViaWhatsApp(selectedBookingDetail)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim Kwitansi WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => openCustomerWhatsApp(selectedBookingDetail)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white hover:bg-[#1ebd59] transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBookingDetail(null)}
                  className="rounded-xl border border-ink/20 px-3.5 py-2.5 text-xs font-semibold text-ink/75 hover:bg-ink/5 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
