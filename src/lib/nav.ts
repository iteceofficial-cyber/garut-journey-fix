/**
 * Smooth scrolling helper for in-page anchors and cross-page navigation.
 */
export function scrollToSection(hash?: string) {
  if (!hash || typeof window === 'undefined') return
  const id = hash.replace(/^#/, '')
  const targetId = id === 'top' ? 'top' : id

  const attemptScroll = () => {
    const el = document.getElementById(targetId) || document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      return true
    }
    return false
  }

  // If already rendered, scroll immediately
  if (!attemptScroll()) {
    // If arriving from another route or still rendering, retry after DOM update
    setTimeout(attemptScroll, 80)
    setTimeout(attemptScroll, 250)
  }
}

export function handleNavClick(hash?: string) {
  if (!hash || typeof window === 'undefined') return
  if (window.location.pathname === '/') {
    scrollToSection(hash)
  }
}
