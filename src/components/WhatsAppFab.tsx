import { useState } from 'react'
import { Send, X, Clock, Sparkles } from 'lucide-react'
import { useSiteSettings } from '@/lib/siteSettings'
import { Img } from '@/components/Img'

export function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.79.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.35-11.34 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  )
}

/** Floating WhatsApp chat widget configured via Admin settings */
export function WhatsAppFab() {
  const { settings } = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [typedMessage, setTypedMessage] = useState('')

  if (settings.whatsappShowFab === false) {
    return null
  }

  const phoneDigits = settings.whatsappDigits || '6285156456791'
  const csName = settings.whatsappCsName || 'Kang Fahmi'
  const csRole = settings.whatsappCsRole || 'Senior Tour Specialist Garut'
  const csAvatar =
    settings.whatsappCsAvatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  const workingHours = settings.whatsappWorkingHours || '07:30 - 21:00 WIB (Online)'
  const greeting =
    settings.whatsappGreeting ||
    'Sampurasun! Ada yang bisa kami bantu seputar destinasi atau custom tour di Garut?'
  const defaultMsg =
    settings.whatsappDefaultMessage ||
    'Halo Garut Journey! Saya ingin konsultasi jadwal dan pilihan paket wisata Garut.'
  const quickReplies = settings.whatsappQuickReplies || [
    'Tanya Rekomendasi Tour 1 Hari',
    'Custom Trip > 3 Hari 2 Malam',
    'Cek Tanggal & Ketersediaan Guide',
    'Konfirmasi Pembayaran / Kwitansi',
  ]

  const positionCls =
    settings.whatsappFabPosition === 'left'
      ? 'left-5 sm:left-7'
      : 'right-5 sm:right-7'

  const popoverPositionCls =
    settings.whatsappFabPosition === 'left'
      ? 'left-4 sm:left-7 origin-bottom-left'
      : 'right-4 sm:right-7 origin-bottom-right'

  const handleSend = (text: string) => {
    const messageToSend = text.trim() || defaultMsg
    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(messageToSend)}`
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsOpen(false)
    setTypedMessage('')
  }

  return (
    <>
      {/* Interactive Chat Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed bottom-24 z-50 w-[92vw] max-w-[360px] rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden animate-fade-in ${popoverPositionCls}`}
        >
          {/* Header */}
          <div className="bg-forest px-5 py-4 text-cream flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-white/20 bg-forest-700 shrink-0">
                <Img file={csAvatar} alt={csName} className="h-full w-full object-cover" width={100} />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-forest" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm truncate">{csName}</h4>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-cream">
                    CS
                  </span>
                </div>
                <p className="text-[0.72rem] text-cream/75 truncate">{csRole}</p>
                <p className="text-[0.68rem] text-cream/60 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> {workingHours}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chat"
              className="rounded-full p-1.5 text-cream/70 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-cream/30 max-h-[360px] overflow-y-auto space-y-3">
            {/* Agent Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="rounded-2xl rounded-tl-sm bg-white p-3.5 shadow-soft border border-ink/5 text-xs text-ink/80 leading-relaxed max-w-[88%]">
                <p className="font-semibold text-forest text-[0.72rem] mb-1">{csName}</p>
                {greeting}
              </div>
            </div>

            {/* Quick Replies */}
            <div className="pt-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink/40 mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-ember" /> Pertanyaan Cepat:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleSend(reply)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-forest border border-forest/20 shadow-sm hover:bg-forest hover:text-white transition text-left"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(typedMessage)
            }}
            className="p-3 bg-white border-t border-ink/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Tulis pesan ke WhatsApp..."
              className="flex-1 rounded-full bg-cream-200/50 px-4 py-2.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-forest"
            />
            <button
              type="submit"
              aria-label="Kirim ke WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white hover:bg-[#1ebd59] transition shadow-soft shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat WhatsApp Garut Journey"
        className={`group fixed bottom-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 sm:p-4 text-white shadow-lift transition hover:-translate-y-1 sm:bottom-7 ${positionCls}`}
      >
        {settings.whatsappPulseEffect !== false && (
          <span className="pulse-ring absolute inset-0 rounded-full" aria-hidden="true" />
        )}
        <WhatsAppIcon className="relative h-6 w-6" />
        <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-xs sm:text-sm font-semibold transition-all duration-500 group-hover:max-w-44 sm:inline">
          {isOpen ? 'Tutup Chat' : 'Chat WhatsApp'}
        </span>
      </button>
    </>
  )
}

