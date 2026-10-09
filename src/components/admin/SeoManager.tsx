import { useState, useEffect } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileCode2,
  FileText,
  Globe2,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  useSeoSettings,
  DEFAULT_SEO_SETTINGS,
  generateSitemapXml,
  generateRobotsTxt,
  type SeoSettings,
} from '@/lib/seoSettings'
import { Img } from '@/components/Img'
import { useArticles } from '@/lib/articlesStorage'
import { ArticleSeoChecker } from '@/components/admin/ArticleSeoChecker'

const AVAILABLE_OG_IMAGES = [
  { file: 'hero.png', label: 'Panorama Garut (Default Hero)' },
  { file: 'papandayan.png', label: 'Kawah Gunung Papandayan' },
  { file: 'citysquare.png', label: 'Alun-alun Kota Garut' },
  { file: 'darajat.png', label: 'Darajat Pass Hot Springs' },
  { file: 'bagendit.png', label: 'Danau Situ Bagendit' },
  { file: 'santolo.png', label: 'Pantai Santolo Selatan' },
  { file: 'cangkuang.png', label: 'Candi Cangkuang' },
  { file: 'sampireun.png', label: 'Kampung Sampireun' },
]

interface SeoManagerProps {
  onNotify: (msg: string) => void
}

export function SeoManager({ onNotify }: SeoManagerProps) {
  const { seo, saveSeo, resetSeo } = useSeoSettings()
  const [form, setForm] = useState<SeoSettings>(seo)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedType, setCopiedType] = useState<string | null>(null)
  const [previewTab, setPreviewTab] = useState<'google' | 'social'>('google')
  const [useCustomOg, setUseCustomOg] = useState(false)
  const [customOgUrl, setCustomOgUrl] = useState('')
  const { articles } = useArticles()
  const [activeSubTab, setActiveSubTab] = useState<'site' | 'articles'>('site')
  const [selectedAuditArticle, setSelectedAuditArticle] = useState<any>(null)

  useEffect(() => {
    setForm(seo)
    const isCustom = seo.ogImage?.startsWith('http') || false
    setUseCustomOg(isCustom)
    if (isCustom) {
      setCustomOgUrl(seo.ogImage)
    }
  }, [seo])

  const titleLength = form.metaTitle.length
  const descLength = form.metaDescription.length

  // SEO Score calculation based on applet-seo guidelines
  const titleOptimal = titleLength >= 30 && titleLength <= 65
  const descOptimal = descLength >= 110 && descLength <= 165
  const hasKeywords = form.focusKeywords.trim().length > 10
  const hasOgImage = Boolean(form.ogImage)
  const hasCanonical = form.canonicalUrl.startsWith('http')
  const hasSchema = Boolean(form.schemaType)

  const scoreChecks = [
    { label: 'Panjang Meta Title optimal (30 - 65 karakter)', passed: titleOptimal, weight: 20 },
    { label: 'Panjang Meta Description optimal (110 - 165 karakter)', passed: descOptimal, weight: 20 },
    { label: 'Fokus Kata Kunci (Keywords) tertarget', passed: hasKeywords, weight: 15 },
    { label: 'OpenGraph Social Share Card & Gambar aktif', passed: hasOgImage, weight: 15 },
    { label: 'URL Kanonikal valid & terpasang', passed: hasCanonical, weight: 15 },
    { label: 'Schema.org JSON-LD TravelAgency aktif', passed: hasSchema, weight: 15 },
  ]

  const healthScore = scoreChecks.reduce((sum, item) => sum + (item.passed ? item.weight : 0), 0)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    onNotify(`${type} berhasil disalin ke clipboard!`)
    setTimeout(() => setCopiedType(null), 3000)
  }

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onNotify(`File "${filename}" berhasil diunduh!`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const finalOg = useCustomOg && customOgUrl.trim() ? customOgUrl.trim() : form.ogImage
    const success = await saveSeo({
      ...form,
      ogImage: finalOg,
    })
    setIsSaving(false)
    if (success) {
      onNotify('Pengaturan SEO berhasil disimpan dan disinkronkan ke seluruh sistem!')
    }
  }

  const handleReset = async () => {
    if (window.confirm('Kembalikan konfigurasi SEO ke standar rekomendasi terbaik Google?')) {
      await resetSeo()
      setForm(DEFAULT_SEO_SETTINGS)
      setUseCustomOg(false)
      setCustomOgUrl('')
      onNotify('Pengaturan SEO telah di-reset ke standar optimal.')
    }
  }

  const activeOgImage = useCustomOg && customOgUrl.trim() ? customOgUrl : form.ogImage
  const sitemapXml = generateSitemapXml(form.canonicalUrl)
  const robotsTxt = generateRobotsTxt(form.canonicalUrl)

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest/95 via-forest to-forest-700 p-6 sm:p-8 text-cream shadow-lift relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-ember/20 text-ember-300 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider border border-ember/30">
                Search Engine Optimization
              </span>
              <span className="text-xs text-cream/70 flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5 text-emerald-300" />
                Google Search, Social Cards & Schema.org
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-white">
              Optimasi SEO & Peringkat Google
            </h2>
            <p className="text-xs sm:text-sm text-cream/80 max-w-2xl mt-1.5 leading-relaxed">
              Tingkatkan visibilitas Garut Journey di mesin pencari Google. Atur Meta Title, Meta Description, OpenGraph Card WhatsApp/Sosmed, dan generate Sitemap.xml secara otomatis.
            </p>
          </div>

          {/* SEO Health Score Card */}
          <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/15 shrink-0 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-white/20 fill-none" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  className={`${
                    healthScore >= 90 ? 'text-emerald-400' : healthScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                  } fill-none transition-all duration-1000`}
                  strokeDasharray={`${(healthScore / 100) * 176} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-base font-bold font-display">{healthScore}%</span>
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-cream/60">Skor Kesehatan SEO</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {healthScore >= 90 ? 'Sangat Baik (Optimal)' : healthScore >= 70 ? 'Cukup Baik' : 'Perlu Dioptimalkan'}
              </p>
              <p className="text-[0.7rem] text-cream/70 mt-0.5">Sesuai Panduan Google & Schema.org</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('site')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'site'
              ? 'bg-forest text-white shadow-soft'
              : 'bg-white text-ink/70 hover:bg-cream-200'
          }`}
        >
          <Globe2 className="h-3.5 w-3.5" />
          <span>SEO Global Website</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('articles')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'articles'
              ? 'bg-forest text-white shadow-soft'
              : 'bg-white text-ink/70 hover:bg-cream-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-ember" />
          <span>Audit &amp; Cek SEO Artikel ({articles.length} Artikel)</span>
        </button>
      </div>

      {activeSubTab === 'articles' ? (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-forest">
                  Daftar Evaluasi SEO Seluruh Artikel Panduan
                </h3>
                <p className="text-xs text-ink/60">
                  Periksa kelayakan kata kunci, panjang meta description, dan kesehatan Google Snippet untuk setiap artikel.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {articles.map((art) => {
                const totalWords =
                  (art.body || []).reduce((acc: number, s: { heading: string; text: string }) => acc + (s.text ? s.text.split(/\s+/).length : 0), 0) +
                  (art.excerpt ? art.excerpt.split(/\s+/).length : 0)
                const titleLen = art.title.length
                const excerptLen = art.excerpt.length
                const isOptimal = titleLen >= 35 && titleLen <= 70 && excerptLen >= 90 && totalWords >= 250

                return (
                  <div
                    key={art.slug}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-cream/40 p-4 border border-ink/5 hover:bg-cream/70 transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-12 w-16 rounded-xl overflow-hidden bg-ink/10 shrink-0">
                        <Img file={art.image} alt="" className="h-full w-full object-cover" width={100} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-bold text-ink truncate">{art.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-[0.7rem] text-ink/60 mt-0.5">
                          <span className="font-mono text-forest">/guide/{art.slug}</span>
                          <span>·</span>
                          <span>{totalWords} kata</span>
                          <span>·</span>
                          <span>Title: {titleLen} kar</span>
                          <span>·</span>
                          <span>Desc: {excerptLen} kar</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                          isOptimal
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isOptimal ? 'SEO Bagus' : 'Perlu Optimasi'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedAuditArticle(art)}
                        className="rounded-xl bg-forest px-3 py-1.5 text-xs font-bold text-white hover:bg-forest-700 transition flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Audit Detail</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Audit Detail Modal */}
          {selectedAuditArticle && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 overflow-y-auto"
              onClick={() => setSelectedAuditArticle(null)}
            >
              <div
                className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-ink border border-ink/10 space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ember">
                      Laporan Audit SEO
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink truncate max-w-md">
                      {selectedAuditArticle.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAuditArticle(null)}
                    className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink"
                  >
                    ✕
                  </button>
                </div>

                <ArticleSeoChecker
                  title={selectedAuditArticle.title}
                  slug={selectedAuditArticle.slug}
                  excerpt={selectedAuditArticle.excerpt}
                  content={(selectedAuditArticle.body || []).map((s: { heading: string; text: string }) => s.heading + ' ' + s.text).join(' ')}
                  image={selectedAuditArticle.image}
                  category={selectedAuditArticle.category}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
      <>
      {/* Grid: Preview & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live SERP & Social Previews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-forest" />
                <h3 className="font-display text-lg font-bold text-forest">Pratinjau Langsung (Live Preview)</h3>
              </div>
              <div className="flex items-center gap-1 bg-cream/70 p-1 rounded-full text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTab('google')}
                  className={`px-3 py-1 rounded-full font-semibold transition ${
                    previewTab === 'google' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  Google Search
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('social')}
                  className={`px-3 py-1 rounded-full font-semibold transition ${
                    previewTab === 'social' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  WhatsApp / Sosmed
                </button>
              </div>
            </div>

            {/* Google SERP Snippet Preview */}
            {previewTab === 'google' ? (
              <div className="mt-5 space-y-3">
                <p className="text-xs text-ink/50 font-medium">Tampilan website Anda di hasil pencarian Google:</p>
                <div className="rounded-2xl border border-ink/15 bg-[#ffffff] p-4.5 sm:p-5 font-sans space-y-1.5 shadow-sm">
                  {/* URL breadcrumb */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-forest text-cream flex items-center justify-center text-[0.6rem] font-bold">
                      GJ
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.8rem] text-[#202124] font-medium leading-none">Garut Journey</span>
                      <span className="text-[0.7rem] text-[#5f6368] leading-none mt-0.5">
                        {form.canonicalUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  </div>
                  {/* Title */}
                  <h4 className="text-[#1a0dab] hover:underline text-[1.15rem] leading-[1.3] font-medium cursor-pointer pt-1">
                    {form.metaTitle || DEFAULT_SEO_SETTINGS.metaTitle}
                  </h4>
                  {/* Description */}
                  <p className="text-[#4d5156] text-[0.82rem] leading-relaxed pt-0.5 line-clamp-2">
                    {form.metaDescription || DEFAULT_SEO_SETTINGS.metaDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 text-ink/60">
                  <div className="flex items-center gap-2">
                    <span>Panjang Judul:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        titleOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {titleLength} / 60 Karakter {titleOptimal && '✓'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Panjang Deskripsi:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        descOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {descLength} / 160 Karakter {descOptimal && '✓'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Social Media / WhatsApp Share Preview */
              <div className="mt-5 space-y-3">
                <p className="text-xs text-ink/50 font-medium">
                  Tampilan kartu preview saat link dibagikan di WhatsApp, Facebook, Telegram, atau Twitter:
                </p>
                <div className="max-w-md mx-auto rounded-2xl border border-ink/15 bg-white overflow-hidden shadow-soft">
                  <div className="aspect-[1.91/1] w-full bg-forest/10 overflow-hidden relative">
                    <Img file={activeOgImage} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 rounded-md bg-ink/75 backdrop-blur-sm text-cream px-2 py-0.5 text-[0.65rem] font-bold">
                      og:image (1200x630)
                    </span>
                  </div>
                  <div className="p-4 space-y-1 bg-[#f8f9fa]">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50">
                      {form.canonicalUrl.replace(/^https?:\/\//, '')}
                    </span>
                    <h5 className="font-bold text-sm text-ink line-clamp-1">
                      {form.ogTitle || form.metaTitle || DEFAULT_SEO_SETTINGS.ogTitle}
                    </h5>
                    <p className="text-xs text-ink/70 line-clamp-2">
                      {form.ogDescription || form.metaDescription || DEFAULT_SEO_SETTINGS.ogDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sitemap & Robots.txt Tools */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-forest" />
                <h3 className="font-display text-base font-bold text-forest">Sitemap.xml & Robots.txt Otomatis</h3>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[0.65rem] font-bold px-2 py-0.5">
                Ready to Index
              </span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Googlebot menggunakan file ini untuk menelusuri seluruh halaman destinasi, paket tour, dan artikel panduan di website Garut Journey.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl border border-ink/10 p-3.5 bg-cream/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest">sitemap.xml</span>
                    <span className="text-[0.65rem] bg-forest/10 text-forest px-1.5 py-0.5 rounded font-mono">14 URLs</span>
                  </div>
                  <p className="text-[0.72rem] text-ink/60 mt-1">Daftar tautan lengkap untuk Google Search Console.</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(sitemapXml, 'Sitemap XML')}
                    className="flex-1 text-[0.75rem] font-semibold bg-white border border-ink/15 rounded-xl py-1.5 px-2 hover:bg-cream/60 transition flex items-center justify-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedType === 'Sitemap XML' ? 'Tersalin!' : 'Salin XML'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(sitemapXml, 'sitemap.xml', 'application/xml')}
                    className="text-[0.75rem] font-semibold bg-forest text-cream rounded-xl py-1.5 px-2.5 hover:bg-forest-700 transition flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-ink/10 p-3.5 bg-cream/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest">robots.txt</span>
                    <span className="text-[0.65rem] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                      Allow All
                    </span>
                  </div>
                  <p className="text-[0.72rem] text-ink/60 mt-1">Panduan perayapan bot & proteksi area admin.</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(robotsTxt, 'Robots.txt')}
                    className="flex-1 text-[0.75rem] font-semibold bg-white border border-ink/15 rounded-xl py-1.5 px-2 hover:bg-cream/60 transition flex items-center justify-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedType === 'Robots.txt' ? 'Tersalin!' : 'Salin TXT'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(robotsTxt, 'robots.txt', 'text/plain')}
                    className="text-[0.75rem] font-semibold bg-forest text-cream rounded-xl py-1.5 px-2.5 hover:bg-forest-700 transition flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SEO Checklist & Structured Data */}
        <div className="lg:col-span-5 space-y-6">
          {/* SEO Audit Checklist */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5">
            <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="font-display text-base font-bold text-forest">Checklist Audit SEO On-Page</h3>
            </div>

            <div className="mt-4 space-y-3">
              {scoreChecks.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  {item.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className={item.passed ? 'text-ink font-medium' : 'text-ink/65 font-normal'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Schema.org Structured Data Preview */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-ember" />
                <h4 className="font-display text-base font-bold text-forest">Schema.org JSON-LD Aktif</h4>
              </div>
              <span className="text-[0.65rem] font-mono bg-forest/10 text-forest px-2 py-0.5 rounded font-bold">
                {form.schemaType}
              </span>
            </div>
            <p className="text-xs text-ink/70">
              Data terstruktur Google ini disematkan otomatis ke dalam tag &lt;head&gt; agar website muncul dengan fitur rich snippets.
            </p>
            <div className="rounded-2xl bg-ink text-emerald-400 p-3.5 font-mono text-[0.7rem] overflow-x-auto max-h-48 leading-relaxed">
              <pre>
                {JSON.stringify(
                  {
                    '@context': 'https://schema.org',
                    '@type': form.schemaType,
                    name: 'Garut Journey',
                    url: form.canonicalUrl,
                    telephone: form.schemaTelephone,
                    priceRange: form.schemaPriceRange,
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: form.schemaAddressLocality,
                      addressRegion: form.schemaAddressRegion,
                      addressCountry: form.schemaAddressCountry,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Main SEO Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-forest">Formulir Konfigurasi SEO Website</h3>
            <p className="text-xs text-ink/60 mt-0.5">Semua perubahan langsung disimpan ke database cloud dan diterapkan di website.</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-forest transition font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset ke Rekomendasi Awal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meta Title */}
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                1. Judul Halaman Google (Meta Title Tag) *
              </label>
              <span className={`text-[0.7rem] font-bold ${titleOptimal ? 'text-emerald-700' : 'text-amber-600'}`}>
                {titleLength} / 60 Karakter (Rekomendasi: 30 - 60)
              </span>
            </div>
            <input
              type="text"
              required
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              placeholder="Contoh: Garut Journey — Explore Swiss van Java, Destinasi & Paket Tour"
              className="w-full rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-forest focus:outline-none"
            />
            <p className="text-[0.72rem] text-ink/50">
              Judul utama yang muncul dengan huruf biru tebal di hasil pencarian Google dan tab browser pengunjung.
            </p>
          </div>

          {/* Meta Description */}
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                2. Deskripsi Penelusuran (Meta Description) *
              </label>
              <span className={`text-[0.7rem] font-bold ${descOptimal ? 'text-emerald-700' : 'text-amber-600'}`}>
                {descLength} / 160 Karakter (Rekomendasi: 120 - 160)
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              placeholder="Jelaskan ringkasan daya tarik Garut, paket tour, destinasi unggulan, dan ajakan bertindak (CTA)..."
              className="w-full rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-forest focus:outline-none"
            />
            <p className="text-[0.72rem] text-ink/50">
              Teks ringkasan 1-2 kalimat yang tampil di bawah judul pada mesin pencari Google.
            </p>
          </div>

          {/* Focus Keywords */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
              3. Kata Kunci Target (SEO Meta Keywords)
            </label>
            <input
              type="text"
              value={form.focusKeywords}
              onChange={(e) => setForm({ ...form, focusKeywords: e.target.value })}
              placeholder="wisata garut, paket tour garut, kawah papandayan, darajat pass, kuliner garut..."
              className="w-full rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-forest focus:outline-none"
            />
            <p className="text-[0.72rem] text-ink/50">Pisahkan setiap kata kunci dengan tanda koma (,).</p>
          </div>

          {/* Canonical URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
              4. URL Kanonikal (Canonical URL)
            </label>
            <input
              type="url"
              required
              value={form.canonicalUrl}
              onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
              placeholder="https://garutjourney.com"
              className="w-full rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-forest focus:outline-none"
            />
          </div>

          {/* Schema Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
              5. Tipe Schema.org (Google Knowledge Graph)
            </label>
            <select
              value={form.schemaType}
              onChange={(e) => setForm({ ...form, schemaType: e.target.value as any })}
              className="w-full rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-forest focus:outline-none"
            >
              <option value="TravelAgency">TravelAgency (Agen Perjalanan Wisata - Rekomendasi)</option>
              <option value="TouristInformationCenter">TouristInformationCenter (Pusat Informasi Wisata)</option>
              <option value="LocalBusiness">LocalBusiness (Bisnis Lokal Priangan)</option>
            </select>
          </div>

          {/* OpenGraph Image Picker */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                6. Gambar Share Sosial Media (OpenGraph / og:image)
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-forest cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomOg}
                  onChange={(e) => setUseCustomOg(e.target.checked)}
                  className="rounded text-forest focus:ring-forest"
                />
                <span>Gunakan URL Gambar Kustom</span>
              </label>
            </div>

            {useCustomOg ? (
              <input
                type="url"
                value={customOgUrl}
                onChange={(e) => setCustomOgUrl(e.target.value)}
                placeholder="https://domain.com/og-image.jpg"
                className="w-full rounded-2xl bg-cream/50 px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-forest focus:outline-none"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVAILABLE_OG_IMAGES.map((imgItem) => (
                  <button
                    key={imgItem.file}
                    type="button"
                    onClick={() => setForm({ ...form, ogImage: imgItem.file })}
                    className={`rounded-2xl p-2 border text-left transition flex flex-col gap-1.5 ${
                      form.ogImage === imgItem.file
                        ? 'border-forest bg-forest/5 ring-2 ring-forest'
                        : 'border-ink/10 bg-cream/30 hover:border-forest/40'
                    }`}
                  >
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-cream">
                      <Img file={imgItem.file} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[0.72rem] font-semibold text-ink truncate">{imgItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Robots Directives */}
          <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={form.robotsIndex}
                onChange={(e) => setForm({ ...form, robotsIndex: e.target.checked })}
                className="rounded text-forest focus:ring-forest"
              />
              <span>Izinkan Mesin Pencari Mengindeks Halaman (robots: index)</span>
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={form.robotsFollow}
                onChange={(e) => setForm({ ...form, robotsFollow: e.target.checked })}
                className="rounded text-forest focus:ring-forest"
              />
              <span>Izinkan Mengikuti Tautan di Halaman (robots: follow)</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-ink/10">
          <p className="text-xs text-ink/60 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-ember" />
            <span>Tersimpan otomatis ke database Firestore dan langsung sinkron ke seluruh link.</span>
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest hover:bg-forest-700 text-cream font-bold px-7 py-3.5 text-sm transition shadow-soft disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan SEO'}</span>
          </button>
        </div>
      </form>
      </>
      )}
    </div>
  )
}
