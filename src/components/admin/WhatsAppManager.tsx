import { useState } from 'react'
import {
  Clock,
  ExternalLink,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react'
import { useSiteSettings, type SiteSettings } from '@/lib/siteSettings'
import { Img } from '@/components/Img'
import { WhatsAppIcon } from '@/components/WhatsAppFab'

interface WhatsAppManagerProps {
  onNotify: (msg: string) => void
}

const PRESET_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', label: 'Pria Tour Guide Ramah' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', label: 'Wanita CS Profesional' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', label: 'Pria Konsultan Wisata' },
  { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', label: 'Wanita Hospitality Specialist' },
]

export function WhatsAppManager({ onNotify }: WhatsAppManagerProps) {
  const { settings, saveSiteSettings } = useSiteSettings()
  const [form, setForm] = useState<SiteSettings>(settings)
  const [newQuickReply, setNewQuickReply] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdate = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddQuickReply = () => {
    if (!newQuickReply.trim()) return
    const current = form.whatsappQuickReplies || []
    setForm((prev) => ({
      ...prev,
      whatsappQuickReplies: [...current, newQuickReply.trim()],
    }))
    setNewQuickReply('')
  }

  const handleRemoveQuickReply = (index: number) => {
    const current = form.whatsappQuickReplies || []
    setForm((prev) => ({
      ...prev,
      whatsappQuickReplies: current.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await saveSiteSettings(form)
      onNotify('Pengaturan Chat WhatsApp berhasil disimpan!')
    } catch {
      onNotify('Gagal menyimpan pengaturan WhatsApp.')
    } finally {
      setIsSaving(false)
    }
  }

  const testLink = `https://wa.me/${form.whatsappDigits || '6285156456791'}?text=${encodeURIComponent(
    form.whatsappDefaultMessage || 'Halo Garut Journey!'
  )}`

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#25D366] flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" /> Pengaturan Komunikasi Pelanggan
          </span>
          <h2 className="font-display text-2xl font-bold text-ink mt-1">
            Pengaturan Chat WhatsApp &amp; Widget
          </h2>
          <p className="text-xs text-ink/65">
            Kelola nomor tujuan, identitas Customer Service, jam operasional, dan pesan cepat untuk client.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={testLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-[#1ebd59] transition"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Tes Chat WhatsApp</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          {/* Card 1: Nomor & Kontak WhatsApp */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-base font-bold text-forest flex items-center gap-2">
              <Phone className="h-4 w-4 text-ember" /> Kontak WhatsApp Resmi
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Nomor WhatsApp Display
                </label>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) => handleUpdate('whatsapp', e.target.value)}
                  placeholder="+62 851-5645-6791"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-forest focus:outline-none"
                />
                <p className="mt-1 text-[0.68rem] text-ink/50">Teks nomor yang tampil di halaman website.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Nomor WhatsApp Link (Hanya Angka) *
                </label>
                <input
                  type="text"
                  required
                  value={form.whatsappDigits}
                  onChange={(e) => handleUpdate('whatsappDigits', e.target.value.replace(/\D/g, ''))}
                  placeholder="6285156456791"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none"
                />
                <p className="mt-1 text-[0.68rem] text-ink/50">Format internasional tanpa tanda plus (awali 628...).</p>
              </div>
            </div>
          </div>

          {/* Card 2: Identitas CS */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-base font-bold text-forest flex items-center gap-2">
              <User className="h-4 w-4 text-ember" /> Identitas Customer Support (CS)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Nama Petugas CS
                </label>
                <input
                  type="text"
                  value={form.whatsappCsName || ''}
                  onChange={(e) => handleUpdate('whatsappCsName', e.target.value)}
                  placeholder="Kang Fahmi"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Peran / Jabatan CS
                </label>
                <input
                  type="text"
                  value={form.whatsappCsRole || ''}
                  onChange={(e) => handleUpdate('whatsappCsRole', e.target.value)}
                  placeholder="Senior Tour Specialist Garut"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Jam Operasional &amp; Status Online
              </label>
              <input
                type="text"
                value={form.whatsappWorkingHours || ''}
                onChange={(e) => handleUpdate('whatsappWorkingHours', e.target.value)}
                placeholder="07:30 - 21:00 WIB (Online Setiap Hari)"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-forest focus:outline-none"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                Foto Avatar Profil CS
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.url}
                    type="button"
                    onClick={() => handleUpdate('whatsappCsAvatar', av.url)}
                    className={`rounded-2xl p-2 border text-center transition flex flex-col items-center ${
                      form.whatsappCsAvatar === av.url
                        ? 'border-forest bg-forest/5 ring-2 ring-forest'
                        : 'border-ink/10 hover:border-ink/30'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-full overflow-hidden mb-1.5">
                      <Img file={av.url} alt="" className="h-full w-full object-cover" width={80} />
                    </div>
                    <span className="text-[0.68rem] font-medium text-ink/75 truncate w-full">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Pesan Sapaan & Pertanyaan Cepat */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-base font-bold text-forest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ember" /> Pesan Sapaan &amp; Quick Replies
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Pesan Balon Sapaan Otomatis di Popover
              </label>
              <textarea
                rows={2}
                value={form.whatsappGreeting || ''}
                onChange={(e) => handleUpdate('whatsappGreeting', e.target.value)}
                placeholder="Sampurasun! Ada yang bisa kami bantu seputar destinasi atau custom tour di Garut?"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Pesan Default Saat Membuka WhatsApp
              </label>
              <textarea
                rows={2}
                value={form.whatsappDefaultMessage || ''}
                onChange={(e) => handleUpdate('whatsappDefaultMessage', e.target.value)}
                placeholder="Halo Garut Journey! Saya ingin konsultasi jadwal dan pilihan paket wisata Garut."
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white p-3 text-xs text-ink focus:border-forest focus:outline-none"
              />
            </div>

            {/* Quick Replies Manager */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                Daftar Pertanyaan Cepat (Quick Reply Buttons)
              </label>
              <div className="space-y-2">
                {(form.whatsappQuickReplies || []).map((reply, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-xl bg-cream/50 px-3 py-2 border border-ink/5 text-xs"
                  >
                    <span className="font-medium text-ink">{reply}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuickReply(idx)}
                      className="text-ink/40 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newQuickReply}
                    onChange={(e) => setNewQuickReply(e.target.value)}
                    placeholder="Tambah pertanyaan cepat baru..."
                    className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuickReply}
                    className="rounded-xl bg-forest px-3 py-2 text-xs font-semibold text-white hover:bg-forest-700 transition"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Tampilan & Posisi Widget */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-ink/5 space-y-4">
            <h3 className="font-display text-base font-bold text-forest">
              Tampilan Tombol Floating FAB
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-ink/10 cursor-pointer hover:bg-cream/40">
                <input
                  type="checkbox"
                  checked={form.whatsappShowFab !== false}
                  onChange={(e) => handleUpdate('whatsappShowFab', e.target.checked)}
                  className="rounded text-forest focus:ring-forest"
                />
                <div>
                  <span className="block text-xs font-bold text-ink">Tampilkan Tombol</span>
                  <span className="text-[0.68rem] text-ink/50">Floating button aktif</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-ink/10 cursor-pointer hover:bg-cream/40">
                <input
                  type="checkbox"
                  checked={form.whatsappPulseEffect !== false}
                  onChange={(e) => handleUpdate('whatsappPulseEffect', e.target.checked)}
                  className="rounded text-forest focus:ring-forest"
                />
                <div>
                  <span className="block text-xs font-bold text-ink">Efek Pulse Ring</span>
                  <span className="text-[0.68rem] text-ink/50">Animasi berdenyut</span>
                </div>
              </label>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                  Posisi Tombol
                </label>
                <select
                  value={form.whatsappFabPosition || 'right'}
                  onChange={(e) => handleUpdate('whatsappFabPosition', e.target.value as any)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-forest focus:outline-none"
                >
                  <option value="right">Kanan Bawah (Default)</option>
                  <option value="left">Kiri Bawah</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-2xl bg-forest py-3.5 text-sm font-bold text-white shadow-soft hover:bg-forest-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan Pengaturan...' : 'Simpan Semua Pengaturan WhatsApp'}
          </button>
        </div>

        {/* Right: Live Interactive Widget Preview */}
        <div className="space-y-4">
          <div className="sticky top-24">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2">
              Pratinjau Live Widget Chat:
            </span>

            <div className="rounded-3xl bg-gradient-to-b from-forest/10 to-cream p-4 border border-ink/10 shadow-lift">
              <div className="rounded-2xl bg-white shadow-xl overflow-hidden border border-ink/10">
                {/* Simulated Header */}
                <div className="bg-forest px-4 py-3 text-cream flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-forest-700">
                      <Img
                        file={form.whatsappCsAvatar || PRESET_AVATARS[0].url}
                        alt=""
                        className="h-full w-full object-cover"
                        width={80}
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-1 ring-forest" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{form.whatsappCsName || 'Kang Fahmi'}</h4>
                      <p className="text-[0.65rem] text-cream/75">{form.whatsappCsRole || 'Tour Specialist'}</p>
                      <p className="text-[0.62rem] text-cream/60 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {form.whatsappWorkingHours || '07:30 - 21:00 WIB'}
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-cream">
                    CS
                  </span>
                </div>

                {/* Simulated Bubble */}
                <div className="p-3 bg-cream/30 space-y-2.5">
                  <div className="rounded-xl rounded-tl-sm bg-white p-3 shadow-xs border border-ink/5 text-xs text-ink/80 leading-relaxed">
                    <p className="font-semibold text-forest text-[0.68rem] mb-0.5">
                      {form.whatsappCsName || 'Kang Fahmi'}
                    </p>
                    {form.whatsappGreeting || 'Sampurasun! Ada yang bisa kami bantu?'}
                  </div>

                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/40 block mb-1">
                      Pertanyaan Cepat:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(form.whatsappQuickReplies || []).slice(0, 3).map((r, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-forest border border-forest/20 shadow-xs"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Input */}
                <div className="p-2.5 bg-white border-t border-ink/5 flex items-center gap-1.5">
                  <div className="flex-1 rounded-full bg-cream-200/50 px-3 py-1.5 text-[0.7rem] text-ink/40">
                    Ketik pesan ke WhatsApp...
                  </div>
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-[#25D366] text-white">
                    <Send className="h-3 w-3" />
                  </div>
                </div>
              </div>

              {/* Floating button preview */}
              <div className="mt-4 flex justify-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-white shadow-soft text-xs font-bold">
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Chat WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
