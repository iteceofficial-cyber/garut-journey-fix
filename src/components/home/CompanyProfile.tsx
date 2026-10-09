import {
  BadgeCheck,
  Building2,
  Car,
  FileCheck,
  Landmark,
  MessageCircle,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { COMPANY_PROFILE } from '@/data/company'
import { whatsappLink } from '@/data/site'

export function CompanyProfile() {
  const p = COMPANY_PROFILE

  return (
    <section id="company-profile" className="relative bg-cream-200/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Profil Perusahaan & Legalitas"
            title={
              <>
                Biro Wisata Resmi &amp; Terpercaya{' '}
                <em className="text-forest">Tatar Garut</em>
              </>
            }
            intro="Membangun kepercayaan Anda sejak 2014. Kami beroperasi secara legal, profesional, dan berdedikasi memajukan ekowisata serta ekonomi masyarakat Garut."
          />

          <div className="inline-flex items-center gap-2 rounded-2xl bg-forest px-4 py-2.5 text-xs font-bold text-cream shadow-soft shrink-0">
            <Building2 className="h-4 w-4 text-ember" />
            <span>{p.legalName}</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          <Reveal delay={50} className="rounded-3xl bg-white p-6 shadow-soft text-center border border-ink/5">
            <span className="font-display text-4xl sm:text-5xl font-light text-forest">
              {p.stats.travelersServed.toLocaleString()}+
            </span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">Wisatawan Terlayani</p>
          </Reveal>

          <Reveal delay={100} className="rounded-3xl bg-white p-6 shadow-soft text-center border border-ink/5">
            <span className="font-display text-4xl sm:text-5xl font-light text-ember">
              {p.stats.satisfactionRate}
            </span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">Tingkat Kepuasan Tamu</p>
          </Reveal>

          <Reveal delay={150} className="rounded-3xl bg-white p-6 shadow-soft text-center border border-ink/5">
            <span className="font-display text-4xl sm:text-5xl font-light text-forest">
              {p.stats.yearsExperience}+ Th
            </span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">Pengalaman Eksplorasi</p>
          </Reveal>

          <Reveal delay={200} className="rounded-3xl bg-white p-6 shadow-soft text-center border border-ink/5">
            <span className="font-display text-4xl sm:text-5xl font-light text-ember">
              {p.stats.umkmPartners}+
            </span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">Mitra UMKM Binaan</p>
          </Reveal>
        </div>

        {/* Legal Credentials & Trust Badges */}
        <div className="mt-12 rounded-[2.5rem] bg-ink text-cream p-8 sm:p-12 shadow-lift">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-ember">
                <FileCheck className="h-4 w-4" />
                <span>Dokumen Legalitas &amp; Keamanan</span>
              </div>
              <h3 className="font-display mt-3 text-3xl sm:text-4xl font-light">
                Keamanan &amp; Kepastian Perjalanan Anda Terjamin 100%
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-cream/75">
                Hindari risiko penipuan berwisata. Garut Journey dinaungi badan hukum perseroan terbatas resmi dengan izin operasional lengkap dari Kementerian Pariwisata dan Ekonomi Kreatif RI serta terdaftar di dinas terkait.
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                  <BadgeCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">Nomor Induk Berusaha (NIB)</span>
                    <p className="font-mono text-sm font-bold text-cream mt-0.5">{p.nib}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                  <BadgeCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">SK Pengesahan Kemenkumham RI</span>
                    <p className="font-mono text-sm font-bold text-cream mt-0.5">{p.skKemenkumham}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                    <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">Keanggotaan ASITA</span>
                    <p className="text-xs font-bold text-cream mt-1">{p.asitaMembership}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                    <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">Kemitraan HPI</span>
                    <p className="text-xs font-bold text-cream mt-1">{p.hpiPartnership}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Accounts & Anti-Fraud Notice */}
            <div className="rounded-3xl bg-forest/80 border border-white/10 p-6 sm:p-8 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ember">
                <Landmark className="h-4 w-4" />
                <span>Rekening Resmi Perusahaan (Anti-Penipuan)</span>
              </div>
              <p className="mt-2 text-xs text-cream/80">
                Seluruh transaksi pembayaran tour kami hanya diproses melalui rekening resmi perseroan berikut:
              </p>

              <div className="mt-5 space-y-3">
                {p.bankAccounts.map((acc) => (
                  <div key={acc.bank} className="rounded-2xl bg-ink/70 p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ember">{acc.bank}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider">
                        Terverifikasi
                      </span>
                    </div>
                    <p className="font-mono text-lg font-bold text-cream mt-1 tracking-wider">{acc.accountNumber}</p>
                    <p className="text-[0.75rem] text-cream/60">a.n. {acc.accountName}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappLink('Halo Manajemen Garut Journey, saya ingin mengajukan kerja sama / corporate trip.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-4 py-3 text-xs font-bold text-white shadow-soft hover:bg-ember-600 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Hubungi Kantor Pusat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {p.pillars.map((pil, idx) => (
            <Reveal key={pil.title} delay={idx * 70}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-soft border border-ink/5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest">
                  {idx === 0 ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : idx === 1 ? (
                    <Users className="h-6 w-6" />
                  ) : idx === 2 ? (
                    <Car className="h-6 w-6" />
                  ) : (
                    <BadgeCheck className="h-6 w-6" />
                  )}
                </div>
                <h4 className="font-display mt-5 text-xl font-bold text-ink">{pil.title}</h4>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-ink/65">{pil.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
