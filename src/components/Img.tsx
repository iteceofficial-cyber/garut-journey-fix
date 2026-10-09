import { useState, useEffect, useRef } from 'react'
import { img, srcSet, DEFAULT_FALLBACK_IMAGE, SVG_FALLBACK_PLACEHOLDER } from '@/lib/img'
import { getPersistedMedia } from '@/lib/mediaStorage'

/** Lazy-loaded, error-resilient image with automated fallback to prevent broken UI */
export function Img({
  file,
  alt,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  className = '',
  eager = false,
  width = 1200,
  fallback,
  onClick,
}: {
  file: string | null | undefined
  alt: string
  sizes?: string
  className?: string
  eager?: boolean
  width?: number
  fallback?: string
  onClick?: () => void
}) {
  const errorCountRef = useRef(0)
  const initialSrc = img(file, width)
  const [src, setSrc] = useState(initialSrc)

  useEffect(() => {
    errorCountRef.current = 0
    const resolved = img(file, width)
    setSrc(resolved)

    // If file looks like an ID and resolved to /img/..., attempt async vault check
    if (file && !file.startsWith('data:') && !file.startsWith('http') && !file.includes('.')) {
      getPersistedMedia(file).then((vaultData) => {
        if (vaultData) {
          setSrc(vaultData)
        }
      })
    }
  }, [file, width])

  const handleError = () => {
    if (errorCountRef.current === 0) {
      errorCountRef.current = 1
      // Check if file is stored in IndexedDB media vault
      if (file && !file.startsWith('data:') && !file.startsWith('http')) {
        getPersistedMedia(file).then((vaultData) => {
          if (vaultData) {
            setSrc(vaultData)
            return
          }
          applyFallback()
        })
      } else {
        applyFallback()
      }
    } else if (errorCountRef.current === 1) {
      errorCountRef.current = 2
      setSrc(SVG_FALLBACK_PLACEHOLDER)
    }
  }

  const applyFallback = () => {
    const fallbackSrc = fallback ? img(fallback, width) : DEFAULT_FALLBACK_IMAGE
    if (src === fallbackSrc || file === fallbackSrc) {
      errorCountRef.current = 2
      setSrc(SVG_FALLBACK_PLACEHOLDER)
    } else {
      setSrc(fallbackSrc)
    }
  }

  const isDataUrl = typeof src === 'string' && src.startsWith('data:')
  const computedSrcSet = errorCountRef.current > 0 || isDataUrl ? undefined : srcSet(file)

  return (
    <img
      src={src}
      srcSet={computedSrcSet}
      sizes={sizes}
      alt={alt}
      loading={eager || isDataUrl ? 'eager' : 'lazy'}
      decoding={isDataUrl ? 'sync' : 'async'}
      fetchPriority={eager || isDataUrl ? 'high' : undefined}
      onError={handleError}
      onClick={onClick}
      className={className}
    />
  )
}
