export const DEFAULT_FALLBACK_IMAGE = '/img/hero.png'

/** Inline SVG placeholder in case no image can be loaded */
export const SVG_FALLBACK_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#17231D"/><path d="M120 480L340 260L460 380L580 220L720 480Z" fill="#1F5D42" opacity="0.6"/><circle cx="280" cy="180" r="40" fill="#D8893B"/><text x="400" y="520" font-family="sans-serif" font-size="20" fill="#F5EFE3" opacity="0.7" text-anchor="middle">Garut Journey</text></svg>'
  )

/**
 * Serve images from /img directory, external URLs, or uploaded data URLs safely.
 */
export function img(file?: string | null, _width = 1200) {
  if (!file || typeof file !== 'string' || !file.trim()) {
    return DEFAULT_FALLBACK_IMAGE
  }
  const trimmed = file.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed
  }
  const clean = trimmed.replace(/^\/+/, '').replace(/^img\/+/, '')
  return `/img/${clean}`
}

/**
 * A responsive srcSet for images.
 * Only generates distinct widths if the URL is an Unsplash image that supports `&w=`.
 * For local static images, returns undefined to avoid browser resolution-density distortion.
 */
export function srcSet(file?: string | null, widths: number[] = [480, 800, 1200]): string | undefined {
  if (!file || file.startsWith('data:') || file.startsWith('blob:')) {
    return undefined
  }
  if (file.includes('images.unsplash.com')) {
    const cleanUrl = file.split('?')[0]
    return widths.map((w) => `${cleanUrl}?auto=format&fit=crop&w=${w}&q=80 ${w}w`).join(', ')
  }
  // Return undefined for static local images without CDN resizer to ensure crisp 1:1 rendering
  return undefined
}

/**
 * Compress and resize an uploaded image File into a lightweight base64 data URL
 * so it can be persisted safely in localStorage, IndexedDB, and Firestore.
 * Keeps output compact (~30KB-70KB) while preserving sharp retina display clarity.
 */
export function readAndCompressImage(file: File, maxWidth = 960, quality = 0.74): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    reader.onload = () => {
      const rawDataUrl = String(reader.result || '')
      if (!rawDataUrl.startsWith('data:image')) {
        resolve(rawDataUrl)
        return
      }

      const image = new Image()
      image.onerror = () => resolve(rawDataUrl)
      image.onload = () => {
        try {
          const maxDim = maxWidth
          let scale = 1
          if (image.width > maxDim || image.height > maxDim) {
            scale = Math.min(maxDim / image.width, maxDim / image.height)
          }

          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.width * scale))
          canvas.height = Math.max(1, Math.round(image.height * scale))
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(rawDataUrl)
            return
          }

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

          let compressed = canvas.toDataURL('image/jpeg', quality)

          // If output is still larger than ~140KB, do a fast downscale pass to prevent localStorage quota issues
          if (compressed.length > 140000) {
            const canvas2 = document.createElement('canvas')
            canvas2.width = Math.max(1, Math.round(canvas.width * 0.8))
            canvas2.height = Math.max(1, Math.round(canvas.height * 0.8))
            const ctx2 = canvas2.getContext('2d')
            if (ctx2) {
              ctx2.imageSmoothingEnabled = true
              ctx2.imageSmoothingQuality = 'medium'
              ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height)
              compressed = canvas2.toDataURL('image/jpeg', 0.68)
            }
          }

          resolve(compressed)
        } catch {
          resolve(rawDataUrl)
        }
      }
      image.src = rawDataUrl
    }
    reader.readAsDataURL(file)
  })
}
