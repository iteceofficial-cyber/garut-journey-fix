import { Check, Edit3, MessageSquarePlus, Quote, RotateCcw, Star, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { type Testimonial } from '@/data/testimonials'
import {
  deleteTestimonial,
  getInitials,
  getRandomTone,
  resetTestimonialsToDefault,
  upsertTestimonial,
  useTestimonials,
} from '@/lib/testimonialsStorage'
import { useCityTours, useTourPackages } from '@/lib/toursStorage'

const BADGE_TONES = [
  { value: 'bg-forest text-cream', label: 'Hijau Hutan (Forest)' },
  { value: 'bg-ember text-white', label: 'Oranye Terakota (Ember)' },
  { value: 'bg-leaf text-cream', label: 'Hijau Daun (Leaf)' },
  { value: 'bg-ink text-cream', label: 'Hitam Elegan (Ink)' },
]

export function ReviewsManager({ onNotify }: { onNotify: (msg: string) => void }) {
  const testimonials = useTestimonials()
  const cityTours = useCityTours()
  const packages = useTourPackages()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [tourName, setTourName] = useState('Garut One-Day City Tour')
  const [rating, setRating] = useState(5)
  const [date, setDate] = useState('Okt 2026')
  const [tone, setTone] = useState('bg-forest text-cream')
  const [review, setReview] = useState('')

  const tourChoices = Array.from(
    new Set([
      ...cityTours.map((ct) => ct.name),
      ...packages.map((p) => p.name),
      'Custom Private Tour Garut',
    ]),
  )

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setFrom('')
    setTourName(tourChoices[0] || 'Garut One-Day City Tour')
    setRating(5)
    setDate('Okt 2026')
    setTone(getRandomTone(testimonials.length))
    setReview('')
  }

  const handleEdit = (item: Testimonial, idx: number) => {
    const id = item.id || `rev-${idx}`
    setEditingId(id)
    setName(item.name)
    setFrom(item.from)
    setTourName(item.tourName || tourChoices[0] || 'Garut One-Day City Tour')
    setRating(item.rating)
    setDate(item.date || 'Okt 2026')
    setTone(item.tone || 'bg-forest text-cream')
    setReview(item.review)
  }

  const handleDelete = (item: Testimonial, idx: number) => {
    const id = item.id || `rev-${idx}`
    deleteTestimonial(id)
    onNotify(`Ulasan dari "${item.name}" telah dihapus.`)
    if (editingId === id) resetForm()
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !review.trim()) return

    const id = editingId || `rev-${Date.now()}`
    upsertTestimonial({
      id,
      name: name.trim(),
      from: from.trim() || 'Indonesia',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      review: review.trim(),
      tourName: tourName.trim() || 'Garut Tour',
      date: date.trim() || 'Okt 2026',
      initials: getInitials(name),
      tone,
    })

    onNotify(
      editingId
        ? `Ulasan klien "${name.trim()}" berhasil diperbarui!`
        : `Ulasan baru dari "${name.trim()}" berhasil ditambahkan ke website!`,
    )
    resetForm()
  }

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, item) => acc + item.rating, 0) / testimonials.length).toFixed(1)
      : '5.0'

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-soft border border-ink/5">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Total Ulasan Klien</span>
            <p className="font-display text-3xl font-bold text-forest mt-0.5">{testimonials.length} Ulasan</p>
          </div>
          <div className="h-10 w-px bg-ink/10 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Rating Rata-rata</span>
            <p className="font-display text-3xl font-bold text-ember mt-0.5 flex items-center gap-1.5">
              <span>{avgRating}</span>
              <Star className="h-6 w-6 fill-ember text-ember" />
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            resetTestimonialsToDefault()
            resetForm()
            onNotify('Daftar ulasan klien telah dikembalikan ke bawaan awal.')
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Ulasan Default</span>
        </button>
      </div>

      {/* Form Tambah / Edit Ulasan Klien */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
        <div className="border-b border-ink/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-ember">
              Manajemen Testimoni & Ulasan Klien (#testimonials)
            </span>
            <h2 className="font-display text-2xl font-semibold text-forest mt-1">
              {editingId ? `Edit Ulasan Klien: ${name}` : 'Tambah Ulasan Klien Baru'}
            </h2>
            <p className="text-xs text-ink/60 mt-1">
              Kelola ulasan yang ditampilkan di halaman utama website. Klien juga dapat menulis dan mengedit ulasan langsung di web.
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="self-start rounded-full bg-ink/5 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/10"
            >
              + Tambah Ulasan Baru
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Nama Lengkap Klien *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Rina Wulandari"
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Kota / Negara Asal *
              </label>
              <input
                type="text"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Contoh: Jakarta / Singapura"
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Paket Tour yang Diikuti
              </label>
              <input
                type="text"
                list="admin-tour-choices"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                placeholder="Pilih atau ketik nama paket..."
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
              />
              <datalist id="admin-tour-choices">
                {tourChoices.map((tc) => (
                  <option key={tc} value={tc} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Rating Bintang (1 – 5) *
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-ink/20 px-3.5 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-0.5 transition hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        s <= rating ? 'fill-ember text-ember' : 'text-ink/20'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-auto text-xs font-bold text-forest">{rating} Bintang</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Bulan / Tanggal Kunjungan
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Contoh: Okt 2026"
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Warna Avatar Inisial
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
              >
                {BADGE_TONES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Isi Ulasan / Testimoni Klien *
              </label>
              <textarea
                rows={3}
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tuliskan ulasan pengalaman klien selama berwisata di Garut..."
                className="mt-1.5 w-full rounded-xl border border-ink/20 p-3.5 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700 transition"
            >
              {editingId ? <Check className="h-4 w-4" /> : <MessageSquarePlus className="h-4 w-4" />}
              <span>{editingId ? 'Simpan Perubahan Ulasan' : 'Tambahkan Ulasan Klien'}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70 hover:bg-ink/5"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar Ulasan Klien */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-5">
        <h3 className="font-display text-xl font-semibold text-forest">
          Daftar Ulasan Klien di Website ({testimonials.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, idx) => {
            const key = item.id || `rev-${idx}`
            return (
              <div
                key={key}
                className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-cream/30 p-5 space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s < item.rating ? 'fill-ember text-ember' : 'text-ink/20'
                          }`}
                        />
                      ))}
                    </div>
                    {item.date && <span className="text-[0.68rem] text-ink/45 font-medium">{item.date}</span>}
                  </div>

                  {item.tourName && (
                    <span className="mt-2 inline-block rounded-full bg-forest/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-forest">
                      {item.tourName}
                    </span>
                  )}

                  <p className="mt-3 text-xs leading-relaxed text-ink/80 italic">
                    <Quote className="inline h-3 w-3 text-ember mr-1" />
                    {item.review}
                  </p>
                </div>

                <div className="border-t border-ink/10 pt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        item.tone || 'bg-forest text-cream'
                      }`}
                    >
                      {item.initials || getInitials(item.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">{item.name}</p>
                      <p className="text-[0.68rem] text-ink/55 truncate">{item.from}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(item, idx)}
                      className="inline-flex items-center gap-1 rounded-xl bg-forest/10 px-2.5 py-1.5 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item, idx)}
                      className="rounded-xl bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-600 hover:text-white transition"
                      title="Hapus ulasan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
