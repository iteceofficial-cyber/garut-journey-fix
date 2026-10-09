import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileEdit,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  X,
  ZoomIn,
} from 'lucide-react'
import { useState } from 'react'
import { Img } from '@/components/Img'
import { ShareButtons } from '@/components/ShareButtons'
import { DestinationCard } from '@/components/DestinationCard'
import { formatDate, getArticle } from '@/data/articles'
import { getDestination } from '@/data/destinations'
import { site, whatsappLink } from '@/data/site'
import { useArticles } from '@/lib/articlesStorage'
import { useDestinations } from '@/lib/destinationsStorage'
import { handleNavClick } from '@/lib/nav'

export const Route = createFileRoute('/guide/$slug')({
  component: GuideArticlePage,
})

// Curated supplementary photos pool to enrich articles with visual galleries
const ARTICLE_EXTRA_PHOTOS: Record<string, { file: string; caption: string }[]> = {
  'panduan-website-garut-journey': [
    { file: 'citysquare.png', caption: 'Pusat Kota Garut & Titik Kumpul Wisatawan' },
    { file: 'hero.png', caption: 'Lembah Hijau Garut Dilihat dari Ketinggian' },
    { file: 'sampireun.png', caption: 'Akomodasi Resor Bernuansa Romantis Sunda' },
  ],
  'menelusuri-keindahan-alam-garut': [
    { file: 'papandayan.png', caption: 'Kawah Belerang Aktif Gunung Papandayan' },
    { file: 'darajat.png', caption: 'Pemandian Air Panas Alami Darajat Pass' },
    { file: 'santolo.png', caption: 'Pesona Garis Pantai Santolo Garut Selatan' },
    { file: 'rancabuaya.png', caption: 'Tebing Karang Megah Rancabuaya' },
  ],
  'surga-kuliner-otentik-garut': [
    { file: 'sundanese.png', caption: 'Paket Nasi Liwet Sunda Lengkap' },
    { file: 'basoaci.png', caption: 'Baso Aci Kuah Pedas Gurih Rempah' },
    { file: 'burayot.png', caption: 'Kue Burayot Legit Gula Aren' },
    { file: 'chocodot.png', caption: 'Inovasi Cokelat Isi Dodol Garut' },
  ],
  'perfect-1-day-garut-itinerary': [
    { file: 'citysquare.png', caption: 'Morning city loop at Alun-alun Garut' },
    { file: 'cangkuang.png', caption: 'Candi Cangkuang temple lake island' },
    { file: 'bagendit.png', caption: 'Raft ride over Situ Bagendit lake' },
  ],
}

