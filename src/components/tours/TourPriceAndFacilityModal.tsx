import {
  BadgePercent,
  Bus,
  Car,
  Check,
  ChevronRight,
  Clock,
  HelpCircle,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { calculatePriceForPax, type CityTour, type TourPackage } from '@/data/tours'
import { selectTour } from '@/lib/trip'
import { handleNavClick } from '@/lib/nav'
import { whatsappLink } from '@/data/site'

interface TourModalProps {
  tour: CityTour | TourPackage
  isOpen: boolean
  onClose: () => void
}

function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID')
}

function getVehicleRecommendation(pax: number): { name: string; icon: 'car' | 'bus'; desc: string } {
  if (pax <= 2) {
    return { name: 'City Car / Toyota Avanza', icon: 'car', desc: 'Mobil pribadi ber-AC dingin, nyaman & lincah' }
  }
  if (pax <= 5) {
    return { name: 'Toyota Innova Reborn', icon: 'car', desc: 'Kenyamanan suspensi maksimal + bagasi lapang' }
  }
  if (pax <= 10) {
    return { name: 'Toyota HiAce Premio / Commuter Luxury', icon: 'bus', desc: 'Microbus premium, captain seats lega' }
  }
  if (pax <= 20) {
    return { name: 'Isuzu Elf Long Eksekutif / Coaster', icon: 'bus', desc: 'Kapasitas 19-20 seat, audio karaoke & AC ducting' }
  }
  if (pax <= 33) {
    return { name: 'Medium Bus Pariwisata (31–33 Seats)', icon: 'bus', desc: 'Bus pariwisata medium berstandar keselamatan tinggi' }
  }
  if (pax <= 50) {
    return { name: 'Big Bus Pariwisata SHD (45–50 Seats)', icon: 'bus', desc: 'Big Bus pariwisata full fasilitas (karaoke, charger USB)' }
  }
  return {
    name: 'Konvoi 2 Big Bus Pariwisata Eksekutif',
    icon: 'bus',
    desc: 'Armada gathering akbar rombongan besar + tour leader standby',
  }
}

