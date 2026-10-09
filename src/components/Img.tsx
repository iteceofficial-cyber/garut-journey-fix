import { useState, useEffect, useRef } from 'react'
import { img, srcSet, DEFAULT_FALLBACK_IMAGE, SVG_FALLBACK_PLACEHOLDER } from '@/lib/img'

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
    setSrc(img(file, width))
  }, [file, width])

  const handleError = () => {
    if (errorCountRef.current === 0) {
      errorCountRef.current = 1
      const fallbackSrc = fallback ? img(fallback, width) : DEFAULT_FALLBACK_IMAGE
      // If the failing file is already the fallback, skip straight to SVG
      if (src === fallbackSrc || file === fallbackSrc) {
        errorCountRef.current = 2
        setSrc(SVG_FALLBACK_PLACEHOLDER)
      } else {
        setSrc(fallbackSrc)
      }
    } else if (errorCountRef.current === 1) {
      errorCountRef.current = 2
      setSrc(SVG_FALLBACK_PLACEHOLDER)
    }
  }

  const computedSrcSet = errorCountRef.current > 0 ? undefined : srcSet(file)

  return (
    <img
      src={src}
      srcSet={computedSrcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      onError={handleError}
      onClick={onClick}
      className={className}
    />
  )
}
