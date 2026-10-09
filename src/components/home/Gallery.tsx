import { useState } from 'react'
import { MessageCircle, X, ZoomIn } from 'lucide-react'
import { Img } from '@/components/Img'
import { SectionHeading } from '@/components/Reveal'
import { galleryFilters, type GalleryItem } from '@/data/gallery'
import { useGallery } from '@/lib/contentStorage'
import { whatsappLink } from '@/data/site'
import { Chip } from './Destinations'
import { useLanguage } from '@/lib/i18n'

export function Gallery() {
  const [filter, setFilter] = useState<(typeof galleryFilters)[number]>('All')
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null)
  const { t } = useLanguage()
  const gallery = useGallery()

  return (
    <section id="gallery" className="bg-cream-200/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            intro={t.gallery.intro}
          />
          <div role="group" aria-label="Filter gallery" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
            {galleryFilters.map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Chip>
            ))}
          </div>
        </div>

        <ul className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
          {gallery.map((g) => {
            const shown = filter === 'All' || g.category === filter
            return (
              <li
                key={g.image + g.title}
                hidden={!shown}
                className="group relative break-inside-avoid overflow-hidden rounded-3xl shadow-soft cursor-pointer"
                onClick={() => setActiveItem(g)}
              >
                <figure className={`fade-up relative ${g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                  <Img
                    file={g.image}
                    alt={`${g.title} — ${g.description}`}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    width={800}
                    className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-ink/60 p-2 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 text-cream opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-ember">{g.category}</span>
                    <span className="font-display mt-1 text-lg font-semibold">{g.title}</span>
                    <span className="mt-1 line-clamp-2 text-xs text-cream/80 transition duration-500">{g.description}</span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-ink rounded-3xl overflow-hidden shadow-lift border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              aria-label={t.gallery.closeModal}
              className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/60 text-white backdrop-blur hover:bg-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[65vh] w-full overflow-hidden bg-black/40">
              <Img
                file={activeItem.image}
                alt={activeItem.title}
                className="h-full max-h-[65vh] w-full object-contain mx-auto"
                sizes="(min-width: 1024px) 1000px, 100vw"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-ink">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ember">{activeItem.category}</span>
                <h3 className="font-display mt-1 text-2xl font-semibold text-cream">{activeItem.title}</h3>
                <p className="mt-2 text-sm text-cream/70 max-w-xl">{activeItem.description}</p>
              </div>

              <a
                href={whatsappLink(`Halo Admin Garut Journey! Saya tertarik berkunjung ke spot '${activeItem.title}' seperti di galeri foto web.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#25D366] px-5 py-3 text-xs font-bold text-white shadow-soft hover:bg-[#1ebd59] transition shrink-0"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t.gallery.consultWhatsApp}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