function GuideArticlePage() {
  const { slug } = Route.useParams()
  const { articles } = useArticles()
  const [selectedPhoto, setSelectedPhoto] = useState<{ file: string; caption: string } | null>(null)
  const article = articles.find((a) => a.slug === slug) ?? getArticle(slug)

  if (!article) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-cream px-5 py-24 text-center">
        <div className="max-w-md">
          <p className="eyebrow text-ember">Garut Travel Guide</p>
          <h1 className="font-display mt-4 text-4xl font-semibold text-ink">Artikel Tidak Ditemukan</h1>
          <p className="mt-3 text-sm text-ink/70">
            Artikel dengan tautan "{slug}" belum tersedia atau telah dipindahkan.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/"
              hash="guide"
              onClick={() => handleNavClick('guide')}
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-700 transition"
            >
              Lihat Panduan Lainnya
            </Link>
            <Link
              to="/wp-admin"
              className="rounded-full border border-forest/30 px-6 py-3 text-sm font-semibold text-forest hover:bg-forest/5 transition"
            >
              Ke Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { destinations } = useDestinations()

  const relatedDests = (article.related || [])
    .map((s) => destinations.find((d) => d.slug === s) ?? getDestination(s))
    .filter(Boolean)

  const otherArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3)

  // Get photo gallery for this article
  const galleryPhotos =
    ARTICLE_EXTRA_PHOTOS[article.slug] || [
      { file: article.image, caption: article.title },
      { file: 'hero.png', caption: 'Pemandangan Panorama Garut' },
      { file: 'sundanese.png', caption: 'Kuliner & Budaya Lokal Priangan' },
    ]

  return (
    <article className="min-h-screen bg-cream pb-24 pt-28">
      {/* Top Breadcrumb & Actions */}
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="flex items-center justify-between border-b border-ink/10 pb-5">
          <Link
            to="/"
            hash="guide"
            onClick={() => handleNavClick('guide')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest hover:text-ember transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Panduan</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/wp-admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-white/70 px-3 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-white transition"
              title="Edit artikel ini di dashboard admin"
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin CMS</span>
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ember/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ember">
              {article.category}
            </span>
            <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest uppercase tracking-wider">
              Swiss van Java
            </span>
            <div className="flex items-center gap-4 text-xs text-ink/60">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTime}
              </span>
            </div>
          </div>

          <h1 className="font-display mt-5 text-3xl sm:text-5xl font-light text-ink leading-tight">
            {article.title}
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-normal text-ink/75 leading-relaxed border-l-2 border-ember pl-5 italic">
            "{article.excerpt}"
          </p>
        </header>

        {/* Hero Image */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lift aspect-[16/10] sm:aspect-[21/10] relative group cursor-pointer"
             onClick={() => setSelectedPhoto({ file: article.image, caption: article.title })}>
          <Img
            file={article.image}
            alt={article.title}
            sizes="(min-width: 1024px) 1000px, 100vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Perbesar Foto</span>
          </div>
        </div>

        {/* Article Body Sections */}
        <div className="mt-12 space-y-10 text-ink leading-relaxed">
          {article.body.map((sec, i) => (
            <section key={i} className="space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl text-forest font-semibold">
                {sec.heading}
              </h2>
              <p className="text-base sm:text-lg text-ink/80 leading-relaxed whitespace-pre-line">
                {sec.text}
              </p>

              {/* Interleaved photo illustration for even sections */}
              {i === 1 && galleryPhotos.length > 1 && (
                <div
                  className="my-8 overflow-hidden rounded-2xl bg-ink/5 shadow-soft aspect-[16/9] relative group cursor-pointer"
                  onClick={() => setSelectedPhoto(galleryPhotos[1])}
                >
                  <Img
                    file={galleryPhotos[1].file}
                    alt={galleryPhotos[1].caption}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 900px, 100vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-xs text-white flex items-center justify-between">
                    <span>{galleryPhotos[1].caption}</span>
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Visual Story Gallery */}
        <div className="mt-16 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ember">
            <ImageIcon className="h-4 w-4" />
            <span>Galeri Visual Cerita</span>
          </div>
          <h3 className="font-display mt-1 text-2xl font-semibold text-forest">
            Dokumentasi & Potret Wisata Terkait
          </h3>
          <p className="mt-1 text-xs text-ink/65">
            Klik foto di bawah untuk melihat detail resolusi tinggi.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryPhotos.map((p, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 cursor-pointer shadow-sm hover:shadow-lift transition"
                onClick={() => setSelectedPhoto(p)}
              >
                <Img
                  file={p.file}
                  alt={p.caption}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  width={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end text-white">
                  <span className="text-xs font-medium line-clamp-1">{p.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Share & WhatsApp CTA */}
        <div className="mt-12 rounded-3xl bg-white p-8 shadow-soft border border-ink/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ember">Suka dengan panduan ini?</p>
              <h3 className="font-display text-xl font-semibold text-ink mt-1">Bagikan ke Teman & Keluarga</h3>
            </div>
            <ShareButtons title={article.title} path={`/guide/${article.slug}`} />
          </div>

          <div className="mt-8 border-t border-ink/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-cream font-bold text-xs">
                GJ
              </span>
              <div>
                <p className="text-xs font-bold text-ink">Butuh Bantuan Rencana Wisata?</p>
                <p className="text-xs text-ink/60">
                  Kantor kami: {site.address}
                </p>
              </div>
            </div>

            <a
              href={whatsappLink(`Halo Admin Garut Journey! Saya tertarik dengan artikel "${article.title}". Boleh minta info rekomendasi paket tour?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#1ebd59] transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat Admin WhatsApp ({site.whatsapp})</span>
            </a>
          </div>
        </div>

        {/* Related Destinations */}
        {relatedDests.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ember">
              <MapPin className="h-4 w-4" />
              <span>Destinasi Terkait Dalam Artikel</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-forest mt-2">
              Jelajahi Tempat yang Direkomendasikan
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedDests.map((d: any) => (
                <DestinationCard key={d.slug} d={d} />
              ))}
            </div>
          </div>
        )}

        {/* Other Articles Recommendation */}
        {otherArticles.length > 0 && (
          <div className="mt-16 border-t border-ink/10 pt-12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ember">Artikel Pilihan Lainnya</p>
                <h3 className="font-display text-2xl font-semibold text-forest mt-1">
                  Inspirasi Perjalanan Swiss van Java
                </h3>
              </div>
              <Link
                to="/"
                hash="guide"
                onClick={() => handleNavClick('guide')}
                className="text-xs font-semibold text-forest hover:text-ember transition"
              >
                Lihat Semua Panduan →
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {otherArticles.map((oa) => (
                <Link
                  key={oa.slug}
                  to="/guide/$slug"
                  params={{ slug: oa.slug }}
                  className="group flex flex-col rounded-2xl bg-white overflow-hidden shadow-soft hover:shadow-lift transition duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <Img
                      file={oa.image}
                      alt={oa.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      width={400}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ember">
                        {oa.category}
                      </span>
                      <h4 className="font-display mt-1 text-sm font-semibold text-ink line-clamp-2 group-hover:text-forest transition">
                        {oa.title}
                      </h4>
                    </div>
                    <p className="mt-3 text-[0.7rem] text-ink/50">
                      {formatDate(oa.date)} · {oa.readingTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Article Photos */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-ink text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-ember transition"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="max-h-[70vh] w-full overflow-hidden bg-black/50">
              <Img
                file={selectedPhoto.file}
                alt={selectedPhoto.caption}
                className="h-full max-h-[70vh] w-full object-contain mx-auto"
                sizes="(min-width: 1024px) 1000px, 100vw"
              />
            </div>
            <div className="p-5 text-center bg-ink">
              <p className="font-display text-lg text-cream">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