export function TourPriceAndFacilityModal({ tour, isOpen, onClose }: TourModalProps) {
  const [activeTab, setActiveTab] = useState<'pricing' | 'facilities' | 'itinerary'>('pricing')
  const [paxCount, setPaxCount] = useState<number>(4)

  if (!isOpen) return null

  // Extract base numeric price for calculations
  const rawPriceNum = Number(tour.price.replace(/\D/g, '')) || 350000
  const calculation = calculatePriceForPax(tour.priceTiers, paxCount, rawPriceNum)
  const soloCalculation = calculatePriceForPax(tour.priceTiers, 1, rawPriceNum)
  const savingsPct =
    paxCount > 1 && soloCalculation.pricePerPax > calculation.pricePerPax
      ? Math.round(((soloCalculation.pricePerPax - calculation.pricePerPax) / soloCalculation.pricePerPax) * 100)
      : 0

  const vehicle = getVehicleRecommendation(paxCount)

  // Combined facilities
  const facilities = tour.facilities && tour.facilities.length > 0
    ? tour.facilities
    : ('included' in tour && tour.included && tour.included.length > 0)
    ? tour.included
    : [
        'Transportasi AC Pariwisata Nyaman + Driver + BBM',
        'Pemandu Lokal Berlisensi HPI Garut',
        'Tiket Masuk Seluruh Objek Wisata',
        'Makan Khas Sunda Sesuai Program Trip',
        'Air Mineral Bebas Isi Ulang & Welcome Snack',
        'Asuransi Perjalanan Pariwisata Resmi',
      ]

  const excluded = tour.excluded && tour.excluded.length > 0
    ? tour.excluded
    : [
        'Pengeluaran pribadi peserta (belanja oleh-oleh)',
        'Tiket wahana opsional di luar program',
        'Tipping sukarela untuk crew guide / driver',
      ]

  const handleBookNow = () => {
    selectTour(tour.name, paxCount)
    onClose()
    handleNavClick('contact')
  }

  const handleChatWa = () => {
    const text = encodeURIComponent(
      `Halo Garut Journey, saya tertarik dengan "${tour.name}" untuk rencana ${paxCount} orang (Estimasi: ${formatRupiah(calculation.totalPrice)}). Mohon info ketersediaan tanggalnya ya!`,
    )
    window.open(`${whatsappLink()}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-[2.5rem] bg-white shadow-2xl text-ink border border-ink/10 overflow-hidden my-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-forest via-forest-700 to-ink p-6 sm:p-8 text-cream relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full bg-white/10 hover:bg-white/20 p-2 text-cream transition"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>

          <span className="rounded-full bg-ember/30 border border-ember/40 px-3.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-ember-300">
            Detail &amp; Tarif 1 s/d 100 Orang
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-white">
            {tour.name}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-cream/75">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-ember" />
              <span>{tour.duration}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-ember" />
              <span>Kapasitas Rombongan 1 – 100 Orang</span>
            </span>
            <span className="font-semibold text-ember-300">
              {tour.price}
            </span>
          </div>

          {/* Subtab Navigation */}
          <div className="mt-6 flex gap-2 border-b border-white/15 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'pricing'
                  ? 'bg-white text-forest shadow-soft'
                  : 'bg-white/10 text-cream/80 hover:bg-white/20'
              }`}
            >
              <BadgePercent className="h-4 w-4" />
              <span>Daftar Harga &amp; Kalkulator 1-100 Pax</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('facilities')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'facilities'
                  ? 'bg-white text-forest shadow-soft'
                  : 'bg-white/10 text-cream/80 hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Kolom Fasilitas Lengkap</span>
            </button>

            {'itinerary' in tour && tour.itinerary && tour.itinerary.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('itinerary')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'itinerary'
                    ? 'bg-white text-forest shadow-soft'
                    : 'bg-white/10 text-cream/80 hover:bg-white/20'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Rencana Perjalanan</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: PRICING CALCULATOR */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              {/* Interactive Calculator Slider */}
              <div className="rounded-3xl bg-cream/30 border border-ink/10 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ember">
                      Kalkulator Tarif Fleksibel
                    </span>
                    <h3 className="font-display text-lg font-bold text-forest">
                      Hitung Tarif Sesuai Jumlah Peserta Anda
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-2xl bg-forest px-4 py-2 text-white font-mono text-sm font-bold shadow-soft">
                    <span>{paxCount} Orang</span>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-ink/60 font-medium">
                    <span>1 Orang (Solo)</span>
                    <span className="font-bold text-forest text-sm">{paxCount} Peserta</span>
                    <span>100 Orang (Gathering)</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={paxCount}
                    onChange={(e) => setPaxCount(Number(e.target.value))}
                    className="w-full accent-forest h-2.5 bg-ink/15 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.7rem] font-bold text-ink/50 uppercase tracking-wider">Cepat Pilih:</span>
                  {[1, 2, 4, 6, 10, 15, 20, 30, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPaxCount(num)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        paxCount === num
                          ? 'bg-forest text-white shadow-soft font-bold'
                          : 'bg-white border border-ink/15 text-ink/75 hover:bg-cream'
                      }`}
                    >
                      {num} Pax
                    </button>
                  ))}
                </div>

                {/* Calculation Summary Card */}
                <div className="rounded-2xl bg-white border border-forest/20 p-5 shadow-soft space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-ink/10 pb-4">
                    <div>
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ink/50 block">
                        Harga Per Orang:
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display text-3xl font-bold text-forest">
                          {formatRupiah(calculation.pricePerPax)}
                        </span>
                        <span className="text-xs text-ink/60">/ orang</span>
                      </div>
                      {savingsPct > 0 && (
                        <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                          Hemat {savingsPct}% dibanding solo trip
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-ink/50 block">
                        Total Estimasi Biaya ({paxCount} Peserta):
                      </span>
                      <div className="mt-1">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-ember">
                          {formatRupiah(calculation.totalPrice)}
                        </span>
                      </div>
                      <p className="text-[0.7rem] text-ink/50 mt-1">
                        *Sudah termasuk seluruh fasilitas, tiket &amp; guide resmi
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Recommendation Strip */}
                  <div className="flex items-center gap-3.5 rounded-xl bg-forest/5 p-3.5 border border-forest/10">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-cream shrink-0">
                      {vehicle.icon === 'car' ? <Car className="h-5 w-5" /> : <Bus className="h-5 w-5" />}
                    </div>
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-forest block">
                        Rekomendasi Armada Transportasi:
                      </span>
                      <strong className="text-xs font-bold text-ink block">{vehicle.name}</strong>
                      <span className="text-[0.7rem] text-ink/65">{vehicle.desc}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Price Tier Table (1 - 100 Orang) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-bold text-forest">
                    Tabel Lengkap Skala Tarif 1 s/d 100 Orang
                  </h4>
                  <span className="text-xs text-ink/50">
                    Transparansi harga resmi
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-ink/10">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-cream/60 border-b border-ink/10 text-ink/60 uppercase tracking-wider text-[0.65rem]">
                        <th className="p-3 font-bold">Kategori Peserta</th>
                        <th className="p-3 font-bold">Jumlah Pax</th>
                        <th className="p-3 font-bold text-right">Tarif / Orang</th>
                        <th className="p-3 font-bold">Armada &amp; Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {(tour.priceTiers || []).map((tier, idx) => {
                        const isCurrent = paxCount >= tier.minPax && paxCount <= tier.maxPax
                        return (
                          <tr
                            key={idx}
                            onClick={() => setPaxCount(tier.minPax)}
                            className={`cursor-pointer transition ${
                              isCurrent
                                ? 'bg-forest/10 font-semibold text-forest'
                                : 'hover:bg-cream/30 text-ink'
                            }`}
                          >
                            <td className="p-3 flex items-center gap-2">
                              {isCurrent && <span className="h-2 w-2 rounded-full bg-forest" />}
                              <span>{tier.label}</span>
                            </td>
                            <td className="p-3 font-mono">
                              {tier.minPax === tier.maxPax
                                ? `${tier.minPax} Pax`
                                : `${tier.minPax} – ${tier.maxPax} Pax`}
                            </td>
                            <td className="p-3 text-right font-bold font-mono text-forest">
                              {formatRupiah(tier.pricePerPax)}
                            </td>
                            <td className="p-3 text-ink/70 text-[0.7rem] truncate max-w-xs">
                              {tier.note || 'Fasilitas komplit & guide HPI'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FACILITIES COLUMN (KOLOM FASILITAS) */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Kolom Fasilitas Termasuk */}
                <div className="rounded-3xl bg-forest/5 border border-forest/15 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-forest font-bold text-sm uppercase tracking-wider border-b border-forest/10 pb-3">
                    <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>Fasilitas Yang Sudah Termasuk:</span>
                  </div>

                  <ul className="space-y-3">
                    {facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ink/85 leading-relaxed">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-forest text-cream shrink-0 mt-0.5 text-[0.6rem] font-bold">
                          ✓
                        </span>
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolom Fasilitas Tidak Termasuk */}
                <div className="rounded-3xl bg-rose-50/50 border border-rose-200/60 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm uppercase tracking-wider border-b border-rose-200/50 pb-3">
                    <X className="h-5 w-5 text-rose-600 shrink-0" />
                    <span>Belum / Tidak Termasuk (Exclude):</span>
                  </div>

                  <ul className="space-y-3">
                    {excluded.map((exc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ink/75 leading-relaxed">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-200 text-rose-800 shrink-0 mt-0.5 text-[0.6rem] font-bold">
                          ✕
                        </span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-rose-200/40 text-[0.7rem] text-rose-700/80">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Butuh fasilitas tambahan (custom)?</span>
                    </p>
                    <p className="mt-1">
                      Anda dapat request penambahan sewa jaket gunung, drone video, tenda private, atau upgrade hotel bintang 4 melalui admin WhatsApp kami.
                    </p>
                  </div>
                </div>
              </div>

              {/* Jaminan Layanan Garut Journey */}
              <div className="rounded-2xl bg-cream/40 p-4 border border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-forest shrink-0" />
                  <div>
                    <strong className="block text-forest">Garansi Transparansi &amp; Tanpa Biaya Tersembunyi</strong>
                    <span className="text-ink/70">
                      Seluruh tarif sudah all-in sesuai kesepakatan tertulis. Tidak ada pungutan liar di lokasi.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ITINERARY */}
          {activeTab === 'itinerary' && 'itinerary' in tour && tour.itinerary && (
            <div className="space-y-4">
              <h4 className="font-display text-base font-bold text-forest">
                Rangkaian Itinerary Perjalanan
              </h4>

              <ol className="relative border-l border-forest/30 pl-6 space-y-4">
                {tour.itinerary.map((s, idx) => (
                  <li key={idx} className="relative pb-2">
                    <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-ember ring-4 ring-forest/10" />
                    <span className="block text-xs font-bold font-mono tracking-wider text-ember">
                      {s.time}
                    </span>
                    <span className="text-xs text-ink font-medium mt-0.5 block leading-relaxed">
                      {s.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-cream/40 border-t border-ink/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink/50 block">
              Pilihan: {tour.name} ({paxCount} Orang)
            </span>
            <span className="font-display text-xl font-bold text-forest">
              Total {formatRupiah(calculation.totalPrice)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleChatWa}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/30 bg-white hover:bg-forest/10 text-forest px-5 py-3 text-xs font-bold shadow-sm transition"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Tanya WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleBookNow}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest hover:bg-forest-700 text-white px-7 py-3 text-xs font-bold uppercase tracking-wider shadow-soft transition"
            >
              <span>Booking Untuk {paxCount} Orang</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
