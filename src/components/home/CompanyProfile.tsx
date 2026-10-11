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
import { useCompanyProfile } from '@/lib/companyStorage'
import { whatsappLink } from '@/data/site'

export function CompanyProfile() {
  const { profile: p } = useCompanyProfile()

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
            <span suppressHydrationWarning className="font-display text-4xl sm:text-5xl font-light text-forest">
              {typeof p.stats.travelersServed === 'number'
                ? p.stats.travelersServed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : p.stats.travelersServed}+
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
                {/* 1. NIB */}
                {p.nibEnabled !== false && p.nib && (
                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                    <BadgeCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">
                          Nomor Induk Berusaha (NIB)
                        </span>
                        {p.nibStatus === 'proses' && (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                            Dalam Proses
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm font-bold text-cream mt-0.5">{p.nib}</p>
                    </div>
                  </div>
                )}

                {/* 2. SK Kemenkumham */}
                {p.skKemenkumhamEnabled !== false && p.skKemenkumham && (
                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                    <BadgeCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">
                          SK Pengesahan Kemenkumham RI
                        </span>
                        {p.skKemenkumhamStatus === 'proses' && (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                            Dalam Proses
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm font-bold text-cream mt-0.5">{p.skKemenkumham}</p>
                    </div>
                  </div>
                )}

                {/* 3. Izin Kemenparekraf / TDUP (if enabled) */}
                {p.izinKemenparekrafEnabled !== false && p.izinKemenparekraf && (
                  <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
                    <BadgeCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">
                          Izin Usaha Pariwisata (Kemenparekraf / TDUP)
                        </span>
                        {p.izinKemenparekrafStatus === 'proses' && (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                            Dalam Proses
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm font-bold text-cream mt-0.5">{p.izinKemenparekraf}</p>
                    </div>
                  </div>
                )}

                {/* 4. ASITA & HPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.asitaMembershipEnabled !== false && p.asitaMembership && (
                    <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">
                          Keanggotaan ASITA
                        </span>
                        {p.asitaMembershipStatus === 'proses' && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-amber-300">
                            Proses
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-cream">{p.asitaMembership}</p>
                    </div>
                  )}

                  {p.hpiPartnershipEnabled !== false && p.hpiPartnership && (
                    <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">
                          Kemitraan HPI
                        </span>
                        {p.hpiPartnershipStatus === 'proses' && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-amber-300">
                            Proses
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-cream">{p.hpiPartnership}</p>
                    </div>
                  )}
                </div>

                {/* 5. Custom Legal Documents */}
                {p.customLegalDocs &&
                  p.customLegalDocs
                    .filter((d) => d.enabled && d.number)
                    .map((d) => (
                      <div key={d.id} className="rounded-2xl bg-white/5 p-4 border border-white/10 flex items-start gap-3">
                        <BadgeCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-cream/50 uppercase tracking-wider">
                              {d.title}
                            </span>
                            {d.status === 'proses' && (
                              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                                Dalam Proses
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-sm font-bold text-cream mt-0.5">{d.number}</p>
                          {d.notes && <p className="text-[0.7rem] text-cream/60 mt-0.5">{d.notes}</p>}
                        </div>
                      </div>
                    ))}
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

        {/* Syarat & Ketentuan Resmi Perjalanan (Editable by Admin) */}
        {p.termsAndConditions && p.termsAndConditions.length > 0 && (
          <Reveal delay={180} className="mt-12 rounded-[2.25rem] bg-white p-8 sm:p-10 shadow-soft border border-ink/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-ember">
                  <FileCheck className="h-4 w-4" />
                  <span>Ketentuan Resmi Reservasi &amp; Trip</span>
                </div>
                <h3 className="font-display mt-2 text-2xl sm:text-3xl font-semibold text-forest">
                  Syarat &amp; Ketentuan Perjalanan (Terms &amp; Conditions)
                </h3>
              </div>
              {p.enableDownPayment !== false && (
                <span className="inline-flex items-center gap-2 rounded-full bg-ember/15 px-4 py-2 text-xs font-bold text-ember shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Tersedia Booking DP {p.downPaymentPercentage ?? 30}% dari Total Trip</span>
                </span>
              )}
            </div>

            <ol className="mt-6 grid gap-3 sm:grid-cols-2 list-decimal pl-5 text-xs sm:text-sm text-ink/75 leading-relaxed">
              {p.termsAndConditions.map((term, idx) => (
                <li key={idx} className="pl-1 pr-2">
                  {term}
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </div>
    </section>
  )
}
