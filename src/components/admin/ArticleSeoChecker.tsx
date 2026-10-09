import { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Globe2,
  Laptop,
  Search,
  Smartphone,
  Sparkles,
} from 'lucide-react'

export interface ArticleSeoProps {
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category?: string
  initialFocusKeyword?: string
}

export function ArticleSeoChecker({
  title,
  slug,
  excerpt,
  content,
  image,
  category,
  initialFocusKeyword = '',
}: ArticleSeoProps) {
  const [focusKeyword, setFocusKeyword] = useState(() => {
    if (initialFocusKeyword) return initialFocusKeyword
    // Auto-suggest first 2-3 significant words of title if available
    const words = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['untuk', 'yang', 'dan', 'dari', 'ke', 'di'].includes(w))
    return words.slice(0, 2).join(' ')
  })
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  const analysis = useMemo(() => {
    const kw = focusKeyword.trim().toLowerCase()
    const titleLower = title.toLowerCase()
    const slugLower = slug.toLowerCase()
    const excerptLower = excerpt.toLowerCase()
    const contentLower = content.toLowerCase()

    // Word counts
    const wordsInContent = content.trim() ? content.trim().split(/\s+/).length : 0
    const wordsInExcerpt = excerpt.trim() ? excerpt.trim().split(/\s+/).length : 0
    const totalWords = wordsInContent + wordsInExcerpt

    // Keyword appearances & density
    let keywordCount = 0
    if (kw) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      const matches = (content + ' ' + excerpt + ' ' + title).match(regex)
      keywordCount = matches ? matches.length : 0
    }
    const keywordDensity = totalWords > 0 && kw ? ((keywordCount / totalWords) * 100).toFixed(1) : '0'

    // Individual checks
    const kwInTitle = Boolean(kw && titleLower.includes(kw))
    const kwInSlug = Boolean(kw && slugLower.includes(kw.replace(/\s+/g, '-')))
    const kwInExcerpt = Boolean(kw && excerptLower.includes(kw))
    const kwInContentFirst100 = Boolean(
      kw && contentLower.slice(0, 400).includes(kw)
    )
    const titleLength = title.length
    const titleLengthOk = titleLength >= 35 && titleLength <= 70
    const excerptLength = excerpt.length
    const excerptLengthOk = excerptLength >= 90 && excerptLength <= 165
    const wordCountOk = totalWords >= 250
    const hasImage = Boolean(image)
    const hasSlug = slug.length >= 3 && !slug.includes(' ')

    const densityNum = parseFloat(keywordDensity)
    const densityOk = densityNum >= 0.8 && densityNum <= 3.5

    const checks = [
      {
        id: 'kw-title',
        label: 'Kata kunci utama ada di Judul Artikel',
        passed: kwInTitle,
        points: 15,
        tip: 'Sertakan kata kunci fokus di bagian awal judul.',
      },
      {
        id: 'kw-slug',
        label: 'Kata kunci ada di Slug URL (Permalink)',
        passed: kwInSlug,
        points: 10,
        tip: 'Pastikan permalink memuat kata kunci fokus.',
      },
      {
        id: 'kw-excerpt',
        label: 'Kata kunci ada di Excerpt / Meta Description',
        passed: kwInExcerpt,
        points: 15,
        tip: 'Sisipkan kata kunci fokus di 1-2 kalimat ringkasan.',
      },
      {
        id: 'kw-first-para',
        label: 'Kata kunci muncul di paragraf awal konten',
        passed: kwInContentFirst100,
        points: 15,
        tip: 'Perkenalkan kata kunci di paragraf pembuka.',
      },
      {
        id: 'title-len',
        label: `Panjang Judul optimal (35-70 kar, saat ini: ${titleLength})`,
        passed: titleLengthOk,
        points: 10,
        tip: 'Panjang ideal antara 35 hingga 70 karakter agar tidak terpotong di Google.',
      },
      {
        id: 'desc-len',
        label: `Panjang Ringkasan optimal (90-165 kar, saat ini: ${excerptLength})`,
        passed: excerptLengthOk,
        points: 10,
        tip: 'Deskripsi 90 - 165 karakter memberikan snippet hasil pencarian terbaik.',
      },
      {
        id: 'word-count',
        label: `Kedalaman artikel (min. 250 kata, saat ini: ${totalWords} kata)`,
        passed: wordCountOk,
        points: 10,
        tip: 'Tulis minimal 250 kata agar artikel memiliki nilai informasi yang kaya bagi pembaca.',
      },
      {
        id: 'kw-density',
        label: `Kerapatan kata kunci ideal (0.8% - 3.5%, saat ini: ${keywordDensity}%)`,
        passed: densityOk,
        points: 5,
        tip: 'Hindari keyword stuffing; jaga kemunculan kata kunci antara 0.8% - 3.5%.',
      },
      {
        id: 'img',
        label: 'Memiliki Gambar Sampul Utama',
        passed: hasImage,
        points: 5,
        tip: 'Gambar meningkatkan CTR (click-through-rate) di media sosial dan Google Discover.',
      },
      {
        id: 'slug-format',
        label: 'Format slug URL rapi (huruf kecil & tanda hubung)',
        passed: hasSlug,
        points: 5,
        tip: 'Gunakan slug bersih tanpa spasi atau karakter khusus.',
      },
    ]

    const score = checks.reduce((acc, c) => acc + (c.passed ? c.points : 0), 0)

    return {
      score,
      checks,
      totalWords,
      keywordCount,
      keywordDensity,
      titleLength,
      excerptLength,
    }
  }, [title, slug, excerpt, content, image, focusKeyword])

  const scoreBadgeColor =
    analysis.score >= 80
      ? 'bg-emerald-500 text-white'
      : analysis.score >= 50
      ? 'bg-amber-500 text-white'
      : 'bg-rose-500 text-white'

  const scoreLabel =
    analysis.score >= 80
      ? 'Sangat Baik (SEO Friendly)'
      : analysis.score >= 50
      ? 'Cukup Baik (Perlu Optimasi)'
      : 'Perlu Banyak Perbaikan'

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-6">
      {/* Header & Score Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ember flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Analisis SEO On-Page Artikel
          </span>
          <h3 className="font-display text-xl font-bold text-ink mt-1">Cek Skor SEO Artikel</h3>
          <p className="text-xs text-ink/60">
            Audit langsung parameter meta title, slug, keyword density, dan kelayakan Google SERP.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-cream/60 p-3 rounded-2xl border border-ink/5 shrink-0">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl font-display text-2xl font-bold shadow-soft ${scoreBadgeColor}`}>
            {analysis.score}
          </div>
          <div>
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">
              Skor SEO
            </span>
            <span className="text-xs font-bold text-ink">{scoreLabel}</span>
          </div>
        </div>
      </div>

      {/* Focus Keyword Input */}
      <div className="rounded-2xl bg-cream/40 p-4 border border-ink/5 space-y-2">
        <label htmlFor="focus-kw" className="block text-xs font-bold uppercase tracking-wider text-ink/70">
          Kata Kunci Fokus (Target Keyword):
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink/40" />
            <input
              id="focus-kw"
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Contoh: wisata garut, papandayan, kuliner dodol"
              className="w-full rounded-xl border border-ink/15 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none"
            />
          </div>
          {title && (
            <button
              type="button"
              onClick={() => {
                const words = title
                  .toLowerCase()
                  .replace(/[^a-z0-9\s]/g, '')
                  .split(/\s+/)
                  .filter((w) => w.length > 3)
                setFocusKeyword(words.slice(0, 2).join(' '))
              }}
              className="rounded-xl bg-forest/10 px-3 py-2 text-xs font-semibold text-forest hover:bg-forest hover:text-white transition whitespace-nowrap"
            >
              Ambil dari Judul
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-[0.72rem] text-ink/60 pt-1">
          <span>
            Muncul di Konten: <strong className="text-ink">{analysis.keywordCount} kali</strong>
          </span>
          <span>·</span>
          <span>
            Kerapatan (Density): <strong className="text-ink">{analysis.keywordDensity}%</strong>
          </span>
          <span>·</span>
          <span>
            Total Kata: <strong className="text-ink">{analysis.totalWords} kata</strong>
          </span>
        </div>
      </div>

      {/* Google Search Result Preview */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/70 flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-forest" /> Pratinjau Google SERP Snippet
          </span>
          <div className="flex items-center gap-1 bg-ink/5 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                previewDevice === 'desktop' ? 'bg-white text-ink shadow-xs' : 'text-ink/60'
              }`}
            >
              <Laptop className="h-3 w-3" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                previewDevice === 'mobile' ? 'bg-white text-ink shadow-xs' : 'text-ink/60'
              }`}
            >
              <Smartphone className="h-3 w-3" /> Mobile
            </button>
          </div>
        </div>

        <div className={`rounded-2xl border border-ink/10 bg-white p-4 font-sans ${previewDevice === 'mobile' ? 'max-w-sm' : ''}`}>
          <div className="flex items-center gap-2 text-[0.72rem] text-ink/70">
            <div className="grid h-4 w-4 place-items-center rounded-full bg-forest text-[0.55rem] font-bold text-white">
              G
            </div>
            <span className="truncate">garutjourney.com › guide {category ? `› ${category.toLowerCase()} ` : ''}› {slug || 'permalink-artikel'}</span>
          </div>
          <h4 className="mt-1 text-base text-[#1a0dab] font-medium leading-snug line-clamp-1 hover:underline cursor-pointer">
            {title || 'Judul Artikel Belum Diisi — Garut Journey'}
          </h4>
          <p className="mt-1 text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
            {excerpt || 'Tambahkan ringkasan yang menarik agar calon pengunjung website mengklik artikel ini di mesin pencari Google...'}
          </p>
        </div>
      </div>

      {/* Checklist Audit */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink/70">
          Checklist Evaluasi SEO ({analysis.checks.filter((c) => c.passed).length}/{analysis.checks.length} Lolos):
        </h4>

        <div className="grid gap-2">
          {analysis.checks.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-2.5 rounded-xl p-3 text-xs transition border ${
                item.passed
                  ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200/80 text-rose-950'
              }`}
            >
              {item.passed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-mono text-[0.68rem] opacity-70">
                    +{item.points} pts
                  </span>
                </div>
                {!item.passed && (
                  <p className="mt-0.5 text-[0.72rem] text-rose-700/90 italic">
                    💡 Rekomendasi: {item.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
