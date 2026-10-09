import { Check, MessageSquarePlus, Quote, Star, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Reveal, SectionHeading } from '@/components/Reveal'
import {
  getInitials,
  getRandomTone,
  upsertTestimonial,
  useTestimonials,
} from '@/lib/testimonialsStorage'
import { useCityTours, useTourPackages } from '@/lib/toursStorage'
import { useLanguage } from '@/lib/i18n'

export function Testimonials() {
  const { t } = useLanguage()
  const testimonials = useTestimonials()
  const cityTours = useCityTours()
  const packages = useTourPackages()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [tourName, setTourName] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null)

  const tourChoices = Array.from(
    new Set([
      ...cityTours.map((ct) => ct.name),
      ...packages.map((p) => p.name),
      'Wisata Trekking & Camping Garut',
      'Custom Private Tour Garut',
    ]),
  )

  const openNewForm = () => {
    setName('')
    setFrom('')
    setTourName(tourChoices[0] || 'Garut One-Day City Tour')
    setRating(5)
    setReview('')
    setIsFormOpen(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !review.trim()) return

    const id = `rev-${Date.now()}`
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const now = new Date()
    const formattedDate = `${monthNames[now.getMonth()]} ${now.getFullYear()}`

    upsertTestimonial({
      id,
      name: name.trim(),
      from: from.trim() || 'Indonesia',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      review: review.trim(),
      tourName: tourName.trim() || 'Garut Tour',
      date: formattedDate,
      initials: getInitials(name),
      tone: getRandomTone(testimonials.length),
    })

    setIsFormOpen(false)
    setSubmittedNotice('Terima kasih! Ulasan Anda telah berhasil dikirim dan ditampilkan.')
    setTimeout(() => setSubmittedNotice(null), 4000)
  }

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, item) => acc + item.rating, 0) / testimonials.length).toFixed(1)
      : '5.0'

  return (
    <section id="testimonials" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionHeading eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-4 py-1.5 text-xs font-semibold text-ember-600">
                <Star className="h-3.5 w-3.5 fill-ember text-ember" />
                <span>Rating Rata-rata {avgRating}/5.0 ({testimonials.length} Ulasan Klien)</span>
              </div>
              {submittedNotice && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1.5 text-xs font-bold text-forest">
                  <Check className="h-3.5 w-3.5" />
                  <span>{submittedNotice}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openNewForm}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700 hover:-translate-y-0.5"
            >
              <MessageSquarePlus className="h-4 w-4 text-ember" />
              <span>Tulis Ulasan Klien</span>
            </button>
          </div>
        </div>

        {/* Form Tambah Ulasan Klien Baru */}
        {isFormOpen && (
          <div className="mt-10 rounded-[2rem] bg-cream p-6 sm:p-8 shadow-lift ring-1 ring-ink/10 animate-fade-in">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ember">
                  Bagikan Pengalaman Anda
                </span>
                <h3 className="font-display mt-1 text-2xl text-ink">
                  Tulis Ulasan Bersama Garut Journey
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-2 text-ink/50 hover:bg-ink/5 hover:text-ink"
                aria-label="Tutup formulir ulasan"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/70">Nama Lengkap *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rina Wulandari"
                  className="mt-2 block w-full rounded-2xl bg-white px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/70">Kota Asal *</span>
                <input
                  type="text"
                  required
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Contoh: Jakarta / Bandung"
                  className="mt-2 block w-full rounded-2xl bg-white px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/70">Paket Tour yang Diikuti</span>
                <select
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  className="mt-2 block w-full rounded-2xl bg-white px-4 py-3 text-sm text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  {tourChoices.map((tc) => (
                    <option key={tc} value={tc}>
                      {tc}
                    </option>
                  ))}
                </select>
              </label>

              <div className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/70">Rating Kepuasan *</span>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 ring-1 ring-ink/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition hover:scale-110"
                      aria-label={`Beri ${star} bintang`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? 'fill-ember text-ember' : 'text-ink/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-ink/70">{rating} / 5 Bintang</span>
                </div>
              </div>

              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/70">Ceritakan Pengalaman Anda *</span>
                <textarea
                  rows={3}
                  required
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Ceritakan kesan perjalanan, pemandu lokal, atau destinasi favorit Anda di Garut..."
                  className="mt-2 block w-full rounded-2xl bg-white p-4 text-sm text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink/70 hover:bg-ink/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ember-600"
                >
                  <Check className="h-4 w-4" />
                  <span>Kirim Ulasan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, i) => {
            const itemKey = item.id || `${item.name}-${i}`
            return (
              <Reveal as="li" key={itemKey} delay={(i % 4) * 80}>
                <figure
                  className={`relative flex h-full flex-col rounded-[1.75rem] p-7 transition duration-300 hover:shadow-soft ${
                    i % 2 ? 'bg-cream lg:translate-y-6' : 'bg-cream-200/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Quote className="h-8 w-8 text-ember shrink-0" aria-hidden="true" />
                    {item.date && (
                      <span className="text-[0.7rem] font-medium text-ink/45">{item.date}</span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-0.5" role="img" aria-label={`Rated ${item.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s < item.rating ? 'fill-ember text-ember' : 'text-ink/20'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {item.tourName && (
                    <span className="mt-3 inline-block self-start rounded-full bg-forest/10 px-3 py-1 text-[0.68rem] font-bold text-forest">
                      {item.tourName}
                    </span>
                  )}

                  <blockquote className="mt-3 flex-1 leading-relaxed text-ink/80 text-sm sm:text-base">
                    “{item.review}”
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/5 pt-4">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-cream ${
                        item.tone || 'bg-forest text-cream'
                      }`}
                      aria-hidden="true"
                    >
                      {item.initials || getInitials(item.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{item.name}</span>
                      <span className="block truncate text-xs text-ink/55">{item.from}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
