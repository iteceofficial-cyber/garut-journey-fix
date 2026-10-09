import { useState, useEffect } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

/**
 * Floating button on the home page allowing visitors to instantly
 * scroll to the very bottom of the website with smooth animation,
 * or back to top when already near the footer.
 */
export function ScrollToBottomFab() {
  const [isNearBottom, setIsNearBottom] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const checkScrollPosition = () => {
      if (typeof window === 'undefined') return
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      // If user has scrolled past ~75% of the page
      const threshold = scrollHeight - clientHeight - 400
      setIsNearBottom(scrollTop >= Math.max(200, threshold))
    }

    checkScrollPosition()
    window.addEventListener('scroll', checkScrollPosition, { passive: true })
    return () => window.removeEventListener('scroll', checkScrollPosition)
  }, [])

  if (!isMounted) return null

  const handleScrollClick = () => {
    if (typeof window === 'undefined') return

    if (isNearBottom) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="fixed bottom-6 left-5 sm:left-7 z-40 select-none animate-fade-in">
      <button
        type="button"
        onClick={handleScrollClick}
        aria-label={isNearBottom ? 'Scroll kembali ke paling atas' : 'Scroll ke paling bawah halaman'}
        title={isNearBottom ? 'Kembali ke Paling Atas' : 'Scroll ke Paling Bawah'}
        className="group flex items-center gap-2.5 rounded-full bg-forest text-cream pl-3.5 pr-4 py-3 shadow-lift ring-1 ring-white/20 transition-all duration-300 hover:bg-forest-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ember"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-cream transition duration-300 group-hover:bg-ember group-hover:text-white shrink-0">
          {isNearBottom ? (
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          )}
        </span>
        <span className="text-xs font-bold tracking-wide hidden sm:inline whitespace-nowrap">
          {isNearBottom ? 'Ke Paling Atas' : 'Scroll ke Bawah'}
        </span>
      </button>
    </div>
  )
}
