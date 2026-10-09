import { Check, Clock, Edit3, Plus, RotateCcw, Sparkles, Star, Trash2, Upload, Users } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Img } from '@/components/Img'
import { type CityTour, type TourPackage } from '@/data/tours'
import { useTourPrices } from '@/lib/destinationsStorage'
import { readAndCompressImage } from '@/lib/img'
import {
  deleteCityTour,
  deleteTourPackage,
  resetCityToursToDefault,
  resetPackagesToDefault,
  upsertCityTour,
  upsertTourPackage,
  useCityTours,
  useTourPackages,
} from '@/lib/toursStorage'

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ToursManager({ onNotify }: { onNotify: (msg: string) => void }) {
  const cityTours = useCityTours()
  const packages = useTourPackages()
  const { prices, updatePrice } = useTourPrices()

  const [subTab, setSubTab] = useState<'city_tours' | 'packages'>('city_tours')

  // --- City Tour Form State ---
  const [editingTourId, setEditingTourId] = useState<string | null>(null)
  const [ctName, setCtName] = useState('')
  const [ctCategory, setCtCategory] = useState<'city' | 'trekking-camping'>('city')
  const [ctDuration, setCtDuration] = useState('Full Day (08.00 – 18.00 WIB)')
  const [ctSummary, setCtSummary] = useState('')
  const [ctPrice, setCtPrice] = useState('Mulai dari Rp 350.000 / orang')
  const [ctNumericPrice, setCtNumericPrice] = useState<number>(350000)
  const [ctImage, setCtImage] = useState('citysquare.png')
  const [ctUploading, setCtUploading] = useState(false)
  const [ctFocus, setCtFocus] = useState('City landmarks, Culinary, Souvenirs')
  const [ctItineraryText, setCtItineraryText] = useState(
    '08:00 WIB | Penjemputan di Stasiun Garut / Hotel\n10:00 WIB | Eksplorasi Destinasi Utama\n12:30 WIB | Makan Siang Kuliner Khas Sunda\n15:30 WIB | Belanja Oleh-oleh & Kerajinan Kulit\n17:30 WIB | Pengantaran Kembali',
  )

  // --- Tour Package Form State ---
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null)
  const [pkgName, setPkgName] = useState('')
  const [pkgTagline, setPkgTagline] = useState('')
  const [pkgDuration, setPkgDuration] = useState('2 Days · 1 Night')
  const [pkgDurationDays, setPkgDurationDays] = useState<1 | 2 | 3>(2)
  const [pkgPrice, setPkgPrice] = useState('Rp 850.000 / orang')
  const [pkgNumericPrice, setPkgNumericPrice] = useState<number>(850000)
  const [pkgGroupSize, setPkgGroupSize] = useState('2–10 guests (private or small group)')
  const [pkgStyles, setPkgStyles] = useState('Nature, Culinary, Culture, Family')
  const [pkgDestinations, setPkgDestinations] = useState('Mount Papandayan, Cipanas Garut, Situ Bagendit')
  const [pkgActivities, setPkgActivities] = useState('Sunrise crater walk, Hot-spring soak, Bamboo raft ride')
  const [pkgIncluded, setPkgIncluded] = useState('Transportasi AC Pribadi, Hotel 1 Malam, Makan Sesuai Program, Tiket Masuk, Pemandu Lokal')
  const [pkgFeatured, setPkgFeatured] = useState(false)

  // --- Handlers for City Tours ---
  const resetCtForm = () => {
    setEditingTourId(null)
    setCtName('')
    setCtCategory('city')
    setCtDuration('Full Day (08.00 – 18.00 WIB)')
    setCtSummary('')
    setCtPrice('Mulai dari Rp 350.000 / orang')
    setCtNumericPrice(350000)
    setCtImage('citysquare.png')
    setCtFocus('City landmarks, Culinary, Souvenirs')
    setCtItineraryText(
      '08:00 WIB | Penjemputan di Stasiun Garut / Hotel\n10:00 WIB | Eksplorasi Destinasi Utama\n12:30 WIB | Makan Siang Kuliner Khas Sunda\n15:30 WIB | Belanja Oleh-oleh & Kerajinan Kulit\n17:30 WIB | Pengantaran Kembali',
    )
  }

  const handleCtFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCtUploading(true)
    try {
      const dataUrl = await readAndCompressImage(file)
      setCtImage(dataUrl)
      onNotify(`Gambar "${file.name}" berhasil di-upload untuk Paket Tour!`)
    } catch {
      onNotify('Gagal memproses file gambar.')
    } finally {
      setCtUploading(false)
    }
  }

  const handleEditCityTour = (t: CityTour) => {
    setEditingTourId(t.id)
    setCtName(t.name)
    setCtCategory(t.category || 'city')
    setCtDuration(t.duration)
    setCtSummary(t.summary)
    setCtPrice(t.price)
    const parsedNum = Number(t.price.replace(/\D/g, '')) || prices[t.name] || 350000
    setCtNumericPrice(parsedNum)
    setCtImage(t.image)
    setCtFocus(t.focus.join(', '))
    setCtItineraryText(t.itinerary.map((s) => `${s.time} | ${s.title}`).join('\n'))
  }

  const handleSaveCityTour = async (e: FormEvent) => {
    e.preventDefault()
    if (!ctName.trim()) return

    const id = editingTourId ? slugify(editingTourId) : slugify(ctName) || `tour-${Date.now()}`
    const itinerary = ctItineraryText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [timePart, ...titleParts] = line.split('|')
        if (titleParts.length > 0) {
          return { time: timePart.trim(), title: titleParts.join('|').trim() }
        }
        return { time: 'Jadwal', title: line }
      })

    const newTour: CityTour = {
      id,
      name: ctName.trim(),
      category: ctCategory,
      duration: ctDuration.trim() || 'Full Day',
      summary: ctSummary.trim() || `Paket perjalanan seru menjelajahi ${ctName.trim()} bersama pemandu lokal Garut Journey.`,
      focus: ctFocus
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      itinerary: itinerary.length > 0 ? itinerary : [{ time: '08:00 WIB', title: 'Mulai Perjalanan Tour' }],
      price: ctPrice.trim() || `Mulai dari Rp ${ctNumericPrice.toLocaleString('id-ID')} / orang`,
      image: ctImage.trim() || 'citysquare.png',
    }

    try {
      await upsertCityTour(newTour)
      if (ctNumericPrice > 0) {
        updatePrice(newTour.name, ctNumericPrice)
      }
      onNotify(
        editingTourId
          ? `City Tour "${newTour.name}" berhasil diperbarui!`
          : `City Tour baru "${newTour.name}" berhasil ditambahkan!`,
      )
      resetCtForm()
    } catch {
      onNotify('City tour tersimpan di perangkat.')
    }
  }

  const handleDeleteCityTour = (t: CityTour) => {
    deleteCityTour(t.id)
    onNotify(`City Tour "${t.name}" telah dihapus.`)
    if (editingTourId === t.id) resetCtForm()
  }

  // --- Handlers for Tour Packages ---
  const resetPkgForm = () => {
    setEditingPkgId(null)
    setPkgName('')
    setPkgTagline('')
    setPkgDuration('2 Days · 1 Night')
    setPkgDurationDays(2)
    setPkgPrice('Rp 850.000 / orang')
    setPkgNumericPrice(850000)
    setPkgGroupSize('2–10 guests (private or small group)')
    setPkgStyles('Nature, Culinary, Culture, Family')
    setPkgDestinations('Mount Papandayan, Cipanas Garut, Situ Bagendit')
    setPkgActivities('Sunrise crater walk, Hot-spring soak, Bamboo raft ride')
    setPkgIncluded('Transportasi AC Pribadi, Hotel 1 Malam, Makan Sesuai Program, Tiket Masuk, Pemandu Lokal')
    setPkgFeatured(false)
  }

  const handleEditPackage = (p: TourPackage) => {
    setEditingPkgId(p.id)
    setPkgName(p.name)
    setPkgTagline(p.tagline)
    setPkgDuration(p.duration)
    setPkgDurationDays(p.durationDays)
    setPkgPrice(p.price)
    const parsedNum = Number(p.price.replace(/\D/g, '')) || prices[p.name] || 500000
    setPkgNumericPrice(parsedNum)
    setPkgGroupSize(p.groupSize)
    setPkgStyles(p.styles.join(', '))
    setPkgDestinations(p.destinations.join(', '))
    setPkgActivities(p.activities.join(', '))
    setPkgIncluded(p.included.join(', '))
    setPkgFeatured(Boolean(p.featured))
  }

  const handleSavePackage = async (e: FormEvent) => {
    e.preventDefault()
    if (!pkgName.trim()) return

    const id = editingPkgId ? slugify(editingPkgId) : slugify(pkgName) || `pkg-${Date.now()}`
    const newPkg: TourPackage = {
      id,
      name: pkgName.trim(),
      tagline: pkgTagline.trim() || 'Pengalaman liburan berkesan di Garut.',
      duration: pkgDuration.trim() || `${pkgDurationDays} Hari`,
      durationDays: pkgDurationDays,
      styles: pkgStyles
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      destinations: pkgDestinations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      activities: pkgActivities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      included: pkgIncluded
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      price: pkgPrice.trim() || `Rp ${pkgNumericPrice.toLocaleString('id-ID')} / orang`,
      groupSize: pkgGroupSize.trim() || '2–10 orang',
      featured: pkgFeatured,
    }

    try {
      await upsertTourPackage(newPkg)
      if (pkgNumericPrice > 0) {
        updatePrice(newPkg.name, pkgNumericPrice)
      }
      onNotify(
        editingPkgId
          ? `Paket Wisata "${newPkg.name}" berhasil diperbarui!`
          : `Paket Wisata baru "${newPkg.name}" berhasil ditambahkan!`,
      )
      resetPkgForm()
    } catch {
      onNotify('Paket wisata tersimpan di perangkat.')
    }
  }

  const handleDeletePackage = (p: TourPackage) => {
    deleteTourPackage(p.id)
    onNotify(`Paket Wisata "${p.name}" telah dihapus.`)
    if (editingPkgId === p.id) resetPkgForm()
  }

  return (
    <div className="space-y-8">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-soft border border-ink/5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('city_tours')}
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              subTab === 'city_tours'
                ? 'bg-forest text-white shadow-sm'
                : 'bg-cream text-ink/70 hover:bg-ink/10'
            }`}
          >
            1. Signature City Tours ({cityTours.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('packages')}
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              subTab === 'packages'
                ? 'bg-forest text-white shadow-sm'
                : 'bg-cream text-ink/70 hover:bg-ink/10'
            }`}
          >
            2. Paket Wisata Multi-Hari ({packages.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (subTab === 'city_tours') {
              resetCityToursToDefault()
              resetCtForm()
              onNotify('Daftar Signature City Tour dikembalikan ke bawaan awal.')
            } else {
              resetPackagesToDefault()
              resetPkgForm()
              onNotify('Daftar Paket Wisata dikembalikan ke bawaan awal.')
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      {subTab === 'city_tours' ? (
        <div className="space-y-8">
          {/* Form Tambah / Edit City Tour */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
            <div className="border-b border-ink/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ember">
                  Signature City Tours (#city-tours)
                </span>
                <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                  {editingTourId ? `Edit City Tour: ${ctName}` : 'Tambah Paket City Tour Baru'}
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  Tambahkan paket tour harian atau multi-hari lengkap dengan jadwal perjalanan (itinerary) jam per jam.
                </p>
              </div>
              {editingTourId && (
                <button
                  type="button"
                  onClick={resetCtForm}
                  className="self-start rounded-full bg-ink/5 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/10"
                >
                  + Buat Baru
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCityTour} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Nama Paket Tour *
                  </label>
                  <input
                    type="text"
                    required
                    value={ctName}
                    onChange={(e) => setCtName(e.target.value)}
                    placeholder="Contoh: Wisata Trekking & Camping Papandayan"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Kategori Menu Paket Tour *
                  </label>
                  <select
                    value={ctCategory}
                    onChange={(e) => {
                      const val = e.target.value as 'city' | 'trekking-camping'
                      setCtCategory(val)
                      if (val === 'trekking-camping' && ctImage === 'citysquare.png') {
                        setCtImage('hiking.png')
                        setCtFocus('Trekking, Camping, Sunrise, Adventure')
                      }
                    }}
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-forest focus:border-forest focus:outline-none"
                  >
                    <option value="city">City & Heritage Tour</option>
                    <option value="trekking-camping">Wisata Trekking & Camping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Label Durasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={ctDuration}
                    onChange={(e) => setCtDuration(e.target.value)}
                    placeholder="Contoh: 2 Days 1 Night · Trekking & Camp"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Teks Harga di Kartu *
                  </label>
                  <input
                    type="text"
                    required
                    value={ctPrice}
                    onChange={(e) => setCtPrice(e.target.value)}
                    placeholder="Contoh: Mulai dari Rp 480.000 / orang"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ember focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Harga Kalkulasi Booking (Angka Rupiah) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={ctNumericPrice}
                    onChange={(e) => setCtNumericPrice(Number(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-mono font-bold text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Gambar Sampul Tour (Pilih atau Upload)
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      value={ctImage.startsWith('data:') ? 'hiking.png' : ctImage}
                      onChange={(e) => setCtImage(e.target.value)}
                      className="flex-1 rounded-xl border border-ink/20 px-3 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    >
                      {AVAILABLE_IMAGES.map((img) => (
                        <option key={img.file} value={img.file}>
                          {img.label} ({img.file})
                        </option>
                      ))}
                    </select>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-ember px-3.5 py-2.5 text-xs font-bold text-white hover:bg-ember-600 shrink-0">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{ctUploading ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleCtFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Tag Fokus Wisata (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={ctFocus}
                    onChange={(e) => setCtFocus(e.target.value)}
                    placeholder="City landmarks, Culinary, Culture, Hot springs"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Ringkasan Deskripsi Tour *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={ctSummary}
                    onChange={(e) => setCtSummary(e.target.value)}
                    placeholder="Jelaskan daya tarik utama dari paket perjalanan ini..."
                    className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Jadwal Perjalanan / Itinerary (1 baris per jadwal, format: Waktu | Kegiatan) *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={ctItineraryText}
                    onChange={(e) => setCtItineraryText(e.target.value)}
                    placeholder={'08:00 WIB | Penjemputan peserta\n10:00 WIB | Kunjungan Kawah Papandayan'}
                    className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 font-mono text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingTourId ? 'Simpan Perubahan City Tour' : 'Tambah City Tour Baru'}</span>
                </button>
                {editingTourId && (
                  <button
                    type="button"
                    onClick={resetCtForm}
                    className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70 hover:bg-ink/5"
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Daftar City Tours */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-5">
            <h3 className="font-display text-xl font-semibold text-forest">
              Daftar Signature City Tour Aktif ({cityTours.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {cityTours.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-cream/30 p-5 space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                      <Img file={t.image} alt={t.name} className="h-full w-full object-cover" width={160} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-ember">
                        <Clock className="h-3 w-3" /> {t.duration}
                      </span>
                      <h4 className="font-display text-lg font-bold text-ink truncate">{t.name}</h4>
                      <p className="text-xs font-bold text-forest mt-0.5">{t.price}</p>
                      <p className="text-xs text-ink/65 line-clamp-2 mt-1">{t.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                    <span className="text-[0.7rem] text-ink/50">{t.itinerary.length} titik jadwal</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCityTour(t)}
                        className="inline-flex items-center gap-1 rounded-xl bg-forest/10 px-3 py-1.5 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCityTour(t)}
                        className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Form Tambah / Edit Tour Package */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
            <div className="border-b border-ink/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ember">
                  Katalog Paket Wisata (#packages)
                </span>
                <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                  {editingPkgId ? `Edit Paket Wisata: ${pkgName}` : 'Tambah Paket Wisata Baru'}
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  Tambahkan paket wisata baru (1 Hari, 2 Hari, atau 3 Hari) lengkap dengan daftar destinasi dan fasilitas.
                </p>
              </div>
              {editingPkgId && (
                <button
                  type="button"
                  onClick={resetPkgForm}
                  className="self-start rounded-full bg-ink/5 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/10"
                >
                  + Buat Paket Baru
                </button>
              )}
            </div>

            <form onSubmit={handleSavePackage} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Nama Paket Wisata *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgName}
                    onChange={(e) => setPkgName(e.target.value)}
                    placeholder="Contoh: Family Glamping & Hot Springs"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Tagline Singkat *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgTagline}
                    onChange={(e) => setPkgTagline(e.target.value)}
                    placeholder="Contoh: Liburan keluarga santai di kaki gunung."
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Teks Durasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    placeholder="Contoh: 2 Days · 1 Night"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Filter Jumlah Hari *
                  </label>
                  <select
                    value={pkgDurationDays}
                    onChange={(e) => setPkgDurationDays(Number(e.target.value) as 1 | 2 | 3)}
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  >
                    <option value={1}>1 Hari (One Day)</option>
                    <option value={2}>2 Hari 1 Malam</option>
                    <option value={3}>3 Hari 2 Malam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Teks Harga di Kartu *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="Contoh: Rp 850.000 / orang"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ember focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Harga Kalkulasi Booking (Angka Rupiah) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={pkgNumericPrice}
                    onChange={(e) => setPkgNumericPrice(Number(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-mono font-bold text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Kapasitas Peserta (Group Size)
                  </label>
                  <input
                    type="text"
                    value={pkgGroupSize}
                    onChange={(e) => setPkgGroupSize(e.target.value)}
                    placeholder="2–10 guests (private or small group)"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Gaya Perjalanan / Filter (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={pkgStyles}
                    onChange={(e) => setPkgStyles(e.target.value)}
                    placeholder="Nature, Culinary, Culture, Family, Adventure, Romantic"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Daftar Destinasi yang Dikunjungi (Pisahkan dengan koma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgDestinations}
                    onChange={(e) => setPkgDestinations(e.target.value)}
                    placeholder="Mount Papandayan, Cipanas Garut, Situ Bagendit, Candi Cangkuang"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Aktivitas Utama (Pisahkan dengan koma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgActivities}
                    onChange={(e) => setPkgActivities(e.target.value)}
                    placeholder="Sunrise crater walk, Hot-spring soak, Bamboo raft ride"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Fasilitas yang Termasuk / Included (Pisahkan dengan koma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgIncluded}
                    onChange={(e) => setPkgIncluded(e.target.value)}
                    placeholder="Private AC transport, 1-night hotel stay, Meals per itinerary, Entrance tickets, Local guide"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer rounded-2xl bg-cream/60 px-4 py-3 border border-ink/10">
                    <input
                      type="checkbox"
                      checked={pkgFeatured}
                      onChange={(e) => setPkgFeatured(e.target.checked)}
                      className="rounded text-forest focus:ring-forest h-4 w-4"
                    />
                    <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-ember" />
                      <span>Jadikan Paket Unggulan (Tampil menonjol dengan badge "Paling Diminati")</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingPkgId ? 'Simpan Perubahan Paket' : 'Tambahkan Paket Wisata'}</span>
                </button>
                {editingPkgId && (
                  <button
                    type="button"
                    onClick={resetPkgForm}
                    className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70 hover:bg-ink/5"
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Daftar Paket Wisata */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-5">
            <h3 className="font-display text-xl font-semibold text-forest">
              Daftar Paket Wisata Aktif ({packages.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 space-y-4 ${
                    p.featured
                      ? 'border-forest bg-forest/5 ring-1 ring-forest/20'
                      : 'border-ink/10 bg-cream/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-ember">
                        {p.duration}
                      </span>
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-ember px-2.5 py-0.5 text-[0.6rem] font-bold uppercase text-white">
                          <Star className="h-2.5 w-2.5 fill-white" /> Unggulan
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-xl font-bold text-ink mt-1">{p.name}</h4>
                    <p className="text-sm font-bold text-forest mt-1">{p.price}</p>
                    <p className="text-xs text-ink/65 mt-1">{p.tagline}</p>

                    <div className="mt-3 pt-3 border-t border-ink/10 text-[0.7rem] text-ink/70 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-ember shrink-0" />
                        <span className="truncate">{p.groupSize}</span>
                      </p>
                      <p className="truncate">
                        <strong>Destinasi:</strong> {p.destinations.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-ink/10 pt-3">
                    <button
                      type="button"
                      onClick={() => handleEditPackage(p)}
                      className="inline-flex items-center gap-1 rounded-xl bg-forest/10 px-3 py-1.5 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(p)}
                      className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
