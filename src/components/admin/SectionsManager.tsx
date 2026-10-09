import {
  Check,
  Compass,
  Edit3,
  Image as ImageIcon,
  Link2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  UtensilsCrossed,
} from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Img } from '@/components/Img'
import { type Dish } from '@/data/culinary'
import { type Experience } from '@/data/experiences'
import { type GalleryCategory, type GalleryItem } from '@/data/gallery'
import {
  deleteCulinaryItem,
  deleteExperienceItem,
  deleteGalleryItem,
  resetCulinaryToDefault,
  resetExperiencesToDefault,
  resetGalleryToDefault,
  upsertCulinaryItem,
  upsertExperienceItem,
  upsertGalleryItem,
  useCulinary,
  useExperiences,
  useGallery,
} from '@/lib/contentStorage'
import { useDestinations } from '@/lib/destinationsStorage'
import { readAndCompressImage } from '@/lib/img'
import { useSiteSettings } from '@/lib/siteSettings'
import { useTourPackages } from '@/lib/toursStorage'

const AVAILABLE_IMAGES = [
  { file: 'dodol.png', label: 'Dodol Garut' },
  { file: 'burayot.png', label: 'Kue Burayot' },
  { file: 'chocodot.png', label: 'Chocodot' },
  { file: 'basoaci.png', label: 'Baso Aci Garut' },
  { file: 'sundanese.png', label: 'Kuliner Sunda' },
  { file: 'streetfood.png', label: 'Street Food' },
  { file: 'citysquare.png', label: 'Alun-alun Garut' },
  { file: 'papandayan.png', label: 'Gunung Papandayan' },
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
  { file: 'hero.png', label: 'Panorama Garut' },
]

