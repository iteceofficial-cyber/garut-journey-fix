import {
  BadgePercent,
  Bot,
  Check,
  Clock,
  Edit3,
  Layers,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Img } from '@/components/Img'
import {
  generateDefaultPriceTiers,
  type CityTour,
  type TourPackage,
  type TourPriceTier,
} from '@/data/tours'
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
import { generateOrganicSeoWithAi } from '@/lib/aiSeoGenerator'

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
  const [ctFacilities, setCtFacilities] = useState(
    'Transportasi AC Pariwisata + Driver + BBM, Pemandu Lokal HPI Garut, Tiket Masuk Seluruh Objek Wisata, Makan Siang Khas Sunda Nasi Liwet, Air Mineral 600ml & Snack Lokal, Asuransi Perjalanan Resmi',
  )
  const [ctExcluded, setCtExcluded] = useState(
    'Pengeluaran pribadi peserta (belanja oleh-oleh), Wahana permainan berbayar opsional, Tips sukarela untuk guide / driver',
  )
  const [ctPriceTiers, setCtPriceTiers] = useState<TourPriceTier[]>(() => generateDefaultPriceTiers(350000))
  const [ctItineraryText, setCtItineraryText] = useState(
    '08:00 WIB | Penjemputan di Stasiun Garut / Hotel\n10:00 WIB | Eksplorasi Destinasi Utama\n12:30 WIB | Makan Siang Kuliner Khas Sunda\n15:30 WIB | Belanja Oleh-oleh & Kerajinan Kulit\n17:30 WIB | Pengantaran Kembali',
  )
  const [ctAiLoading, setCtAiLoading] = useState(false)

  // --- Tour Package Form State ---
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null)
  const [pkgName, setPkgName] = useState('')
  const [pkgTagline, setPkgTagline] = useState('')
  const [pkgDuration, setPkgDuration] = useState('2 Days · 1 Night')
  const [pkgDurationDays, setPkgDurationDays] = useState<1 | 2 | 3>(2)
  const [pkgPrice, setPkgPrice] = useState('Rp 850.000 / orang')
  const [pkgNumericPrice, setPkgNumericPrice] = useState<number>(850000)
  const [pkgGroupSize, setPkgGroupSize] = useState('1–100 peserta (private atau rombongan bus)')
  const [pkgStyles, setPkgStyles] = useState('Nature, Culinary, Culture, Family')
  const [pkgDestinations, setPkgDestinations] = useState('Mount Papandayan, Cipanas Garut, Situ Bagendit')
  const [pkgActivities, setPkgActivities] = useState('Sunrise crater walk, Hot-spring soak, Bamboo raft ride')
  const [pkgIncluded, setPkgIncluded] = useState(
    'Transportasi AC Pariwisata, Hotel 1 Malam, Makan Sesuai Program, Tiket Masuk Objek, Pemandu Wisata HPI',
  )
  const [pkgFacilities, setPkgFacilities] = useState(
    'Hotel / Penginapan Nyaman 1 Malam, Transportasi AC Full Trip + Driver + BBM, Tiket Masuk Seluruh Destinasi Wisata, Makan 4x Termasuk Restoran Khas Sunda, Pemandu Lokal Berlisensi HPI Garut, Air Mineral & Snack Lokal, Dokumentasi Foto Trip, Asuransi Perjalanan Resmi',
  )
  const [pkgExcluded, setPkgExcluded] = useState(
    'Pengeluaran belanja pribadi di luar program, Minibar / laundry hotel, Tips sukarela driver / guide',
  )
  const [pkgPriceTiers, setPkgPriceTiers] = useState<TourPriceTier[]>(() => generateDefaultPriceTiers(850000))
  const [pkgFeatured, setPkgFeatured] = useState(false)
  const [pkgAiLoading, setPkgAiLoading] = useState(false)

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
    setCtFacilities(
      'Transportasi AC Pariwisata + Driver + BBM, Pemandu Lokal HPI Garut, Tiket Masuk Seluruh Objek Wisata, Makan Siang Khas Sunda Nasi Liwet, Air Mineral 600ml & Snack Lokal, Asuransi Perjalanan Resmi',
    )
    setCtExcluded(
      'Pengeluaran pribadi peserta (belanja oleh-oleh), Wahana permainan berbayar opsional, Tips sukarela untuk guide / driver',
    )
    setCtPriceTiers(generateDefaultPriceTiers(350000))
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
    setCtFacilities(
      t.facilities && t.facilities.length > 0
        ? t.facilities.join(', ')
        : 'Transportasi AC Pariwisata + Driver + BBM, Pemandu Lokal HPI Garut, Tiket Masuk Seluruh Objek Wisata, Makan Siang Khas Sunda, Air Mineral 600ml & Snack Lokal, Asuransi Perjalanan Resmi',
    )
    setCtExcluded(
      t.excluded && t.excluded.length > 0
        ? t.excluded.join(', ')
        : 'Pengeluaran pribadi peserta (belanja oleh-oleh), Wahana permainan berbayar opsional, Tips sukarela untuk guide / driver',
    )
    setCtPriceTiers(
      t.priceTiers && t.priceTiers.length > 0
        ? t.priceTiers
        : generateDefaultPriceTiers(parsedNum),
    )
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
      facilities: ctFacilities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      excluded: ctExcluded
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      priceTiers: ctPriceTiers.length > 0 ? ctPriceTiers : generateDefaultPriceTiers(ctNumericPrice),
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
    setPkgGroupSize('1–100 peserta (private atau rombongan bus)')
    setPkgStyles('Nature, Culinary, Culture, Family')
    setPkgDestinations('Mount Papandayan, Cipanas Garut, Situ Bagendit')
    setPkgActivities('Sunrise crater walk, Hot-spring soak, Bamboo raft ride')
    setPkgIncluded(
      'Transportasi AC Pariwisata, Hotel 1 Malam, Makan Sesuai Program, Tiket Masuk Objek, Pemandu Wisata HPI',
    )
    setPkgFacilities(
      'Hotel / Penginapan Nyaman 1 Malam, Transportasi AC Full Trip + Driver + BBM, Tiket Masuk Seluruh Destinasi Wisata, Makan 4x Termasuk Restoran Khas Sunda, Pemandu Lokal Berlisensi HPI Garut, Air Mineral & Snack Lokal, Dokumentasi Foto Trip, Asuransi Perjalanan Resmi',
    )
    setPkgExcluded(
      'Pengeluaran belanja pribadi di luar program, Minibar / laundry hotel, Tips sukarela driver / guide',
    )
    setPkgPriceTiers(generateDefaultPriceTiers(850000))
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
    setPkgFacilities(
      p.facilities && p.facilities.length > 0
        ? p.facilities.join(', ')
        : 'Hotel / Penginapan Nyaman, Transportasi AC Pariwisata, Tiket Masuk Destinasi, Makan Sesuai Program, Pemandu HPI, Dokumentasi Foto, Asuransi Resmi',
    )
    setPkgExcluded(
      p.excluded && p.excluded.length > 0
        ? p.excluded.join(', ')
        : 'Pengeluaran belanja pribadi, Minibar / laundry hotel, Tips sukarela driver / guide',
    )
    setPkgPriceTiers(
      p.priceTiers && p.priceTiers.length > 0
        ? p.priceTiers
        : generateDefaultPriceTiers(parsedNum),
    )
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
      facilities: pkgFacilities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      excluded: pkgExcluded
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      priceTiers: pkgPriceTiers.length > 0 ? pkgPriceTiers : generateDefaultPriceTiers(pkgNumericPrice),
      price: pkgPrice.trim() || `Rp ${pkgNumericPrice.toLocaleString('id-ID')} / orang`,
      groupSize: pkgGroupSize.trim() || '1–100 orang',
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
                      value={ctImage.startsWith('data:') ? 'custom' : ctImage}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') setCtImage(e.target.value)
                      }}
                      className="flex-1 rounded-xl border border-ink/20 px-3 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                    >
                      {ctImage.startsWith('data:') && (
                        <option value="custom">Foto Hasil Upload Sendiri</option>
                      )}
                      {AVAILABLE_IMAGES.map((img) => (
                        <option key={img.file} value={img.file}>
                          {img.label} ({img.file})
                        </option>
                      ))}
                    </select>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-ember px-3.5 py-2.5 text-xs font-bold text-white hover:bg-ember-600 shrink-0">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{ctUploading ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg,image/gif,image/*"
                        onChange={handleCtFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {ctImage.startsWith('data:') && (
                    <div className="mt-2 flex items-center gap-2 bg-cream/40 p-2 rounded-xl border border-ink/10">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-forest/10 shrink-0">
                        <img src={ctImage} alt="Preview Tour" className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[0.7rem] text-forest font-semibold">Foto sampul tour siap digunakan</span>
                    </div>
                  )}
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
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Ringkasan Deskripsi Tour *
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!ctName.trim()) {
                          onNotify('Ketik nama City Tour terlebih dahulu!')
                          return
                        }
                        setCtAiLoading(true)
                        try {
                          const res = await generateOrganicSeoWithAi({
                            scope: 'tour',
                            subjectName: ctName,
                            subjectDetails: `Kategori: ${ctCategory}. Durasi: ${ctDuration}. Fokus: ${ctFocus}.`,
                            audienceStyle: 'keluarga',
                          })
                          setCtSummary(res.organicPitch || res.metaDescription)
                          onNotify('Deskripsi & copywriting organik berhasil di-generate AI!')
                        } catch {
                          onNotify('Gagal generate AI SEO.')
                        } finally {
                          setCtAiLoading(false)
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-ember bg-forest/5 hover:bg-forest/10 px-3 py-1 rounded-full transition"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span>{ctAiLoading ? 'Menulis Organik...' : 'Generate Copy Organik AI'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={ctSummary}
                    onChange={(e) => setCtSummary(e.target.value)}
                    placeholder="Jelaskan daya tarik utama dari paket perjalanan ini..."
                    className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {/* Kolom Fasilitas Termasuk (Facilities) */}
                <div className="sm:col-span-2 rounded-2xl bg-forest/5 border border-forest/15 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Kolom Fasilitas yang Termasuk (Pisahkan dengan koma) *</span>
                    </label>
                    <span className="text-[0.65rem] text-ink/50">Tampil di popup &amp; rincian paket</span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={ctFacilities}
                    onChange={(e) => setCtFacilities(e.target.value)}
                    placeholder="Transportasi AC + Driver + BBM, Pemandu Lokal HPI Garut, Tiket Masuk Semua Objek, Makan Siang Khas Sunda, Air Mineral, Asuransi Perjalanan"
                    className="w-full rounded-xl border border-ink/20 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {/* Kolom Fasilitas Tidak Termasuk (Excluded) */}
                <div className="sm:col-span-2 rounded-2xl bg-rose-50/50 border border-rose-200/50 p-4 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <span>Kolom Tidak Termasuk / Excluded (Pisahkan dengan koma)</span>
                  </label>
                  <input
                    type="text"
                    value={ctExcluded}
                    onChange={(e) => setCtExcluded(e.target.value)}
                    placeholder="Pengeluaran pribadi peserta (belanja oleh-oleh), Wahana permainan berbayar opsional, Tips sukarela untuk guide / driver"
                    className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {/* Editor Tarif 1 s/d 100 Orang (Tiered Pricing Matrix) */}
                <div className="sm:col-span-2 rounded-2xl bg-cream/40 border border-ink/15 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-ink/10 pb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                        <BadgePercent className="h-4 w-4 text-ember" />
                        <span>Skala Harga Paket: 1 Orang s/d 100 Orang (Tiered Pricing)</span>
                      </span>
                      <p className="text-[0.7rem] text-ink/60">
                        Atur harga berbeda untuk rombongan (1 pax, 2 pax, 3-5 pax, 6-10 pax, hingga 100 pax).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCtPriceTiers(generateDefaultPriceTiers(ctNumericPrice))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-ember bg-white border border-forest/20 px-3 py-1.5 rounded-xl shadow-sm transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Hitung Ulang Otomatis 1-100 Pax</span>
                    </button>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {ctPriceTiers.map((tier, idx) => (
                      <div key={idx} className="rounded-xl bg-white p-2.5 border border-ink/10 space-y-1">
                        <span className="text-[0.65rem] font-bold text-forest block truncate">
                          {tier.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[0.7rem] font-bold text-ink/50">Rp</span>
                          <input
                            type="number"
                            step={5000}
                            value={tier.pricePerPax}
                            onChange={(e) => {
                              const updated = [...ctPriceTiers]
                              updated[idx] = { ...updated[idx], pricePerPax: Number(e.target.value) || 0 }
                              setCtPriceTiers(updated)
                            }}
                            className="w-full rounded border border-ink/15 px-2 py-1 text-xs font-mono font-bold text-forest"
                          />
                        </div>
                        <span className="text-[0.6rem] text-ink/40 block truncate">
                          {tier.note || 'Fasilitas komplit'}
                        </span>
                      </div>
                    ))}
                  </div>
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
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Tagline Singkat *
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!pkgName.trim()) {
                          onNotify('Ketik nama Paket Wisata terlebih dahulu!')
                          return
                        }
                        setPkgAiLoading(true)
                        try {
                          const res = await generateOrganicSeoWithAi({
                            scope: 'tour',
                            subjectName: pkgName,
                            subjectDetails: `Destinasi: ${pkgDestinations}. Aktivitas: ${pkgActivities}. Durasi: ${pkgDuration}.`,
                            audienceStyle: 'keluarga',
                          })
                          setPkgTagline(res.metaDescription.slice(0, 85))
                          onNotify('Tagline & copywriting organik berhasil di-generate AI!')
                        } catch {
                          onNotify('Gagal generate AI SEO.')
                        } finally {
                          setPkgAiLoading(false)
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-ember bg-forest/5 hover:bg-forest/10 px-2.5 py-0.5 rounded-full transition"
                    >
                      <Bot className="h-3 w-3" />
                      <span>{pkgAiLoading ? 'Menulis...' : 'Generate AI'}</span>
                    </button>
                  </div>
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
                    Fasilitas Ringkas (Highlight di Kartu, pisahkan koma) *
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

                {/* Kolom Fasilitas Lengkap (Detailed Facilities) */}
                <div className="sm:col-span-2 rounded-2xl bg-emerald-50/50 border border-emerald-200/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Kolom Fasilitas Lengkap Paket Tour (Termasuk / Included) *</span>
                    </label>
                    <span className="text-[0.65rem] text-ink/50">Pisahkan dengan tanda koma (,)</span>
                  </div>
                  <textarea
                    rows={3}
                    value={pkgFacilities}
                    onChange={(e) => setPkgFacilities(e.target.value)}
                    placeholder="Hotel / Resort Nyaman 1 Malam, Transportasi AC Pariwisata + Driver + BBM, Tiket Masuk Seluruh Destinasi, Makan 4x Restoran Khas Sunda, Pemandu HPI Garut, Air Mineral & Snack, Dokumentasi Foto, Asuransi Resmi"
                    className="w-full rounded-xl border border-ink/20 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none leading-relaxed"
                  />
                  <p className="text-[0.68rem] text-ink/55">
                    Ditampilkan dalam kolom rincian fasilitas pada kartu paket wisata dan modal rincian fasilitas.
                  </p>
                </div>

                {/* Kolom Fasilitas Tidak Termasuk (Excluded) */}
                <div className="sm:col-span-2 rounded-2xl bg-rose-50/50 border border-rose-200/50 p-4 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <span>Kolom Tidak Termasuk / Excluded (Pisahkan dengan koma)</span>
                  </label>
                  <input
                    type="text"
                    value={pkgExcluded}
                    onChange={(e) => setPkgExcluded(e.target.value)}
                    placeholder="Pengeluaran belanja pribadi di luar program, Minibar / laundry hotel, Tips sukarela driver / guide"
                    className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {/* Editor Skala Harga 1 s/d 100 Orang (Tiered Pricing Matrix) */}
                <div className="sm:col-span-2 rounded-2xl bg-cream/40 border border-ink/15 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-ink/10 pb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                        <BadgePercent className="h-4 w-4 text-ember" />
                        <span>Skala Harga Paket: 1 Orang s/d 100 Orang (Tiered Pricing)</span>
                      </span>
                      <p className="text-[0.7rem] text-ink/60">
                        Atur harga bertingkat untuk perorangan dan rombongan hingga 100 pax dengan harga yang berbeda.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPkgPriceTiers(generateDefaultPriceTiers(pkgNumericPrice))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-ember bg-white border border-forest/20 px-3 py-1.5 rounded-xl shadow-sm transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Hitung Ulang Otomatis 1-100 Pax</span>
                    </button>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {pkgPriceTiers.map((tier, idx) => (
                      <div key={idx} className="rounded-xl bg-white p-2.5 border border-ink/10 space-y-1">
                        <span className="text-[0.65rem] font-bold text-forest block truncate">
                          {tier.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[0.7rem] font-bold text-ink/50">Rp</span>
                          <input
                            type="number"
                            step={10000}
                            value={tier.pricePerPax}
                            onChange={(e) => {
                              const updated = [...pkgPriceTiers]
                              updated[idx] = { ...updated[idx], pricePerPax: Number(e.target.value) || 0 }
                              setPkgPriceTiers(updated)
                            }}
                            className="w-full rounded border border-ink/15 px-2 py-1 text-xs font-mono font-bold text-forest"
                          />
                        </div>
                        <span className="text-[0.6rem] text-ink/40 block truncate">
                          {tier.note || 'Fasilitas komplit'}
                        </span>
                      </div>
                    ))}
                  </div>
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
