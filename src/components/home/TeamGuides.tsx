import {
  Award,
  Globe,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { Img } from '@/components/Img'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { GUIDE_TEAM } from '@/data/team'
import { whatsappLink } from '@/data/site'

export function TeamGuides() {

  return (
    <section id="team" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Tim & Pramuwisata Lokal"
            title={
              <>
                Dipandu Putra Daerah Berlisensi{' '}
                <em className="text-forest">HPI &amp; BNSP</em>
              </>
            }
            intro="Bukan makelar atau pihak ketiga. Kami menjamin setiap perjalanan Anda didampingi oleh pemandu lokal resmi yang ramah, paham sejarah tatar Sunda, dan memprioritaskan keselamatan."
          />

          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft border border-forest/10 shrink-0">
            <ShieldCheck className="h-5 w-5 text-forest shrink-0" />
            <div className="text-xs">
              <span className="block font-bold text-ink">100% Certified Local Guides</span>
              <span className="text-ink/60">Himpunan Pramuwisata Indonesia DPC Garut</span>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDE_TEAM.map((guide, idx) => (
            <Reveal key={guide.id} delay={idx * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft border border-ink/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                {/* Photo & Top Badges */}
                <div className="relative aspect-[4/3] overflow-hidden bg-forest/5">
                  <Img
                    file={guide.image}
                    alt={`${guide.name} — ${guide.role}`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 shadow-sm backdrop-blur text-xs font-bold text-ink">
                    <Star className="h-3.5 w-3.5 fill-ember text-ember" />
                    <span>{guide.rating.toFixed(2)}</span>
                    <span className="text-ink/50 text-[0.7rem]">({guide.reviewCount})</span>
                  </div>

                  {/* Experience badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-bold text-cream">
                    <span className="rounded-full bg-forest/90 px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wider backdrop-blur">
                      {guide.experience} Exp
                    </span>
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[0.7rem] backdrop-blur">
                      {guide.totalTrips}+ Trip
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink">{guide.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ember">
                      {guide.role}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {guide.bio}
                  </p>

                  {/* Quote */}
                  <blockquote className="mt-4 rounded-xl bg-cream/70 p-3 text-xs italic text-ink/80 border-l-2 border-ember">
                    &ldquo;{guide.quote}&rdquo;
                  </blockquote>

                  {/* Specialties */}
                  <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-xs">
                    <div>
                      <span className="font-bold text-ink/70 flex items-center gap-1.5 mb-1.5">
                        <MapPin className="h-3.5 w-3.5 text-forest" /> Spesialisasi Wilayah:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {guide.specialties.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg bg-cream px-2 py-0.5 text-[0.72rem] font-medium text-ink/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-ink/65 text-[0.75rem]">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-forest" /> {guide.languages.join(', ')}
                      </span>
                      <span className="flex items-center gap-1 text-forest font-semibold">
                        <Award className="h-3.5 w-3.5" /> HPI Certified
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-ink/10">
                    <a
                      href={whatsappLink(
                        `Halo Admin Garut Journey! Saya ingin request dipandu oleh ${guide.name} (${guide.nickname}) untuk jadwal trip saya.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-bold text-white transition hover:bg-forest-700 shadow-soft"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Request {guide.nickname}</span>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Guide Guarantee Banner */}
        <Reveal delay={200} className="mt-14 rounded-3xl bg-forest p-8 text-cream shadow-lift">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 shrink-0">
                <ShieldCheck className="h-6 w-6 text-ember" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Standar Keselamatan P3K</h4>
                <p className="text-xs text-cream/70 mt-0.5">Semua pemandu dilatih penanganan medis darurat gunung & pantai.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 shrink-0">
                <Users className="h-6 w-6 text-ember" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Pemandu Ramah & Fleksibel</h4>
                <p className="text-xs text-cream/70 mt-0.5">Tidak terburu-buru, sabar mendampingi anak-anak hingga lansia.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 shrink-0">
                <Award className="h-6 w-6 text-ember" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Dokumentasi Foto Ciamik</h4>
                <p className="text-xs text-cream/70 mt-0.5">Guide paham angle terbaik di setiap spot Instagramable Garut.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