const GALLERY_CATEGORIES: GalleryCategory[] = ['Nature', 'City', 'Culinary', 'Culture', 'Adventure']

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function SectionsManager({ onNotify }: { onNotify: (msg: string) => void }) {
  const dishes = useCulinary()
  const gallery = useGallery()
  const experiences = useExperiences()
  const { destinations } = useDestinations()
  const packages = useTourPackages()
  const { settings, saveSiteSettings } = useSiteSettings()

  const [subTab, setSubTab] = useState<'gallery' | 'culinary' | 'experiences' | 'banners'>('gallery')

  // --- 1. Culinary Form State ---
  const [editingDishId, setEditingDishId] = useState<string | null>(null)
  const [dishName, setDishName] = useState('')
  const [dishPriceRange, setDishPriceRange] = useState('Rp 15.000 – Rp 45.000')
  const [dishLocation, setDishLocation] = useState('')
  const [dishImage, setDishImage] = useState('basoaci.png')
  const [dishDesc, setDishDesc] = useState('')
  const [dishUploading, setDishUploading] = useState(false)

  const resetDishForm = () => {
    setEditingDishId(null)
    setDishName('')
    setDishPriceRange('Rp 15.000 – Rp 45.000')
    setDishLocation('')
    setDishImage('basoaci.png')
    setDishDesc('')
  }

  const handleEditDish = (d: Dish) => {
    setEditingDishId(d.id)
    setDishName(d.name)
    setDishPriceRange(d.priceRange)
    setDishLocation(d.location)
    setDishImage(d.image)
    setDishDesc(d.description)
  }

  const handleDishFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDishUploading(true)
    try {
      const dataUrl = await readAndCompressImage(file)
      setDishImage(dataUrl)
      onNotify(`Gambar "${file.name}" berhasil di-upload untuk kuliner!`)
    } catch {
      onNotify('Gagal memproses file gambar.')
    } finally {
      setDishUploading(false)
    }
  }

  const handleSaveDish = (e: FormEvent) => {
    e.preventDefault()
    if (!dishName.trim()) return
    const id = editingDishId || slugify(dishName) || `dish-${Date.now()}`
    upsertCulinaryItem({
      id,
      name: dishName.trim(),
      priceRange: dishPriceRange.trim() || 'Harga bervariasi',
      location: dishLocation.trim() || 'Pusat Kota Garut',
      image: dishImage.trim() || 'sundanese.png',
      description: dishDesc.trim() || `Kuliner khas Garut ${dishName.trim()}.`,
    })
    onNotify(editingDishId ? `Kuliner "${dishName}" berhasil diperbarui!` : `Kuliner "${dishName}" berhasil ditambahkan!`)
    resetDishForm()
  }

  // --- 2. Gallery Form State (with Upload Gambar) ---
  const [editingGalId, setEditingGalId] = useState<string | null>(null)
  const [galTitle, setGalTitle] = useState('')
  const [galCategory, setGalCategory] = useState<GalleryCategory>('Nature')
  const [galImageMode, setGalImageMode] = useState<'upload' | 'preset' | 'url'>('upload')
  const [galImage, setGalImage] = useState('hero.png')
  const [galUploadedName, setGalUploadedName] = useState('')
  const [galUploading, setGalUploading] = useState(false)
  const [galDesc, setGalDesc] = useState('')
  const [galTall, setGalTall] = useState(false)

  const resetGalForm = () => {
    setEditingGalId(null)
    setGalTitle('')
    setGalCategory('Nature')
    setGalImage('hero.png')
    setGalUploadedName('')
    setGalDesc('')
    setGalTall(false)
  }

  const handleEditGal = (g: GalleryItem) => {
    setEditingGalId(g.id || g.title)
    setGalTitle(g.title)
    setGalCategory(g.category)
    setGalImage(g.image)
    if (g.image.startsWith('data:')) {
      setGalImageMode('upload')
      setGalUploadedName('Gambar Hasil Upload')
    } else if (g.image.startsWith('http')) {
      setGalImageMode('url')
    } else {
      setGalImageMode('preset')
    }
    setGalDesc(g.description)
    setGalTall(Boolean(g.tall))
  }

  const handleGalleryFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setGalUploading(true)
    try {
      const dataUrl = await readAndCompressImage(file, 1280, 0.84)
      setGalImage(dataUrl)
      setGalUploadedName(file.name)
      if (!galTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
        setGalTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1))
      }
      onNotify(`Foto "${file.name}" siap ditambahkan ke Galeri!`)
    } catch {
      onNotify('Gagal membaca file gambar.')
    } finally {
      setGalUploading(false)
    }
  }

  const handleSaveGal = (e: FormEvent) => {
    e.preventDefault()
    if (!galTitle.trim()) return
    const id = editingGalId || `gal-${Date.now()}`
    upsertGalleryItem({
      id,
      title: galTitle.trim(),
      category: galCategory,
      image: galImage.trim() || 'hero.png',
      description: galDesc.trim() || galTitle.trim(),
      tall: galTall,
    })
    onNotify(
      editingGalId
        ? `Foto galeri "${galTitle}" berhasil diperbarui!`
        : `Foto baru "${galTitle}" berhasil ditambahkan ke Galeri Website!`,
    )
    resetGalForm()
  }

  // --- 3. Experiences Form State ---
  const [editingExpId, setEditingExpId] = useState<string | null>(null)
  const [expEmoji, setExpEmoji] = useState('🌿')
  const [expLabel, setExpLabel] = useState('')
  const [expBlurb, setExpBlurb] = useState('')
  const [expDests, setExpDests] = useState<string[]>(['mount-papandayan', 'cipanas-garut'])
  const [expPkgs, setExpPkgs] = useState<string[]>(['garut-discovery'])

  const resetExpForm = () => {
    setEditingExpId(null)
    setExpEmoji('🌿')
    setExpLabel('')
    setExpBlurb('')
    setExpDests(['mount-papandayan', 'cipanas-garut'])
    setExpPkgs(['garut-discovery'])
  }

  const handleEditExp = (exp: Experience) => {
    setEditingExpId(exp.id)
    setExpEmoji(exp.emoji)
    setExpLabel(exp.label)
    setExpBlurb(exp.blurb)
    setExpDests(exp.destinations)
    setExpPkgs(exp.packages)
  }

  const handleSaveExp = (e: FormEvent) => {
    e.preventDefault()
    if (!expLabel.trim()) return
    const id = editingExpId || slugify(expLabel) || `exp-${Date.now()}`
    upsertExperienceItem({
      id,
      emoji: expEmoji.trim() || '✨',
      label: expLabel.trim(),
      blurb: expBlurb.trim() || `Pengalaman ${expLabel.trim()} terbaik di Garut.`,
      destinations: expDests.length > 0 ? expDests : ['mount-papandayan'],
      packages: expPkgs.length > 0 ? expPkgs : ['garut-discovery'],
    })
    onNotify(editingExpId ? `Pengalaman "${expLabel}" diperbarui!` : `Pengalaman "${expLabel}" ditambahkan!`)
    resetExpForm()
  }

  const toggleDestInExp = (slug: string) => {
    setExpDests((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  const togglePkgInExp = (pkgId: string) => {
    setExpPkgs((prev) => (prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]))
  }

  // --- 4. Banner & Story Images Form State ---
  const [storyImage, setStoryImage] = useState(settings.storyImage || 'community.png')
  const [storySecondaryImage, setStorySecondaryImage] = useState(settings.storySecondaryImage || 'craft.png')
  const [bookingEyebrow, setBookingEyebrow] = useState(settings.bookingEyebrow || 'Siap Berangkat?')
  const [bookingTitle, setBookingTitle] = useState(settings.bookingTitle || 'Mulai Cerita Anda di Garut')
  const [bookingSubtitle, setBookingSubtitle] = useState(
    settings.bookingSubtitle ||
      'Hubungi tim lokal kami untuk merancang perjalanan pribadi, keluarga, atau rombongan terbaik.',
  )
  const [bookingImage, setBookingImage] = useState(settings.bookingImage || 'hiking.png')

  const handleSaveBanners = (e: FormEvent) => {
    e.preventDefault()
    saveSiteSettings({
      storyImage,
      storySecondaryImage,
      bookingEyebrow,
      bookingTitle,
      bookingSubtitle,
      bookingImage,
    })
    onNotify('Pengaturan Banner Booking & Foto Cerita Kami berhasil disimpan!')
  }

  return (
    <div className="space-y-8">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-soft border border-ink/5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('gallery')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              subTab === 'gallery' ? 'bg-forest text-white shadow-sm' : 'bg-cream text-ink/70 hover:bg-ink/10'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload & Galeri Foto ({gallery.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('culinary')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              subTab === 'culinary' ? 'bg-forest text-white shadow-sm' : 'bg-cream text-ink/70 hover:bg-ink/10'
            }`}
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Kuliner ({dishes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('experiences')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              subTab === 'experiences' ? 'bg-forest text-white shadow-sm' : 'bg-cream text-ink/70 hover:bg-ink/10'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Pilihan Pengalaman ({experiences.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('banners')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              subTab === 'banners' ? 'bg-forest text-white shadow-sm' : 'bg-cream text-ink/70 hover:bg-ink/10'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Banner & Foto Cerita</span>
          </button>
        </div>

        {subTab !== 'banners' && (
          <button
            type="button"
            onClick={() => {
              if (subTab === 'culinary') {
                resetCulinaryToDefault()
                resetDishForm()
                onNotify('Data kuliner dikembalikan ke bawaan awal.')
              } else if (subTab === 'gallery') {
                resetGalleryToDefault()
                resetGalForm()
                onNotify('Galeri foto dikembalikan ke bawaan awal.')
              } else if (subTab === 'experiences') {
                resetExperiencesToDefault()
                resetExpForm()
                onNotify('Pilihan pengalaman dikembalikan ke bawaan awal.')
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default</span>
          </button>
        )}
      </div>

      {/* 1. GALLERY MANAGER WITH IMAGE UPLOAD */}
      {subTab === 'gallery' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
            <div className="border-b border-ink/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ember">
                  Upload & Kelola Galeri Visual Garut (#gallery)
                </span>
                <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                  {editingGalId ? `Edit Foto Galeri: ${galTitle}` : 'Upload & Tambah Foto Galeri Baru'}
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  Upload foto baru langsung dari perangkat Anda (HP/Laptop), gunakan URL gambar, atau pilih dari koleksi foto Garut.
                </p>
              </div>
              {editingGalId && (
                <button
                  type="button"
                  onClick={resetGalForm}
                  className="self-start rounded-full bg-ink/5 px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-ink/10"
                >
                  + Upload Foto Baru
                </button>
              )}
            </div>

            <form onSubmit={handleSaveGal} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                {/* Mode Sumber Gambar */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                    Sumber Gambar Galeri *
                  </label>
                  <div className="grid grid-cols-3 gap-2 rounded-2xl bg-cream p-1.5">
                    <button
                      type="button"
                      onClick={() => setGalImageMode('upload')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                        galImageMode === 'upload'
                          ? 'bg-forest text-white shadow-sm'
                          : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalImageMode('preset')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                        galImageMode === 'preset'
                          ? 'bg-forest text-white shadow-sm'
                          : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Koleksi Web</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalImageMode('url')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                        galImageMode === 'url'
                          ? 'bg-forest text-white shadow-sm'
                          : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      <span>URL Gambar</span>
                    </button>
                  </div>
                </div>

                {/* Input berdasarkan Mode */}
                {galImageMode === 'upload' && (
                  <div className="rounded-2xl border-2 border-dashed border-forest/30 bg-forest/[0.03] p-5 text-center space-y-3">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {galUploading
                          ? 'Memproses & mengoptimalkan gambar...'
                          : galUploadedName
                          ? `File terpilih: ${galUploadedName}`
                          : 'Pilih file foto dari perangkat Anda'}
                      </p>
                      <p className="text-xs text-ink/55 mt-0.5">
                        Mendukung format JPG, PNG, WebP (Otomatis dikompresi agar cepat dimuat)
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-ember-600 transition">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Pilih File Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {galImageMode === 'preset' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Pilih dari Koleksi Foto Garut
                    </label>
                    <select
                      value={galImage.startsWith('data:') || galImage.startsWith('http') ? 'hero.png' : galImage}
                      onChange={(e) => setGalImage(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
                    >
                      {AVAILABLE_IMAGES.map((img) => (
                        <option key={img.file} value={img.file}>
                          {img.label} ({img.file})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {galImageMode === 'url' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                      Masukkan URL Gambar Eksternal
                    </label>
                    <input
                      type="url"
                      value={galImage.startsWith('http') ? galImage : ''}
                      onChange={(e) => setGalImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
                    />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Judul Foto *</label>
                    <input
                      type="text"
                      required
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      placeholder="Contoh: Camping Ceria di Pondok Saladah"
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Kategori Filter</label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as GalleryCategory)}
                      className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
                    >
                      {GALLERY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Caption / Deskripsi Foto *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={galDesc}
                    onChange={(e) => setGalDesc(e.target.value)}
                    placeholder="Tuliskan keterangan singkat suasana foto ini..."
                    className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 text-sm text-ink"
                  />
                </div>

                <label className="inline-flex items-center gap-2.5 cursor-pointer rounded-xl bg-cream/60 px-4 py-2.5 border border-ink/10 w-full">
                  <input
                    type="checkbox"
                    checked={galTall}
                    onChange={(e) => setGalTall(e.target.checked)}
                    className="rounded text-forest h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-ink">
                    Tampilkan dalam Rasio Vertikal / Portrait (Cocok untuk foto berdiri)
                  </span>
                </label>

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={galUploading}
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{editingGalId ? 'Simpan Perubahan Foto' : 'Tambahkan Gambar ke Galeri'}</span>
                  </button>
                  {editingGalId && (
                    <button
                      type="button"
                      onClick={resetGalForm}
                      className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Pratinjau Gambar Live */}
              <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-cream/40 p-5 space-y-4">
                <div>
                  <span className="text-[0.7rem] font-bold uppercase tracking-widest text-ink/50 block mb-2">
                    Pratinjau Gambar di Galeri
                  </span>
                  <div
                    className={`relative mx-auto overflow-hidden rounded-2xl bg-ink/10 shadow-soft ${
                      galTall ? 'aspect-[3/4] max-w-[260px]' : 'aspect-[4/3] w-full'
                    }`}
                  >
                    <Img file={galImage} alt={galTitle || 'Preview'} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/20 to-transparent p-4 text-cream">
                      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-ember">
                        {galCategory}
                      </span>
                      <span className="font-display text-base font-semibold">
                        {galTitle || 'Judul Foto Anda'}
                      </span>
                      <span className="text-[0.7rem] text-cream/80 line-clamp-2 mt-0.5">
                        {galDesc || 'Deskripsi foto akan tampil saat disentuh pengunjung.'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[0.7rem] text-ink/55 text-center">
                  Gambar yang di-upload langsung tampil di bagian <strong>Galeri</strong> halaman depan.
                </p>
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-xl font-semibold text-forest">Daftar Foto Galeri ({gallery.length})</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((g, idx) => {
                const gid = g.id || `gal-${idx}`
                return (
                  <div key={gid} className="rounded-2xl border border-ink/10 bg-cream/30 overflow-hidden flex flex-col justify-between">
                    <div className="aspect-[4/3] relative bg-ink/10">
                      <Img file={g.image} alt={g.title} className="h-full w-full object-cover" width={250} />
                      <span className="absolute top-2 left-2 rounded-full bg-ink/75 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase text-white">
                        {g.category}
                      </span>
                      {g.image.startsWith('data:') && (
                        <span className="absolute top-2 right-2 rounded-full bg-ember px-2 py-0.5 text-[0.6rem] font-bold text-white">
                          Uploaded
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 space-y-2">
                      <h4 className="font-display text-sm font-bold text-ink truncate">{g.title}</h4>
                      <p className="text-[0.7rem] text-ink/60 line-clamp-2">{g.description}</p>
                      <div className="flex justify-end gap-1.5 pt-2 border-t border-ink/10">
                        <button
                          type="button"
                          onClick={() => handleEditGal(g)}
                          className="rounded-lg bg-forest/10 px-2.5 py-1 text-[0.7rem] font-bold text-forest hover:bg-forest hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (g.id) deleteGalleryItem(g.id)
                            onNotify(`Foto "${g.title}" dihapus.`)
                          }}
                          className="rounded-lg bg-rose-50 px-2.5 py-1 text-[0.7rem] font-bold text-rose-700 hover:bg-rose-600 hover:text-white"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. CULINARY MANAGER */}
      {subTab === 'culinary' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                Wisata Kuliner Garut (#culinary)
              </span>
              <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                {editingDishId ? `Edit Kuliner: ${dishName}` : 'Tambah Kuliner Khas Baru'}
              </h2>
            </div>

            <form onSubmit={handleSaveDish} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Nama Kuliner *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="Contoh: Sate Domba Garut"
                  className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Rentang Harga *</label>
                <input
                  type="text"
                  required
                  value={dishPriceRange}
                  onChange={(e) => setDishPriceRange(e.target.value)}
                  placeholder="Contoh: Rp 25.000 – Rp 60.000"
                  className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ember font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Lokasi Terbaik *</label>
                <input
                  type="text"
                  required
                  value={dishLocation}
                  onChange={(e) => setDishLocation(e.target.value)}
                  placeholder="Contoh: Jl. Cimanuk & Pusat Kota Garut"
                  className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Gambar Kuliner (Pilih atau Upload)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <select
                    value={dishImage.startsWith('data:') ? 'basoaci.png' : dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                    className="flex-1 rounded-xl border border-ink/20 px-3 py-2.5 text-sm text-ink"
                  >
                    {AVAILABLE_IMAGES.map((img) => (
                      <option key={img.file} value={img.file}>
                        {img.label} ({img.file})
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-ember px-3.5 py-2.5 text-xs font-bold text-white hover:bg-ember-600 shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{dishUploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleDishFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Deskripsi Kuliner *</label>
                <textarea
                  rows={2}
                  required
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  placeholder="Jelaskan cita rasa dan keunikan kuliner ini..."
                  className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 text-sm text-ink"
                />
              </div>

              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingDishId ? 'Simpan Perubahan Kuliner' : 'Tambahkan Kuliner'}</span>
                </button>
                {editingDishId && (
                  <button
                    type="button"
                    onClick={resetDishForm}
                    className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-xl font-semibold text-forest">Daftar Kuliner Aktif ({dishes.length})</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((d) => (
                <div key={d.id} className="rounded-2xl border border-ink/10 bg-cream/30 p-4 flex flex-col justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                      <Img file={d.image} alt={d.name} className="h-full w-full object-cover" width={120} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-base font-bold text-ink truncate">{d.name}</h4>
                      <p className="text-xs font-semibold text-ember">{d.priceRange}</p>
                      <p className="text-[0.7rem] text-ink/60 truncate">{d.location}</p>
                    </div>
                  </div>
                  <p className="text-xs text-ink/70 line-clamp-2">{d.description}</p>
                  <div className="flex justify-end gap-2 border-t border-ink/10 pt-2.5">
                    <button
                      type="button"
                      onClick={() => handleEditDish(d)}
                      className="inline-flex items-center gap-1 rounded-lg bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest hover:bg-forest hover:text-white"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCulinaryItem(d.id)
                        onNotify(`Kuliner "${d.name}" dihapus.`)
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPERIENCES MANAGER */}
      {subTab === 'experiences' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                Pilihan Pengalaman Wisata (#experience)
              </span>
              <h2 className="font-display text-2xl font-semibold text-forest mt-1">
                {editingExpId ? `Edit Pengalaman: ${expLabel}` : 'Tambah Kategori Pengalaman Baru'}
              </h2>
            </div>

            <form onSubmit={handleSaveExp} className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Ikon Emoji *</label>
                <input
                  type="text"
                  required
                  value={expEmoji}
                  onChange={(e) => setExpEmoji(e.target.value)}
                  placeholder="🌿 / 📸 / 🍜"
                  className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Nama Pengalaman *</label>
                <input
                  type="text"
                  required
                  value={expLabel}
                  onChange={(e) => setExpLabel(e.target.value)}
                  placeholder="Contoh: Nature & Healing"
                  className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Deskripsi Singkat *</label>
                <input
                  type="text"
                  required
                  value={expBlurb}
                  onChange={(e) => setExpBlurb(e.target.value)}
                  placeholder="Contoh: Udara pegunungan sejuk, danau tenang, dan pemandian air panas alami."
                  className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                  Pilih Destinasi yang Direkomendasikan:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {destinations.map((d) => {
                    const active = expDests.includes(d.slug)
                    return (
                      <button
                        key={d.slug}
                        type="button"
                        onClick={() => toggleDestInExp(d.slug)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          active ? 'bg-forest text-white' : 'bg-cream text-ink/70 hover:bg-ink/10'
                        }`}
                      >
                        {d.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                  Pilih Paket Tour yang Direkomendasikan:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {packages.map((p) => {
                    const active = expPkgs.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePkgInExp(p.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          active ? 'bg-ember text-white' : 'bg-cream text-ink/70 hover:bg-ink/10'
                        }`}
                      >
                        {p.name} ({p.duration})
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="sm:col-span-3 flex gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingExpId ? 'Simpan Perubahan' : 'Tambahkan Pengalaman'}</span>
                </button>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={resetExpForm}
                    className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink/70"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-xl font-semibold text-forest">
              Daftar Kategori Pengalaman ({experiences.length})
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="rounded-2xl border border-ink/10 bg-cream/30 p-4 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-3xl">{exp.emoji}</span>
                    <h4 className="font-display text-base font-bold text-ink mt-2">{exp.label}</h4>
                    <p className="text-xs text-ink/65 mt-1">{exp.blurb}</p>
                  </div>
                  <div className="flex justify-end gap-1.5 pt-2 border-t border-ink/10">
                    <button
                      type="button"
                      onClick={() => handleEditExp(exp)}
                      className="rounded-lg bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest hover:bg-forest hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteExperienceItem(exp.id)
                        onNotify(`Pengalaman "${exp.label}" dihapus.`)
                      }}
                      className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. BANNERS & STORY PHOTOS MANAGER */}
      {subTab === 'banners' && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-ember">
              Foto Cerita Kami & Banner Ajakan Booking (#story & #booking)
            </span>
            <h2 className="font-display text-2xl font-semibold text-forest mt-1">
              Edit Gambar Cerita Kami & Banner Booking Bawah
            </h2>
          </div>

          <form onSubmit={handleSaveBanners} className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Foto Utama Seksi "Cerita Kami"
              </label>
              <select
                value={storyImage}
                onChange={(e) => setStoryImage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
              >
                {AVAILABLE_IMAGES.map((img) => (
                  <option key={img.file} value={img.file}>
                    {img.label} ({img.file})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Foto Kecil / Kerajinan Seksi "Cerita Kami"
              </label>
              <select
                value={storySecondaryImage}
                onChange={(e) => setStorySecondaryImage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
              >
                {AVAILABLE_IMAGES.map((img) => (
                  <option key={img.file} value={img.file}>
                    {img.label} ({img.file})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Eyebrow Banner Booking Bawah
              </label>
              <input
                type="text"
                value={bookingEyebrow}
                onChange={(e) => setBookingEyebrow(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Gambar Latar Banner Booking Bawah
              </label>
              <select
                value={bookingImage}
                onChange={(e) => setBookingImage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm text-ink"
              >
                {AVAILABLE_IMAGES.map((img) => (
                  <option key={img.file} value={img.file}>
                    {img.label} ({img.file})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Judul Utama Banner Booking Bawah
              </label>
              <input
                type="text"
                value={bookingTitle}
                onChange={(e) => setBookingTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Subjudul Banner Booking Bawah
              </label>
              <textarea
                rows={2}
                value={bookingSubtitle}
                onChange={(e) => setBookingSubtitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/20 p-3 text-sm text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-forest-700"
              >
                <Check className="h-4 w-4" />
                <span>Simpan Pengaturan Banner & Foto Cerita</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
