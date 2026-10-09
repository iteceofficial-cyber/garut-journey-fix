import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { selectTour } from '@/lib/trip'
import { handleNavClick } from '@/lib/nav'

/** Jumps to the inquiry form with the given tour pre-selected. */
export function BookLink({
  tour,
  className,
  children,
  onNavigate,
}: {
  tour?: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
}) {
  return (
    <Link
      to="/"
      hash="contact"
      onClick={() => {
        if (tour) selectTour(tour)
        onNavigate?.()
        handleNavClick('contact')
      }}
      className={className}
    >
      {children}
    </Link>
  )
}

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ember-600 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember',
  dark: 'inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-full border border-current px-6 py-3.5 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2',
  outline:
    'inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:border-forest hover:text-forest',
}
