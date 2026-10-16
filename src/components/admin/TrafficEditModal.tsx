import { useState } from 'react'
import { Activity, Check, Radio, Users, X, Eye } from 'lucide-react'
import { type TrafficData } from '@/lib/trafficTracker'

interface TrafficEditModalProps {
  isOpen: boolean
  traffic: TrafficData
  onSave: (metrics: Partial<TrafficData>) => void
  onClose: () => void
}

export function TrafficEditModal({
  isOpen,
  traffic,
  onSave,
  onClose,
}: TrafficEditModalProps) {
  const [totalVisitors, setTotalVisitors] = useState<number>(traffic.totalVisitors || 0)
  const [todayVisitors, setTodayVisitors] = useState<number>(traffic.todayVisitors || 0)
  const [liveVisitors, setLiveVisitors] = useState<number>(traffic.liveVisitors || 8)
  const [totalPageViews, setTotalPageViews] = useState<number>(traffic.totalPageViews || 0)
  const [todayPageViews, setTodayPageViews] = useState<number>(traffic.todayPageViews || 0)
  const [bounceRate, setBounceRate] = useState<number>(traffic.bounceRate || 25.5)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      totalVisitors: Number(totalVisitors) || 0,
      todayVisitors: Number(todayVisitors) || 0,
      liveVisitors: Number(liveVisitors) || 5,
      totalPageViews: Number(totalPageViews) || 0,
      todayPageViews: Number(todayPageViews) || 0,
      bounceRate: Number(bounceRate) || 25,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-lift border border-ink/10 space-y-5">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-forest/10 text-forest">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ember">Statistik Pengunjung</span>
              <h3 className="font-display text-xl font-bold text-forest">Edit Parameter Trafik & Analitik</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-ink/70 leading-relaxed">
          Sesuaikan metrik kunjungan, target tayangan, dan jumlah wisatawan online secara langsung untuk kebutuhan laporan dan analitik website.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                <Users className="h-3.5 w-3.5 text-forest" /> Total Pengunjung (All-Time)
              </label>
              <input
                type="number"
                min={0}
                value={totalVisitors}
                onChange={(e) => setTotalVisitors(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-bold text-forest focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                <Users className="h-3.5 w-3.5 text-ember" /> Pengunjung Hari Ini
              </label>
              <input
                type="number"
                min={0}
                value={todayVisitors}
                onChange={(e) => setTodayVisitors(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-bold text-ember focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> Sedang Online (Live)
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={liveVisitors}
                onChange={(e) => setLiveVisitors(Number(e.target.value) || 1)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-bold text-emerald-600 focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                <Eye className="h-3.5 w-3.5 text-ink/50" /> Total Tayangan (Pageviews)
              </label>
              <input
                type="number"
                min={0}
                value={totalPageViews}
                onChange={(e) => setTotalPageViews(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-bold text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Tayangan Hari Ini
              </label>
              <input
                type="number"
                min={0}
                value={todayPageViews}
                onChange={(e) => setTodayPageViews(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1">
                Bounce Rate (%)
              </label>
              <input
                type="number"
                step={0.1}
                min={0}
                max={100}
                value={bounceRate}
                onChange={(e) => setBounceRate(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-ink/15 bg-cream/30 px-3.5 py-2 text-xs font-medium text-ink focus:border-forest focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-ink/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-xs font-semibold text-ink/60 hover:bg-ink/5"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-forest-700 transition"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Simpan Perubahan Metrik</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
