import { useState, useEffect } from 'react'
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck,
  Landmark,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  RotateCcw,
  ExternalLink,
  Award,
} from 'lucide-react'
import { useCompanyProfile, type CompanyProfileData } from '@/lib/companyStorage'
import { COMPANY_PROFILE } from '@/data/company'

export function CompanyLegalManager({ onNotify }: { onNotify?: (msg: string, isError?: boolean) => void }) {
  const { profile, saveCompanyProfile, loading } = useCompanyProfile()
  const [formData, setFormData] = useState<CompanyProfileData>(profile)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Sync state when profile is loaded or changes remotely
  useEffect(() => {
    setFormData(profile)
  }, [profile])

  const handleFieldChange = (field: keyof CompanyProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStatChange = (key: keyof CompanyProfileData['stats'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: value,
      },
    }))
  }

  // Bank Accounts Management
  const handleBankChange = (index: number, field: string, val: string) => {
    const list = [...formData.bankAccounts]
    list[index] = { ...list[index], [field]: val }
    setFormData((prev) => ({ ...prev, bankAccounts: list }))
  }

  const handleAddBank = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        {
          bank: 'Bank Baru',
          accountNumber: '123-456-7890',
          accountName: prev.legalName || 'PT GARUT PESONA JELAJAH',
          logoText: 'BANK',
        },
      ],
    }))
  }

  const handleRemoveBank = (index: number) => {
    if (formData.bankAccounts.length <= 1) {
      onNotify?.('Minimal harus ada 1 rekening bank resmi.', true)
      setErrorMsg('Minimal harus ada 1 rekening bank resmi.')
      return
    }
    const list = formData.bankAccounts.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, bankAccounts: list }))
  }

  // Mission list
  const handleMissionChange = (index: number, text: string) => {
    const list = [...formData.mission]
    list[index] = text
    setFormData((prev) => ({ ...prev, mission: list }))
  }

  const handleAddMission = () => {
    setFormData((prev) => ({
      ...prev,
      mission: [...prev.mission, 'Poin misi baru perusahan...'],
    }))
  }

  const handleRemoveMission = (index: number) => {
    const list = formData.mission.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, mission: list }))
  }

  // Terms & Conditions list
  const handleTermChange = (index: number, text: string) => {
    const list = [...(formData.termsAndConditions || [])]
    list[index] = text
    setFormData((prev) => ({ ...prev, termsAndConditions: list }))
  }

  const handleAddTerm = () => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [
        ...(prev.termsAndConditions || []),
        'Ketentuan perjalanan baru (silakan sesuaikan isi syarat & ketentuan)...',
      ],
    }))
  }

  const handleRemoveTerm = (index: number) => {
    const list = (formData.termsAndConditions || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, termsAndConditions: list }))
  }

  // Submit save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      const ok = await saveCompanyProfile(formData)
      if (ok) {
        setSavedSuccess(true)
        onNotify?.('Berhasil! Dokumen Legalitas, Pengaturan DP, dan Syarat & Ketentuan Trip telah disimpan.')
        setTimeout(() => setSavedSuccess(false), 4000)
      } else {
        setErrorMsg('Gagal menyimpan dokumen legalitas perusahaan.')
        onNotify?.('Gagal menyimpan dokumen legalitas dan syarat ketentuan trip.', true)
      }
    } catch {
      setErrorMsg('Gagal menyimpan dokumen legalitas perusahaan ke Firestore.')
      onNotify?.('Gagal menyimpan dokumen legalitas dan syarat ketentuan trip.', true)
    }
  }

  const handleResetToDefault = () => {
    setFormData(COMPANY_PROFILE)
    void saveCompanyProfile(COMPANY_PROFILE)
    setSavedSuccess(true)
    onNotify?.('Berhasil! Data legalitas dan Syarat & Ketentuan Trip dikembalikan ke default.')
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest via-forest-700 to-ink p-6 sm:p-8 text-cream shadow-lift relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-ember/20 text-ember-300 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-ember/30 flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-ember-400" />
                <span>Dokumen Resmi & Akreditasi Biro Wisata</span>
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-white">
              Kelola Dokumen Legalitas &amp; Profil Perusahaan
            </h2>
            <p className="text-xs sm:text-sm text-cream/80 max-w-2xl mt-1.5">
              Edit data legalitas PT resmi, Nomor Induk Berusaha (NIB), SK Kemenkumham, keanggotaan ASITA, lisensi HPI, rekening bank resmi anti-penipuan, dan profil perusahaan yang tampil di landing page dan kwitansi invoice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream px-3.5 py-2.5 text-xs font-semibold border border-white/15 transition"
              title="Reset ke data template"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Default</span>
            </button>
            <a
              href="/#company-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream px-3.5 py-2.5 text-xs font-semibold border border-white/15 transition"
            >
              <span>Lihat di Web</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Success & Error Toasts */}
      {savedSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 shadow-soft animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold">Dokumen Legalitas Berhasil Diperbarui!</p>
            <p className="text-xs text-emerald-700">
              Data legalitas PT telah tersimpan permanen ke Cloud Firestore dan langsung aktif di halaman web serta berkas kwitansi PDF.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Identitas Badan Hukum & PT */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                01 &bull; Badan Hukum &amp; Identitas PT
              </span>
              <h3 className="font-display text-xl font-semibold text-forest mt-1">
                Profil Badan Usaha Perseroan Terbatas
              </h3>
            </div>
            <Building2 className="h-6 w-6 text-forest/40" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Nama Resmi Badan Usaha / PT *
              </label>
              <input
                type="text"
                required
                value={formData.legalName}
                onChange={(e) => handleFieldChange('legalName', e.target.value)}
                placeholder="Contoh: PT GARUT PESONA JELAJAH NUSANTARA"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-cream/10 px-4 py-2.5 text-xs text-ink font-bold focus:border-forest focus:outline-none"
              />
              <p className="mt-1 text-[0.65rem] text-ink/50">
                Ditampilkan pada badge resmi header profil, footer & kwitansi invoice.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Nama Merek / Brand Komersial *
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => handleFieldChange('brandName', e.target.value)}
                placeholder="Garut Journey"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-cream/10 px-4 py-2.5 text-xs text-ink font-semibold focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Tagline / Slogan Resmi
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                placeholder="Explore Garut, Feel the Story."
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Tahun Berdiri / Pengalaman
              </label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => handleFieldChange('establishedYear', Number(e.target.value))}
                placeholder="2014"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink focus:border-forest focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Dokumen Legalitas & Izin Operasional */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                02 &bull; Dokumen Legalitas &amp; Perizinan
              </span>
              <h3 className="font-display text-xl font-semibold text-forest mt-1">
                Kelola Legalitas, SK &amp; Keanggotaan Asosiasi
              </h3>
              <p className="text-xs text-ink/65 mt-1">
                Sesuaikan dokumen legalitas yang dimiliki saat ini. Dokumen yang dinonaktifkan atau kosong otomatis <strong>tidak akan ditampilkan</strong> di website publik.
              </p>
            </div>
            <ShieldCheck className="h-6 w-6 text-ember" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* 1. NIB */}
            <div className={`rounded-2xl border p-4 space-y-3 transition ${
              formData.nibEnabled !== false ? 'border-ink/15 bg-cream/20' : 'border-ink/10 bg-zinc-50 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-forest">
                  <BadgeCheck className="h-4 w-4 text-ember shrink-0" />
                  <span>Nomor Induk Berusaha (NIB)</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.nibEnabled !== false}
                    onChange={(e) => handleFieldChange('nibEnabled', e.target.checked)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className={formData.nibEnabled !== false ? 'text-forest' : 'text-ink/40'}>
                    {formData.nibEnabled !== false ? 'Tampilkan' : 'Sembunyikan'}
                  </span>
                </label>
              </div>

              <input
                type="text"
                value={formData.nib || ''}
                onChange={(e) => handleFieldChange('nib', e.target.value)}
                placeholder="Nomor NIB dan KBLI (kosongkan jika belum ada)..."
                disabled={formData.nibEnabled === false}
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none disabled:bg-zinc-100"
              />

              <div className="flex items-center justify-between text-[0.7rem]">
                <span className="text-ink/60">Status Dokumen:</span>
                <select
                  value={formData.nibStatus || 'aktif'}
                  onChange={(e) => handleFieldChange('nibStatus', e.target.value)}
                  disabled={formData.nibEnabled === false}
                  className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-xs text-ink font-semibold"
                >
                  <option value="aktif">Terbit & Aktif</option>
                  <option value="proses">Dalam Proses Pengajuan</option>
                  <option value="none">Belum Tersedia</option>
                </select>
              </div>
            </div>

            {/* 2. SK Kemenkumham */}
            <div className={`rounded-2xl border p-4 space-y-3 transition ${
              formData.skKemenkumhamEnabled !== false ? 'border-ink/15 bg-cream/20' : 'border-ink/10 bg-zinc-50 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-forest">
                  <BadgeCheck className="h-4 w-4 text-ember shrink-0" />
                  <span>SK Pengesahan Kemenkumham RI</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skKemenkumhamEnabled !== false}
                    onChange={(e) => handleFieldChange('skKemenkumhamEnabled', e.target.checked)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className={formData.skKemenkumhamEnabled !== false ? 'text-forest' : 'text-ink/40'}>
                    {formData.skKemenkumhamEnabled !== false ? 'Tampilkan' : 'Sembunyikan'}
                  </span>
                </label>
              </div>

              <input
                type="text"
                value={formData.skKemenkumham || ''}
                onChange={(e) => handleFieldChange('skKemenkumham', e.target.value)}
                placeholder="AHU-0038912.AH.01.01.TAHUN 2020 (opsional)..."
                disabled={formData.skKemenkumhamEnabled === false}
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none disabled:bg-zinc-100"
              />

              <div className="flex items-center justify-between text-[0.7rem]">
                <span className="text-ink/60">Status Dokumen:</span>
                <select
                  value={formData.skKemenkumhamStatus || 'aktif'}
                  onChange={(e) => handleFieldChange('skKemenkumhamStatus', e.target.value)}
                  disabled={formData.skKemenkumhamEnabled === false}
                  className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-xs text-ink font-semibold"
                >
                  <option value="aktif">Terbit & Aktif</option>
                  <option value="proses">Dalam Proses Pengajuan</option>
                  <option value="none">Belum Tersedia</option>
                </select>
              </div>
            </div>

            {/* 3. Izin Kemenparekraf / TDUP */}
            <div className={`rounded-2xl border p-4 space-y-3 transition ${
              formData.izinKemenparekrafEnabled !== false ? 'border-ink/15 bg-cream/20' : 'border-ink/10 bg-zinc-50 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-forest">
                  <Award className="h-4 w-4 text-ember shrink-0" />
                  <span>Izin Kemenparekraf / TDUP</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.izinKemenparekrafEnabled !== false}
                    onChange={(e) => handleFieldChange('izinKemenparekrafEnabled', e.target.checked)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className={formData.izinKemenparekrafEnabled !== false ? 'text-forest' : 'text-ink/40'}>
                    {formData.izinKemenparekrafEnabled !== false ? 'Tampilkan' : 'Sembunyikan'}
                  </span>
                </label>
              </div>

              <input
                type="text"
                value={formData.izinKemenparekraf || ''}
                onChange={(e) => handleFieldChange('izinKemenparekraf', e.target.value)}
                placeholder="IZIN-TDUP/GRT/2021/0084 (opsional)..."
                disabled={formData.izinKemenparekrafEnabled === false}
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs font-mono text-ink focus:border-forest focus:outline-none disabled:bg-zinc-100"
              />

              <div className="flex items-center justify-between text-[0.7rem]">
                <span className="text-ink/60">Status Dokumen:</span>
                <select
                  value={formData.izinKemenparekrafStatus || 'aktif'}
                  onChange={(e) => handleFieldChange('izinKemenparekrafStatus', e.target.value)}
                  disabled={formData.izinKemenparekrafEnabled === false}
                  className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-xs text-ink font-semibold"
                >
                  <option value="aktif">Terbit & Aktif</option>
                  <option value="proses">Dalam Proses Pengajuan</option>
                  <option value="none">Belum Tersedia</option>
                </select>
              </div>
            </div>

            {/* 4. Keanggotaan ASITA */}
            <div className={`rounded-2xl border p-4 space-y-3 transition ${
              formData.asitaMembershipEnabled !== false ? 'border-ink/15 bg-cream/20' : 'border-ink/10 bg-zinc-50 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-forest">
                  <Award className="h-4 w-4 text-ember shrink-0" />
                  <span>Keanggotaan ASITA</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.asitaMembershipEnabled !== false}
                    onChange={(e) => handleFieldChange('asitaMembershipEnabled', e.target.checked)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className={formData.asitaMembershipEnabled !== false ? 'text-forest' : 'text-ink/40'}>
                    {formData.asitaMembershipEnabled !== false ? 'Tampilkan' : 'Sembunyikan'}
                  </span>
                </label>
              </div>

              <input
                type="text"
                value={formData.asitaMembership || ''}
                onChange={(e) => handleFieldChange('asitaMembership', e.target.value)}
                placeholder="ASITA DPC Garut No. 031/ASITA-GRT/2021 (opsional)..."
                disabled={formData.asitaMembershipEnabled === false}
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs text-ink focus:border-forest focus:outline-none disabled:bg-zinc-100"
              />

              <div className="flex items-center justify-between text-[0.7rem]">
                <span className="text-ink/60">Status Keanggotaan:</span>
                <select
                  value={formData.asitaMembershipStatus || 'aktif'}
                  onChange={(e) => handleFieldChange('asitaMembershipStatus', e.target.value)}
                  disabled={formData.asitaMembershipEnabled === false}
                  className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-xs text-ink font-semibold"
                >
                  <option value="aktif">Anggota Aktif Resmi</option>
                  <option value="proses">Proses Registrasi Keanggotaan</option>
                  <option value="none">Belum Menjadi Anggota</option>
                </select>
              </div>
            </div>

            {/* 5. Kemitraan HPI */}
            <div className={`rounded-2xl border p-4 space-y-3 sm:col-span-2 transition ${
              formData.hpiPartnershipEnabled !== false ? 'border-ink/15 bg-cream/20' : 'border-ink/10 bg-zinc-50 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-forest">
                  <BadgeCheck className="h-4 w-4 text-ember shrink-0" />
                  <span>Kemitraan Resmi Pemandu HPI (Himpunan Pramuwisata Indonesia)</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hpiPartnershipEnabled !== false}
                    onChange={(e) => handleFieldChange('hpiPartnershipEnabled', e.target.checked)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className={formData.hpiPartnershipEnabled !== false ? 'text-forest' : 'text-ink/40'}>
                    {formData.hpiPartnershipEnabled !== false ? 'Tampilkan' : 'Sembunyikan'}
                  </span>
                </label>
              </div>

              <input
                type="text"
                value={formData.hpiPartnership || ''}
                onChange={(e) => handleFieldChange('hpiPartnership', e.target.value)}
                placeholder="Mitra Resmi DPC HPI Garut (Guide Berlisensi BNSP)..."
                disabled={formData.hpiPartnershipEnabled === false}
                className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs text-ink focus:border-forest focus:outline-none disabled:bg-zinc-100"
              />
            </div>
          </div>

          {/* Dokumen Tambahan Kustom */}
          <div className="pt-4 border-t border-ink/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold text-forest">
                  Dokumen Legalitas Tambahan (NPWP, Domisili, CHSE, dll.)
                </h4>
                <p className="text-[0.7rem] text-ink/60">
                  Tambahkan dokumen legalitas lain yang Anda miliki sebagai bukti keabsahan usaha.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentDocs = formData.customLegalDocs || []
                  setFormData((prev) => ({
                    ...prev,
                    customLegalDocs: [
                      ...currentDocs,
                      {
                        id: `doc-${Date.now()}`,
                        title: 'NPWP Perusahaan / Surat Keterangan Domisili',
                        number: 'Nomor Dokumen Resmi',
                        enabled: true,
                        status: 'aktif',
                        notes: '',
                      },
                    ],
                  }))
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-white px-3 py-1.5 text-xs font-bold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Dokumen</span>
              </button>
            </div>

            {formData.customLegalDocs && formData.customLegalDocs.length > 0 && (
              <div className="space-y-3">
                {formData.customLegalDocs.map((docItem, idx) => (
                  <div key={docItem.id} className="rounded-2xl border border-ink/10 bg-white p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={docItem.title}
                        onChange={(e) => {
                          const updated = [...(formData.customLegalDocs || [])]
                          updated[idx] = { ...updated[idx], title: e.target.value }
                          setFormData((prev) => ({ ...prev, customLegalDocs: updated }))
                        }}
                        placeholder="Nama Dokumen (misal: NPWP Badan)"
                        className="font-bold text-xs text-forest border-b border-dashed border-ink/20 pb-0.5 focus:outline-none"
                      />
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1 text-[0.7rem] font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={docItem.enabled}
                            onChange={(e) => {
                              const updated = [...(formData.customLegalDocs || [])]
                              updated[idx] = { ...updated[idx], enabled: e.target.checked }
                              setFormData((prev) => ({ ...prev, customLegalDocs: updated }))
                            }}
                            className="rounded text-forest focus:ring-forest"
                          />
                          <span>{docItem.enabled ? 'Aktif' : 'Nonaktif'}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.customLegalDocs || []).filter((_, i) => i !== idx)
                            setFormData((prev) => ({ ...prev, customLegalDocs: updated }))
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Hapus dokumen ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        value={docItem.number}
                        onChange={(e) => {
                          const updated = [...(formData.customLegalDocs || [])]
                          updated[idx] = { ...updated[idx], number: e.target.value }
                          setFormData((prev) => ({ ...prev, customLegalDocs: updated }))
                        }}
                        placeholder="Nomor Surat / Sertifikat..."
                        className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-mono font-bold text-ink"
                      />
                      <input
                        type="text"
                        value={docItem.notes || ''}
                        onChange={(e) => {
                          const updated = [...(formData.customLegalDocs || [])]
                          updated[idx] = { ...updated[idx], notes: e.target.value }
                          setFormData((prev) => ({ ...prev, customLegalDocs: updated }))
                        }}
                        placeholder="Catatan / Lembaga Penerbit (opsional)"
                        className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs text-ink/70"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Rekening Bank Resmi (Anti-Penipuan) */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                03 &bull; Rekening Bank Resmi Perusahaan
              </span>
              <h3 className="font-display text-xl font-semibold text-forest mt-1">
                Rekening Penerimaan Resmi (Anti-Penipuan Wisata)
              </h3>
              <p className="text-xs text-ink/65 mt-1">
                Tampil di kartu keamanan landing page untuk memastikan transfer konsumen hanya ke rekening sah perusahaan.
              </p>
            </div>
            <Landmark className="h-6 w-6 text-forest/40" />
          </div>

          <div className="space-y-4">
            {formData.bankAccounts.map((acc, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-ink/10 bg-cream/15 p-4 grid gap-3 sm:grid-cols-[1.5fr_1.5fr_1.5fr_auto] sm:items-center"
              >
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-ink/50">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={acc.bank}
                    onChange={(e) => handleBankChange(idx, 'bank', e.target.value)}
                    placeholder="BCA, Mandiri, BRI, BNI..."
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-ink/50">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={acc.accountNumber}
                    onChange={(e) => handleBankChange(idx, 'accountNumber', e.target.value)}
                    placeholder="148-092-8811"
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-mono font-bold text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-ink/50">
                    Atas Nama Rekening
                  </label>
                  <input
                    type="text"
                    value={acc.accountName}
                    onChange={(e) => handleBankChange(idx, 'accountName', e.target.value)}
                    placeholder="PT GARUT PESONA JELAJAH"
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="flex sm:justify-center pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveBank(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                    title="Hapus rekening"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddBank}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 px-4 py-2.5 text-xs font-bold text-forest hover:border-forest hover:bg-forest/5 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Rekening Bank Resmi</span>
            </button>
          </div>
        </div>

        {/* Section 4: Metrik Statistik Perusahaan */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-ember">
              04 &bull; Angka Statistik Reputasi
            </span>
            <h3 className="font-display text-xl font-semibold text-forest mt-1">
              Statistik Strip di Profil Perusahaan
            </h3>
            <p className="text-xs text-ink/65 mt-1">
              Angka pencapaian wisatawan, kepuasan, dan mitra yang tampil di baris atas profil.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Wisatawan Terlayani
              </label>
              <input
                type="number"
                value={formData.stats.travelersServed}
                onChange={(e) => handleStatChange('travelersServed', Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink font-bold focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Tingkat Kepuasan Tamu
              </label>
              <input
                type="text"
                value={formData.stats.satisfactionRate}
                onChange={(e) => handleStatChange('satisfactionRate', e.target.value)}
                placeholder="99.4%"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink font-bold focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Tahun Pengalaman
              </label>
              <input
                type="number"
                value={formData.stats.yearsExperience}
                onChange={(e) => handleStatChange('yearsExperience', Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink font-bold focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Mitra UMKM Binaan
              </label>
              <input
                type="number"
                value={formData.stats.umkmPartners}
                onChange={(e) => handleStatChange('umkmPartners', Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-xs text-ink font-bold focus:border-forest focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Visi & Misi Perusahaan */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-ember">
              05 &bull; Visi &amp; Misi Perusahaan
            </span>
            <h3 className="font-display text-xl font-semibold text-forest mt-1">
              Visi &amp; Butir Misi Perusahaan
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Visi Perusahaan:
            </label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => handleFieldChange('vision', e.target.value)}
              className="w-full rounded-2xl border border-ink/15 bg-white p-3.5 text-xs text-ink focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
              Daftar Misi Perusahaan:
            </label>
            <div className="space-y-2.5">
              {formData.mission.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-forest text-[0.65rem] font-bold text-cream shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => handleMissionChange(idx, e.target.value)}
                    className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMission(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddMission}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-ink/15 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest/5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Misi</span>
            </button>
          </div>
        </div>

        {/* Section 6: Pengaturan Down Payment (DP 30%) & Syarat Ketentuan Trip */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-ink/5 space-y-6">
          <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                06 &bull; Down Payment (DP) &amp; Syarat Ketentuan Trip
              </span>
              <h3 className="font-display text-xl font-semibold text-forest mt-1">
                Kelola Kebijakan Down Payment (DP 30%) &amp; Syarat Ketentuan Perjalanan
              </h3>
              <p className="text-xs text-ink/65 mt-1">
                Atur persentase Down Payment (default 30% dari total trip) serta daftar butir Syarat &amp; Ketentuan yang tampil di formulir booking, modal paket wisata, dan halaman pembayaran.
              </p>
            </div>
            <FileCheck className="h-6 w-6 text-ember shrink-0" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-cream/30 p-4 border border-ink/10">
            <div>
              <label className="flex items-center gap-2.5 text-xs font-bold text-forest cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableDownPayment !== false}
                  onChange={(e) => handleFieldChange('enableDownPayment', e.target.checked)}
                  className="h-4 w-4 rounded text-forest focus:ring-forest"
                />
                <span>Aktifkan Fitur Pembayaran Down Payment (DP)</span>
              </label>
              <p className="mt-1 text-[0.7rem] text-ink/60 pl-6">
                Jika aktif, pelanggan dapat memilih membayar DP (misal 30%) atau Bayar Lunas (100%) saat checkout.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showTermsAndConditionsSection === true}
                  onChange={(e) => handleFieldChange('showTermsAndConditionsSection', e.target.checked)}
                  className="rounded text-forest focus:ring-forest"
                />
                <span>Tampilkan Blok Syarat &amp; Ketentuan di Beranda (Default: Dinonaktifkan)</span>
              </label>
              <p className="mt-1 text-[0.7rem] text-ink/60 pl-6">
                Hilangkan centang ini untuk menyembunyikan kotak teks Syarat &amp; Ketentuan di halaman depan agar website tampak bersih dan ringkas.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Persentase Down Payment (% dari Total Trip)
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={90}
                  value={formData.downPaymentPercentage ?? 30}
                  onChange={(e) => handleFieldChange('downPaymentPercentage', Math.max(10, Math.min(90, Number(e.target.value) || 30)))}
                  disabled={formData.enableDownPayment === false}
                  className="w-28 rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-xs font-bold text-ember focus:border-forest focus:outline-none disabled:bg-zinc-100"
                />
                <span className="text-xs font-semibold text-ink/70">% dari total biaya trip (Standar: 30%)</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Daftar Poin Syarat &amp; Ketentuan Trip ({(formData.termsAndConditions || []).length} Poin):
              </label>
              <button
                type="button"
                onClick={handleAddTerm}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-white px-3 py-1.5 text-xs font-bold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Poin S&amp;K</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(formData.termsAndConditions || []).map((term, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-2 grid h-6 w-6 place-items-center rounded-full bg-ember text-[0.65rem] font-bold text-white shrink-0">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={term}
                    onChange={(e) => handleTermChange(idx, e.target.value)}
                    className="flex-1 rounded-xl border border-ink/15 bg-white p-2.5 text-xs text-ink focus:border-forest focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(idx)}
                    className="mt-1.5 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus poin syarat & ketentuan ini"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="rounded-3xl bg-ink text-cream p-6 sm:p-8 shadow-lift border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ember">
            <FileCheck className="h-4 w-4" />
            <span>Live Preview — Dokumen Legalitas di Landing Page</span>
          </div>
          <h4 className="font-display text-xl text-white">
            Keamanan &amp; Kepastian Perjalanan Anda Terjamin 100%
          </h4>

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <span className="text-[0.65rem] font-semibold text-cream/50 uppercase tracking-wider">
                Nomor Induk Berusaha (NIB)
              </span>
              <p className="font-mono text-xs font-bold text-cream mt-0.5">{formData.nib}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <span className="text-[0.65rem] font-semibold text-cream/50 uppercase tracking-wider">
                SK Pengesahan Kemenkumham RI
              </span>
              <p className="font-mono text-xs font-bold text-cream mt-0.5">{formData.skKemenkumham}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <span className="text-[0.65rem] font-semibold text-cream/50 uppercase tracking-wider">
                Keanggotaan ASITA
              </span>
              <p className="text-xs font-bold text-cream mt-0.5">{formData.asitaMembership}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <span className="text-[0.65rem] font-semibold text-cream/50 uppercase tracking-wider">
                Kemitraan HPI
              </span>
              <p className="text-xs font-bold text-cream mt-0.5">{formData.hpiPartnership}</p>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-4 z-40 rounded-3xl bg-forest p-4 sm:p-5 text-cream shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10">
          <div>
            <p className="text-sm font-bold">Simpan Seluruh Dokumen Legalitas &amp; Profil PT</p>
            <p className="text-xs text-cream/70">
              Perubahan akan langsung diperbarui ke Firestore database dan dapat diakses semua pengunjung.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ember hover:bg-ember-600 px-6 py-3.5 text-xs font-bold text-white shadow-soft transition shrink-0 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Dokumen Legalitas'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
