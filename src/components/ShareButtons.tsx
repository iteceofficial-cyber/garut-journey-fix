import { Check, Facebook, Link2, Twitter } from 'lucide-react'
import { useState } from 'react'
import { WhatsAppIcon } from './WhatsAppFab'

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.origin + path : path
  const text = `${title} — Garut Journey`
  const items = [
    { label: 'Share on WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, icon: <WhatsAppIcon className="h-4 w-4" /> },
    { label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: <Facebook className="h-4 w-4" /> },
    { label: 'Share on X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, icon: <Twitter className="h-4 w-4" /> },
  ]
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-ink/50">Share</span>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={i.label}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-forest hover:text-forest"
        >
          {i.icon}
        </a>
      ))}
      <button
        type="button"
        aria-label="Copy link"
        onClick={async () => {
          try {
            if (navigator?.clipboard?.writeText) {
              await navigator.clipboard.writeText(window.location.href)
            }
          } catch {
            // fallback
          }
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        }}
        className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-forest hover:text-forest"
      >
        {copied ? <Check className="h-4 w-4 text-forest" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
