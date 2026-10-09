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
  return trimmed.startsWith('/') ? trimmed : `/img/${trimmed}`
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
 * so it can be persisted safely in localStorage.
 */
export function readAndCompressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    reader.onload = () => {
      const result = String(reader.result || '')
      const image = new Image()
      image.onerror = () => resolve(result)
      image.onload = () => {
        try {
          const scale = image.width > maxWidth ? maxWidth / image.width : 1
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(image.width * scale)
          canvas.height = Math.round(image.height * scale)
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(result)
            return
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          const compressed = canvas.toDataURL('image/jpeg', quality)
          resolve(compressed)
        } catch {
          resolve(result)
        }
      }
      image.src = result
    }
    reader.readAsDataURL(file)
  })
}
