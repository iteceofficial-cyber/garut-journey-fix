import { useState, useRef } from 'react'
import {
  Video,
  Upload,
  Play,
  Check,
  Film,
  Image as ImageIcon,
} from 'lucide-react'
import { HERO_VIDEO_PRESETS, type HeroBgType, type HeroDarkness } from '@/lib/siteSettings'
import { persistMedia } from '@/lib/mediaStorage'

interface HeroVideoManagerProps {
  heroBgType: HeroBgType
  heroVideoUrl: string
  heroBgDarkness: HeroDarkness
  heroZoomEffect: boolean
  onUpdate: (data: {
    heroBgType?: HeroBgType
    heroVideoUrl?: string
    heroBgDarkness?: HeroDarkness
    heroZoomEffect?: boolean
  }) => void
  onNotify: (msg: string, isError?: boolean) => void
}

export function HeroVideoManager({
  heroBgType,
  heroVideoUrl,
  heroBgDarkness,
  heroZoomEffect,
  onUpdate,
  onNotify,
}: HeroVideoManagerProps) {
  const [videoFileUploading, setVideoFileUploading] = useState(false)
  const [customVideoInput, setCustomVideoInput] = useState('')
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      onNotify('File harus berformat video (MP4, WebM, MOV, atau OGG).', true)
      return
    }

    // Check size warning (above 80MB)
    const sizeInMb = file.size / (1024 * 1024)
    if (sizeInMb > 80) {
      onNotify('Ukuran video terlalu besar (> 80 MB). Disarankan menggunakan video berdurasi 5-15 detik di bawah 40 MB agar loading website cepat.', true)
      return
    }

    setVideoFileUploading(true)
    setUploadProgress(`Sedang memproses video "${file.name}" (${sizeInMb.toFixed(1)} MB)...`)

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        if (dataUrl) {
          // Persist to IndexedDB media vault
          await persistMedia('hero_custom_video', dataUrl)
          onUpdate({
            heroBgType: 'video',
            heroVideoUrl: dataUrl,
          })
          setUploadProgress(null)
          setVideoFileUploading(false)
          onNotify(`Video background "${file.name}" berhasil diunggah & diaktifkan sebagai latar header!`)
        }
      }
      reader.onerror = () => {
        setUploadProgress(null)
        setVideoFileUploading(false)
        onNotify('Gagal membaca file video dari perangkat.', true)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setUploadProgress(null)
      setVideoFileUploading(false)
      onNotify('Terjadi kesalahan saat memproses video.', true)
    }
  }

  const handleApplyPreset = (url: string, label: string) => {
    onUpdate({
      heroBgType: 'video',
      heroVideoUrl: url,
    })
    onNotify(`Preset video "${label}" berhasil diterapkan sebagai latar header!`)
  }

  const handleApplyUrl = () => {
    const trimmed = customVideoInput.trim()
    if (!trimmed) {
      onNotify('Silakan masukkan tautan URL video (MP4/WebM).', true)
      return
    }
    onUpdate({
      heroBgType: 'video',
      heroVideoUrl: trimmed,
    })
    setCustomVideoInput('')
    onNotify('Tautan video URL berhasil diterapkan sebagai latar header!')
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ember">
            <Film className="h-4 w-4" />
            <span>Format Latar Header Utama</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-forest mt-1">
            Media Latar Header (Foto vs Video Sinematik)
          </h3>
          <p className="text-xs text-ink/65 mt-0.5">
            Pilih apakah header utama beranda menggunakan foto pemandangan Garut atau video sinematik bergerak yang diunggah admin.
          </p>
        </div>

        {/* Media Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-cream/60 p-1.5 border border-ink/10 shrink-0">
          <button
            type="button"
            onClick={() => onUpdate({ heroBgType: 'image' })}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              heroBgType === 'image'
                ? 'bg-forest text-white shadow-sm'
                : 'text-ink/70 hover:text-ink hover:bg-white/60'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Foto Background</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ heroBgType: 'video' })}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              heroBgType === 'video'
                ? 'bg-forest text-white shadow-sm'
                : 'text-ink/70 hover:text-ink hover:bg-white/60'
            }`}
          >
            <Video className="h-3.5 w-3.5 text-ember-400" />
            <span>Video Sinematik</span>
          </button>
        </div>
      </div>

      {heroBgType === 'video' && (
        <div className="space-y-6 animate-fade-in">
          {/* Active Video Live Preview */}
          <div className="rounded-2xl border border-ink/10 bg-ink p-4 text-cream">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold flex items-center gap-2 text-ember">
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Pratinjau Video Header Aktif Saat Ini</span>
              </span>
              <span className="text-[0.7rem] text-cream/60 font-mono truncate max-w-xs">
                {heroVideoUrl.startsWith('data:') ? 'Video Uploaded (Base64/Local Storage)' : heroVideoUrl}
              </span>
            </div>

            <div className="relative aspect-[16/9] max-h-72 w-full overflow-hidden rounded-xl bg-black/60 border border-white/10">
              <video
                key={heroVideoUrl}
                src={heroVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-[0.68rem] text-cream/60">
              Video akan otomatis berputar berulang (loop), tanpa suara (muted), dan responsive di semua layar desktop & smartphone.
            </p>
          </div>

          {/* Upload Video File Directly */}
          <div className="rounded-2xl border border-dashed border-forest/30 bg-forest/5 p-5 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-base font-bold text-forest flex items-center gap-2">
                  <Upload className="h-4 w-4 text-ember" />
                  <span>Unggah File Video Dari Perangkat (HP / Laptop)</span>
                </h4>
                <p className="text-xs text-ink/70 mt-1 max-w-lg">
                  Pilih file video MP4 atau WebM dari galeri perangkat Anda. Video akan langsung disimpan dan tampil di latar atas header.
                </p>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={videoFileUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-forest-700 transition disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{videoFileUploading ? 'Mengunggah...' : 'Pilih File Video'}</span>
                </button>
              </div>
            </div>

            {uploadProgress && (
              <div className="rounded-xl bg-forest/10 p-3 text-xs font-semibold text-forest flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-forest border-t-transparent animate-spin" />
                <span>{uploadProgress}</span>
              </div>
            )}
          </div>

          {/* Custom Video URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
              Atau Gunakan Tautan URL Video Eksternal (CDN / Cloudinary / MP4 Direct Link)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customVideoInput}
                onChange={(e) => setCustomVideoInput(e.target.value)}
                placeholder="https://example.com/assets/video-garut.mp4"
                className="flex-1 rounded-xl border border-ink/20 bg-cream/30 px-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest-700 transition shrink-0"
              >
                Terapkan URL
              </button>
            </div>
          </div>

          {/* Preset Scenic Videos */}
          <div className="space-y-3 pt-3 border-t border-ink/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
              Pilihan Koleksi Video Alam Sinematik Rekomendasi (Garut Highland Presets):
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HERO_VIDEO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.url, preset.label)}
                  className={`cursor-pointer rounded-2xl border-2 p-3 transition flex flex-col justify-between gap-2.5 ${
                    heroVideoUrl === preset.url
                      ? 'border-forest bg-forest/5 shadow-md'
                      : 'border-ink/10 bg-white hover:border-forest/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-ink">{preset.label}</span>
                      {heroVideoUrl === preset.url && (
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-forest text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-[0.68rem] text-ink/65 leading-tight">{preset.desc}</p>
                  </div>
                  <span className="inline-block text-[0.65rem] font-bold text-forest">
                    {heroVideoUrl === preset.url ? '✓ Sedang Digunakan' : 'Klik Untuk Terapkan'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay Darkness & Zoom Motion for Video */}
          <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-ink/10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                Tingkat Kegelapan Latar Header (Darkness Overlay)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'light', label: 'Light', desc: 'Video Terang' },
                    { id: 'medium', label: 'Medium', desc: 'Seimbang' },
                    { id: 'dark', label: 'Dark', desc: 'Kontras Tinggi' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onUpdate({ heroBgDarkness: d.id })}
                    className={`rounded-xl p-2.5 text-center text-xs border transition ${
                      heroBgDarkness === d.id
                        ? 'border-forest bg-forest text-white font-bold shadow-sm'
                        : 'border-ink/15 bg-white text-ink/75 hover:bg-cream/50'
                    }`}
                  >
                    <span className="block font-bold">{d.label}</span>
                    <span className="text-[0.6rem] block opacity-80">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                Efek Gerak Latar (Zoom Motion)
              </label>
              <button
                type="button"
                onClick={() => onUpdate({ heroZoomEffect: !heroZoomEffect })}
                className={`w-full rounded-xl p-2.5 text-xs font-bold border transition flex items-center justify-between ${
                  heroZoomEffect
                    ? 'border-forest bg-forest/10 text-forest'
                    : 'border-ink/15 bg-white text-ink/65 hover:bg-cream/40'
                }`}
              >
                <span>Efek Sinematik Slow-Zoom</span>
                <span className="text-[0.7rem]">{heroZoomEffect ? '✓ Aktif' : 'Nonaktif'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
